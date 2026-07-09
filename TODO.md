# Brightcave Digital — TODO / Next Steps

Running notes on what's placeholder and what's left to do. Last updated 2026-07-08.

## 🚀 Go-live blockers (set in Vercel, then redeploy)
- [ ] **GA4** — add env var `GA4_MEASUREMENT_ID=G-FBQKRMDJ50` in Vercel → Settings →
      Environment Variables (Production), then redeploy. Verified working locally.
- [ ] **Custom domain** — confirm `brightcavedigital.com` is attached in Vercel.
      `SITE_URL` in `src/consts.ts` already points there.

## 📮 Contact form (currently inert by choice)
- [ ] Pick a form service (Formspree / Web3Forms / Vercel Forms) and set
      `PUBLIC_CONTACT_ENDPOINT` in Vercel. The form posts a `_next` field →
      `/thank-you`, so configure the service to redirect there on success.
- [ ] Until set, the form has no submit target (no email is exposed anywhere).

## ✍️ Placeholder content to replace
- [ ] **Home** — real testimonial quote + stats (currently dummy numbers).
- [ ] **About** — real story, team, mission (marked "Placeholder content").
- [ ] **Services** — confirm tier descriptions / add real offerings.
- [ ] **Blog** — replace `src/content/blog/welcome-to-brightcave.md`.
- [ ] **Resources** — replace `digital-growth-starter-checklist.md`; add real
      `downloadUrl`s where relevant.

## 🎨 Brand assets
- [ ] **Logo** — the header/footer use a text wordmark ("Brightcave / Digital")
      + CSS monogram. The image logos in `public/brand/` read "Bright Cave
      Analytics" (from the design system) and are NOT used. Commission a real
      "Brightcave Digital" logo if wanted.
- [ ] **OG image** — `public/og-default.png` is a plain navy placeholder.
      Replace with a branded 1200×630 image for social sharing.
- [ ] **Favicon** — `public/favicon.svg` is a monogram "B" placeholder.

## 🔗 Social / metadata (empty until real accounts exist)
- [ ] Add real profile URLs to `ORGANIZATION.sameAs` in `src/consts.ts`.
- [ ] Set `TWITTER_HANDLE` in `src/consts.ts` (re-enables Twitter card attribution).

## 💡 Nice-to-haves / later
- [ ] GA4 custom event on contact-form submit (once the form is live).
- [ ] Consider Google Tag Manager only if adding multiple tags/pixels later.
- [ ] Fill in real copy for the footer / legal line if needed.

## ✅ Done
- Astro project scaffolded, deployed config for Vercel.
- Bright Cave design system applied across all pages.
- SEO (OG + Twitter cards), sitemap, RSS, robots (AI-crawler friendly),
  llms.txt, humans.txt, JSON-LD (Organization + Article).
- Contact form + thank-you page built (styled, accessible).
- Business email removed from all site output.
- Placeholder social links removed.
- Clean: `astro check` 0/0/0, all internal links resolve, no secrets in repo.
