import { glob } from 'astro/loaders';
import { defineCollection, reference, z } from 'astro:content';

/* ================================================================== */
/* Shared vocabularies                                                 */
/* ================================================================== */

export const AUDIENCES = [
  'data-scientist',
  'analytics-engineer',
  'developer',
  'product-manager',
  'ux-researcher',
  'marketer',
  'seo-content',
  'marketing-exec',
  'ceo',
  'revops',
  'finance',
  'privacy-officer',
  'accidental-owner',
  'public-sector',
  'nonprofit',
  'subscription-media',
] as const;

export const DOMAINS = [
  'foundations',
  'strategy',
  'data-model',
  'vendors',
  'identity',
  'collection',
  'privacy',
  'quality',
  'metrics',
  'attribution',
  'experimentation',
  'warehouse',
  'modeling',
  'practice',
] as const;

// Reader-facing altitude. Controls which atoms a given guide pulls in.
//   foundation  everyone needs this regardless of role
//   working     needed to do the job, not to understand the concept
//   specialist  only relevant if this is your actual responsibility
export const DEPTHS = ['foundation', 'working', 'specialist'] as const;

// How fast content goes stale. Drives re-verification cadence.
export const VOLATILITY = ['stable', 'shifting', 'volatile'] as const;

// NOTE: deliberately NOT the same as `draft: boolean` on blog and resources.
// The guide pipeline needs a review state that gates publication, and
// validate_content.py enforces rules against it. The divergence is intentional.
export const STATUSES = ['draft', 'review', 'published'] as const;

// 'corrected' means the previous version was wrong and carries an obligation
// to be visible. 'verified' means nothing changed but the clock reset.
// Collapsing these into "updated" throws away the only thing a returning
// reader wants to know.
export const CHANGE_KINDS = [
  'created',
  'verified',
  'updated',
  'corrected',
  'revised',
  'expanded',
] as const;

export const REVIEW_ROLES = ['editorial', 'technical', 'legal'] as const;

// Existing service taxonomy, reused for the content funnel:
//   DIY  free — guides, blog
//   DWY  paid one-time — kits
//   DFY  engagement — workshop
export const TIERS = ['DIY', 'DWY', 'DFY'] as const;

/* ================================================================== */
/* Shared helper schemas                                               */
/* ================================================================== */

const source = z.object({
  title: z.string(),
  url: z.string().url(),
  publisher: z.string().optional(),
  accessed: z.coerce.date(),
  // True for vendor docs, regulator text, or primary research.
  primary: z.boolean().default(false),
});

// One entry per change, oldest first. Guide changelogs and the RSS update feed
// are computed from these, never hand-maintained.
const revision = z.object({
  date: z.coerce.date(),
  kind: z.enum(CHANGE_KINDS),
  // Plain language, reader-facing.
  note: z.string().min(10),
  by: z.string().optional(),
  // Required in practice for kind: 'corrected'. What the previous version
  // said, so the correction is legible rather than silent.
  previously: z.string().optional(),
});

const review = z.object({
  by: z.string(),
  role: z.enum(REVIEW_ROLES),
  date: z.coerce.date(),
  scope: z.string().optional(),
});

const provenance = {
  status: z.enum(STATUSES).default('draft'),
  owner: z.string().optional(),
  contributors: z.array(z.string()).default([]),
  lastVerified: z.coerce.date(),
  sources: z.array(source).default([]),
  // Declared here rather than on the guide so a new guide cannot pull in a
  // regulatory atom and silently drop its disclaimer.
  notices: z.array(reference('notices')).default([]),
  revisions: z.array(revision).min(1),
  reviews: z.array(review).default([]),
  // Where the draft is thin, extrapolated, or needs a human decision.
  // The build gates status: 'published' on this being empty.
  openQuestions: z.array(z.string()).default([]),
};

/* ================================================================== */
/* EXISTING COLLECTIONS                                                */
/* ================================================================== */

// Blog posts: dated, author-attributed articles.
const blog = defineCollection({
  loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/blog' }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    pubDate: z.coerce.date(),
    updatedDate: z.coerce.date().optional(),
    author: z.string().default('Bright Cave Digital'),
    tags: z.array(z.string()).default([]),
    heroImage: z.string().optional(),
    // Per-page social share image (falls back to the site default).
    ogImage: z.string().optional(),
    draft: z.boolean().default(false),
  }),
});

// Resources: templates, checklists, tools, ebooks, and paid kits. Optionally
// categorised by the DIY / DWY / DFY tier they best support.
const resources = defineCollection({
  loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/resources' }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    pubDate: z.coerce.date(),
    updatedDate: z.coerce.date().optional(),
    // 'guide' removed: long-form guides are their own collection now, so a
    // resource can no longer claim to be one. 'kit' added for paid downloads.
    resourceType: z
      .enum(['template', 'checklist', 'tool', 'ebook', 'kit'])
      .default('template'),
    tier: z.enum(['DIY', 'DWY', 'DFY']).optional(),
    downloadUrl: z.string().url().optional(),
    ogImage: z.string().optional(),
    draft: z.boolean().default(false),
  }),
});

/* ================================================================== */
/* GUIDE SERIES COLLECTIONS                                            */
/* ================================================================== */

const notices = defineCollection({
  loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/notices' }),
  schema: z.object({
    title: z.string(),
    short: z.string().max(300).optional(),
    placement: z.enum([
      'inline',
      'section-head',
      'guide-front',
      'guide-back',
    ]),
    severity: z.enum(['note', 'important']).default('note'),
    // True once counsel has signed off. The validator warns on edits.
    locked: z.boolean().default(false),
    lastReviewed: z.coerce.date(),
    reviews: z.array(review).default([]),
    revisions: z.array(revision).min(1),
  }),
});

const atoms = defineCollection({
  loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/atoms' }),
  schema: z.object({
    title: z.string(),
    // Must make sense stripped of all surrounding context: used in tables of
    // contents and computed skim maps.
    summary: z.string().min(20).max(200),
    domain: z.enum(DOMAINS),
    depth: z.enum(DEPTHS),
    volatility: z.enum(VOLATILITY),
    prerequisites: z.array(reference('atoms')).default([]),
    related: z.array(reference('atoms')).default([]),
    // Former ids, kept so old anchors and skim maps keep resolving after a
    // rename. Ids are otherwise permanent.
    formerIds: z.array(z.string()).default([]),
    ...provenance,
  }),
});

// File naming convention: {atom-id}--{audience}.mdx
// The body carries stakes and action. All voice and opinion lives here;
// atoms stay neutral.
const lenses = defineCollection({
  loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/lenses' }),
  schema: z.object({
    atom: reference('atoms'),
    audience: z.enum(AUDIENCES),
    // One line answering "why does this matter to me."
    hook: z.string().min(20).max(240),
    // Raise or lower the atom's depth for this audience only.
    depthOverride: z.enum(DEPTHS).optional(),
    ...provenance,
  }),
});

const exclusives = defineCollection({
  loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/exclusives' }),
  schema: z.object({
    title: z.string(),
    summary: z.string().min(20).max(200),
    audience: z.enum(AUDIENCES),
    domain: z.enum(DOMAINS),
    ...provenance,
  }),
});

// The lens is resolved by matching the guide's audience, so it is not named.
const atomEntry = z.object({
  kind: z.literal('atom'),
  atom: reference('atoms'),
  // False to use the canonical text with no audience wrapper.
  lens: z.boolean().default(true),
  // Connective tissue belongs to the guide, not the atom. This is what keeps
  // assembled documents from reading choppy at the seams.
  transition: z.string().optional(),
});

const exclusiveEntry = z.object({
  kind: z.literal('exclusive'),
  section: reference('exclusives'),
  transition: z.string().optional(),
});

const guides = defineCollection({
  loader: glob({ pattern: '**/*.{yaml,yml}', base: './src/content/guides' }),
  schema: z.object({
    title: z.string(),
    subtitle: z.string().optional(),
    // Matches blog and resources so shared SEO components work unchanged.
    description: z.string(),
    audience: z.enum(AUDIENCES),
    // The single claim the guide is organized around.
    thesis: z.string(),
    tier: z.enum(TIERS).default('DIY'),

    // Guides to diff against. Renders "if you have read X, these sections are
    // new" as a set difference over atom ids, not hand-maintained prose.
    skimAgainst: z.array(reference('guides')).default([]),

    parts: z
      .array(
        z.object({
          title: z.string(),
          intro: z.string().optional(),
          entries: z
            .array(z.discriminatedUnion('kind', [atomEntry, exclusiveEntry]))
            .min(1),
        })
      )
      .min(1),

    // Guide-level only. Content-level notices come from the atoms and are
    // gathered and deduplicated at build time.
    notices: z.array(reference('notices')).default([]),

    license: z
      .enum(['all-rights-reserved', 'cc-by-4.0', 'cc-by-nc-4.0'])
      .default('all-rights-reserved'),
    citation: z.string().optional(),
    cta: z
      .object({
        heading: z.string(),
        body: z.string(),
        label: z.string(),
        href: z.string(),
      })
      .optional(),

    ogImage: z.string().optional(),

    // Manifest-level changes only: parts added, reordered, removed. The
    // displayed "last updated" is computed across this plus every atom, lens,
    // and exclusive included above. Never version an assembled document by hand.
    revisions: z.array(revision).min(1),
    status: z.enum(STATUSES).default('draft'),
    owner: z.string().optional(),
    contributors: z.array(z.string()).default([]),
  }),
});

export const collections = {
  blog,
  resources,
  atoms,
  lenses,
  exclusives,
  notices,
  guides,
};
