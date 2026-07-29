---
name: reverify
description: Re-check atoms against current primary sources and report what changed. Use for the scheduled maintenance pass on volatile or shifting content, or when asked to verify whether an atom is still accurate.
argument-hint: [volatility-tier or atom-id]
---

Re-verify `$0`. If given a volatility tier (`volatile`, `shifting`), work
through every atom in `src/content/atoms/` with that value, oldest
`lastVerified` first. If given an atom id, do just that one.

## For each atom

1. Read it. List its factual claims about vendor behavior, regulation, product
   defaults, or thresholds.
2. Check each claim against its recorded `sources`. Fetch the URLs. Note any
   that 404 or have been restructured.
3. Search for current primary sources where the recorded ones are stale or
   insufficient.
4. Classify the outcome:

   - **unchanged** — claims still accurate. Add a `verified` revision, update
     `lastVerified` and the `accessed` dates. Do not touch the body.
   - **changed** — the world moved. Update the body, add an `updated` revision
     describing what changed in the world, not what you edited.
   - **wrong** — it was inaccurate when published. Update the body, add a
     `corrected` revision with a `previously` field stating what the old
     version claimed. The validator enforces this field; it exists so readers
     can see the correction rather than having it disappear.

## Rules

- Do not silently rewrite. Every body change gets a revision entry.
- Do not downgrade a `corrected` to an `updated` because it reads better. The
  distinction is the point: readers use it to judge whether they relied on
  something false.
- Do not edit atoms in `src/content/` in place if the change is substantive.
  Copy to `drafts/atoms/`, edit there, and report. Date and `accessed` bumps on
  an otherwise unchanged `verified` atom are fine to make in place.
- If a source is now paywalled or gone, say so rather than substituting a
  secondary source silently.

## Report

A table: atom id, outcome, what changed, sources checked. Then flag anything
needing the author's judgment. Do not update the inventory counts yourself;
say whether `--inventory` needs running.
