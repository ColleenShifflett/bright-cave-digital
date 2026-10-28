// The three areas. Each one has an area page built from the AreaPage layout,
// a card on the home page, a tag in the Resources collection, and an option on
// the contact form. The slug is shared by all four, so keep it stable.

export type AreaSlug = 'web-analytics' | 'web-strategy' | 'ai-strategy';

export type Area = {
  slug: AreaSlug;
  name: string;
  diagnostic: string;
  /** The problem in one sentence. Used on the home card and the area hero. */
  problem: string;
  /** SEO description for the area page. */
  description: string;
  whoFor: string[];
  /**
   * What the diagnostic checks. An unlabeled group renders as a list; a
   * labeled group renders as one sentence, so its items start lowercase.
   */
  checks: { label?: string; items: string[] }[];
  /** Shown under the checks list. */
  checksNote?: string;
  /** What implementation leaves you with, used on /services. */
  outcome: string;

  // Optional overrides. Leave unset to use the template's default copy.
  /** A paragraph under the hero problem line. */
  intro?: string;
  /** A line under the diagnostic heading. */
  diagnosticIntro?: string;
  /** Replaces the "What it checks:" label. */
  checksLabel?: string;
  /** Replaces the default "What you get" list. */
  whatYouGet?: string[];
  /** Replaces the default weekly-limit line under the diagnostic. */
  limitNote?: string;
  /** Replaces the default "What happens next" paragraph. */
  nextSteps?: string;
};

export const AREAS: Area[] = [
  {
    slug: 'web-analytics',
    name: 'Web Analytics',
    diagnostic: 'GA4 Health Check',
    problem:
      "Your GA4 data doesn't add up, so nobody trusts the numbers enough to act on them.",
    description:
      'A free GA4 Health Check: configuration, key events, data quality, consent, and AI readiness, with your top fixes ranked.',
    whoFor: [
      'Teams who set up GA4 once and have not looked under the hood since',
      'Marketers who get a different answer every time they pull a report',
      'Leaders who want to use their data with AI but are not sure it is ready',
      'Anyone who inherited an analytics setup with no documentation',
    ],
    checks: [
      {
        items: [
          'Property configuration',
          'Key events and conversions',
          'Data quality',
          'Consent and attribution',
          'Whether your data is ready to use with AI',
        ],
      },
    ],
    checksNote:
      'Colleen reviews every property by hand. We need view access to your GA4 property.',
    outcome:
      'A GA4 setup you can trust, a measurement plan, and a fix queue that gets worked through.',
  },
  {
    slug: 'web-strategy',
    name: 'Web Strategy',
    diagnostic: 'Content Core Scorecard',
    problem:
      "People and AI assistants can't easily find your site, understand what you do, or see what to do next.",
    description:
      'A free Content Core Scorecard: how well search engines, AI assistants, and people can find, understand, and act on your site.',
    whoFor: [
      'Teams whose site no longer explains what they actually do',
      'Businesses that want to show up in AI assistants, not just search',
      'Sites that get visits but few next steps',
      'Anyone planning a redesign who wants to fix the content first',
    ],
    checks: [
      {
        label: 'Discoverable',
        items: ['findability', 'AI readiness', 'how your pages show up when shared'],
      },
      { label: 'Actionable', items: ['a clear next step for visitors'] },
      {
        label: 'Relatable',
        items: ['enough content depth that people and AI understand your business'],
      },
    ],
    checksNote:
      'The scorecard works from outside your site, so we need no account access.',
    outcome:
      "Content that's organized, labeled, and easy to find, plus a regular schedule for improving the site.",
  },
  {
    slug: 'ai-strategy',
    name: 'AI Strategy',
    diagnostic: 'AI Cost & Usage Review',
    problem: "Your team is already using AI. Can you see what it's costing you?",
    description:
      'A free AI Cost & Usage Review: where your AI spend goes, whether your models fit the work, and the rules and training your team needs.',
    intro:
      "AI tools showed up one subscription at a time. Now you're paying for them without knowing who uses what, what it costs per task, or whether any of it is helping. We help you get AI spend under control, set rules people will actually follow, and give your team the confidence to use AI well.",
    whoFor: [
      'Teams where AI tools spread faster than any plan for them',
      "Leaders who see the AI bill but can't connect it to results",
      'Companies with no clear answer on which tools are approved or what data can go into them',
      'Employees who want to use AI well but were never shown how',
    ],
    checks: [
      {
        items: [
          'Which AI tools and subscriptions you have, and what they cost',
          "How usage is measured, if it's measured at all",
          'Whether the models you use fit the work you use them for',
          'Your current policies on tools and data',
          'Gaps in adoption and training',
        ],
      },
    ],
    diagnosticIntro: 'A free review to show you where you stand before you spend more.',
    checksLabel: 'What we look at:',
    whatYouGet: [
      'A clear picture of your current AI spend and usage',
      'Your top fixes, ranked by savings and risk',
      'A walkthrough on your discovery call',
    ],
    limitNote: 'Reviews are limited each week, so we can give every one real attention.',
    nextSteps:
      'If the review turns up work worth doing, we can take it further together through a half-day workshop and guided implementation. You end up with AI spend you can see and manage, a usage policy your team follows, and people trained on workflows they use every week.',
    outcome:
      'AI spend you can see and manage, a usage policy your team follows, and people trained on workflows they use every week.',
  },
];

export const AREA_TAGS = AREAS.map((a) => a.slug);

export const areaBySlug = (slug: string) => AREAS.find((a) => a.slug === slug);
