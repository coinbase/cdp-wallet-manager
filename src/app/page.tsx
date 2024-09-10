import Link from "next/link";
import { PlusCircle } from "lucide-react";

// Mock data for wallets (replace with actual data fetching logic later)
const wallets = [
  { id: 1, name: "Main Wallet", network: "Ethereum", addresses: 3 },
  { id: 2, name: "Savings Wallet", network: "Bitcoin", addresses: 2 },
  { id: 3, name: "Investment Wallet", network: "Polygon", addresses: 5 },
];

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 p-8 font-sans">
      <main className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold mb-8 text-gray-800 dark:text-gray-100">Wallet Manager</h1>
        
        <Link href="/create-wallet" className="inline-block bg-primary hover:bg-primary/90 text-white px-6 py-3 rounded-lg shadow-md transition duration-300 ease-in-out flex items-center space-x-2 mb-8">
          <PlusCircle size={20} />
          <span>Create Wallet</span>
        </Link>
        
        <h2 className="text-2xl font-semibold mb-4 text-gray-700 dark:text-gray-200">Your Wallets</h2>
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden">
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-200 text-sm uppercase">
                <th className="p-3 text-left font-semibold">Wallet ID</th>
                <th className="p-3 text-left font-semibold">Name</th>
                <th className="p-3 text-left font-semibold">Network</th>
                <th className="p-3 text-left font-semibold">Addresses</th>
              </tr>
            </thead>
            <tbody>
              {wallets.map((wallet, index) => (
                <tr key={wallet.id} className={`border-b border-gray-200 dark:border-gray-700 ${index % 2 === 0 ? 'bg-gray-50 dark:bg-gray-800' : 'bg-white dark:bg-gray-900'}`}>
                  <td className="p-3 text-gray-600 dark:text-gray-300">{wallet.id}</td>
                  <td className="p-3">
                    <Link href={`/wallet/${wallet.id}`} className="text-primary hover:text-primary/80 font-medium">
                      {wallet.name}
                    </Link>
                  </td>
                  <td className="p-3 text-gray-600 dark:text-gray-300">{wallet.network}</td>
                  <td className="p-3 text-gray-600 dark:text-gray-300">{wallet.addresses}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </main>
    </div>
  );
}
