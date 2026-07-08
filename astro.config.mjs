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
