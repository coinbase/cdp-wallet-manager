'use client'

import { useEffect, useState } from 'react';
import Link from "next/link";
import { ArrowLeft, Wallet, ChevronLeft, ChevronRight } from "lucide-react";
import { Card, CardBody, CardHeader, Table, TableHeader, TableColumn, TableBody, TableRow, TableCell, Button, Spinner, Dropdown, DropdownTrigger, DropdownMenu, DropdownItem } from "@nextui-org/react";
import { formatNetworkId } from '@/utils/stringUtils';

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
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  useEffect(() => {
    async function fetchWallet() {
      try {
        const response = await fetch(`/api/wallets/${params.walletId}`);
        if (!response.ok) throw new Error('Failed to fetch wallet');
        const data = await response.json();
        setWallet(data);
      } catch (err) {
        console.error('Error fetching wallet:', err);
        setError('Failed to load wallet. Please try again later.');
      } finally {
        setLoading(false);
      }
    }
    fetchWallet();
  }, [params.walletId]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Spinner size="lg" />
      </div>
    );
  }

  if (error || !wallet) {
    return (
      <Card className="max-w-2xl mx-auto mt-8">
        <CardBody>
          <p className="text-danger">{error || 'Wallet not found'}</p>
        </CardBody>
      </Card>
    );
  }

  const totalBalancePages = Math.ceil(Math.max(Object.keys(wallet.balances).length, 1) / balancesPerPage);
  const startIndex = (currentPage - 1) * balancesPerPage;
  const endIndex = startIndex + balancesPerPage;
  let currentBalances = Object.entries(wallet.balances).slice(startIndex, endIndex);
  
  // Add empty ETH balance if no balances exist
  if (currentBalances.length === 0) {
    currentBalances = [['eth', 0]];
  }

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handleBalancesPerPageChange = (key: string) => {
    setBalancesPerPage(Number(key));
    setCurrentPage(1); // Reset to first page when changing items per page
  };

  return (
    <div className="container max-w-4xl mx-auto p-4 space-y-6">
      <Link href="/" className="inline-flex items-center text-blue-600 hover:text-blue-800 mb-4">
        <ArrowLeft className="mr-2" size={20} />
        <span>Back to Wallets</span>
      </Link>

      <Card className="border border-gray-200 shadow-sm">
        <CardHeader className="flex justify-between items-center px-6 py-4 bg-gray-50">
          <div className="flex items-center gap-3">
            <Wallet size={24} className="text-blue-600" />
            <div>
              <h1 className="text-lg text-gray-800 dark:text-gray-800 font-semibold">Wallet Details</h1>
              <p className="text-sm text-gray-500">ID: {params.walletId}</p>
            </div>
          </div>
        </CardHeader>
        <CardBody className="px-6 py-4">
          <div className="grid grid-cols-2 gap-6">
            <div>
              <p className="text-sm font-medium text-gray-500 dark:text-gray-800 mb-1">Network</p>
              <p className="text-base text-gray-500 dark:text-gray-800 ">{formatNetworkId(wallet.network)}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500 mb-1">Default Address</p>
              <p className="text-sm text-gray-500 dark:text-gray-800 ">{wallet.defaultAddress || 'N/A'}</p>
            </div>
          </div>
        </CardBody>
      </Card>

      <Card className="shadow-sm">
        <CardHeader className="flex justify-between items-center px-6 py-4">
          <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-800">Balances</h2>
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-500 dark:text-gray-800">Items per page:</span>
            <Dropdown onOpenChange={setIsDropdownOpen}>
              <DropdownTrigger>
                <Button 
                  variant="light" 
                  className={`min-w-[70px] border transition-colors ${
                    isDropdownOpen
                      ? 'bg-blue-100 border-blue-600 text-blue-600'
                      : 'bg-transparent border-gray-300 hover:border-blue-600 text-gray-700 dark:text-gray-200 hover:text-blue-600 dark:hover:text-gray-200'
                  }`}
                >
                  {balancesPerPage}
                </Button>
              </DropdownTrigger>
              <DropdownMenu 
                aria-label="Balances per page"
                onAction={(key) => handleBalancesPerPageChange(key.toString())}
              >
                {BALANCES_PER_PAGE_OPTIONS.map((option) => (
                  <DropdownItem key={option}>{option}</DropdownItem>
                ))}
              </DropdownMenu>
            </Dropdown>
          </div>
        </CardHeader>
        <CardBody className="px-6 py-4">
          <Table aria-label="Balances table" className="min-w-full text-gray-800 dark:text-gray-800">
            <TableHeader>
              <TableColumn className="text-left">CURRENCY</TableColumn>
              <TableColumn className="text-right">AMOUNT</TableColumn>
            </TableHeader>
            <TableBody>
              {currentBalances.map(([currency, amount]) => (
                <TableRow key={currency}>
                  <TableCell className="text-left">{currency}</TableCell>
                  <TableCell className="text-right">{amount}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          <div className="flex justify-center items-center gap-2 mt-4">
            <Button
              isIconOnly
              aria-label="Previous page"
              variant="light"
              isDisabled={currentPage === 1}
              onPress={() => handlePageChange(currentPage - 1)}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            {Array.from({ length: totalBalancePages }, (_, i) => i + 1).map((page) => (
              <Button
                key={page}
                size="sm"
                variant={currentPage === page ? "solid" : "light"}
                onPress={() => handlePageChange(page)}
                className={`w-8 h-8 text-sm ${
                  currentPage === page ? "bg-blue-600 text-white" : "text-gray-700"
                }`}
              >
                {page}
              </Button>
            ))}
            <Button
              isIconOnly
              aria-label="Next page"
              variant="light"
              isDisabled={currentPage === totalBalancePages}
              onPress={() => handlePageChange(currentPage + 1)}
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </CardBody>
      </Card>

      <Card className="shadow-sm">
        <CardHeader className="px-6 py-4">
          <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-800">Addresses</h2>
        </CardHeader>
        <CardBody className="px-6 py-4">
          <Table aria-label="Addresses table" className="min-w-full">
            <TableHeader>
              <TableColumn className="w-1/6 text-gray-800 dark:text-gray-800">INDEX</TableColumn>
              <TableColumn className="text-gray-800 dark:text-gray-800">ADDRESS</TableColumn>
            </TableHeader>
            <TableBody>
              {wallet.addresses.map((address, index) => (
                <TableRow key={index}>
                  <TableCell className="text-gray-800 dark:text-gray-800">{index}</TableCell>
                  <TableCell>
                    <Link 
                      href={`/wallets/${wallet.id}/addresses/${address}`}
                      className="text-blue-600 hover:text-blue-800 hover:underline text-blue-600 cursor-pointer dark:text-blue-800"
                    >
                      {address}
                    </Link>
                    {address === wallet.defaultAddress && (
                      <span className="ml-2 text-xs bg-blue-100 text-blue-800 py-1 px-2 rounded-full dark:bg-blue-900 dark:text-blue-400">
                        Default
                      </span>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardBody>
      </Card>
    </div>
  );
}
