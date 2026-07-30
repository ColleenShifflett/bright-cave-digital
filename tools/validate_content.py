#!/usr/bin/env python3
"""
Content model tooling for the Web Analytics Guides series.

Three modes:

  validate_content.py [root]
      Validate required frontmatter per collection. Astro's Zod schemas are
      the real authority; this runs faster, in a hook, with clearer errors,
      and enforces two process rules Zod cannot express cleanly.

  validate_content.py --inventory [root] [--inventory-file PATH]
      Regenerate the derived count blocks in the inventory doc in place.
      PATH defaults to <root>/concept-inventory.md; pass it explicitly when
      the inventory lives outside the content root (e.g. docs/).

  validate_content.py --inventory --check [root] [--inventory-file PATH]
      Fail if regeneration would change anything. This is the CI mode. Every
      hand-typed number in a planning doc is wrong within a week; this makes
      that a build failure instead of a discovery.

SOURCE OF TRUTH NOTE
Right now the inventory tables are the planning source of truth, because most
atoms are not written yet. Once every planned atom exists as a file, flip
INVENTORY_IS_AUTHORITATIVE to False and the atom frontmatter becomes
authoritative, with the tables regenerated from it.
"""

from __future__ import annotations

import collections
import pathlib
import re
import sys

import yaml

INVENTORY_IS_AUTHORITATIVE = True
INVENTORY_FILE = "concept-inventory.md"

# ------------------------------------------------------------------ #
# Vocabularies, mirrored from content.config.ts                       #
# ------------------------------------------------------------------ #

REQUIRED = {
    "atoms": ["title", "summary", "domain", "depth", "volatility",
              "lastVerified", "revisions"],
    "lenses": ["atom", "audience", "hook", "lastVerified", "revisions"],
    "exclusives": ["title", "summary", "audience", "domain",
                   "lastVerified", "revisions"],
    "notices": ["title", "placement", "lastReviewed", "revisions"],
    "guides": ["title", "audience", "thesis", "parts", "revisions"],
}

ENUMS = {
    "depth": ["foundation", "working", "specialist"],
    "volatility": ["stable", "shifting", "volatile"],
    "status": ["draft", "review", "published"],
    "placement": ["inline", "section-head", "guide-front", "guide-back"],
}

CHANGE_KINDS = ["created", "verified", "updated", "corrected", "revised",
                "expanded"]

DEPTH_CODES = {"F": "foundation", "W": "working", "S": "specialist"}

CADENCE = {"volatile": "quarterly",
           "shifting": "twice yearly",
           "stable": "annually, or on challenge"}

# Which notice attaches to which atoms. Policy, so it lives here rather than
# being inferred. Predicates receive a parsed inventory row.
NOTICE_RULES = [
    ("not-legal-advice",
     lambda r: r["domain"] == "privacy"),
    ("vendor-neutrality",
     lambda r: r["domain"] == "vendors"
     or r["id"] == "platform-reported-conversions"),
    ("point-in-time",
     lambda r: r["volatility"] == "volatile"),
]


# ------------------------------------------------------------------ #
# Parsing                                                             #
# ------------------------------------------------------------------ #

ROW_RE = re.compile(
    r"^\|\s*`(?P<id>[^`]+)`\s*\|(?P<title>[^|]*)\|(?P<depth>[^|]*)"
    r"\|(?P<vol>[^|]*)\|(?P<core>[^|]*)\|"
)


def load_frontmatter(path: pathlib.Path) -> dict:
    text = path.read_text(encoding="utf-8")
    if path.suffix in (".yaml", ".yml"):
        return yaml.safe_load(text) or {}
    if not text.startswith("---"):
        raise ValueError("missing frontmatter delimiter")
    _, front, _ = text.split("---", 2)
    return yaml.safe_load(front) or {}


def parse_inventory(text: str) -> tuple[list[dict], list[str]]:
    """Parse the per-domain tables. Returns (rows, parse_errors)."""
    rows: list[dict] = []
    errs: list[str] = []
    domain = None
    for lineno, line in enumerate(text.splitlines(), 1):
        if line.startswith("## "):
            heading = line[3:].strip()
            # Domain headings are single lowercase slugs. Prose headings
            # ("Reuse math") clear the domain so a stray table row outside a
            # domain section is reported rather than silently misfiled.
            domain = heading if heading.islower() and " " not in heading \
                else None
        m = ROW_RE.match(line)
        if not m:
            continue
        depth_code = m.group("depth").strip()
        vol = m.group("vol").strip()
        if depth_code not in DEPTH_CODES:
            errs.append(f"line {lineno}: depth code '{depth_code}' invalid")
        if vol not in CADENCE:
            errs.append(f"line {lineno}: volatility '{vol}' invalid")
        if domain is None:
            errs.append(f"line {lineno}: row outside a domain heading")
        rows.append({
            "id": m.group("id").strip(),
            "title": m.group("title").strip(),
            "depth": DEPTH_CODES.get(depth_code, depth_code),
            "volatility": vol,
            "core": "\u25cf" in m.group("core"),
            "domain": domain,
        })
    dupes = [i for i, n in collections.Counter(r["id"] for r in rows).items()
             if n > 1]
    errs += [f"duplicate atom id in inventory: {d}" for d in dupes]
    return rows, errs


def read_guides(root: pathlib.Path) -> dict[str, dict]:
    guides = {}
    gdir = root / "guides"
    if not gdir.is_dir():
        return guides
    for path in sorted(gdir.glob("*.y*ml")):
        data = yaml.safe_load(path.read_text(encoding="utf-8")) or {}
        refs: list[str] = []
        for part in data.get("parts") or []:
            for entry in part.get("entries") or []:
                if entry.get("kind") == "atom":
                    refs.append(entry["atom"])
        guides[path.stem] = {"data": data, "refs": refs}
    return guides


def read_written_atoms(root: pathlib.Path) -> dict[str, dict]:
    written = {}
    adir = root / "atoms"
    if not adir.is_dir():
        return written
    for path in sorted(adir.rglob("*.md*")):
        try:
            written[path.stem] = load_frontmatter(path)
        except Exception:  # noqa: BLE001
            written[path.stem] = {}
    return written


# ------------------------------------------------------------------ #
# Generated regions                                                   #
# ------------------------------------------------------------------ #

REGION_RE_TMPL = (r"(<!-- gen:{name} -->\n)(.*?)(<!-- /gen:{name} -->)")


def replace_region(text: str, name: str, body: str) -> tuple[str, bool]:
    pattern = re.compile(REGION_RE_TMPL.format(name=re.escape(name)), re.S)
    match = pattern.search(text)
    if not match:
        return text, False
    replacement = match.group(1) + body.strip("\n") + "\n" + match.group(3)
    if match.group(0) == replacement:
        return text, False
    return text[:match.start()] + replacement + text[match.end():], True


def gen_total(rows, guides, written, root) -> str:
    domains = len({r["domain"] for r in rows})
    return (f"**{len(rows)} atoms** across {domains} domains. "
            f"{len(written)} written, {len(rows) - len(written)} planned.")


def gen_reuse(rows, guides, written, root) -> str:
    core = [r for r in rows if r["core"]]
    rest = len(rows) - len(core)
    depth = collections.Counter(r["depth"] for r in rows)
    out = [
        f"- **{len(core)} core atoms** appear in most or all guides. Written "
        "once instead of once per guide, that is the entire justification "
        "for the model.",
    ]
    if len(guides) < 2:
        out.append(
            f"- **{rest} remaining atoms** are unclassified for reuse. They "
            "cannot be classified yet: reuse is a function of which sibling "
            "guides exist, and fewer than two manifests are written. "
            "Revisit after the second guide is scoped."
        )
    else:
        counts = collections.Counter()
        for g in guides.values():
            for ref in set(g["refs"]):
                counts[ref] += 1
        shared = sum(1 for r in rows if counts.get(r["id"], 0) == 2)
        single = sum(1 for r in rows if counts.get(r["id"], 0) == 1)
        unused = sum(1 for r in rows if counts.get(r["id"], 0) == 0)
        out.append(f"- **{shared} atoms** are used by exactly two guides.")
        out.append(f"- **{single} atoms** are used by exactly one guide and "
                   "are candidates for demotion to exclusives.")
        out.append(f"- **{unused} atoms** are used by no guide.")
    out.append("")
    out.append("Depth distribution: "
               + ", ".join(f"{depth[d]} {d}" for d in
                           ("foundation", "working", "specialist"))
               + ".")
    return "\n".join(out)


def gen_cadence(rows, guides, written, root) -> str:
    counts = collections.Counter(r["volatility"] for r in rows)
    lines = ["| Volatility | Count | Cadence | Domains most affected |",
             "|---|---|---|---|"]
    for vol in ("volatile", "shifting", "stable"):
        doms = collections.Counter(r["domain"] for r in rows
                                   if r["volatility"] == vol)
        top = ", ".join(f"`{d}`" for d, _ in doms.most_common(2)) or "-"
        lines.append(f"| {vol} | {counts[vol]} | {CADENCE[vol]} | {top} |")
    return "\n".join(lines)


def gen_notices(rows, guides, written, root) -> str:
    ndir = root / "notices"
    drafted = {p.stem for p in ndir.glob("*.md*")} if ndir.is_dir() else set()
    lines = ["| Notice | Atoms | Drafted |", "|---|---|---|"]
    for notice, predicate in NOTICE_RULES:
        hits = [r for r in rows if predicate(r)]
        doms = sorted({r["domain"] for r in hits})
        if len(doms) <= 2:
            desc = f"{len(hits)} atoms in " + ", ".join(f"`{d}`" for d in doms)
        else:
            desc = f"{len(hits)} atoms across {len(doms)} domains"
        mark = "yes" if notice in drafted else "**no**"
        lines.append(f"| `{notice}` | {desc} | {mark} |")
    return "\n".join(lines)


def gen_coverage(rows, guides, written, root) -> str:
    ids = {r["id"] for r in rows}
    referenced = {ref for g in guides.values() for ref in g["refs"]}
    orphans = sorted(ids - referenced)
    ghosts = sorted(referenced - ids)
    lines = []
    if ghosts:
        lines.append("**Referenced by a guide but absent from this "
                     "inventory** (build will fail):")
        lines += [f"- `{g}`" for g in ghosts]
        lines.append("")
    if orphans:
        lines.append(f"**{len(orphans)} atoms not referenced by the shipped "
                     "manifest.** See `docs/guide-plan/` for the full intended "
                     "outline.")
        lines.append("")
        lines += [f"- `{o}`" for o in orphans]
    else:
        lines.append("Every atom is referenced by at least one guide.")
    dup_notes = []
    for name, g in guides.items():
        repeats = [i for i, n in collections.Counter(g["refs"]).items()
                   if n > 1]
        for r in repeats:
            dup_notes.append(f"- `{r}` appears twice in `{name}`")
    if dup_notes:
        lines.append("")
        lines.append("**Repeated within a single guide.** Permitted by the "
                     "schema, but the renderer will emit duplicate anchor "
                     "ids and a broken table of contents:")
        lines += dup_notes
    return "\n".join(lines)


def gen_drift(rows, guides, written, root) -> str:
    """Inventory rows vs written atom frontmatter."""
    by_id = {r["id"]: r for r in rows}
    problems = []
    for atom_id, front in sorted(written.items()):
        row = by_id.get(atom_id)
        if row is None:
            problems.append(f"- `{atom_id}` is written but absent from the "
                            "inventory tables")
            continue
        for field, inv_key in (("depth", "depth"),
                               ("volatility", "volatility"),
                               ("domain", "domain")):
            if front.get(field) and front[field] != row[inv_key]:
                problems.append(
                    f"- `{atom_id}` {field}: file says `{front[field]}`, "
                    f"inventory says `{row[inv_key]}`")
    if not problems:
        return (f"{len(written)} of {len(rows)} atoms written. No metadata "
                "drift between inventory and files.")
    return (f"{len(written)} of {len(rows)} atoms written.\n\n"
            + "\n".join(problems))


GENERATORS = {
    "total": gen_total,
    "reuse": gen_reuse,
    "cadence": gen_cadence,
    "notices": gen_notices,
    "coverage": gen_coverage,
    "drift": gen_drift,
}


# ------------------------------------------------------------------ #
# Modes                                                               #
# ------------------------------------------------------------------ #

def run_inventory(root: pathlib.Path, check_only: bool,
                  inventory_path: pathlib.Path | None = None) -> int:
    path = inventory_path or (root / INVENTORY_FILE)
    if not path.is_file():
        print(f"FAIL  inventory not found: {path}")
        return 1

    text = path.read_text(encoding="utf-8")
    rows, parse_errs = parse_inventory(text)
    for err in parse_errs:
        print(f"FAIL  {path.name}: {err}")
    if not rows:
        print(f"FAIL  {path.name}: no atom rows parsed")
        return 1

    guides = read_guides(root)
    written = read_written_atoms(root)

    updated = text
    changed, missing = [], []
    for name, generator in GENERATORS.items():
        body = generator(rows, guides, written, root)
        updated, did = replace_region(updated, name, body)
        if did:
            changed.append(name)
        if f"<!-- gen:{name} -->" not in updated:
            missing.append(name)

    for name in missing:
        print(f"WARN  no <!-- gen:{name} --> region in {path.name}")

    print(f"\nparsed {len(rows)} atoms, {len(guides)} guide(s), "
          f"{len(written)} written atom file(s)")

    if check_only:
        if changed:
            print(f"FAIL  stale generated regions: {', '.join(changed)}")
            print("      run: validate_content.py --inventory")
            return 1
        print("ok    all generated regions current")
        return 1 if parse_errs else 0

    if changed:
        path.write_text(updated, encoding="utf-8")
        print(f"ok    regenerated: {', '.join(changed)}")
    else:
        print("ok    no changes needed")
    return 1 if parse_errs else 0


def check_file(collection: str, data: dict) -> list[str]:
    errs = []
    for field in REQUIRED[collection]:
        if field not in data or data[field] in (None, [], ""):
            errs.append(f"missing required field: {field}")
    for field, allowed in ENUMS.items():
        if field in data and data[field] not in allowed:
            errs.append(f"{field}: '{data[field]}' not in {allowed}")

    for i, rev in enumerate(data.get("revisions") or []):
        if not isinstance(rev, dict):
            errs.append(f"revisions[{i}]: not a mapping")
            continue
        for key in ("date", "kind", "note"):
            if key not in rev:
                errs.append(f"revisions[{i}]: missing {key}")
        if "kind" in rev and rev["kind"] not in CHANGE_KINDS:
            errs.append(f"revisions[{i}]: kind '{rev['kind']}' invalid")
        if rev.get("kind") == "corrected" and "previously" not in rev:
            errs.append(f"revisions[{i}]: kind 'corrected' requires "
                        "'previously' so the correction is legible")

    if data.get("status") == "published":
        if data.get("openQuestions"):
            errs.append(f"status: published but "
                        f"{len(data['openQuestions'])} openQuestions remain")
        if not data.get("sources") and collection in ("atoms", "exclusives"):
            errs.append("status: published with no sources")

    if collection == "notices" and data.get("locked"):
        roles = [r.get("role") for r in (data.get("reviews") or [])]
        if "legal" not in roles:
            errs.append("locked: true but no review with role 'legal'")
    return errs


def run_validate(root: pathlib.Path) -> int:
    total = failures = 0
    for collection in REQUIRED:
        directory = root / collection
        if not directory.is_dir():
            print(f"  --  {collection}/ not present, skipped")
            continue
        for path in sorted(directory.rglob("*")):
            if path.suffix not in (".md", ".mdx", ".yaml", ".yml"):
                continue
            total += 1
            rel = path.relative_to(root)
            try:
                data = load_frontmatter(path)
            except Exception as exc:  # noqa: BLE001
                print(f"FAIL  {rel}\n        unparseable: {exc}")
                failures += 1
                continue
            errs = check_file(collection, data)
            if errs:
                failures += 1
                print(f"FAIL  {rel}")
                for err in errs:
                    print(f"        {err}")
            else:
                print(f"ok    {rel}")
    print(f"\n{total} file(s) checked, {failures} failing")
    return 1 if failures else 0


def main() -> int:
    args = sys.argv[1:]
    inventory = "--inventory" in args
    check_only = "--check" in args

    inventory_path = None
    if "--inventory-file" in args:
        idx = args.index("--inventory-file")
        try:
            inventory_path = pathlib.Path(args[idx + 1])
        except IndexError:
            print("FAIL  --inventory-file requires a path")
            return 1
        args = args[:idx] + args[idx + 2:]

    positional = [a for a in args if not a.startswith("--")]
    root = pathlib.Path(positional[0] if positional else ".")
    if inventory:
        return run_inventory(root, check_only, inventory_path)
    return run_validate(root)


if __name__ == "__main__":
    sys.exit(main())
