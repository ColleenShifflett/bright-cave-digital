// The six service stages. One source for the homepage, the services overview,
// and the stage pages (src/pages/services/[stage].astro), so a stage's name,
// one-liner, and availability never drift between them.

export type HandsOn = {
  /** Which levels this line covers, e.g. 'DIY' or 'DWY and DFY'. */
  levels: string;
  text: string;
  /** Optional link for the line (e.g. the free scorecard). */
  href?: string;
};

export type Stage = {
  slug: string;
  name: string;
  subtitle: string;
  /** One-line description used on cards (homepage and services overview). */
  line: string;
  /** Meta description for the stage page. */
  description: string;
  youAreHere: string;
  whatHappens: string;
  youLeaveWith: string;
  handsOn: HandsOn[];
  availability: 'open' | 'waitlist';
  price?: string;
  next: { text: string; slugs: string[] };
};

export const STAGES: Stage[] = [
  {
    slug: 'diagnose',
    name: 'Diagnose',
    subtitle: 'Web Ground Truth Assessment',
    line: 'Something feels off. Find out what, and how much it matters.',
    description:
      "Find out what's holding your website back, and how much it matters.",
    youAreHere:
      "Something feels off, but you're not sure what. You don't trust your numbers, or you suspect your site isn't showing up the way it should.",
    whatHappens:
      'A structured audit of your analytics and tag setup, a discoverability scan across search and AI, a content and site inventory, and a quick look at your martech stack. Most of it can start without full account access.',
    youLeaveWith:
      "A plain-language findings report: what's working, what's broken, what's missing, and how much each one matters.",
    handsOn: [
      { levels: 'DIY', text: 'Start with the free scorecard.', href: '/scorecard' },
      { levels: 'DWY and DFY', text: 'The full assessment, done with or for you.' },
    ],
    availability: 'open',
    price: '[price]',
    next: { text: 'Roadmap', slugs: ['roadmap'] },
  },
  {
    slug: 'roadmap',
    name: 'Roadmap',
    subtitle: 'Foundational Web Analytics Roadmapping',
    line: 'You know there are problems. Decide what to fix first with the team you have.',
    description: 'Turn what\'s wrong into a plan your team can actually carry out.',
    youAreHere:
      'You know there are problems, from a diagnostic or your own experience, and you need to decide what to do first with the resources you actually have.',
    whatHappens:
      'A half-day working session with light pre-work. Your goals, constraints, and team capacity become a prioritized plan.',
    youLeaveWith:
      'A measurement charter and a prioritized fix queue within 48 hours, sized to your team.',
    handsOn: [
      { levels: 'DIY', text: '[roadmap template, coming soon]' },
      { levels: 'DWY', text: 'The workshop.' },
      { levels: 'DFY', text: 'Not offered at this stage.' },
    ],
    availability: 'open',
    price: '[$4,500]',
    next: { text: 'Foundation or Content', slugs: ['foundation', 'content'] },
  },
  {
    slug: 'foundation',
    name: 'Foundation',
    subtitle: 'Analytics Reset and Governance',
    line: 'Get data you can trust and a consistent way to tag, label, and publish.',
    description: 'Data you can trust and a consistent way to tag, label, and publish.',
    youAreHere:
      "Your data can't be trusted, or there's no consistent way things get tagged, named, and published.",
    whatHappens:
      'GA4 re-onboarding or new setup, configuration of your other data sources (search, business data, content), and governance for how things get tagged, labeled, and published.',
    youLeaveWith:
      'Accurate data (not perfect data), documentation, SOPs, and a maintenance guide.',
    handsOn: [
      {
        levels: 'DIY',
        text: 'The free tracking governance guide and template.',
        href: '/resources',
      },
      { levels: 'DWY and DFY', text: 'The full reset.' },
    ],
    availability: 'waitlist',
    next: { text: 'Optimize', slugs: ['optimize'] },
  },
  {
    slug: 'content',
    name: 'Content',
    subtitle: 'Discoverability and Information Design',
    line: 'Make your site say what you actually do, for people and for machines.',
    description: 'Make your site say what you actually do, for people and for machines.',
    youAreHere:
      "Your site doesn't fully represent what you do, or people and AI systems aren't finding or understanding you.",
    // "We" here means the owner and the client together. Approved exception
    // to the first person singular rule.
    whatHappens:
      'Content gap analysis, information architecture, labeling and taxonomy, and discoverability work for search, AI answers, and agents. We flesh out what you already know is missing.',
    youLeaveWith:
      'A site whose content and structure work for both people and machines, plus a content model your team can maintain.',
    handsOn: [
      { levels: 'DIY', text: '[content model template, coming soon]' },
      { levels: 'DWY and DFY', text: 'Available.' },
    ],
    availability: 'waitlist',
    next: { text: 'Optimize', slugs: ['optimize'] },
  },
  {
    slug: 'optimize',
    name: 'Optimize',
    subtitle: 'The Optimization Program',
    line: 'Turn your site into one that gets better on a schedule.',
    description: 'Turn your website into one that gets better on a schedule.',
    youAreHere:
      'Your foundation is solid, and you want your site to improve on a schedule instead of in bursts.',
    whatHappens:
      'A recurring cycle: review a short scorecard, design one to three experiments or changes, hand them to your existing web team, measure, and log what you learned. Conversion and usability work lives here.',
    youLeaveWith: 'A working improvement loop and a record of what you learned.',
    handsOn: [
      { levels: 'DIY', text: 'Not offered at this stage.' },
      { levels: 'DWY', text: 'I run the cycle with your team.' },
      { levels: 'DFY', text: 'I run it and your team ships.' },
    ],
    availability: 'waitlist',
    next: { text: 'Enable', slugs: ['enable'] },
  },
  {
    slug: 'enable',
    name: 'Enable',
    subtitle: 'Training and Handoff',
    line: 'Hand it to your team, with the skills to keep it running.',
    description: 'Hand your web program to your team, with the skills to keep it running.',
    youAreHere:
      'You want your own people to own this, or you want to do it yourself with guidance.',
    whatHappens:
      'Workshops, training plans, and SOP development, plus training a named internal owner for your program.',
    youLeaveWith:
      'A team that runs it without me. Optional quarterly check-ins keep a light connection.',
    handsOn: [
      { levels: 'DIY', text: 'Guides and resources.', href: '/resources' },
      { levels: 'DWY', text: 'Workshops and coaching.' },
      { levels: 'DFY', text: 'Not offered at this stage.' },
    ],
    availability: 'waitlist',
    next: { text: "You're set. Come back to Diagnose in a year.", slugs: ['diagnose'] },
  },
];

export const stageBySlug = (slug: string) => STAGES.find((s) => s.slug === slug);
