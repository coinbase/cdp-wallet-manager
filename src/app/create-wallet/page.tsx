'use client'

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

export default function CreateWallet() {
  const [network, setNetwork] = useState('');
  const router = useRouter();
  const networkOptions = ['Base Sepolia', 'Base Mainnet', 'Ethereum', 'Polygon'];

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    // In a real app, you'd make an API call here to create the wallet
    // For now, we'll just simulate creating a new wallet with a random ID
    const newWalletId = Math.floor(Math.random() * 1000) + 1;
    router.push(`/wallet/${newWalletId}`);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 p-8 font-sans">
      <main className="max-w-md mx-auto">
        <Link href="/" className="inline-flex items-center text-primary hover:text-primary/80 mb-8 transition duration-300 ease-in-out">
          <ArrowLeft size={20} className="mr-2" />
          <span>Back to Wallets</span>
        </Link>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
          <h1 className="text-3xl font-bold mb-6 text-gray-800 dark:text-gray-100">Create New Wallet</h1>
          <form onSubmit={handleCreate}>
            <div className="mb-4">
              <label htmlFor="network" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Network
              </label>
              <select
                id="network"
                value={network}
                onChange={(e) => setNetwork(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary"
                required
              >
                <option value="">Select a network</option>
                {networkOptions.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
            </div>
            <button
              type="submit"
              className="w-full bg-primary hover:bg-primary/90 text-white font-bold py-2 px-4 rounded-lg shadow-md transition duration-300 ease-in-out"
            >
              Create Wallet
            </button>
          </form>
        </div>
      </main>
    </div>
  );
}
