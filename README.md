# Solana Wallet

A web-based HD wallet built on Solana.

## Features
- Generate a 12-word seed phrase
- Create multiple Solana wallets from one phrase
- View live SOL and USDC balances on mainnet
- Show/hide private keys
- Copy keys to clipboard

## Tech Stack
- Next.js + TypeScript
- Tailwind CSS
- @solana/web3.js
- bip39, ed25519-hd-key, tweetnacl

## Setup
1. Clone the repo
2. Run `npm install`
3. Create `.env.local` and add:
   `NEXT_PUBLIC_HELIUS_API_KEY=your_key_here`
4. Run `npm run dev`

## Built by
Bhasker371
