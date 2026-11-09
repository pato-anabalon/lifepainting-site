# SEO Worklog

## Status (Phase 1)
Foundation in place. Priority: Auckland painting-service searches ("painters Auckland", "North Shore painters", interior/exterior painting, GIB stopping).

## Indexable routes
| Route | Index | Notes |
|---|---|---|
| `/` | yes | title/description/canonical/OG/Twitter via `buildMetadata("home")` |
| not-found | no | `robots: noindex` |
Planned: `/thank-you` (noindex), `/privacy` (index, low priority).

## Implemented
`lang="en-NZ"`, `metadataBase`, per-route metadata + canonical + OG + Twitter, `opengraph-image`, `robots.ts` (blocks `/api/`), `sitemap.ts` (only `index: true` routes), single H1 in hero.

## Structured data
- `HousePainter` (name, phone, email, areas served, founding 2023). **No** street address, rating or review: none verified.
- `BreadcrumbList` (home).
- `FAQPage`: emitted only when the FAQ section is visible; answers are factual from the brief, owner to confirm.

## Technical to-do
OG image with real branding/photo · Lovelo font · `/privacy` · per-service landing pages · Vercel Analytics after consent · Lighthouse/CWV pass · validate JSON-LD in Rich Results Test.

## Content to-do
Real project photos with alt text · real client comments (with permission) → then add `Review` markup only if genuine · owner review of FAQ answers · service-area copy per suburb.

## Future landing pages
`/interior-painting-auckland`, `/exterior-painting-auckland`, `/north-shore-painters`, `/gib-stopping-skimming-auckland`, `/roof-painting-auckland`.

## External actions
Google Business Profile (service-area business, no street address shown) · collect Google reviews · NZ local citations · Search Console + sitemap submission · set up the contact@ mailbox on lifepaintingdec.co.nz.

## Decision log
- Phase 0: `/` single landing; hide pending sections in production rather than ship placeholders.
- Phase 1: no street address in schema; generic Auckland service areas; FAQ JSON-LD tied to section visibility.


## FAQ + contact block
- FAQ section visible → `FAQPage` JSON-LD already emitted from `faq` content (same 5 answers shown on the page). FAQ title shortened to "Good to know first" (max two lines). `#faq` and `#contact` anchors now exist.


## Proof + work sections
- Pending-evidence sections excluded from production HTML and sitemap impact is none. Nav items "How we work"/"Our work" appear in development only.

## Phase 3
- Added `/privacy` (index: true, in sitemap, breadcrumb) and `/thank-you` (index: false, noindex/nofollow, excluded from sitemap). Form needs JS, so it is not in the prerendered HTML; no SEO content depends on it. Analytics only after consent.

## Hero (2026-11-01)
- The scroll image sequence was replaced by the photo collage (`HeroSection`). H1 unchanged, server-rendered, one per route. Collage photos are decorative (`alt=""`, layer `aria-hidden`); the hero logo carries the business name as alt. LCP candidate is likely the hero logo, the H1 or a collage photo (not measured yet). Since the mobile brush-stroke backdrop (same day), collage photos are `loading="lazy"` and are not downloaded below 768px; mobile LCP is the logo or H1. The sequence's poster image and its H2 overlays are gone. No title, canonical or JSON-LD changes.

## Anchors (2026-10-31)
- Home anchors: "What we paint and prepare" is now `#services` (menu "Services", hero "See what we do"); "How we look after your home" moved from `#services` to `#looking-after-your-home`. No route, title, canonical or JSON-LD changes.

## Navigation (2026-11-01)
- New menu item "Our approach" → `#looking-after-your-home` (header and footer "Explore"). Internal anchor only; no route, title, canonical or JSON-LD changes. The desktop nav row now starts at 1024 px; below that the full-screen menu holds the same links.

## Social share image (2026-11-01)
- `src/app/opengraph-image.tsx` redesigned (1200×630, PNG, generated at build time, static): forest ground, wide logo, the hero headline in two lines ("Good preparations." cream, "Better finishes." yellow) in Montserrat Bold, the services line in Montserrat Medium, the atomic shapes top right and the cream wave divider along the foot. Copy and alt text in `content.ts` → `ogImage`. Fonts: static Montserrat 500/700 TTFs from Google Fonts in `src/app/_og/` with `OFL.txt` (ImageResponse cannot use the variable font or next/font).
- `buildMetadata` now lists the image explicitly in `openGraph.images` and `twitter.images` (with alt, size, type): routes that set their own `openGraph` (privacy, thank-you) were replacing the file-based image and had no og:image. Checked: one og:image / twitter:image set per route. URLs are absolute from `SITE_URL`.

## Site URL on Vercel (2026-11-01)
- The first Vercel deployment (no custom domain yet, `lifepainting-site.vercel.app`) failed the og:image check: every absolute URL pointed at lifepaintingdec.co.nz, which does not resolve yet. `SITE_URL` (seo.ts) now resolves `NEXT_PUBLIC_SITE_URL` → `https://${VERCEL_PROJECT_PRODUCTION_URL}` (Vercel's production domain, set on every build) → `https://lifepaintingdec.co.nz`. Canonical, og:url, og:image, JSON-LD, robots and sitemap follow the live domain; once lifepaintingdec.co.nz is connected in Vercel, one redeploy switches them with no code change. Preview deployments also use the production domain (canonical to production, as intended).
- Home description shortened from 184 to 142 characters (owner's pick): "Interior, exterior and decorative painting for Auckland homes, with careful preparation and GIB stopping. Get a free quote from Life Painting." The service areas (North Shore, Auckland Central) stay in the page copy and the LocalBusiness JSON-LD.

## Work gallery with real photos (2026-11-09)
- "Finishes we're proud of" (`#work`) is now `evidence: "ready"` and renders in production; the "Our work" nav item shows in production.
- 18 owner-supplied project photos via `next/image` (lazy, responsive `sizes`), each with a descriptive alt in `content.ts`. 9 are in the server HTML (3 per tier); the other 9 only appear after the client-side shuffle button, so crawlers see the first set. No captions or claims beyond what the photos show; no structured data added for them.
- Still one H1 (hero); tier titles are H3 under the section H2.

## Production release prep (2026-11-09)
- Mock-up mode off (`SHOW_PENDING_SECTIONS = false`): no "PENDING" text or placeholder slots in the production HTML (checked in the build output and on `next start`).
- "How we run every job" (`#how-we-work`) now ships in production with its 5 qualitative standards; the "How we work" nav item shows. The "Kind words from our clients" block stays hidden until real, permitted comments exist. No review or rating markup.
- Production home sections: hero, services overview, our approach, how we work, our work, FAQ, contact. Still one H1.
- Service areas (client review): West Auckland added. Shows in the footer, the FAQ answer (so FAQPage JSON-LD too) and LocalBusiness `areaServed`. Title and meta description unchanged (they say "Auckland").
- Lovelo title font added via `next/font/local` (self-hosted woff2, 11.5 KB, preloaded, `display: swap`): no third-party font request; headline sizes and line counts re-checked, no layout change beyond two bento tile title sizes.
- Privacy policy in a dialog from the contact form (2026-11-09): the dialog only exists once a visitor reaches step 3 of the form (client-side), so the home HTML is unchanged; inside it the policy uses H2 + H3, never a second H1. `/privacy` is unchanged and remains the canonical page (indexed, in the sitemap); the form's link still points to it.
- Instagram profile (2026-11-09): `sameAs: ["https://www.instagram.com/lifepaintingdec"]` in the LocalBusiness JSON-LD, plus a footer link (new tab). Helps Google tie the profile to the business; check with the Rich Results Test after deploy.
