# Life Painting – Project Context

_Last updated: Phase 2, block 2 (hero, services overview, services). Design skills Impeccable + Taste in use._

## Business goals
Homeowner enquiries (quotes) in Auckland, North Shore and Auckland Central. Painting first; decorating secondary.
Residential focus; commercial and subcontracting are aspirational/occasional and are not promoted.
Founded 2023 (owners' prior experience must not be conflated with company age).

## Positioning
- Essence: Care. Craft. Reliability. Pillar: **Reliable**.
- Positioning: Premium workmanship. Approachable service. ("Premium" = workmanship/finish, never luxury or expensive.)
- Slogan: Good preparations. Better Finishes.
- Values: Reliability · Craftsmanship · Care · Attention to detail · Communication.
- Must not feel: unreliable, unprofessional, childish, eccentric, outdated, pretentious, a generic agency template.

## Architecture
Single landing (`/`) with anchored sections. Pending sections render in development only (`isSectionVisible`).

| # | Section | Id / anchor | Evidence | Production |
|---|---|---|---|---|
| 1 | Loading screen (3 s monogram shimmer, once per session) | n/a | ready | yes |
| 2 | Hero (GSAP animated bg, no video → no hls.js) | `top` | ready, **built** | yes |
| 3 | Services at a glance (8-tile bento, tiles link to `/?service=<key>#contact`) | `overview` | ready, **built** | yes |
| 4 | What we do (4 items, alternating, `ServiceCard`) | `services` | ready, **built** | yes |
| 5 | How we work + testimonial wall (thumbs) | `how-we-work` | **pending** (real comments + permission) | hidden |
| 6 | Our work gallery (3 tiers, yellow middle, photo slots) | `work` | **pending** (real photos) | hidden |
| 7 | FAQ (5 items) | `faq` | ready (owner to review answers) | yes |
| 8 | Final CTA (marquee + button) + step form | `contact` | ready | yes |
| 9 | Footer | n/a | ready | yes |

## Components (Phase 1)
atoms: Button (primary/secondary × light/dark), TextLink, Container, Logo (stacked/wide/icon × light/dark), MetaChip, Eyebrow, JsonLd ·
molecules: SectionHeading, ScrollReveal (ONCE on scroll), ServiceCard · atoms also: LifeServiceArt, LifeStarburst · organisms: Header (client, mobile menu, forest surface), Footer · templates: SiteShell.
Planned: TextField, ContactForm, TrackedCta, ScrollReveal (Phases 2–3). **No PlanCard**: the business has no plans/pricing.

## Design skills decision (hybrid, owner-approved)
Impeccable and Taste are used on this project. Where they conflict with the brief/brand guidelines, the brief wins; everywhere else their rules apply.
- **Kept from the brand (explicit exceptions):** hard offset "sign-painter" shadows on buttons/cards, geometric mid-century motifs, the 3 s preloader, the pennant/sunburst/starburst hero, brand palette incl. cream `#F8F0DA`, Lovelo titles.
- **Applied from the skills:** no eyebrows or tiny uppercase labels, no 01/02 numbering, no monospace, no gradients (except the preloader shimmer mask), no hairline rules, headlines max 2 lines at every width, every section titled, no decorative element over content, `PRODUCT.md` as product record.
- Expected remaining inspector findings (accepted): `shadow` (brand depth, run with `--allow shadow`), preloader-related `late-title`/`covered-text` (inspect with the preloader skipped), `few-pictures`/`no-footage` (client photos pending; no third-party photos used because the open-licence Auckland photos found were low quality), `palette-cream` (brand colour), `font-fallback` (Lovelo pending).
- Verify with `node ~/.claude/skills/design-taste-frontend/scripts/inspect.mjs <url> --allow shadow`. Once Lovelo is added re-check headline line counts: it is wider than Montserrat.

## Visual system
Mid-century 1940s–60s commercial signage (not 70s/80s). Palette (only these): Cream `#F8F0DA`, Forest "Dark Turquoise" `#1F4A3A`,
Gray Azure `#5A9CAB`, Yellow `#FDD01D`, Mustard `#EAA72F`. Yellow replaces the brief's "lime". Azure is decorative/large type only on cream (low contrast).
Type: Lovelo (titles, **file pending – licensed**, falls back to Montserrat), Montserrat Bold (headings), Montserrat (body).
Depth = hard offset "sign-painter" shadows. Roles: Button (action, shadow, press) ≠ TextLink (underline) ≠ MetaChip (flat outline, inert, sentence case). Eyebrows were removed (design skills ban).

## Responsive
Mobile-first at 375 / 768 / 1024 / 1440. Mobile has its own nav panel and sticky quote CTA. Heavy/decorative assets are conditionally mounted in JS, not just CSS-hidden. No horizontal overflow (`overflow-x: clip` safeguard on body, not a fix for bugs).

## Animation
Implemented: preloader + hero. Modules in `src/lib/motion/`: `register.ts` (plugins + `LIFE_MOTION_OK`), `preloader.ts` (PRELOADER), `once.ts` (ONCE), `scrub.ts` (SCRUB). Hover stays in CSS (Button).
- **Preloader** `LifePaintingPreloader`: monogram fade-in + shimmer + ease-out fade, 3 s. A boot script in `<body>` sets `html[data-lp-preloader]` = `pending|skip` before paint; CSS hides the overlay unless `pending` (no JS → hidden; reduced motion or already seen this session → `skip`). `done` after finishing. Page scroll is locked only while `pending`.
- **Hero** (`HeroSection`, server) = `LifeHeroBackdrop` (SVG sunburst + pennant string + starburst; ONCE pennant drop, SCRUB ray rotation/starburst drift) + `LifeHeroReveal` (ONCE copy stagger). Both wait for the preloader. Nothing loops. Reduced motion → fully static, visible content.
- Motifs are generated SVG in palette colours, inspired by the guidelines' mid-century graphics (pennants/starburst/sunburst). Swap for exact brand artwork if the client provides vector files.
Original plan:
Four separate modules: `scrub`, `once`, `hover`, `preloader`. `useGSAP` with cleanup, scoped to the section, transform/opacity only,
`prefers-reduced-motion` gives a static alternative. Preloader once per session and skipped under reduced motion.

## Integrations (Phase 3)
Vercel Analytics (with consent) + custom CTA events · `/api/contact` (Resend) · `/api/upload` (Vercel Blob). No credentials → explicit local simulation, never fake success in production.

## Route status
`/` index (skeleton) · `/_not-found` noindex. Planned `/thank-you` noindex, `/privacy`.

## Commercial decisions
Name shown: **Life Painting**; footer/legal: Life Painting & Decorating. Service area shown generically (Auckland · North Shore · Auckland Central), no street address.
Contact: phone 027 375 9093, email `contact@lifepaintingdec.co.nz`. Domain: `lifepaintingdec.co.nz`.
Git: the owner (Patricio) makes all commits and pushes.

## data-testid map
`site-header`, `site-header-logo`, `site-nav`, `site-nav-{section}-link`, `site-header-quote-button`, `site-nav-mobile-toggle`, `site-nav-mobile-panel`,
`site-nav-mobile-quote-button`, `site-skip-link`, `site-footer`, `site-footer-logo`, `site-footer-nav`, `site-footer-contact`, `site-footer-brand-mark`,
`site-preloader`, `home-services-overview-section`, `home-services-bento-grid`, `home-services-tile-{interior|exterior|weatherboards|masonry|roofs|fences|decorative|preparation}`, `home-services-section`, `home-services-card-list`, `home-services-{service}-card`, `home-services-{service}-quote-button`, `home-hero-section`, `home-hero-backdrop`, `home-hero-title`, `home-hero-quote-button`, `home-hero-services-button`, `home-jsonld-{business|breadcrumb|faq}`, `not-found-heading`, `not-found-home-button`.

## Do not change accidentally
- No invented testimonials, reviews, awards, metrics, clients, certifications or guarantees.
- Palette, slogan, "Painting first" order, no PlanCard, yellow-not-lime.
- Pending sections never render in production.
- One H1 per route (hero only). Motion modules stay separated.


## Block 3 (FAQ + closing CTA)
- `FaqSection` (5 items, `FaqItem` accordion: grid 0fr→1fr height transition, closed panel `inert`, first item open) and `ContactSection` (`#contact`: call / email buttons, mustard `Marquee`). Testids: `home-faq-section`, `home-faq-list`, `home-faq-item-{n}[-trigger]`, `home-contact-section`, `home-contact-call-button`, `home-contact-email-button`, `home-contact-marquee`.
- The step form is Phase 3 and will mount inside `ContactSection`; until then call and email are the only real channels (no fake form).

## Block 4 (proof + gallery, pending evidence)
- `ProofSection` ("How we run every job": 5 qualitative standards + 3 testimonial slots) and `WorkSection` (3-tier bento, middle "Exterior" highlighted, `ThumbSlot` placeholders). Both are `evidence: "pending"`: rendered in development only, absent from the production HTML (verified in the build output). Testids: `home-proof-*`, `home-work-*`, `*-slot-{n}`.
- To go live: replace `ThumbSlot` with real `<Image>` photos / written-permission testimonials, then set `evidence: "ready"` in `content.ts`.

## Phase 3 (integrations)
- **Form:** `ContactForm` inside `ContactSection` (3 steps: service → project → details). Reads `?service=` (CTAs link `/?service=<key>#contact`), sends the route it started from, validation shared with the API in `src/lib/contact-schema.ts` (tested). Honeypot field. Success → `/thank-you` (noindex). Needs JS; call and email buttons always work.
- **`POST /api/contact`:** validates again, rate-limits (best effort, per instance), sends text email via Resend (`replyTo` = visitor). Without `RESEND_API_KEY` / `CONTACT_TO_EMAIL` / `CONTACT_FROM_EMAIL`: development → `{ok:true, simulated:true}` (logged redacted); production → 503 `not_configured` and the form shows the call/email fallback. Never a fake success in production.
- **`POST /api/upload`:** one photo per request, JPG/PNG/WebP, ≤ 4 MB (Vercel body limit 4.5 MB), max 3 per enquiry, to Vercel Blob (`BLOB_READ_WRITE_TOKEN`) with random names and public-but-unguessable URLs (stated in `/privacy`). Same simulation/503 rule. Only `*.blob.vercel-storage.com` URLs are accepted by `/api/contact`.
- **Consent + analytics:** `AnalyticsGate` shows a banner until a choice is made; `<Analytics />` mounts only on "granted" (stored in `localStorage` `lp-consent`); footer "Cookie preferences" resets it. `trackEvent` (`cta_click`, `form_start`, `form_step`, `form_submit`) is a no-op without consent; CTA events use each `data-testid` ending in `-button` as id, plus origin route and destination. Custom events may require a Vercel plan that supports them.
- **Routes:** `/privacy` (index, in sitemap), `/thank-you` (noindex, not in sitemap).
- **To go live (owner):** set the four env vars in Vercel, verify the Resend sender domain, have the privacy text reviewed, test one real enquiry.
- Verified in a headless Chrome against the dev server (simulation): prefill, step validation, focus to step heading, submit → `/thank-you`. Production-build API checks via curl: 503 without keys, 400 invalid, honeypot silent 200, 415 bad file type.
