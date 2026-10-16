# Garage UI Review

## Direction

The Garage now follows the homepage language: cream paper, racing orange, deep petrol green, hard borders, italic racing display type, and physical automotive controls. It deliberately avoids blue-purple neon, glass SaaS cards, and dense telemetry panels.

## Layout

- Desktop uses a 240 px collection rail, flexible 3D stage, and 350 px configurator.
- The vehicle occupies the main stage with a front three-quarter default camera and is not clipped at the supported desktop/mobile viewports.
- Mobile reorders the stage first, then garage selection and configurator, keeping all controls reachable without horizontal overflow.
- The bottom toolbar uses a consistent 42 px control height. SAVE BUILD is the orange primary action.

## Interaction review

- Paint updates body material color immediately; Midnight uses a visibly matte material profile.
- Wheel selection changes the rendered cylinder segmentation and spoke count, not only a label.
- Scene selection changes lights, fog, backdrop, floor, grid and platform without remounting the Canvas.
- Camera presets update the active OrbitControls camera; drag, wheel zoom and touch gestures remain enabled.
- Plate text is drawn into a local Three.js CanvasTexture.
- Undo, redo and reset use the existing Zustand history/configuration format unchanged.
- Save and restore continue to use the validated local draft. Share requires a saved build.
- Mint never claims success; it states the wallet and deployed-contract prerequisites.
- Loading, error, retry, unsupported-WebGL, busy, success and disabled states are surfaced.

## Evidence

- Before: `artifacts/garage-before/desktop.png`, `artifacts/garage-before/mobile.png`
- After: `artifacts/garage-after/desktop.png`, `artifacts/garage-after/mobile.png`
- Playwright validates rendered Canvas pixel output via `toDataURL()`, then exercises paint, wheel, scene, plate, history, persistence, capture, recovery and mobile behavior.

## Known limitations

- The visible vehicle remains a stylized procedural fallback because no licensed vehicle GLTF was supplied.
- The fallback has intentionally simple body proportions; production fidelity depends on the missing model, wheel and texture package.
- WalletConnect reports configuration errors with the repository's placeholder project id. Wallet implementation was left untouched per scope.
