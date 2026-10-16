# NEON GARAGE Home V4 Report

## Outcome

The homepage was rebuilt as an image-led automotive landing page matching the supplied V4 reference: cream navigation, a sunset garage hero, oversized racing typography, four photographic feature cards, filterable Featured Builds, and a dark Creator Economy banner. Wallet behavior, Garage 3D code, contracts, and database structures were not changed as part of this work.

## Implemented files

- `app/page.tsx` — rebuilt homepage structure and routes.
- `app/home.module.css` — responsive desktop, tablet, and mobile visual system.
- `components/Featured.tsx` — unique build artwork, working category filters, and market links.
- `components/Nav.tsx` — added a functional market search control without changing wallet logic.
- `public/assets/home-v4/*.webp` — 11 optimized photographic assets.
- `tests/home-v4.spec.ts` — browser coverage for image decoding, filtering, routes, mobile overflow, and key content.
- `design-reference/neon-garage-home-v4.png` — local copy of the supplied reference.

## Image assets and provenance

All 11 assets are original images generated with OpenAI ImageGen for this project. No third-party stock photography or external copyrighted vehicle photography was copied. They were exported to WebP for the site.

| Asset group | Count | Combined size |
| --- | ---: | ---: |
| Hero | 1 | 269,836 bytes |
| Feature cards | 4 | 265,370 bytes |
| Featured builds | 5 | 528,076 bytes |
| Creator Economy | 1 | 142,778 bytes |
| **Total** | **11** | **1,206,060 bytes (1.15 MiB)** |

The hero uses eager priority loading. Supporting imagery uses Next.js image optimization and lazy loading where appropriate.

## Reference comparison

Matched characteristics:

- Cream, racing orange, and deep ink-green palette.
- Full-width photographic sunset garage hero.
- Large condensed italic racing headline and handwritten-style accent line.
- Four image-backed action cards attached to the hero.
- Five-card Featured Builds row on desktop with working category pills.
- Dark Creator Economy strip with workshop photography and two real navigation actions.
- Responsive two-column tablet cards and single-column mobile build feed.

Known differences:

- The exact proprietary/display fonts in the raster reference were unavailable; the implementation uses robust system fallbacks (`Arial Black`, Impact, Georgia).
- Generated imagery is original and intentionally does not reproduce a branded real-world vehicle exactly.
- Mobile reflows content instead of scaling the desktop composition, preserving readability and eliminating horizontal page overflow.

## Browser and visual verification

Screenshots:

- `artifacts/home-v4/1920.png` — 1920 × 1080 viewport.
- `artifacts/home-v4/1440.png` — 1440 × 900 viewport.
- `artifacts/home-v4/768.png` — 768 × 1024 viewport.
- `artifacts/home-v4/390.png` — 390 × 844 viewport.

Browser checks at all four viewports found:

- page horizontal overflow: none;
- image decode failures: 0 of 11;
- hero and CTA visibility: passed;
- mobile Creator Economy visibility: passed.

## Automated checks

| Check | Result |
| --- | --- |
| `npm run typecheck` | Passed |
| `npm run lint` | Passed, no warnings or errors |
| `npm run test` | Passed: 2 files, 5 tests |
| `npm run build` | Passed |
| Home Playwright desktop | Passed |
| Home Playwright mobile | Passed |

The production build reports existing dependency warnings from MetaMask SDK optional React Native storage resolution and a dynamic dependency inside `ox/tempo`. Compilation and static generation still complete successfully; these warnings are outside the homepage implementation.

## Functional verification

- Navigation links resolve to existing application routes.
- Search opens an input and submits to `/market?q=...`.
- Featured category filters update the visible builds.
- Build cards link to their market detail routes.
- `START BUILDING` routes to `/garage`.
- `START CREATING` and `LEARN MORE` route to `/create`.
- Wallet components and connection logic were left unchanged.

## Remaining limitations

- Exact pixel equivalence to the reference cannot be guaranteed because its source typefaces and layered design files were not supplied.
- Image generation can introduce minor fictional vehicle-detail inconsistencies when inspected at extreme zoom.
- Browser tests verify rendered/decoded imagery and interactions; they do not perform perceptual-diff scoring against the reference image.
