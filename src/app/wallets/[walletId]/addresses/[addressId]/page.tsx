'use client'

import { useEffect, useState } from 'react';
import Link from "next/link";
import { ArrowLeft, CreditCard, ChevronLeft, ChevronRight } from "lucide-react";
import { AddressResponse } from '@/app/api/wallets/[walletId]/addresses/[addressId]/route';

const BALANCES_PER_PAGE_OPTIONS = [5, 10, 20, 50];

export default function AddressPage({ params }: { params: { walletId: string, addressId: string } }) {
  const [address, setAddress] = useState<AddressResponse | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [balancesPerPage, setBalancesPerPage] = useState(BALANCES_PER_PAGE_OPTIONS[0]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState('');
  const [destinationAddress, setDestinationAddress] = useState('');
  const [amount, setAmount] = useState('');
  const [asset, setAsset] = useState('');
  const [transferLoading, setTransferLoading] = useState(false);
  const [transferError, setTransferError] = useState('');
  const [transferSuccess, setTransferSuccess] = useState('');

  useEffect(() => {
    const fetchAddress = async () => {
      try {
        setLoading(true);
        const response = await fetch(`/api/wallets/${params.walletId}/addresses/${params.addressId}`);
        if (!response.ok) {
          throw new Error('Failed to fetch address data');
        }
        const data: AddressResponse = await response.json();
        setAddress(data);
      } catch (err) {
        setError('Error fetching address data');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchAddress();
  }, [params.walletId, params.addressId]);

  if (loading) {
    return (
      <div className="fixed inset-0 bg-gray-100/75 dark:bg-gray-900/75 flex justify-center items-center z-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-24 w-24 border-t-4 border-b-4 border-blue-600 dark:border-blue-400 mx-auto"></div>
          <p className="mt-4 text-xl font-semibold text-gray-800 dark:text-gray-200">Loading address...</p>
        </div>
      </div>
    );
  }

  if (error || !address) {
    return <div>Error: {error || 'Address not found'}</div>;
  }

  const totalBalancePages = Math.ceil(Object.keys(address.balances).length / balancesPerPage);
  const startIndex = (currentPage - 1) * balancesPerPage;
  const endIndex = startIndex + balancesPerPage;
  const currentBalances = Object.entries(address.balances).slice(startIndex, endIndex);

  const goToPage = (page: number) => {
    setCurrentPage(page);
  };

  const handleBalancesPerPageChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const newBalancesPerPage = parseInt(event.target.value, 10);
    setBalancesPerPage(newBalancesPerPage);
    setCurrentPage(1);
  };

  const handleFaucetRequest = async () => {
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      const response = await fetch(`/api/wallets/${params.walletId}/addresses/${params.addressId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to request faucet');
      }

      setSuccess('Faucet request successful!');
    } catch (err) {
      setError('Failed to request faucet funds');
    } finally {
      setLoading(false);
    }
  };


  const handleCreateTransfer = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log('Transfer form submitted');
    setTransferLoading(true);
    setTransferError('');
    setTransferSuccess('');

    try {
      console.log('Creating transfer:', { destinationAddress, amount, asset });
      const response = await fetch(`/api/wallets/${params.walletId}/addresses/${params.addressId}/transfers`,{
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
      setTransferSuccess('Transfer created successfully: ' + data.transactionLink);

      // Reset form
      setDestinationAddress('');
      setAmount('');
      setAsset('');
    } catch (err) {
      console.error('Error creating transfer:', err); // Debugging log
      if (err instanceof Error) {
        setTransferError(err.message);
      } else {
        setTransferError('An unknown error occurred');
      }
    } finally {
      setTransferLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 p-8 font-sans">
      <main className="max-w-4xl mx-auto">
        <Link href={`/wallets/${address.walletId}`} className="inline-flex items-center text-primary hover:text-primary/80 mb-8 transition duration-300 ease-in-out">
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
              {currentBalances.map(([currency, amount], index) => (
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
        <div className="grid grid-cols-2 md:grid-cols-1 gap-8">
        {/* Faucet Request Card */}
        <div className="bg-white shadow-md rounded-lg p-6">
          <h2 className="text-xl font-semibold mb-4">Request Faucet Funds</h2>
          <button
            onClick={handleFaucetRequest}
            disabled={loading}
            className="w-full bg-green-500 hover:bg-green-600 text-white font-semibold py-2 px-4 rounded-md transition duration-300 ease-in-out transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-opacity-50 shadow-md disabled:bg-gray-400 disabled:cursor-not-allowed disabled:transform-none"
            >
            {loading ? 'Requesting...' : 'Request Faucet'}
          </button>
          {error && <p className="text-red-500 mt-2">{error}</p>}
          {success && <p className="text-green-500 mt-2">{success}</p>}
        </div>

        {/* Create Transfer Card */}
        <div className="bg-white shadow-md rounded-lg p-6">
          <h2 className="text-xl font-semibold mb-4">Create Transfer</h2>
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
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
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
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
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
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                placeholder="ETH, USDC, etc."
              />
            </div>
            <button
              type="submit"
              disabled={transferLoading}
              className="w-full bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline disabled:bg-gray-400 disabled:cursor-not-allowed"
            >
              {transferLoading ? 'Creating Transfer...' : 'Create Transfer'}
            </button>
          </form>
          {transferError && <p className="text-red-500 mt-2">{transferError}</p>}
          {transferSuccess && <p className="text-green-500 mt-2">{transferSuccess}</p>}
        </div>
        </div>
      </main>
    </div>
  );
}
