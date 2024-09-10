'use client'

import { useEffect, useState } from 'react';
import Link from "next/link";
import { ArrowLeft, CreditCard } from "lucide-react";

export type Address = {
  id: string;
  walletId: number;
  network: string;
  balances: Record<string, number>;
  transactions: number;
};

// Mock data for address details (replace with actual data fetching logic later)
const addresses: Record<string, Address> = {
  "0x1234...5678": {
    id: "0x1234...5678",
    walletId: 1,
    network: "Ethereum",
    balances: { ETH: 1.5, USDT: 500 },
    transactions: 25
  },
  "bc1qxy...zw3f0": {
    id: "bc1qxy...zw3f0",
    walletId: 2,
    network: "Bitcoin",
    balances: { BTC: 0.05 },
    transactions: 10
  },
  "0x2468...1357": {
    id: "0x2468...1357",
    walletId: 3,
    network: "Polygon",
    balances: { MATIC: 100, USDC: 200 },
    transactions: 50
  },
};

export default function AddressPage({ params }: { params: { addressId: string } }) {
  const [address, setAddress] = useState<Address | null>(null);

  useEffect(() => {
    // In a real app, you'd fetch the address data from an API here
    const fetchedAddress = addresses[params.addressId] || {
      id: params.addressId,
      walletId: 0,
      network: "Unknown",
      balances: {},
      transactions: 0
    };
    setAddress(fetchedAddress);
  }, [params.addressId]);

  if (!address) {
    return <div>Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 p-8 font-sans">
      <main className="max-w-4xl mx-auto">
        <Link href={`/wallet/${address.walletId}`} className="inline-flex items-center text-primary hover:text-primary/80 mb-8 transition duration-300 ease-in-out">
          <ArrowLeft size={20} className="mr-2" />
          <span>Back to Wallet</span>
        </Link>
        
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 mb-8">
          <h1 className="text-3xl font-bold mb-2 text-gray-800 dark:text-gray-100 flex items-center">
            <CreditCard size={32} className="mr-3 text-primary" />
            Address Details
          </h1>
          <p className="text-gray-600 dark:text-gray-300 mb-4 break-all">Address ID: {address.id}</p>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <span className="font-semibold text-gray-700 dark:text-gray-200">Network:</span>
              <span className="ml-2 text-gray-600 dark:text-gray-300">{address.network}</span>
            </div>
            <div>
              <span className="font-semibold text-gray-700 dark:text-gray-200">Wallet ID:</span>
              <span className="ml-2 text-gray-600 dark:text-gray-300">{address.walletId}</span>
            </div>
          </div>
        </div>
        
        <h2 className="text-2xl font-semibold mb-4 text-gray-700 dark:text-gray-200">Balances</h2>
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden">
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-200 text-sm uppercase">
                <th className="p-3 text-left font-semibold">Currency</th>
                <th className="p-3 text-left font-semibold">Amount</th>
              </tr>
            </thead>
            <tbody>
              {Object.entries(address.balances).map(([currency, amount], index) => (
                <tr key={currency} className={`border-b border-gray-300 dark:border-gray-600 ${index % 2 === 0 ? 'bg-gray-50 dark:bg-gray-800' : 'bg-white dark:bg-gray-900'}`}>
                  <td className="p-3 font-medium text-gray-700 dark:text-gray-300">{currency}</td>
                  <td className="p-3 text-gray-600 dark:text-gray-300">{amount.toString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </main>
    </div>
  );
}
