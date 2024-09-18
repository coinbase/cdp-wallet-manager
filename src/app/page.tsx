'use client'

import { useState, useEffect } from "react";
import Link from "next/link";
import { PlusCircle, ChevronLeft, ChevronRight } from "lucide-react";
import { WalletListResponse } from "./api/wallets/route";
import React from 'react';

const WALLETS_PER_PAGE_OPTIONS = [10, 20, 50, 100];
const CACHE_DURATION = 6 * 60 * 60 * 1000; // 6 hours in milliseconds

export default function Home() {
  const [wallets, setWallets] = useState<WalletListResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [walletsPerPage, setWalletsPerPage] = useState(WALLETS_PER_PAGE_OPTIONS[0]);

  useEffect(() => {
    async function fetchWallets() {
      try {
        const cachedData = localStorage.getItem('walletsData');
        const cachedTimestamp = localStorage.getItem('walletsTimestamp');
        
        if (cachedData && cachedTimestamp) {
          const parsedData = JSON.parse(cachedData);
          const timestamp = parseInt(cachedTimestamp, 10);
          
          if (Date.now() - timestamp < CACHE_DURATION) {
            setWallets(parsedData);
            setLoading(false);
            return;
          }
        }

        const response = await fetch('/api/wallets');
        if (!response.ok) {
          throw new Error('Failed to fetch wallets');
        }
        const data = await response.json();
        setWallets(data);
        setLoading(false);
        
        localStorage.setItem('walletsData', JSON.stringify(data));
        localStorage.setItem('walletsTimestamp', Date.now().toString());
      } catch (err) {
        console.error('Error fetching wallets:', err);
        setError('Failed to load wallets. Please try again later.');
        setLoading(false);
      }
    }

    fetchWallets();
  }, []);

  const totalPages = Math.ceil(wallets.length / walletsPerPage);
  const startIndex = (currentPage - 1) * walletsPerPage;
  const endIndex = startIndex + walletsPerPage;
  const currentWallets = wallets.slice(startIndex, endIndex);

  const goToPage = (page: number) => {
    setCurrentPage(page);
  };

  const handleWalletsPerPageChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const newWalletsPerPage = parseInt(event.target.value, 10);
    setWalletsPerPage(newWalletsPerPage);
    setCurrentPage(1);
  };

  if (loading) {
    return <div>Loading wallets...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 p-8 font-sans">
      <main className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold mb-8 text-gray-800 dark:text-gray-100">Wallet Manager</h1>
        
        <div className="flex justify-between items-center mb-8">
          <Link 
            href="/create-wallet" 
            className="inline-flex items-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg shadow-md transition duration-300 ease-in-out"
          >
            <PlusCircle size={20} />
            <span>Create Wallet</span>
          </Link>
          
          <div className="flex items-center space-x-2">
            <label htmlFor="walletsPerPage" className="text-gray-700 dark:text-gray-300">Wallets per page:</label>
            <select
              id="walletsPerPage"
              value={walletsPerPage}
              onChange={handleWalletsPerPageChange}
              className="bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-md px-2 py-1"
            >
              {WALLETS_PER_PAGE_OPTIONS.map(option => (
                <option key={option} value={option}>{option}</option>
              ))}
            </select>
          </div>
        </div>
        
        <h2 className="text-2xl font-semibold mb-4 text-gray-700 dark:text-gray-200">Wallets</h2>
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden mb-6">
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-200 text-sm uppercase">
                <th className="p-3 text-left font-semibold">Wallet ID</th>
                <th className="p-3 text-left font-semibold">Network</th>
              </tr>
            </thead>
            <tbody>
              {currentWallets.map((wallet) => (
                <tr key={wallet.id} className="border-b border-gray-300 dark:border-gray-600">
                  <td className="p-3">
                    <Link href={`/wallet/${wallet.id}`} className="text-primary hover:text-primary/80 font-medium">
                      {wallet.id}
                    </Link>
                  </td>
                  <td className="p-3 text-gray-600 dark:text-gray-300">{wallet.network}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="flex justify-center items-center space-x-2">
          <button
            onClick={() => goToPage(currentPage - 1)}
            disabled={currentPage === 1}
            className="p-2 rounded-md bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-300 disabled:opacity-50"
          >
            <ChevronLeft size={20} />
          </button>
          
          {Array.from({ length: totalPages }, (_, i) => i + 1)
            .filter(page => {
              if (totalPages <= 10) return true;
              if (page === 1 || page === totalPages) return true;
              if (page >= currentPage - 2 && page <= currentPage + 2) return true;
              if (page === 2 || page === totalPages - 1) return true;
              return false;
            })
            .map((page, index, array) => (
              <React.Fragment key={page}>
                {index > 0 && array[index - 1] !== page - 1 && (
                  <span className="px-2 text-gray-400">...</span>
                )}
                <button
                  onClick={() => goToPage(page)}
                  className={`px-3 py-1 rounded-md ${
                    currentPage === page
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-300'
                  }`}
                >
                  {page}
                </button>
              </React.Fragment>
            ))}
          
          <button
            onClick={() => goToPage(currentPage + 1)}
            disabled={currentPage === totalPages}
            className="p-2 rounded-md bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-300 disabled:opacity-50"
          >
            <ChevronRight size={20} />
          </button>
        </div>
      </main>
    </div>
  );
}