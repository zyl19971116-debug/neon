# NEON GARAGE 2D Rebuild Report

## Result

The active `/garage` route is now a responsive 2D image configurator. It does not import React Three Fiber, create a Canvas/WebGL context, request GLB/GLTF resources, or run Blender-generated geometry. The previous `components/GarageCanvas.tsx` implementation and model-generation files remain in the repository as an archive.

## Main changes

- Rebuilt `app/garage/page.tsx` around Next/Image and a deterministic image resolver.
- Rebuilt the Garage stylesheet for a three-column premium retro motorsport layout and a stacked mobile layout.
- Migrated the Zustand configuration to asset version `garage-2d-v1`:
  - `modelId`
  - `paintColor`
  - `wheelId`
  - `liveryId`
  - `decalId`
  - `plateText`
  - `sceneId`
  - `viewId`
- Kept undo, redo, reset, local draft save/restore, capture, share, and truthful mint prerequisites.
- Added migration for compatible version 1 local drafts.
- Capture draws the current loaded image and current plate overlay to a new PNG.
- Preloads the complete verified render set on mount to avoid blank transitions.

## Image provenance

All vehicle and scene photographs were created specifically for this project using the built-in OpenAI ImageGen workflow. They depict an original fictional NG CLASSIC 77 and do not use third-party stock photography. Final web assets are WebP files.

## Asset inventory

| Folder | Assets |
| --- | --- |
| `cars/` | 4 sunset views; silver studio; orange studio; mesh wheel studio; aero wheel studio; clean-livery studio |
| `backgrounds/` | Night Street and Race Paddock complete matched renders |
| `wheels/` | Classic, Mesh, and Aero preview images |
| `decals/` | Stripe + 77 and clean-body previews |
| `previews/` | NG Classic 77 garage thumbnail |

Total optimized asset size: **2,427,448 bytes (2.32 MiB)** across 17 WebP files.

## Truly supported combinations

Every enabled choice replaces the central car image.

| Feature | Supported renders |
| --- | --- |
| Views | Front, Side, Rear, Three Quarter in Sunset Garage |
| Scenes | Sunset Garage, Photo Studio, Night Street, Race Paddock in silver/classic/striped Three Quarter |
| Paint | Silver Alloy and Racing Orange in Photo Studio, classic wheels, Three Quarter |
| Wheels | Classic, Mesh, and Aero in silver Photo Studio, striped Three Quarter |
| Livery | Orange stripe + 77 and Clean Body in silver Photo Studio, classic wheels, Three Quarter |
| Plate | Live CSS overlay and actual Canvas 2D export |

Selecting a view, scene, paint, wheel, or livery loads its canonical verified configuration. The UI explicitly explains when other options are reset. This prevents unsupported combinations from appearing selected without a matching image.

## Missing image combinations

- Full Cartesian combinations of every paint × wheel × livery × scene × view.
- Petrol Teal and Midnight Black paint photography.
- Editable race-number photographic variants.
- Free wheel-color variants.
- Additional vehicle model packs.

These options are disabled or listed as requiring an image asset. Free rotation is intentionally not offered.

## Performance and browser verification

- Canvas elements on Garage: **0**
- WebGL contexts created by Garage: **0**
- GLB/GLTF requests from Garage: **0**
- Default image uses Next/Image priority loading.
- Other assets use browser/Next image caching and explicit warm preloading.
- No horizontal overflow at 1920, 1440, or 390 px.
- Default photographic render decoded successfully in real Chromium.

## Tests

| Check | Result |
| --- | --- |
| TypeScript | Passed |
| ESLint | Passed with no warnings |
| Vitest | Passed: 2 files, 6 tests |
| Production build | Passed |
| Garage desktop Playwright | Passed |
| Garage mobile Playwright | Passed |
| Wallet entry regression | Passed |

Playwright verifies real image decoding, absence of Canvas, image source changes for paint/wheels/livery/view/scene, history, reset, save/restore, current-image capture, mobile overflow, wallet entry, and honest NFT prerequisites.

## Screenshots

- `artifacts/garage-2d/1920.png`
- `artifacts/garage-2d/1440.png`
- `artifacts/garage-2d/390.png`

## Limitations

- ImageGen preserves the intended vehicle identity closely, but small details can vary between independently rendered camera angles.
- Plate text is a correctly aligned live 2D overlay and capture layer; it is not photometrically relit into every base photograph.
- Share exports a configuration URL. A backend-persisted public build ID was not added because database changes were explicitly out of scope.
- Mint does not claim success: it requires both a connected wallet and `NEXT_PUBLIC_NFT_CONTRACT_ADDRESS`.
