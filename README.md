# Life Painting – website

Production landing site for **Life Painting & Decorating**, an Auckland painting company
(*Good preparations. Better Finishes.*). Goal: turn homeowner visits into clear, well-informed quote enquiries.

## Stack
Next.js 16 (App Router) · React 19 · TypeScript strict · Tailwind CSS 4 · GSAP + `@gsap/react` · Framer Motion ·
Lucide · Vercel Analytics · Vercel Blob + Resend (Phase 3). Hosted on Vercel, versioned on GitHub
(`git@github.com:pato-anabalon/lifepainting-site.git`).

## Install & scripts
```bash
npm install
npm run dev        # http://localhost:3000
npm run lint
npm run typecheck
npm test           # vitest
npm run build
npm run verify     # lint + typecheck + test + build
```

## Structure
- `src/app` routes, `robots.ts`, `sitemap.ts`, OG image
- `src/components/{atoms,molecules,organisms,templates}` Atomic Design
- `src/lib/content.ts` all commercial copy · `src/lib/seo.ts` metadata + JSON-LD
- `src/app/globals.css` design tokens

## Sections / routes
| Route | Status |
|---|---|
| `/` | Phase 1 skeleton (hero only). Sections are built in Phase 2 |
| `/not-found` | noindex |
Routes: `/`, `/privacy`, `/thank-you` (noindex). Hero = floating photo collage from `public/hero-collage` with mouse parallax (see PROJECT_CONTEXT). Preloader brush sprite: `public/brush/brush-stroke-cream.webp` (from a public CodePen; free licence, confirmed by the owner 2026-11-01). See `Life_Painting_PROJECT_CONTEXT.md` for the 9-section plan.

## Environment variables
See `.env.example`. Nothing is required for Phase 1. Phase 3 needs `RESEND_API_KEY`, `CONTACT_TO_EMAIL`,
`CONTACT_FROM_EMAIL`, `BLOB_READ_WRITE_TOKEN`. Without them, the contact API runs in an explicit *local simulation*
mode and must never report fake success in production.

## Deploy
Push to GitHub, import the repo in Vercel and set the env vars above. Production domain: `lifepaintingdec.co.nz`. The site's absolute URLs (canonical, og:image, sitemap) follow Vercel's production domain automatically (`VERCEL_PROJECT_PRODUCTION_URL`: the *.vercel.app URL until the custom domain is connected); set `NEXT_PUBLIC_SITE_URL` only to override it. After connecting the domain, redeploy once so the URLs switch.

## More docs
[`Life_Painting_PROJECT_CONTEXT.md`](./Life_Painting_PROJECT_CONTEXT.md) · [`SEO_WORKLOG.md`](./SEO_WORKLOG.md) · [`AGENTS.md`](./AGENTS.md)


## Status
Home sections built: hero, services overview, services, FAQ, contact CTA. Proof and gallery built as dev-only placeholders (awaiting real photos and testimonials). Phase 3 built (step form, /api/contact via Resend, /api/upload via Blob, consent + Vercel Analytics, /privacy, /thank-you); needs env vars to go live.
