# Brightcave Digital

Marketing site for Brightcave Digital, built with [Astro](https://astro.build)
and deployed to [Vercel](https://vercel.com). Brightcave offers digital growth
services across three tiers: **DIY** (Do It Yourself), **DWY** (Done With You),
and **DFY** (Done For You).

## Getting started

```sh
npm install
cp .env.example .env   # then fill in your GA4 measurement ID
npm run dev            # http://localhost:4321
```

## Scripts

| Command           | Action                                      |
| ----------------- | ------------------------------------------- |
| `npm run dev`     | Start the dev server                        |
| `npm run build`   | Build the production site to `./dist/`      |
| `npm run preview` | Preview the production build locally        |

## Environment variables

Copy `.env.example` to `.env`:

- `GA4_MEASUREMENT_ID` — your Google Analytics 4 ID (e.g. `G-XXXXXXXXXX`).
  When unset, the analytics snippet is omitted (so dev/preview stay untracked).

On Vercel, add `GA4_MEASUREMENT_ID` under **Project → Settings → Environment Variables**.

## Project structure

```
src/
  components/     SEO, JsonLd, Analytics
  content/        blog/ and resources/ collections (Markdown)
  content.config.ts   collection schemas
  layouts/        BaseLayout (head, nav, footer, SEO, structured data)
  lib/            jsonld.ts (schema.org builders)
  pages/          routes, incl. rss.xml.js and llms.txt.ts
public/           robots.txt, humans.txt, favicon.svg, og-default.png
```

## SEO & discoverability

- **Metadata** — `src/components/SEO.astro` renders Open Graph + Twitter cards.
- **Sitemap** — auto-generated at `/sitemap-index.xml` via `@astrojs/sitemap`.
- **RSS** — `/rss.xml` via `@astrojs/rss`.
- **robots.txt** — allows all crawlers, incl. AI/LLM bots. Update the `Sitemap:`
  URL and the domain if you change the production domain.
- **llms.txt** — generated at `/llms.txt`, summarising the site for LLM agents.
- **humans.txt** — at `/humans.txt`.
- **Structured data** — Organization schema sitewide + Article schema on posts.

## Social share images

A default 1200×630 image is expected at `public/og-default.png`.
**This file is not included — add your own branded image before launch.**
Override it per page/post with the `image` prop (pages) or the `ogImage`
frontmatter field (blog posts / resources).

## Configuration notes

- `site` and marketing metadata live in `src/consts.ts`. The domain is currently
  `https://brightcavedigital.com` — update `SITE_URL` there (and the `Sitemap:`
  line in `public/robots.txt`) if the production domain differs.
- No CSS framework is wired up yet — markup is clean semantic HTML.
