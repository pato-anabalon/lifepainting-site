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
- **Preloader** `LifePaintingPreloader`: monogram fade-in + shimmer (1.6 s), then a sprite brush wipe (`src/lib/motion/brushWipe.ts`, after the GSAP stepped-sprite technique in Unseen Studio's CodePen "LZLLEM"; the canvas bristle version was rejected by the owner): rows of a real brush stroke (sprite `public/brush/brush-stroke-cream.webp`, 22 frames of 1000×205, recoloured to `--lp-cream`) overlap by 22 % and paint top to bottom, each one stepped left to right with `steps(21)`; 1.5 s for all rows (15 % overlap between rows), then the overlay fades in 0.3 s and the preloader is marked done, so the hero (collage + logo, H1, intro, buttons) appears on cream. Strokes run along the long side: across on landscape, down the screen on portrait (the row stage is transposed); the row count (2–6) is the one that keeps the stroke closest to its own proportions (1440×900 → 4 rows, 390×844 → 3, 768×1024 → 5). The sprite starts loading when the preloader mounts and the brush waits for it to decode; if it fails the preloader just ends. ≈3.4 s total. **Fail-safes (2026-10-31, after an intermittent "stuck on the monogram" report that could not be reproduced in 34 headless loads):** the overlay only leaves when the app's JS finishes it, so (1) the boot script starts an 8 s watchdog that marks the preloader done and fires the done event if the JS never runs or never mounts the preloader (chunk/hydration error); the preloader clears it on mount; (2) from mount the preloader has its own hard deadline (≈7.4 s); (3) the sprite wait is capped at 2.5 s, after which the overlay just fades out without the brush. Tested by blocking the sprite (overlay fades at ≈2.5–2.8 s) and blocking the JS chunks (the static green + monogram screen, released at 8 s). **Asset licence to confirm:** the sprite comes from that public CodePen (Unseen Studio); replace it with an own stroke before launch or confirm it may be used. A boot script in `<body>` sets `html[data-lp-preloader]` = `pending|skip` before paint; CSS hides the overlay unless `pending` (no JS → hidden; reduced motion or already seen this session → `skip`). `done` after finishing. Page scroll is locked only while `pending`.
- **Hero** (`HeroSection`, server) = `LifeHeroCollage` (client: ONCE intro after the preloader, 3D mouse parallax, SCRUB lift on scroll) + `LifeHeroReveal` (ONCE stagger of logo, H1, intro, buttons). Both wait for the preloader. Nothing loops. Reduced motion → static collage, visible content. Details under "Hero: photo collage".
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
`site-header`, `site-header-logo`, `site-nav`, `site-nav-{section}-link` (Services = `site-nav-services-overview-link` since 2026-10-31, was `site-nav-services-link`), `site-header-quote-button`, `site-nav-mobile-toggle`, `site-nav-mobile-panel`,
`site-nav-mobile-quote-button`, `site-skip-link`, `site-footer`, `site-footer-logo`, `site-footer-nav`, `site-footer-contact`, `site-footer-brand-mark`,
`site-preloader`, `home-services-overview-section`, `home-services-bento-grid`, `home-services-tile-{interior|exterior|weatherboards|masonry|roofs|fences|decorative|preparation}`, `home-services-section`, `home-services-card-list`, `home-services-{service}-card`, `home-services-{service}-quote-button`, `home-hero-section`, `home-hero-logo`, `home-hero-title`, `home-hero-quote-button`, `home-hero-services-button`, `home-jsonld-{business|breadcrumb|faq}`, `not-found-heading`, `not-found-home-button`.

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

## Hero history
- Earlier heroes, now removed: an SVG backdrop (`LifeHeroBackdrop`), then a scroll-scrubbed canvas image sequence (`LifeHeroSequence`, `frameSequence.ts`, 26 frames in `public/hero-frames/`). On 2026-11-01 the owner chose the photo collage as the official hero; the sequence component, its helpers and tests, its `.lp-seq` CSS, its copy (`hero.sequence`, `hero.chips`) and the frames were deleted. PNG originals of the frames remain in `design-source/hero-frames-png/` (gitignored). Retired testids: `home-hero-sequence`, `home-hero-canvas`, `home-hero-poster`, `home-hero-loading`, `home-hero-intro`, `home-hero-overlay-1`, `home-hero-overlay-2`.

## Hero: photo collage (official since 2026-11-01)
- `HeroSection` (server; was `HeroSection2` while under review) → `LifeHeroCollage` + `LifeHeroReveal`. Inspired by a parallax portfolio template the owner shared (structure only; no code or assets copied, rebuilt with our own loop and brand). The loop's easing helpers live in `src/lib/motion/smooth.ts` (`clamp`, `smoothToward`, tested).
- `LifeHeroCollage` (client): 12 tiles in a 4-column floating grid (20vw tiles / 10vw gap on desktop, 30vw / 40vw on smaller screens). ONCE intro after the preloader (opacity 0→1, scale 0.8→1, 1.4 s); 3D mouse parallax for fine pointers only (perspective 1200px on the centre; the grid pans ±14vw away from the cursor, no tilt (tried ±7°/±9°, owner preferred it flat); every tile has a signed depth −4…5 that sets its translateZ (45px per unit) and an extra drift of 1.2vw per unit, so near tiles follow the mouse and far ones move against it; τ 520 ms; intro opacity lives on the centre so the grid's preserve-3d is not flattened); SCRUB on scroll over a 170svh track (collage lifts 70 %, grows to 1.2, fades to 25 % but never fully, so what is left scrolls out with the headline and there is no blank screen before the next section; blur ≤ 10 px on desktop only; was 220svh / fully gone at 85 %, which left an empty screen). One rAF loop that stops when everything has caught up (measured: 0 frames while idle). Reduced motion / no JS: static collage, one screen.
- Headline and intro have no panel or backings (owner's call, 2026-10-31; the earlier cream / yellow per-line backings were removed). A soft glow halo and then a thin cream text edge were tried on the intro and dropped. Line 2 of the H1 ("Better finishes.") is `text-azure` (#5A9CAB, owner's choice; ≈2.7:1 on cream, below the 3:1 large-text minimum, accepted as brand display type). Trade-off: where a dark photo passes behind the H1, contrast drops for a moment. Hero copy carries a hard cream (background-colour) offset shadow, same geometry as the buttons' shadow (mustard was tried first): `.lp-text-offset` (0.05em) on both the H1 and the intro. The secondary button keeps a cream fill.
- Photos (2026-11-01): 12 pictures supplied by the owner in `public/hero-collage/` (`1-optimized.avif` … `12-optimized.avif`, order = tile order), replacing the earlier Wikimedia Commons set and the 2 hero-sequence stills. The owner later converted all of them to AVIF and swapped photos 2 and 7 (tiles updated to match). Each tile now uses its photo's own aspect ratio (`TILES` in `LifeHeroCollage.tsx`), so nothing is cropped; tile offsets and depths are unchanged. Credits: none recorded (`credit: null`); add one in `content.ts` → `heroCollage` for any photo that needs it. The footer "Photo credits" block only renders when at least one photo has a credit. Pending: confirm the source/licence of each photo, and note that photo 2 shows a "Life Painting Decorating" shopfront sign (it reads as a physical shop; confirm it is real or acceptable as an illustration).
- Testids: `home-hero-collage` (renamed from `home-hero2-collage` on 2026-11-01: the "2" only marked the mock-up), `home-hero-logo`, `site-footer-photo-credits` (only rendered when a photo has a credit; title/CTA testids unchanged).
- Fix (2026-10-31): on a first visit (preloader running) the hero copy stayed hidden. The preloader dispatches its "done" event from inside its GSAP `onComplete`, so a selector string tweened in that callback was resolved against the preloader's scope and matched nothing. `lifeEntranceOnLoad` (`src/lib/motion/once.ts`) now resolves its targets to elements up front. Rule: anything that waits for the preloader must hold element refs, never selector strings.
- Header over the hero (2026-10-31): the home hero is full screen and the header is hidden while it is on screen; it slides down once the next section reaches the header band. Opt-in per page with `data-lp-header-auto` on the hero section; `Header.tsx` sets `data-shown` (scroll + resize, re-checked on route change) and `globals.css` makes `.lp-header` fixed / translated only when JS ran (`html[data-lp-preloader]:has([data-lp-header-auto])`). `--lp-hero-offset` (0 in that mode, header height otherwise) sizes the collage stage. Keyboard focus (`:focus-visible`, not `:focus-within`, so clicking the logo does not pin it open) inside the header always shows it; on the home page the header logo scrolls to the top itself (a same-URL Link navigation did not scroll); without JS the header stays sticky as before; other routes (privacy, thank-you) are unchanged.
- Hero logo (2026-10-31): `logo-wide-for-light.png` above the H1 (`home-hero-logo`), cropped in CSS to the artwork band of its square 1563px canvas (`aspect-[1563/380]`, object-cover), no backing, 13–22rem wide, part of the ONCE reveal. Alt = `site.legalName`.

## Navigation, consent and preloader brush (2026-10-31)
- "Services" in the menu (and the hero's "See what we do") now lands on "What we paint and prepare" (`services-overview`, anchor `#services`). It used to go to "How we look after your home" (`services`), which now has anchor `#looking-after-your-home` and no menu item. Nav testid follows the section id: `site-nav-services-overview-link`.
- Consent banner (`AnalyticsGate`) waits until the section marked `data-lp-consent-after` (home: "What we paint and prepare") comes into view or has been scrolled past, so it never covers the hero. Pages without the marker show it straight away. Behaviour of Accept / Decline unchanged.
- Preloader brush: see Motion → Preloader. Row layout and timing are unit-tested in `brushWipe.test.ts`.
