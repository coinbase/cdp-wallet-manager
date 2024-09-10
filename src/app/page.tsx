import Link from "next/link";

// Mock data for wallets (replace with actual data fetching logic later)
const wallets = [
  { id: 1, name: "Main Wallet" },
  { id: 2, name: "Savings Wallet" },
  { id: 3, name: "Investment Wallet" },
];

export default function Home() {
  return (
    <div className="min-h-screen p-8 font-[family-name:var(--font-geist-sans)]">
      <main className="max-w-3xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Wallet Manager</h1>
        
        <button className="bg-blue-500 text-white px-4 py-2 rounded mb-8">
          Create Wallet
        </button>
        
        <h2 className="text-2xl font-semibold mb-4">Your Wallets</h2>
        <ul className="space-y-4">
          {wallets.map((wallet) => (
            <li key={wallet.id} className="border p-4 rounded">
              <Link href={`/wallet/${wallet.id}`} className="hover:underline">
                {wallet.name}
              </Link>
            </li>
          ))}
        </ul>
      </main>
    </div>
  );
}
