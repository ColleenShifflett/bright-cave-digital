# Concept Inventory

Derived from the revised Data Scientist's Guide outline.

Every count below is generated. Run `python3 validate_content.py --inventory`
after adding or changing atoms; CI runs `--inventory --check` and fails on
drift. Do not hand-edit anything between `gen:` markers.

<!-- gen:total -->
**70 atoms** across 14 domains. 1 written, 69 planned.
<!-- /gen:total -->

Columns:

- **Depth** — `F` foundation, `W` working, `S` specialist
- **Vol** — volatility, drives re-verification cadence: `stable`, `shifting`, `volatile`
- **Core** — ● marks the universal core, atoms expected in most or all guides in the series

---

## foundations

| ID | Title | Depth | Vol | Core |
|---|---|---|---|---|
| `data-is-manufactured` | Web data is created by code, not collected from the world | F | stable | ● |
| `ui-is-not-source-of-truth` | The vendor interface, the export, and the warehouse disagree by design | F | stable | ● |
| `no-schema-contract` | Nothing guarantees a field means today what it meant last quarter | W | stable | |

## strategy

| ID | Title | Depth | Vol | Core |
|---|---|---|---|---|
| `funnel-and-lifecycle` | The funnel and its lifecycle variants | F | stable | ● |
| `channel-taxonomy-utm` | How channel gets encoded, and who controls the encoding | F | shifting | ● |
| `direct-traffic-problem` | Why Direct is a landfill and what falls into it | W | stable | |
| `paid-media-mechanics` | Auctions, bid strategies, and the CPC/CPM/CPA/ROAS family | W | shifting | |
| `platform-reported-conversions` | Why every ad platform reports numbers that flatter itself | W | shifting | ● |
| `seo-fundamentals` | Crawl, index, rank, and the query-to-page gap | F | shifting | |
| `organic-attribution-problem` | Why organic search resists credit assignment | W | stable | |
| `owned-channels` | Email, CRM, and lifecycle messaging as the audience you control | W | stable | |
| `business-model-metrics` | Ecommerce, subscription, lead gen, and ad-supported measure different things | F | stable | ● |
| `unit-economics` | CAC, LTV, payback period, and contribution margin | F | stable | ● |
| `marketing-decision-cadence` | When marketing decisions actually get made, and on what evidence | W | stable | |
| `request-driven-drift` | How measurement programs decay into request queues | W | stable | ● |

## data-model

| ID | Title | Depth | Vol | Core |
|---|---|---|---|---|
| `event-model` | Events as the base unit of collection | F | stable | ● |
| `session-construct` | A session is a rule, not a behavior | F | stable | ● |
| `scope-event-session-user` | Property scope decides what you are allowed to join | W | stable | |
| `ga4-vs-universal-model` | What changed moving from pageviews to events | W | shifting | |

## vendors

| ID | Title | Depth | Vol | Core |
|---|---|---|---|---|
| `web-analytics-vendors` | GA4 and Adobe Analytics | F | volatile | ● |
| `product-analytics-vendors` | Amplitude, Mixpanel, Heap, PostHog, and the autocapture tradeoff | W | volatile | |
| `warehouse-native-pipelines` | Snowplow, Segment, and collect-once-model-yourself | W | shifting | |
| `qualitative-replay-tools` | Session replay and heatmaps, and what they answer that quant cannot | W | volatile | |
| `consent-infrastructure` | GTM, server-side GTM, Tealium, and the CMP layer | W | volatile | |
| `vendor-evaluation-dimensions` | Data model, sampling, retention, export fidelity, cost | F | stable | ● |
| `build-vs-buy` | When a warehouse-native pipeline beats a packaged tool | W | stable | |

## identity

| ID | Title | Depth | Vol | Core |
|---|---|---|---|---|
| `client-id-vs-user-id` | Three different things all called a user | F | stable | ● |
| `cross-device-cross-domain` | Where a single person becomes several rows | W | stable | |
| `cookie-lifespan-itp` | Browser restrictions and what they truncate | W | volatile | |
| `unique-user-counting` | What a unique user count actually counts | F | shifting | ● |
| `choosing-unit-of-analysis` | Deciding what a user means before you query | W | stable | |

## collection

| ID | Title | Depth | Vol | Core |
|---|---|---|---|---|
| `tag-manager-datalayer` | Tag managers, the dataLayer, and who can change your data | F | shifting | |
| `tracking-bug-vs-behavior-change` | A broken tag and a behavior change look identical in a chart | F | stable | ● |
| `client-vs-server-side` | Where collection happens and what it changes | W | shifting | |
| `reading-an-implementation` | Auditing a tag setup well enough to trust a field | W | shifting | |

## privacy

| ID | Title | Depth | Vol | Core |
|---|---|---|---|---|
| `regulatory-map` | GDPR, ePrivacy, CCPA/CPRA, and the US state patchwork | F | volatile | ● |
| `sector-specific-rules` | HIPAA, COPPA, GLBA, and FERPA as collection constraints | S | volatile | |
| `consent-mechanics` | Banners, consent mode, and the population you can no longer see | F | volatile | ● |
| `modeled-gap-filled-data` | When the vendor is estimating on your behalf | W | volatile | |
| `pii-leakage` | Query strings, form fields, page titles, and referrers | F | stable | ● |
| `pseudonymization-hashing` | What hashing does and does not protect | W | stable | |
| `retention-limits` | How retention windows quietly truncate your history | F | volatile | ● |
| `deletion-residency-dpa` | Deletion requests, data residency, and subprocessors | S | volatile | |

## quality

| ID | Title | Depth | Vol | Core |
|---|---|---|---|---|
| `bots-and-blockers` | Non-human traffic and the traffic you never see | F | shifting | ● |
| `sampling-and-cardinality` | Sampling, cardinality limits, and the (other) row | W | shifting | |
| `thresholding-suppression` | Data withheld for privacy reasons | W | volatile | |
| `late-duplicate-hits` | Arrival order, retries, and double counting | W | stable | |
| `timezone-date-boundaries` | Where a day starts and why totals move | W | stable | |

## metrics

| ID | Title | Depth | Vol | Core |
|---|---|---|---|---|
| `misleading-engagement-metrics` | Bounce rate, engaged sessions, average session duration | F | shifting | ● |
| `conversion-rate-denominators` | Why two teams report different conversion rates | F | stable | ● |
| `modeled-vs-observed-metrics` | Estimated and measured numbers in the same report | W | volatile | ● |

## attribution

| ID | Title | Depth | Vol | Core |
|---|---|---|---|---|
| `attribution-is-heuristic` | Attribution assigns credit, it does not establish cause | F | stable | ● |
| `attribution-models-windows` | Models, lookback windows, and channel groupings | F | shifting | ● |
| `platform-vs-analytics-reconciliation` | Why the numbers never match, and which gap is normal | F | stable | ● |
| `mmm-and-incrementality` | When to stop attributing and start testing | S | shifting | |

## experimentation

| ID | Title | Depth | Vol | Core |
|---|---|---|---|---|
| `traffic-as-constraint` | Traffic volume, not statistics, is usually the limit | F | stable | ● |
| `randomization-vs-analysis-unit` | Assigning at one level and measuring at another | W | stable | |
| `sample-ratio-mismatch` | Your first diagnostic before reading any result | W | stable | |
| `peeking-novelty-interference` | Three ways a valid test produces an invalid answer | W | stable | |

## warehouse

| ID | Title | Depth | Vol | Core |
|---|---|---|---|---|
| `bq-export-structure` | What the BigQuery export actually contains | W | shifting | |
| `nested-repeated-unnesting` | Working with nested and repeated fields | S | stable | |
| `warehouse-ui-reconciliation` | Reconciling warehouse totals against the interface | W | stable | |
| `sessionization-as-modeling` | Sessionization is a decision you now own | S | stable | |
| `behavioral-feature-layer` | A stable intermediate layer instead of re-querying raw events | S | stable | |

## modeling

| ID | Title | Depth | Vol | Core |
|---|---|---|---|---|
| `web-data-use-cases` | Propensity, churn, LTV, next-best-content, path analysis | W | stable | |
| `behavioral-feature-engineering` | Recency, frequency, depth, velocity | S | stable | |
| `strengths-and-blind-spots` | Where web data is strong and where it is guessing | F | stable | ● |

## practice

| ID | Title | Depth | Vol | Core |
|---|---|---|---|---|
| `provenance-questions` | Who instrumented this, when, and what changed since | F | stable | ● |
| `missing-population-questions` | What is absent from this data and why | F | stable | ● |
| `decision-precision-fit` | Matching precision to the decision it feeds | F | stable | ● |

---

## Reuse math

<!-- gen:reuse -->
- **31 core atoms** appear in most or all guides. Written once instead of once per guide, that is the entire justification for the model.
- **39 remaining atoms** are unclassified for reuse. They cannot be classified yet: reuse is a function of which sibling guides exist, and fewer than two manifests are written. Revisit after the second guide is scoped.

Depth distribution: 30 foundation, 33 working, 7 specialist.
<!-- /gen:reuse -->

## Re-verification cadence

Derived from `volatility` rather than stored per atom.

<!-- gen:cadence -->
| Volatility | Count | Cadence | Domains most affected |
|---|---|---|---|
| volatile | 13 | quarterly | `privacy`, `vendors` |
| shifting | 16 | twice yearly | `strategy`, `collection` |
| stable | 41 | annually, or on challenge | `strategy`, `experimentation` |
<!-- /gen:cadence -->

## Notice attachments

Declared on the atom, not the guide, so they travel into guides that do not
exist yet. Attachment policy lives in `NOTICE_RULES` in `validate_content.py`.

<!-- gen:notices -->
| Notice | Atoms | Drafted |
|---|---|---|
| `not-legal-advice` | 8 atoms in `privacy` | yes |
| `vendor-neutrality` | 8 atoms in `strategy`, `vendors` | **no** |
| `point-in-time` | 13 atoms across 5 domains | **no** |
<!-- /gen:notices -->

## Guide coverage

<!-- gen:coverage -->
**69 atoms not referenced by the shipped manifest.** See `docs/guide-plan/` for the full intended outline.

- `attribution-is-heuristic`
- `attribution-models-windows`
- `behavioral-feature-engineering`
- `behavioral-feature-layer`
- `bots-and-blockers`
- `bq-export-structure`
- `build-vs-buy`
- `business-model-metrics`
- `channel-taxonomy-utm`
- `choosing-unit-of-analysis`
- `client-id-vs-user-id`
- `client-vs-server-side`
- `consent-infrastructure`
- `consent-mechanics`
- `conversion-rate-denominators`
- `cookie-lifespan-itp`
- `cross-device-cross-domain`
- `data-is-manufactured`
- `decision-precision-fit`
- `deletion-residency-dpa`
- `direct-traffic-problem`
- `event-model`
- `funnel-and-lifecycle`
- `ga4-vs-universal-model`
- `late-duplicate-hits`
- `marketing-decision-cadence`
- `misleading-engagement-metrics`
- `missing-population-questions`
- `mmm-and-incrementality`
- `modeled-gap-filled-data`
- `modeled-vs-observed-metrics`
- `nested-repeated-unnesting`
- `no-schema-contract`
- `organic-attribution-problem`
- `owned-channels`
- `paid-media-mechanics`
- `peeking-novelty-interference`
- `pii-leakage`
- `platform-reported-conversions`
- `platform-vs-analytics-reconciliation`
- `product-analytics-vendors`
- `provenance-questions`
- `pseudonymization-hashing`
- `qualitative-replay-tools`
- `randomization-vs-analysis-unit`
- `reading-an-implementation`
- `regulatory-map`
- `request-driven-drift`
- `retention-limits`
- `sample-ratio-mismatch`
- `sampling-and-cardinality`
- `scope-event-session-user`
- `sector-specific-rules`
- `seo-fundamentals`
- `sessionization-as-modeling`
- `strengths-and-blind-spots`
- `tag-manager-datalayer`
- `thresholding-suppression`
- `timezone-date-boundaries`
- `tracking-bug-vs-behavior-change`
- `traffic-as-constraint`
- `ui-is-not-source-of-truth`
- `unique-user-counting`
- `unit-economics`
- `vendor-evaluation-dimensions`
- `warehouse-native-pipelines`
- `warehouse-ui-reconciliation`
- `web-analytics-vendors`
- `web-data-use-cases`
<!-- /gen:coverage -->

## Implementation status

<!-- gen:drift -->
1 of 70 atoms written. No metadata drift between inventory and files.
<!-- /gen:drift -->

## Open structural questions

1. `sector-specific-rules` and `deletion-residency-dpa` are specialist-only and may belong in the privacy officer guide as exclusives rather than in the shared pool.
2. The strategy domain is 12 atoms and carries the most risk of sprawl. It may want its own depth gating so the data scientist guide takes only the foundation tier.
3. No atom currently covers accessibility or task-completion measurement, which the public sector guide will need. Add when that guide is scoped.
4. `choosing-unit-of-analysis` is referenced twice in the DS manifest, once in the identity part and once in the checklist. The model permits this but the renderer will emit duplicate anchor ids and a broken table of contents. Either allow an atom to be recalled by reference rather than re-rendered, or drop the second occurrence.
