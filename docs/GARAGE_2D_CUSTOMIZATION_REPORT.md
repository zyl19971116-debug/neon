# NEON GARAGE — 2D Customization V2 Report

## Delivered architecture

- `lib/garage/configuration-schema.ts` defines the complete V2 configuration and validates every category.
- `lib/garage/asset-manifest.ts` is the source of truth for availability, preview files, 1536 × 1024 canvas dimensions, per-view wheel anchors, layer order, render resolution, canonical combinations, and random-build pools.
- `components/garage/CarLayerRenderer.tsx` selects and preloads the exact photographic render and owns live number/plate overlay layers.
- `components/garage/CustomizationPanel.tsx` renders all 11 categories, visual swatches/thumbnails, selection states, and explicit UNAVAILABLE locks.
- Zustand retains history, reset, save/load, and migration from V1/V2 drafts.

The active Garage route creates no WebGL context, imports no React Three Fiber component, and requests no GLB/GLTF resource.

## Safe checkpoint

`garage-2d-v1-checkpoint` points to commit `6d3b248`, the complete Garage 2D V1 implementation before this expansion.

## New original imagery

The V2 expansion added six original OpenAI ImageGen renders:

| Asset | Purpose |
| --- | --- |
| `spoilers/ducktail.webp` | Ducktail spoiler full matched render |
| `bodykits/track.webp` | Track body-kit full matched render |
| `lights/vintage-yellow.webp` | Vintage-yellow headlight render |
| `windows/dark.webp` | Dark window-tint render |
| `cars/ride-low.webp` | Low ride-height render |
| `backgrounds/coastal-highway.webp` | Coastal Highway environment |

All use the same NG Classic 77 reference, studio framing, and 1536 × 1024 output canvas where applicable. They are original generated project assets, not stock photography.

## Configuration fields

`modelId`, `paintColor`, `paintFinish`, `wheelId`, `wheelFinish`, `spoilerId`, `bodyKitId`, `liveryId`, `raceNumber`, `headlightId`, `windowTint`, `rideHeight`, `plateText`, `sceneId`, `viewId`, and `assetVersion`.

## Verified selectable assets

| Category | Enabled choices |
| --- | --- |
| Paint | Silver Alloy, Racing Orange |
| Paint finish | Metallic |
| Wheels | Classic, Mesh, Aero |
| Wheel finish | Black |
| Spoiler | Ducktail, GT Wing |
| Body kit | Widebody, Track |
| Livery | Clean, Number 77 |
| Headlights | Classic White, Vintage Yellow |
| Window tint | Clear, Dark |
| Ride height | Sport, Low |
| Plate | Custom 1–8 character text |
| Environment | Sunset Garage, Photo Studio, Night Street, Race Paddock, Coastal Highway |
| View | Front, Side, Rear, Three Quarter |

Changing any enabled photographic option changes the central image source immediately. Canonical selection resets unrelated categories so the selected state can never claim a combination for which no image exists.

Race numbers 1–999 use a dedicated, correctly positioned 2D roundel overlay in the supported three-quarter render. Plate text uses a second overlay. Both layers are also drawn into the exported PNG.

## Explicitly unavailable assets

The manifest exposes but locks these choices because matched independent imagery does not exist:

- Paints: Pearl White, Midnight Black, Heritage Red, Petrol Teal, Sunset Yellow, British Racing Green, Ocean Blue, Candy Purple, Gunmetal Grey, Rose Gold.
- Finishes: Gloss and Matte.
- Wheels: Deep Dish and Racing.
- Wheel finishes: Silver, Gold, Bronze, White, Orange.
- Spoilers: None and Street.
- Body kits: Stock and Street.
- Liveries: Classic Stripe, Double Stripe, Flame, Retro Racing, Geometric, Street Style.
- Headlights: LED White.
- Window tint: Light and Blackout.
- Ride height: Stock.

No identical asset is presented as two different selectable parts. Disabled options show a lock icon and UNAVAILABLE label.

## Interaction behavior

- Undo/Redo history covers all V2 configuration values.
- Reset returns to the versioned initial configuration.
- Random Build selects only one canonical, photographed modification/environment at a time.
- Save/Load persists the full V2 configuration.
- Share writes a URL containing the complete validated configuration; visiting it restores the build.
- Capture draws the currently displayed render, custom number, and plate into the downloaded PNG.
- Mint still requires a connected wallet and deployed `NEXT_PUBLIC_NFT_CONTRACT_ADDRESS`; no success is fabricated.

## Verification

| Check | Result |
| --- | --- |
| `npm run typecheck` | Passed |
| `npm run lint` | Passed |
| `npm run test` | Passed: 6 tests |
| `npm run build` | Passed |
| Desktop Garage Playwright | Passed |
| Mobile Garage Playwright | Passed |
| Wallet regression | Passed |
| Canvas/WebGL elements | 0 |
| Horizontal overflow: 1920/1440/390 | None |

Browser tests change every enabled category and assert a distinct corresponding image URL. Tests also cover unavailable locks, race number validation, plate filtering, Undo/Redo, Random Build, Save/Load, Capture, Share, mobile panel ordering, wallet entry, and NFT prerequisites.

Screenshots:

- `artifacts/garage-customization/1920.png`
- `artifacts/garage-customization/1440.png`
- `artifacts/garage-customization/390.png`

## Limitations

This is not a complete Cartesian asset library. Producing every requested color in all three finishes across five wheels, six wheel finishes, four spoilers, four body kits, eight liveries, three lights, four tints, three heights, five scenes, and four views would require thousands of matched renders or professionally authored transparent masks. The missing combinations remain visibly disabled rather than simulated with whole-image filters or duplicated imagery.

The manifest includes anchor and occlusion metadata for future transparent layers. Current enabled mechanical modifications use full matched renders because the available ImageGen outputs do not provide pixel-identical alpha layers suitable for production-grade wheel/body occlusion.
