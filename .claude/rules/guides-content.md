---
name: guides-content
description: Rules for the structured content model behind the web analytics guide series
paths:
  - "src/content/atoms/**"
  - "src/content/lenses/**"
  - "src/content/exclusives/**"
  - "src/content/notices/**"
  - "src/content/guides/**"
  - "drafts/**"
  - "docs/concept-inventory.md"
  - "tools/validate_content.py"
  - "src/content.config.ts"
---

# Guide series content model

Read `docs/GUIDES.md` before changing anything structural.

## Commands

```bash
python3 tools/validate_content.py src/content
python3 tools/validate_content.py --inventory src/content --inventory-file docs/concept-inventory.md
```

## The three tiers, and the rule that matters most

**Atoms** (`src/content/atoms/`) are canonical explanations. Impersonal, no
stakes, no verdict, no "you". They must read correctly for a CEO and a data
engineer simultaneously. If a sentence only makes sense for one audience, it
belongs in a lens.

**Lenses** (`src/content/lenses/`) are per-audience wrappers, named
`{atom-id}--{audience}.mdx`. Second person, opinionated, 300-500 words. All
voice and all judgment lives here.

**Exclusives** belong to one guide.

Guides are manifests, not documents. Transitions belong to the manifest.

## Voice, for lenses and prose only

Calm, direct, second person. Short sentences. No em dashes. No "delve",
"leverage", "robust", no "it's not just X, it's Y", no rhetorical questions as
transitions, no closing paragraph restating what was just said. Assume the
reader is competent and busy.

## Hard rules

- Never write to `src/content/{atoms,lenses,exclusives,notices,guides}/`
  directly. New content goes in `drafts/`. Promotion is a human `git mv`.
- Never edit text between `<!-- gen:... -->` markers in
  `docs/concept-inventory.md`. Run the `--inventory` command instead.
- Never edit a notice with `locked: true`.
- Every factual claim about a vendor, regulation, or platform behavior needs a
  frontmatter source with a URL and access date. Prefer vendor docs and
  regulator text over blog posts.
- Anything thin, extrapolated, or needing a decision you cannot make goes in
  `openQuestions`. Leaving it empty when unsure is the one failure that
  matters. An honest entry beats a confident sentence.
- Do not write an atom unless a guide manifest references its id.
- Do not invent atom ids. Check `docs/concept-inventory.md`.

## Scope

These rules govern the guide collections only. Other content collections in
this repo follow the conventions in the root `CLAUDE.md`.
