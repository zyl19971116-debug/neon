# Garage Performance Report

Date: 2026-10-16  
Route: `/garage`  
Browser: headless Chromium, 1440 × 900  
Hardware profile: local development machine (no CPU/network throttling)

## Verified bottlenecks

1. The previous scene mounted Drei `Environment preset` inside the Canvas. That preset resolves a remote HDR environment at runtime. A failed or slow third-party request could keep scene work suspended without a terminal error UI.
2. The previous Drei `Text` plate introduced another runtime font/resource dependency inside the 3D scene.
3. Loading had no timeout, error boundary, WebGL capability fallback, context-loss handler, or retry path. A failed scene therefore looked like infinite loading.
4. CAPTURE queried `#garage-canvas canvas`, while the id was assigned to the canvas itself. The selector could never match.
5. Wheel geometry and the whole environment were authored as one minimal scene without a low-power path. There was no way to disable antialiasing/shadows or cap DPR at 1.

No infinite Zustand update was found. Camera changes are handled by an effect whose dependencies are stable, and the Canvas is now mounted once while scene properties update in place.

## Measurements

| Metric | Before | After | Notes |
| --- | ---: | ---: | --- |
| First visible preview | NOT MEASURED | ≤ 1,886 ms | The after run reached fully rendered, interactive 3D at 1,886 ms; preview appears before that but was not separately instrumented. |
| 3D interactive | > 30,000 ms / timeout | 1,886 ms | Before sampling exceeded the 30 s harness limit. Dev server logged one `/garage` response at 53,592 ms during the cold/stalled run. After value is a warm dev-server run. |
| DOMContentLoaded | NOT MEASURED | 148 ms | Local warm dev-server run. |
| Rendered Canvas PNG | NOT MEASURED | 233,542 chars | `canvas.toDataURL()` check verifies actual pixels, not only DOM presence. |
| GLTF model bytes | 0 B | 0 B | No licensed GLTF is present. The local procedural fallback is used. |
| Local HDR/environment bytes | 0 B | 0 B | The new environments use local colors, lights and geometry. |
| Largest local asset | 2,572,371 B | 2,572,371 B | Homepage hero image; it is not loaded by the Garage route. |

These are development measurements, not production Lighthouse numbers. A strict before/after production comparison is **NOT MEASURED** because the original page could not complete the bounded baseline run and no production telemetry existed.

## Errors observed

- Before: bounded browser sampler did not complete within 30 seconds; dev compilation also emitted the existing MetaMask optional-module warning for `@react-native-async-storage/async-storage`.
- After: Garage rendering had no failed local model, HDR, texture, or font request. WalletConnect/RainbowKit attempted its existing project configuration endpoints and returned HTTP 400/403 because the repository uses the placeholder `walletconnect-project-id-required`. Wallet authentication code was intentionally not changed.

## Changes made

- Removed runtime HDR preset and Drei font loading from the scene.
- Added a local CanvasTexture license plate and disposed it on replacement/unmount.
- Kept one stable Canvas across camera, paint, wheel and scene updates.
- Added demand rendering, DPR `[1, 1.5]`, and a DPR 1 low-performance mode that disables antialiasing and contact shadows.
- Added WebGL support detection, a 10-second terminal timeout, an error boundary, context-loss reporting, static vehicle fallback, and Retry.
- Added scene-local lighting, ground, platform, grid, backdrop, fog and four palettes without remote assets.
- Added real wheel geometry variants (5-spoke classic, 10-spoke mesh, 3-spoke aero).
- Fixed screenshot capture to target `canvas#garage-canvas` and retain the drawing buffer.

## Remaining resource gaps

- Licensed production GLTF/GLB vehicle model: missing.
- Authored wheel GLTF meshes: missing; procedural wheel geometry is active.
- Optimized local HDR/KTX2 environment maps: missing; local light rigs are active.
- Authored livery/number decal texture atlas: missing; current roundel/stripe geometry is procedural.
- Draco/KTX2 transcoder pipeline: not applicable until production assets are supplied.

## Verification result

- `npm run typecheck`: passed
- `npm run lint`: passed, 0 warnings/errors
- `npm run test`: passed, 2 files / 5 tests
- `npm run build`: passed; existing wallet dependency warnings remain
- `npm run test:e2e`: passed, 30 passed / 4 intentional project skips

The E2E runner is capped at two workers and a 60-second per-test timeout. Six concurrent cold Next.js compilations previously caused aborted navigations; the bounded concurrency makes the full route matrix deterministic without weakening assertions.

