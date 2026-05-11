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
   `NEXT_PUBLIC_HELIUS_API_KEY=your_key_here`
4. Run `npm run dev`
5. Open `http://localhost:3000/wallet`

## How It Works
1. A 12-word mnemonic is generated using BIP39
2. The mnemonic is converted to a seed
3. Each wallet is derived using the path `m/44'/501'/index'/0'`
4. Solana keypairs are created using TweetNaCl
5. Balances are fetched live from Solana mainnet via Helius RPC

## License
MIT License — feel free to use and modify with credit.

## Author
Built by [Bhasker371](https://github.com/Bhasker371)
