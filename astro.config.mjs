// @ts-check
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import partytown from '@astrojs/partytown';
import vercel from '@astrojs/vercel';

import { SITE_URL } from './src/consts';

// https://astro.build/config
export default defineConfig({
  // `site` is required for the sitemap, RSS feed, and canonical/OG URLs.
  site: SITE_URL,

  output: 'static',

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
    sitemap(),
    partytown({
      // Forward the GA4 dataLayer/gtag calls to the Partytown web worker.
      config: {
        forward: ['dataLayer.push', 'gtag'],
      },
    }),
  ],
});
