'use client'

import { useEffect, useState } from 'react';
import Link from "next/link";
import { ArrowLeft, Wallet, ChevronLeft, ChevronRight } from "lucide-react";

export type Wallet = {
  id: string;
  name: string;
  network: string;
  addresses: string[];
  balances: Record<string, number>;
  defaultAddress: string | null;
};

const BALANCES_PER_PAGE_OPTIONS = [5, 10, 20, 50];

export default function WalletPage({ params }: { params: { walletId: string } }) {
  const [wallet, setWallet] = useState<Wallet | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [balancesPerPage, setBalancesPerPage] = useState(BALANCES_PER_PAGE_OPTIONS[0]);

  const [destinationAddress, setDestinationAddress] = useState('');
  const [amount, setAmount] = useState('');
  const [asset, setAsset] = useState('');
  const [transferLoading, setTransferLoading] = useState(false);
  const [transferError, setTransferError] = useState('');
  const [transferSuccess, setTransferSuccess] = useState('');


  useEffect(() => {
    async function fetchWallet() {
      try {
        const response = await fetch(`/api/wallets/${params.walletId}`);
        if (!response.ok) {
          throw new Error('Failed to fetch wallet');
        }
        const data = await response.json();
        setWallet(data);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching wallet:', err);
        setError('Failed to load wallet. Please try again later.');
        setLoading(false);
      }
    }

    fetchWallet();
  }, [params.walletId]);

  if (loading) {
    return (
      <div className="fixed inset-0 bg-gray-100/75 dark:bg-gray-900/75 flex justify-center items-center z-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-24 w-24 border-t-4 border-b-4 border-blue-600 dark:border-blue-400 mx-auto"></div>
          <p className="mt-4 text-xl font-semibold text-gray-800 dark:text-gray-200">Loading wallet...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  if (!wallet) {
    return <div>Wallet not found</div>;
  }

  const totalBalancePages = Math.ceil(Object.keys(wallet.balances).length / balancesPerPage);

  const goToPage = (page: number) => {
    setCurrentPage(page);
  };

  const handleBalancesPerPageChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const newBalancesPerPage = parseInt(event.target.value, 10);
    setBalancesPerPage(newBalancesPerPage);
    setCurrentPage(1);
  };


  const handleCreateTransfer = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log('Transfer form submitted');
    setTransferLoading(true);
    setTransferError('');
    setTransferSuccess('');

    try {
      console.log('Creating transfer:', { destinationAddress, amount, asset }); 
      const response = await fetch('/api/wallets', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          destination_address: destinationAddress,
          amount,
          asset: asset,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to create transfer');
      }

      const data = await response.json();
      console.log('Transfer created:', data);
      setTransferSuccess('Transfer request created successfully!');
      
      // Reset form
      setDestinationAddress('');
      setAmount('');
      setAsset('');
    } catch (err) {
      console.error('Error creating transfer:', err); // Debugging log
      setTransferError(err.message);
    } finally {
      setTransferLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 p-8 font-sans">
      <main className="max-w-4xl mx-auto">
        <Link href="/" className="inline-flex items-center text-primary hover:text-primary/80 mb-8 transition duration-300 ease-in-out">
          <ArrowLeft size={20} className="mr-2" />
          <span>Back to Wallets</span>
        </Link>
        
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 mb-8">
          <h1 className="text-3xl font-bold mb-6 text-gray-800 dark:text-gray-100 flex items-center">
            <Wallet size={32} className="mr-3 text-primary" />
            Wallet {params.walletId}
          </h1>
          <div className="flex flex-col sm:flex-row gap-4 text-sm">
            <div className="flex-1">
              <span className="font-semibold text-gray-700 dark:text-gray-200">Network:</span>
              <span className="ml-2 text-gray-600 dark:text-gray-300">{wallet.network}</span>
            </div>
            <div className="flex-1">
              <div className="font-semibold text-gray-700 dark:text-gray-200">Default Address:</div>
              <div className="text-gray-600 dark:text-gray-300 break-all mt-1">
                {wallet.addresses.length > 0 && wallet.defaultAddress ? wallet.defaultAddress : 'N/A'}
              </div>
            </div>
          </div>
        </div>
        
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-semibold text-gray-700 dark:text-gray-200">Balances</h2>
          <div className="flex items-center space-x-2">
            <label htmlFor="balancesPerPage" className="text-gray-700 dark:text-gray-300">Items per page:</label>
            <select
              id="balancesPerPage"
              value={balancesPerPage}
              onChange={handleBalancesPerPageChange}
              className="bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-md px-2 py-1"
            >
              {BALANCES_PER_PAGE_OPTIONS.map(option => (
                <option key={option} value={option}>{option}</option>
              ))}
            </select>
          </div>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden mb-6">
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-200 text-sm uppercase">
                <th className="p-3 text-left font-semibold">Currency</th>
                <th className="p-3 text-left font-semibold">Amount</th>
              </tr>
            </thead>
            <tbody>
              {Object.entries(wallet.balances).map(([currency, amount], index) => (
                <tr key={currency} className={`border-b border-gray-300 dark:border-gray-600 ${index % 2 === 0 ? 'bg-gray-50 dark:bg-gray-800' : 'bg-white dark:bg-gray-900'}`}>
                  <td className="p-3 font-medium text-gray-700 dark:text-gray-300">{currency}</td>
                  <td className="p-3 text-gray-600 dark:text-gray-300">{amount}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Balances Pagination */}
        <div className="flex justify-center items-center space-x-2 mb-8">
          <button
            onClick={() => goToPage(currentPage - 1)}
            disabled={currentPage === 1}
            className="p-2 rounded-md bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-300 disabled:opacity-50"
          >
            <ChevronLeft size={20} />
          </button>
          {Array.from({ length: totalBalancePages }, (_, i) => i + 1).map((page) => (
            <button
              key={page}
              onClick={() => goToPage(page)}
              className={`px-3 py-1 rounded-md ${
                currentPage === page
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-300'
              }`}
            >
              {page}
            </button>
          ))}
          <button
            onClick={() => goToPage(currentPage + 1)}
            disabled={currentPage === totalBalancePages}
            className="p-2 rounded-md bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-300 disabled:opacity-50"
          >
            <ChevronRight size={20} />
          </button>
        </div>
        
        <h2 className="text-2xl font-semibold mb-4 mt-8 text-gray-700 dark:text-gray-200">Addresses</h2>
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden">
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-200 text-sm uppercase">
                <th className="p-3 text-left font-semibold">Index</th>
                <th className="p-3 text-left font-semibold">Address</th>
              </tr>
            </thead>
            <tbody>
              {wallet.addresses.map((address, index) => (
                <tr key={index} className={`border-b border-gray-300 dark:border-gray-600 ${index % 2 === 0 ? 'bg-gray-50 dark:bg-gray-800' : 'bg-white dark:bg-gray-900'}`}>
                  <td className="p-3 font-medium text-gray-700 dark:text-gray-300">{index}</td>
                  <td className="p-3 text-gray-600 dark:text-gray-300 break-all">
                    <Link 
                      href={`/wallets/${wallet.id}/addresses/${address}`}
                      className="text-primary hover:text-primary/80 hover:underline transition duration-300 ease-in-out"
                    >
                      {address}
                    </Link>
                    {address === wallet.defaultAddress && " (default)"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {/* Create Transfer */}
        <div className="bg-white shadow-md rounded-lg p-6">
          <h2 className="text-2xl font-semibold text-gray-800 mb-6">Create Transfer</h2>
          <form onSubmit={handleCreateTransfer} className="space-y-4">
            <div>
              <label htmlFor="destinationAddress" className="block text-sm font-medium text-gray-700 mb-1">
                Destination Address
              </label>
              <input
                type="text"
                id="destinationAddress"
                value={destinationAddress}
                onChange={(e) => setDestinationAddress(e.target.value)}
                required
                className="block w-full rounded-md border-gray-300 pl-3 pr-10 py-2 text-base focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm text-gray-900"
                placeholder="0x..."
              />
            </div>
            <div>
              <label htmlFor="amount" className="block text-sm font-medium text-gray-700 mb-1">
                Amount
              </label>
              <input
                type="number"
                id="amount"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                required
                min="0"
                step="any"
                className="block w-full rounded-md border-gray-300 pl-3 pr-10 py-2 text-base focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm text-gray-900"
                placeholder="0.00"
              />
            </div>
            <div>
              <label htmlFor="asset" className="block text-sm font-medium text-gray-700 mb-1">
                Asset
              </label>
              <input
                type="text"
                id="asset"
                value={asset}
                onChange={(e) => setAsset(e.target.value)}
                required
                className="block w-full rounded-md border-gray-300 pl-3 pr-10 py-2 text-base focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm text-gray-900"
                placeholder="ETH, USDC, etc."
              />
            </div>
            <button
              type="submit"
              disabled={transferLoading || !destinationAddress || !amount || !asset}
              className="w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors duration-200"
            >
              {transferLoading ? (
                <>
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Creating Transfer...
                </>
              ) : (
                'Create Transfer'
              )}
            </button>
          </form>
          {transferError && <p className="mt-2 text-red-600">{transferError}</p>}
          {transferSuccess && <p className="mt-2 text-green-600">{transferSuccess}</p>}
        </div>
      </main>
    </div>
  );
}