# Solana Wallet

A web-based HD wallet built on Solana. Generate seed phrases, create multiple wallets, and view live SOL and USDC balances on mainnet.

## Live Demo
Coming soon

## Features
- Generate a random 12-word seed phrase
- Create multiple Solana wallets from one phrase
- View live SOL balance on mainnet
- View live USDC token balance on mainnet
- Show/hide private keys and recovery phrase
- Copy keys to clipboard

## Tech Stack
- Next.js 14 + TypeScript
- Tailwind CSS
- @solana/web3.js
- bip39, ed25519-hd-key, tweetnacl
- Helius RPC

## Setup
1. Clone the repo
2. Run `npm install`
3. Create `.env.local` and add:
