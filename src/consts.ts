// Site-wide constants. Keep marketing copy and metadata in one place so the
// SEO component, RSS feed, sitemap, and structured data all stay in sync.

export const SITE_URL = 'https://brightcavedigital.com';

export const SITE_TITLE = 'Bright Cave Digital';
export const SITE_DESCRIPTION =
  'AI-era web strategy and analytics for busy teams with big dreams. Start ' +
  'with a free scorecard of how well people and AI can find your site.';

export const SITE_TAGLINE = 'A website that gets better on a schedule.';

// Used for the Organization JSON-LD and humans/llms metadata.
// `sameAs` lists profile URLs for the ORGANISATION itself (a LinkedIn company
// page, GitHub org, directory listing) — not personal profiles. A person's URL
// belongs on `founder.sameAs`, which links the human to the studio without
// claiming they are the same entity.
export const ORGANIZATION = {
  name: SITE_TITLE,
  legalName: 'Bright Cave Digital',
  logo: `${SITE_URL}/og-default.png`,
  sameAs: [] as string[],
  founder: {
    name: 'Colleen Shifflett',
    sameAs: ['https://www.linkedin.com/in/colleenshifflett/'],
  },
};

// Twitter/X handle for Twitter card metadata (e.g. '@yourhandle').
// Empty until a real account exists — Twitter cards omit attribution when blank.
export const TWITTER_HANDLE = '';

// Default social share image (place a 1200x630 PNG at public/og-default.png).
export const DEFAULT_OG_IMAGE = '/og-default.png';

// Primary navigation shown in the site header.
export const NAV_LINKS = [
  { href: '/about', label: 'About' },
  { href: '/services', label: 'Services' },
  { href: '/scorecard', label: 'Scorecard' },
  { href: '/blog', label: 'Blog' },
  { href: '/resources', label: 'Resources' },
];

// Footer "Explore" links.
export const FOOTER_LINKS = [
  { href: '/manifesto', label: 'Manifesto' },
  { href: '/about', label: 'About' },
  { href: '/approach', label: 'Approach' },
  { href: '/services', label: 'Services' },
  { href: '/scorecard', label: 'Scorecard' },
  { href: '/fixing-it-in-public', label: 'Fixing it in public' },
  { href: '/work-with-me', label: 'Work with me' },
  { href: '/now', label: 'Now' },
  { href: '/blog', label: 'Blog' },
  { href: '/resources', label: 'Resources' },
];

// Free scorecards offered per week. Placeholder until the owner confirms.
export const SCORECARDS_PER_WEEK = '[five]';
