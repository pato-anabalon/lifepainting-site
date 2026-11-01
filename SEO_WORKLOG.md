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
