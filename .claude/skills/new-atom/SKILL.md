---
name: new-atom
description: Research and draft a canonical concept atom for the guides content model. Use when asked to write, draft, or research an atom by its id. Handles sourcing, frontmatter, and the openQuestions audit trail.
argument-hint: [atom-id]
---

Draft the atom `$0` into `drafts/atoms/$0.mdx`.

## Before writing

1. Find the row for `$0` in `docs/concept-inventory.md`. Take `domain`,
   `depth`, and `volatility` from it. Do not invent these; if the id is not in
   the inventory, stop and say so.
2. Confirm at least one manifest in `src/content/guides/` references `$0`. If
   none does, stop. Unreferenced atoms do not get written.
3. Read two existing atoms in the same domain, if any exist, to match register.
4. If `volatility` is `shifting` or `volatile`, search for current primary
   sources before drafting. Do not write vendor behavior or regulatory detail
   from memory. Vendor documentation and regulator text only; a blog post is
   not a source for what GA4 currently does.

## Writing

Canonical register: impersonal, explanatory, no second person, no stakes, no
recommendation. The test is whether the text reads correctly for a CEO and a
data engineer at the same time. Anything audience-specific belongs in a lens,
not here.

Roughly 300-600 words. Structure it as prose with at most one short list.
Prerequisites are declared in frontmatter, not re-explained in the body.

## Frontmatter

Required: `title`, `summary` (one line, 20-200 chars, must make sense stripped
of context), `domain`, `depth`, `volatility`, `lastVerified`, `revisions` with
one `created` entry, `status: draft`.

Add `prerequisites` and `related` only for atom ids that exist in the
inventory. Add `notices` per the attachment table in the inventory: privacy
atoms get `not-legal-advice`.

Every claim about vendor behavior or regulation needs a matching `sources`
entry with a URL and today's date as `accessed`, and `primary: true` for
vendor docs or regulator text.

## openQuestions

Populate honestly. This is the audit trail the human review depends on, and it
is the only place uncertainty is allowed to live. Include:

- claims you could not source to a primary reference
- places you generalized across vendors that may differ in practice
- specific defaults or thresholds that need checking before publication
- decisions requiring the author's judgment rather than research

An empty `openQuestions` on a `shifting` or `volatile` atom is almost always
wrong. Do not empty it to look finished.

## After writing

Run `python3 tools/validate_content.py drafts` and fix what it reports.

Then report: word count, how many claims are sourced to primary references,
and the openQuestions list. Do not move the file into `src/content/`.
