# AGENTS.md

Website for Life Painting & Decorating (Auckland). Read `Life_Painting_PROJECT_CONTEXT.md` first.

## Architecture
Next.js App Router, TS strict, Tailwind 4. Atomic Design in `src/components/{atoms,molecules,organisms,templates}`, aliases `@/…`.
All commercial copy in `src/lib/content.ts`; all metadata/JSON-LD in `src/lib/seo.ts`; tokens in `src/app/globals.css`.
Server Components by default; Client Components only for small interactive islands. Use Life Painting names (`LifePaintingPreloader`, …), never reference external sites.

## Conventions
Mobile-first. Shared components take explicit `surface="light" | "dark"` variants rather than duplicates. Don't make everything a pill: Button ≠ TextLink.
Stable `data-testid` names describe function + context (`home-hero-quote-button`); never rename them casually.

## Design skills
Impeccable (`PRODUCT.md` is the product record) and Taste are used here, hybrid mode: brand/brief exceptions are listed in `Life_Painting_PROJECT_CONTEXT.md` ("Design skills decision"). No eyebrows, tiny uppercase labels, numbering, monospace, gradients or hairlines; headlines max 2 lines; every section titled.

## Verify
`npm run verify` (lint, typecheck, test, build). Also check 375/768/1024/1440 px, keyboard, reduced motion, no horizontal overflow.

## Business rules & content limits
Painting first, decorating second. Residential homeowners in Auckland / North Shore / Auckland Central. Tone: clear, direct, human, en-NZ.
Never invent testimonials, clients, reviews, awards, metrics, certifications or guarantees. Missing evidence → `evidence: "pending"` (hidden in production).
No pricing/plans. Contact: 027 375 9093, contact@lifepaintingdec.co.nz.

## Refactors
Only abstract on real repetition. Keep changes scoped: declare what changes, what is preserved, what is out of scope. Log unrelated improvements as recommendations.
The owner commits and pushes; never commit or push.

## SEO
Unique title/description/canonical per route, explicit index state in `seo.ts`, one H1 per route, update `SEO_WORKLOG.md` with changes. No fake ratings in JSON-LD.

## Animation
Keep the animation kinds apart: `once` and `preloader` modules in `src/lib/motion/`, hovers in CSS, scrubs with their component (the hero collage's scroll lift). `useGSAP`/`gsap.context` with cleanup, scoped per section, transform/opacity, honour `prefers-reduced-motion` with a static fallback.
`once` never repeats; `scrub` never becomes autoplay; entrance animations never replace hovers.
Hero photo collage (`LifeHeroCollage`, helpers in `src/lib/motion/smooth.ts`): static by default; mouse parallax and scroll lift only with JS + motion allowed (scroll part is a scrub, never autoplay).

## Update docs with every change
README, PROJECT_CONTEXT, SEO_WORKLOG.

<!-- BEGIN:nextjs-agent-rules -->

## This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->
