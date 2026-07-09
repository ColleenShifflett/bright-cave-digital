// Site-wide constants. Keep marketing copy and metadata in one place so the
// SEO component, RSS feed, sitemap, and structured data all stay in sync.

export const SITE_URL = 'https://brightcavedigital.com';

export const SITE_TITLE = 'Bright Cave Digital';
export const SITE_DESCRIPTION =
  'Bright Cave Digital helps businesses grow online with a flexible ' +
  'Do-It-Yourself, Done-With-You, and Done-For-You service model.';

export const SITE_TAGLINE = 'Digital growth, on your terms.';

// Used for the Organization JSON-LD and humans/llms metadata.
// `sameAs` lists official social/profile URLs — add real ones when available.
export const ORGANIZATION = {
  name: SITE_TITLE,
  legalName: 'Bright Cave Digital',
  logo: `${SITE_URL}/og-default.png`,
  sameAs: [] as string[],
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
