# NEON GARAGE Phase 2 — Baseline Audit

Date: 2026-10-16 (Asia/Shanghai)  
Branch: `phase-2-production-upgrade`  
Baseline commit: `d643303`

## Baseline verification

| Check | Status | Evidence |
| --- | --- | --- |
| `npm run typecheck` | COMPLETE | Exit 0 |
| `npm run lint` | COMPLETE | Exit 0, no warnings or errors |
| `npm run build` | COMPLETE | Exit 0, 13 application routes generated |
| `npm run test` | COMPLETE | Exit 0, 2/2 Vitest tests passed |
| Desktop screenshot | COMPLETE | `artifacts/baseline/home-desktop-1440x900.png` |
| Mobile screenshot | COMPLETE | `artifacts/baseline/home-mobile-390x844.png` |
| Foundry tests | BLOCKED | `forge` is not installed |
| Database connection | BLOCKED | `DATABASE_URL` is not configured; Prisma packages are not installed |
| Wallet integration test | BLOCKED | RainbowKit and WalletConnect project ID are absent |

The first screenshot attempt found a stale development process that returned HTML without its generated CSS assets. A fresh isolated dev server on port 3100 was started, and both baseline captures were regenerated successfully.

## Implemented and working

- Next.js App Router application with all 13 requested route patterns.
- Shared responsive navigation, home hero, feature cards, filterable build gallery, creator banner, studio shells and empty states.
- React Three Fiber procedural vehicle with orbit/zoom controls, paint color, wheel color, stripe, decal and environment controls.
- Browser-local garage draft save.
- Zustand garage state.
- Prisma schema covering users, sessions, builds, versions, parts, decals, NFTs, listings, sales and social records.
- Initial ERC-721, ERC-1155 and non-custodial marketplace contracts.
- Original project-owned hero image plus preserved design reference.

## UI prototypes only

- The navigation wallet control toggles component state; it is not a real wallet connection and must be replaced before production use.
- Mint, share and capture actions show explanatory text but do not implement their named production workflows.
- Creator Studio does not yet upload, sanitize or persist files.
- Showroom, Community and Settings are presentation shells with empty states.
- Market cards use hard-coded development examples. They are not chain-indexed listings. Detail pages label them `EXAMPLE BUILD · OFF-CHAIN`, but the home cards need stronger `DEMO` labeling.
- Screenshot export is not implemented from the active WebGL canvas.

## Missing external configuration

- `DATABASE_URL`
- `NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID`
- Deployed testnet contract addresses
- Persistent object storage / IPFS-compatible upload service
- Robinhood Chain testnet deployment wallet and test ETH

No credentials were read, printed or modified.

## Required fixes

1. Replace fake wallet UI state with Wagmi/RainbowKit provider state and explicit error handling.
2. Add SIWE nonce, signature verification and secure server session handling.
3. Install Prisma client/CLI, validate the schema and add authenticated API routes.
4. Define a versioned `CarModelDefinition` and configuration schema; add undo/redo, camera presets, restore and real canvas capture.
5. Add a licensed GLTF/GLB model only when its license is documented; retain the procedural model as fallback.
6. Add Foundry configuration, mocks, unit tests, fuzz tests and invariant tests before making security claims.
7. Separate demo/off-chain cards from verified listings throughout the UI.
8. Add Playwright E2E coverage for every route and interaction.

## Security findings

| Severity | Finding | Status |
| --- | --- | --- |
| Critical | `npm audit` reports vulnerable legacy Next.js and Vitest dependency lines | OPEN |
| High | No authenticated server API or ownership checks exist yet | NOT IMPLEMENTED |
| High | No SIWE nonce/session layer; current wallet UI must not be treated as identity | NOT IMPLEMENTED |
| High | Contracts have not been compiled or tested with Foundry | BLOCKED |
| Medium | Marketplace contract does not invalidate listings automatically after transfer; buy rejects stale ownership at execution time | REVIEW REQUIRED |
| Medium | Creator upload surface lacks MIME, dimension and SVG sanitization enforcement | NOT IMPLEMENTED |
| Medium | No CSRF, rate limiting, moderation or request validation layer exists | NOT IMPLEMENTED |

`npm audit` baseline: 41 findings — 27 moderate, 11 high and 3 critical. Automatic `--force` remediation was not run because it requires major-version upgrades and could break the working baseline.

## Phase status

- Phase 0: COMPLETE
- Phase 1+: NOT STARTED in this commit

