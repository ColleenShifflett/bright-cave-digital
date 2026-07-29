# Web Analytics Guides

An audience-specific guide series assembled from a shared pool of canonical
concepts. Readers need exactly one guide. The overlap between guides is
deliberate, disclosed, and maintained in one place.

## Layout

This lives inside the Astro site repo, because Astro content collections have
to sit in `src/content/` of an Astro project. There is no version of this that
works as a standalone content repo without duplicating the build.

```
src/
  content.config.ts            schemas for all five collections
  content/
    atoms/                     canonical concepts, audience-neutral
    lenses/                    {atom-id}--{audience}.mdx
    exclusives/                single-guide sections
    notices/                   disclaimers and standing legal text
    guides/                    manifests (.yaml)
  pages/guides/[slug].astro    the renderer
drafts/
  atoms/                       staging. NOT a content collection.
  lenses/
docs/
  concept-inventory.md         planning doc, counts generated
tools/
  validate_content.py
.github/workflows/content.yml
```

## The staging gate

`drafts/` is outside `src/content/`, which means Astro never sees it and a
malformed or unreviewed file cannot break the build.

Research tasks write to `drafts/`. Review happens there. Promotion is a
`git mv` into `src/content/`, and that move is the editorial sign-off. Nothing
enters the build without passing through a human doing exactly one thing:
moving a file.

```bash
python3 tools/validate_content.py drafts        # check staged work
git mv drafts/atoms/session-construct.mdx src/content/atoms/
```

## Three tiers

**Atoms** are canonical, neutral, explanatory. No stakes, no verdict, no
second person. Written once, reused verbatim.

**Lenses** wrap an atom for one audience: why this matters to you, what to do
about it. 300 to 500 words. All voice and all opinion lives here. This split
is what keeps shared prose from flattening into something that serves every
audience and satisfies none.

**Exclusives** belong to one guide and are not reused.

A guide is not a document. It is a manifest of atom references plus its own
transitions, and the transitions belong to the manifest so assembled prose
does not read choppy at the seams.

## Adding an atom

1. Add a row to the domain table in `docs/concept-inventory.md`.
2. Confirm at least one guide manifest references the id. If none does, do not
   write it. Unreferenced atoms are research nobody ships.
3. Write the file in `drafts/atoms/`.
4. Populate `openQuestions` with anything thin, extrapolated, or needing a
   decision you cannot make. This is the audit trail, not a formality.
5. Validate, review, promote.
6. Regenerate inventory counts.

## Commands

```bash
python3 tools/validate_content.py src/content
python3 tools/validate_content.py --inventory src/content \
    --inventory-file docs/concept-inventory.md
python3 tools/validate_content.py --inventory --check src/content \
    --inventory-file docs/concept-inventory.md
npm run build
```

Requires `pyyaml`. Nothing else.

## What the tooling enforces

Astro's Zod schemas validate shape. `validate_content.py` validates process:

- `status: published` fails with a non-empty `openQuestions` array
- `status: published` fails on an atom with no sources
- `kind: corrected` requires a `previously` field, so corrections cannot ship
  silently
- `locked: true` on a notice requires a review recorded at `role: legal`
- every generated block in the inventory must match the content, or CI fails

Every number in the inventory is generated. Hand-typed counts in a planning
doc are wrong within a week; this makes that a build failure rather than a
discovery.

### Coverage counts reflect what ships, not what is planned

The generated `gen:coverage` section counts references from the **shipped**
manifests in `src/content/guides/` only. The plan of record lives in
`docs/guide-plan/`, and the generator does not read it yet. So an atom listed
as "referenced by no guide" may be fully planned — it just is not referenced by
a manifest that has shipped. Read those counts as "what is live," not "what is
intended," and do not delete inventory atoms on the strength of that list.

## Things that are derived, never stored

- Guide "last updated" — computed as the latest revision date across the
  manifest and every atom, lens, and exclusive it includes. Never version an
  assembled document by hand.
- Changelogs — computed from `revisions` arrays.
- Skim maps ("if you read the Marketer's Guide, these sections are new") —
  a set difference over atom ids between two manifests. This is the feature
  the whole structure pays for.
- Re-verification schedule — derived from each atom's `volatility`.
- Notice attachment — derived from `NOTICE_RULES` in the validator.

## Pre-commit hook

```bash
cat > .git/hooks/pre-commit << 'EOF'
#!/bin/sh
python3 tools/validate_content.py src/content || exit 1
python3 tools/validate_content.py --inventory --check src/content \
    --inventory-file docs/concept-inventory.md || exit 1
EOF
chmod +x .git/hooks/pre-commit
```

## Open structural questions

Tracked at the bottom of `docs/concept-inventory.md`. Four are open and all
four are cheap now and expensive after sixty atoms exist.
