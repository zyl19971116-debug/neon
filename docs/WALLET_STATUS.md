# Wallet Integration Status

## COMPLETE

- Wagmi and RainbowKit providers are mounted at the application root.
- Robinhood Chain mainnet (`4663`) is the only configured and default chain.
- Public RPC and explorer URLs match Robinhood's official chain documentation.
- The header reflects actual connector/account/chain state rather than a local boolean.
- RainbowKit provides connect, reconnect, account switching and disconnect flows.
- Wrong-network state opens the real network-switch UI.
- Connected state exposes address copy, explorer navigation and provider/account details through the account modal.
- Account and chain updates are driven by Wagmi subscriptions.

## PARTIAL

- MetaMask/Rabby and other injected EVM wallets can be offered by the browser when installed.
- Coinbase Wallet is provided by RainbowKit's connector set.

## BLOCKED

- WalletConnect requires a valid `NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID`; none is configured in this environment.
- A full connection/disconnection transaction test needs an isolated browser wallet or local-chain test fixture. The current Playwright test verifies the real RainbowKit modal and connector surface without authorizing a wallet.

No private key, seed phrase or wallet signature is requested by application code.

