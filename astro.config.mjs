// @ts-check
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import partytown from '@astrojs/partytown';
import mdx from '@astrojs/mdx';
import vercel from '@astrojs/vercel';

import { SITE_URL } from './src/consts';

// https://astro.build/config
export default defineConfig({
  // `site` is required for the sitemap, RSS feed, and canonical/OG URLs.
  site: SITE_URL,

  output: 'static',

  // Permanent redirects for pages retired in the October 2026 site reset. The
  // Vercel adapter turns these into real 301s rather than meta-refresh pages.
  redirects: {
    '/scorecard': { status: 301, destination: '/web-strategy' },
    '/approach': { status: 301, destination: '/about' },
    '/core-beliefs': { status: 301, destination: '/about' },
    '/now': { status: 301, destination: '/about' },
    '/work-with-us': { status: 301, destination: '/services#freelance' },
    '/fixing-it-in-public': { status: 301, destination: '/resources/fixing-it-in-public' },
    '/blog': { status: 301, destination: '/resources' },
    '/blog/[...slug]': { status: 301, destination: '/resources/[...slug]' },
    '/resources/digital-growth-starter-checklist': { status: 301, destination: '/resources' },
    '/services/diagnose': { status: 301, destination: '/services' },
    '/services/roadmap': { status: 301, destination: '/services' },
    '/services/foundation': { status: 301, destination: '/services' },
    '/services/content': { status: 301, destination: '/services' },
    '/services/optimize': { status: 301, destination: '/services' },
    '/services/enable': { status: 301, destination: '/services' },
  },

  // Disable Astro's origin-check CSRF guard. It rejects the /api/contact form
  // POST when the domain's non-www → www redirect drops the Origin header
  // ("Cross-site POST form submissions are forbidden"). This endpoint has no
  // auth/session to protect; spam and abuse are handled by the honeypot,
  // Cloudflare Turnstile, and per-IP rate limiting inside the route itself.
  security: {
    checkOrigin: false,
  },

  adapter: vercel({
    webAnalytics: { enabled: false },
  }),

  integrations: [
    sitemap({
      // Keep utility pages out of the sitemap: they are noindex and have no
      // search value.
      filter: (page) => !/\/(thank-you|404)\/?$/.test(new URL(page).pathname),
    }),
    partytown({
      // Forward the GA4 dataLayer/gtag calls to the Partytown web worker.
      config: {
        forward: ['dataLayer.push', 'gtag'],
      },
    }),
    // Registers the .mdx entry type for the content layer so atoms, lenses,
    // and notices load and render. Order is irrelevant here: no integration
    // modifies markdown config for it to inherit.
    mdx(),
  ],
});
