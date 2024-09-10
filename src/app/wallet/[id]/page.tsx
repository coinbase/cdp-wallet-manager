import Link from "next/link";

// Mock data for wallet balances (replace with actual data fetching logic later)
const walletBalances = {
  1: { BTC: 0.5, ETH: 2.3, USDT: 1000 },
  2: { BTC: 0.1, ETH: 1.5, USDT: 500 },
  3: { BTC: 1.2, ETH: 5.0, USDT: 2000 },
};

export default function WalletPage({ params }: { params: { id: string } }) {
  const walletId = parseInt(params.id);
  const balances = walletBalances[walletId as keyof typeof walletBalances];

  return (
    <div className="min-h-screen p-8 font-[family-name:var(--font-geist-sans)]">
      <main className="max-w-3xl mx-auto">
        <Link href="/" className="text-blue-500 hover:underline mb-8 inline-block">
          &larr; Back to Wallets
        </Link>
        
        <h1 className="text-3xl font-bold mb-8">Wallet {walletId}</h1>
        
        <h2 className="text-2xl font-semibold mb-4">Balances</h2>
        <ul className="space-y-4">
          {Object.entries(balances).map(([currency, amount]) => (
            <li key={currency} className="border p-4 rounded">
              <span className="font-semibold">{currency}:</span> {amount}
            </li>
          ))}
        </ul>
      </main>
    </div>
  );
}