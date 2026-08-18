// Site-wide constants. Keep marketing copy and metadata in one place so the
// SEO component, RSS feed, sitemap, and structured data all stay in sync.

export const SITE_URL = 'https://brightcavedigital.com';

export const SITE_TITLE = 'Bright Cave Digital';
export const SITE_DESCRIPTION =
  'Web strategy and analytics for small and mighty teams. Get found by ' +
  "today's AI-driven buyers — and get the measurement to prove what's working.";

export const SITE_TAGLINE = 'Evolve with the agentic web.';

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
  { href: '/', label: 'Home' },
  { href: '/about', label: 'About' },
  { href: '/services', label: 'Services' },
  { href: '/blog', label: 'Blog' },
  { href: '/resources', label: 'Resources' },
  { href: '/contact', label: 'Contact' },
];
