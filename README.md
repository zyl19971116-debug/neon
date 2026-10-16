# Neon Garage

An original Web3 automotive customization and collectibles experience for Robinhood Chain Testnet.

## Run

```bash
npm install
cp .env.example .env.local
npm run dev
```

No contract deployment or live transaction is performed by default. Example market cards are explicitly off-chain development data.

## Network

- Robinhood Chain Testnet: chain ID `46630`
- RPC: `https://rpc.testnet.chain.robinhood.com`
- Gas token: ETH

## Contracts

Solidity sources live in `contracts/src`. Install Foundry and OpenZeppelin contracts inside `contracts/lib` before compiling or testing them.
