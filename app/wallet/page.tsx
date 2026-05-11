"use client";
import { useState } from "react";
import * as bip39 from "bip39";
import { derivePath } from "ed25519-hd-key";
import { Keypair, Connection, PublicKey, LAMPORTS_PER_SOL } from "@solana/web3.js";
import nacl from "tweetnacl";

const USDC_MINT = "EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v";

type Wallet = {
  publicKey: string;
  privateKey: string;
  balance: number | null;
  usdcBalance: number | null;
};

export default function WalletPage() {
  const [mnemonic, setMnemonic] = useState<string[]>([]);
  const [wallets, setWallets] = useState<Wallet[]>([]);
  const [showPrivateKey, setShowPrivateKey] = useState(false);
  const [showMnemonic, setShowMnemonic] = useState(false);
  const [copied, setCopied] = useState<string | null>(null);
  const [loading, setLoading] = useState<number | null>(null);

  async function generateWallet() {
    let phrase = mnemonic.join(" ");
    if (!phrase) {
      phrase = bip39.generateMnemonic();
      setMnemonic(phrase.split(" "));
    }
    const seed = await bip39.mnemonicToSeed(phrase);
    const index = wallets.length;
    const { key: derivedSeed } = derivePath(`m/44'/501'/${index}'/0'`, seed.toString("hex"));
    const { secretKey } = nacl.sign.keyPair.fromSeed(derivedSeed);
    const keypair = Keypair.fromSecretKey(secretKey);
    setWallets([...wallets, {
      publicKey: keypair.publicKey.toBase58(),
      privateKey: Buffer.from(keypair.secretKey).toString("hex"),
      balance: null,
      usdcBalance: null,
    }]);
  }

  async function fetchBalances(publicKey: string, index: number) {
    setLoading(index);
    try {
      const connection = new Connection(
        `https://mainnet.helius-rpc.com/?api-key=${process.env.NEXT_PUBLIC_HELIUS_API_KEY}`
      );
      const solBalance = await connection.getBalance(new PublicKey(publicKey));
      let usdcBalance = 0;
      const tokenAccounts = await connection.getParsedTokenAccountsByOwner(
        new PublicKey(publicKey),
        { mint: new PublicKey(USDC_MINT) }
      );
      if (tokenAccounts.value.length > 0) {
        usdcBalance = tokenAccounts.value[0].account.data.parsed.info.tokenAmount.uiAmount;
      }
      const updated = [...wallets];
      updated[index].balance = solBalance / LAMPORTS_PER_SOL;
      updated[index].usdcBalance = usdcBalance;
      setWallets(updated);
    } finally {
      setLoading(null);
    }
  }

  function copy(text: string, label: string) {
    navigator.clipboard.writeText(text);
    setCopied(label);
    setTimeout(() => setCopied(null), 2000);
  }

  return (
    <div className="min-h-screen bg-gray-950 text-white font-mono">

      {/* subtle grid */}
      <div className="fixed inset-0 bg-[linear-gradient(rgba(0,255,128,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(0,255,128,0.02)_1px,transparent_1px)] bg-[size:40px_40px] pointer-events-none" />

      <div className="relative max-w-2xl mx-auto px-6 py-12">

        {/* header */}
        <div className="mb-10 text-center">
          <p className="text-green-500 text-xs tracking-[0.4em] mb-2">SOLANA NETWORK</p>
          <h1 className="text-4xl font-bold">
            <span className="text-green-400">&gt; </span>
            <span className="text-white">Beast</span>
            <span className="text-purple-400">_WALLET</span>
          </h1>
          <p className="text-gray-600 text-xs mt-2 tracking-widest">HD WALLET GENERATOR v1.0</p>
        </div>

        {/* generate button */}
        <button
          onClick={generateWallet}
          className="w-full mb-8 py-4 border-2 border-green-500 text-green-400 hover:bg-green-500 hover:text-black transition-all duration-200 text-sm tracking-widest font-bold"
        >
          ▶ &nbsp; {wallets.length === 0 ? "INITIALIZE WALLET" : "ADD ANOTHER WALLET"}
        </button>

        {/* mnemonic */}
        {mnemonic.length > 0 && (
          <div className="mb-6 border border-purple-500 bg-gray-900 p-5">
            <div className="flex justify-between items-center mb-4">
              <span className="text-purple-400 text-sm font-bold tracking-widest">▸ RECOVERY PHRASE</span>
              <div className="flex gap-2">
                <button
                  onClick={() => setShowMnemonic(!showMnemonic)}
                  className="text-xs border border-purple-500 text-purple-300 hover:bg-purple-500 hover:text-black px-3 py-1 transition"
                >
                  {showMnemonic ? "HIDE" : "SHOW"}
                </button>
                <button
                  onClick={() => copy(mnemonic.join(" "), "mnemonic")}
                  className="text-xs border border-purple-500 text-purple-300 hover:bg-purple-500 hover:text-black px-3 py-1 transition"
                >
                  {copied === "mnemonic" ? "✓ COPIED" : "COPY"}
                </button>
              </div>
            </div>
            {showMnemonic ? (
              <div className="grid grid-cols-4 gap-2">
                {mnemonic.map((word, i) => (
                  <div key={i} className="border border-purple-800 bg-black px-2 py-2 text-center">
                    <p className="text-purple-600 text-[10px] mb-1">{String(i + 1).padStart(2, "0")}</p>
                    <p className="text-purple-200 text-xs">{word}</p>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-purple-700 tracking-widest text-lg">••••••••••••••••••••••••••••••</p>
            )}
          </div>
        )}

        {/* wallets */}
        {wallets.map((w, i) => (
          <div key={i} className="mb-4 border border-green-800 bg-gray-900">

            {/* wallet header bar */}
            <div className="bg-green-950 border-b border-green-800 px-5 py-3 flex justify-between items-center">
              <span className="text-green-400 text-sm font-bold tracking-widest">
                ▸ WALLET_{String(i + 1).padStart(2, "0")}
              </span>
              <span className="text-green-700 text-xs">SOLANA MAINNET</span>
            </div>

            <div className="p-5 space-y-5">

              {/* public key */}
              <div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-gray-400 text-xs tracking-widest">PUBLIC ADDRESS</span>
                  <button
                    onClick={() => copy(w.publicKey, `pub-${i}`)}
                    className="text-xs border border-green-700 text-green-400 hover:bg-green-700 hover:text-black px-2 py-1 transition"
                  >
                    {copied === `pub-${i}` ? "✓ COPIED" : "COPY"}
                  </button>
                </div>
                <p className="text-green-300 text-xs break-all bg-black px-3 py-2 border border-green-900">
                  {w.publicKey}
                </p>
              </div>

              {/* balances */}
              <div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-gray-400 text-xs tracking-widest">BALANCES</span>
                  <button
                    onClick={() => fetchBalances(w.publicKey, i)}
                    disabled={loading === i}
                    className="text-xs border border-green-700 text-green-400 hover:bg-green-700 hover:text-black px-2 py-1 transition disabled:opacity-40"
                  >
                    {loading === i ? "LOADING..." : "↻ REFRESH"}
                  </button>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div className="bg-black border border-yellow-800 px-4 py-3">
                    <p className="text-gray-500 text-xs mb-1">SOL</p>
                    <p className="text-yellow-400 text-xl font-bold">
                      {w.balance === null ? "—" : w.balance}
                    </p>
                  </div>
                  <div className="bg-black border border-blue-800 px-4 py-3">
                    <p className="text-gray-500 text-xs mb-1">USDC</p>
                    <p className="text-blue-400 text-xl font-bold">
                      {w.usdcBalance === null ? "—" : w.usdcBalance}
                    </p>
                  </div>
                </div>
              </div>

              {/* private key */}
              <div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-gray-400 text-xs tracking-widest">PRIVATE KEY</span>
                  <button
                    onClick={() => copy(w.privateKey, `priv-${i}`)}
                    className="text-xs border border-red-800 text-red-400 hover:bg-red-800 hover:text-white px-2 py-1 transition"
                  >
                    {copied === `priv-${i}` ? "✓ COPIED" : "COPY"}
                  </button>
                </div>
                <p className="text-xs break-all bg-black px-3 py-2 border border-red-900 text-red-400">
                  {showPrivateKey ? w.privateKey : "••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••"}
                </p>
              </div>

            </div>
          </div>
        ))}

        {/* toggle private keys */}
        {wallets.length > 0 && (
          <button
            onClick={() => setShowPrivateKey(!showPrivateKey)}
            className="w-full py-3 border border-red-800 text-red-400 hover:bg-red-900 hover:text-white text-xs tracking-widest transition mt-2"
          >
            {showPrivateKey ? "⚠ HIDE PRIVATE KEYS" : "⚠ REVEAL PRIVATE KEYS"}
          </button>
        )}

        <p className="text-center text-gray-800 text-xs tracking-widest mt-12">
          YOUR KEYS • YOUR CRYPTO • BUILT ON SOLANA
        </p>

      </div>
    </div>
  );
}