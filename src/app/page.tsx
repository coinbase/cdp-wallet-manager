'use client'

import { useState, useEffect } from "react";
import { useRouter } from 'next/navigation';
import { Table, TableHeader, TableColumn, TableBody, TableRow, TableCell, Button, Card, CardBody, CardHeader, Spinner } from "@nextui-org/react";
import { Dropdown, DropdownTrigger, DropdownMenu, DropdownItem } from "@nextui-org/react";
import { Selection } from "@nextui-org/react";
import { ChevronDownIcon } from '@heroicons/react/20/solid';
import { WalletListResponse } from "./api/wallets/route";
import { ChevronLeft, ChevronRight, Wallet } from "lucide-react";
import { formatNetworkId } from "@/utils/stringUtils";
import { Tooltip } from "@nextui-org/react";

const WALLETS_PER_PAGE_OPTIONS = [10, 20, 50, 100];
const SUPPORTED_NETWORKS = ['base-sepolia', 'base-mainnet'];

export default function Home() {
  const [wallets, setWallets] = useState<WalletListResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedNetwork, setSelectedNetwork] = useState<Selection>(new Set([SUPPORTED_NETWORKS[0]]));
  const [walletsPerPage, setWalletsPerPage] = useState(WALLETS_PER_PAGE_OPTIONS[0]);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [createWalletLoading, setCreateWalletLoading] = useState(false);
  const [createWalletError, setCreateWalletError] = useState<string | null>(null);
  const [mainnetDisabled, setMainnetDisabled] = useState(true);
  const router = useRouter();

  useEffect(() => {
    fetchWallets();
    checkMainnetStatus();
  }, []);

  async function fetchWallets() {
    try {
      const response = await fetch('/api/wallets');
      if (!response.ok) throw new Error('Failed to fetch wallets');
      const data = await response.json();
      setWallets(data);
    } catch (err) {
      console.error('Error fetching wallets:', err);
      setError('Failed to load wallets. Please try again later.');
    } finally {
      setLoading(false);
    }
  }

  async function checkMainnetStatus() {
    try {
      const response = await fetch('/api/mainnet-status');
      if (!response.ok) throw new Error('Failed to fetch mainnet status');
      const { disabled } = await response.json();
      setMainnetDisabled(disabled);
    } catch (err) {
      console.error('Error fetching mainnet status:', err);
    }
  }

  const handleCreateWallet = async () => {
    setCreateWalletLoading(true);
    setCreateWalletError(null);

    try {
      const networkId = Array.from(selectedNetwork)[0] as string;
      const response = await fetch('/api/wallets', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ networkId }),
      });

      if (!response.ok) throw new Error('Failed to create wallet');

      const data = await response.json();
      router.push(`/wallets/${data.id}`);
    } catch (err) {
      setCreateWalletError(err instanceof Error ? err.message : 'An unknown error occurred');
    } finally {
      setCreateWalletLoading(false);
    }
  };

  const columns = [
    { name: "WALLET ID", uid: "id" },
    { name: "NETWORK", uid: "network" },
  ];

  const paginatedWallets = wallets.slice(
    (currentPage - 1) * walletsPerPage,
    currentPage * walletsPerPage
  );

  const totalPages = Math.ceil(wallets.length / walletsPerPage);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  if (loading) {
    return (
      <div className="h-screen flex justify-center items-center">
        <Spinner size="lg" />
      </div>
    );
  }

  if (error) {
    return <div className="text-red-500">{error}</div>;
  }

  return (
    <div className="container max-w-4xl mx-auto p-4 space-y-6">
      <h1 className="text-4xl font-bold mb-8 bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-pink-600">CDP Wallet Manager</h1>
      
      <Card className="bg-white dark:bg-gray-800">
        <CardHeader className="flex justify-between items-center">
          <h2 className="text-2xl font-semibold flex items-center text-gray-800 dark:text-gray-200">
            <Wallet className="mr-2 h-6 w-6" /> Wallets
          </h2>
          <div className="flex items-center space-x-2">
            <span className="text-sm text-gray-600 dark:text-gray-200">Wallets per page:</span>
            <Dropdown onOpenChange={setIsDropdownOpen}>
              <DropdownTrigger>
                <Button 
                  variant="light" 
                  className={`min-w-[70px] border transition-colors ${
                    isDropdownOpen
                      ? 'bg-blue-100 border-blue-600 text-blue-600 dark:text-gray-800'
                      : 'bg-transparent border-gray-300 hover:border-blue-600 text-gray-700 dark:text-gray-200 hover:text-blue-600 dark:hover:text-gray-200'
                  }`}
                >
                  {walletsPerPage}
                </Button>
              </DropdownTrigger>
              <DropdownMenu 
                aria-label="Wallets per page"
                onAction={(key) => setWalletsPerPage(Number(key))}
              >
                {WALLETS_PER_PAGE_OPTIONS.map((option) => (
                  <DropdownItem key={option}>{option}</DropdownItem>
                ))}
              </DropdownMenu>
            </Dropdown>
          </div>
        </CardHeader>
        <CardBody>
          <Table 
            aria-label="Wallets table"
            classNames={{
              base: "max-w-full",
              table: "min-w-full border-collapse border border-gray-200 dark:border-gray-700",
              thead: "bg-gray-100 dark:bg-gray-700",
              tbody: "bg-white dark:bg-gray-900",
              tr: "border-b border-gray-200 dark:border-gray-700",
              th: "text-left p-3 text-gray-800 dark:text-gray-200 font-semibold",
              td: "p-3 text-gray-800 dark:text-gray-200",
            }}
          >
            <TableHeader>
              {columns.map((column) => (
                <TableColumn key={column.uid} className="text-gray-800 dark:text-gray-800 font-semibold">
                  {column.name}
                </TableColumn>
              ))}
            </TableHeader>
            <TableBody>
              {paginatedWallets.map((wallet) => (
                <TableRow key={wallet.id}>
                  <TableCell>
                    <span 
                      className="text-blue-600 cursor-pointer dark:text-gray-200" 
                      onClick={() => router.push(`/wallets/${wallet.id}`)}
                    >
                      {wallet.id}
                    </span>
                  </TableCell>
                  <TableCell>{formatNetworkId(wallet.network)}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          
          <div className="flex justify-center items-center mt-6">
            <Button
              isIconOnly
              aria-label="Previous page"
              variant="light"
              isDisabled={currentPage === 1}
              onPress={() => handlePageChange(currentPage - 1)}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
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
              isDisabled={currentPage === totalPages}
              onPress={() => handlePageChange(currentPage + 1)}
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </CardBody>
      </Card>
      
      <Card className="bg-white dark:bg-gray-800">
        <CardHeader className="flex justify-between items-center">
          <h2 className="text-2xl font-semibold flex items-center text-gray-800 dark:text-gray-200">
            Create New Wallet
          </h2>
        </CardHeader>
        <CardBody>
          <div className="flex items-center space-x-4">
            <Dropdown>
              <DropdownTrigger>
                <Button 
                  variant="bordered" 
                  className="min-w-[150px] border transition-colors bg-transparent border-gray-300 hover:border-blue-600 text-gray-700 hover:text-blue-600 dark:text-gray-200"
                  endContent={<ChevronDownIcon className="h-4 w-4" />}
                >
                  {Array.from(selectedNetwork)[0] || "Select Network"}
                </Button>
              </DropdownTrigger>
              <DropdownMenu
                aria-label="Select Network"
                disallowEmptySelection
                selectionMode="single"
                selectedKeys={selectedNetwork}
                onSelectionChange={setSelectedNetwork}
                className="bg-white dark:bg-gray-800"
              >
                {SUPPORTED_NETWORKS.filter(network => !mainnetDisabled || !network.includes('mainnet')).map((network) => (
                  <DropdownItem key={network}>{network}</DropdownItem>
                ))}
              </DropdownMenu>
            </Dropdown>
            <Tooltip
              content="Deploy the vercel template to create wallets"
              isDisabled={!mainnetDisabled}
            >
              <div className="inline-block"> {/* Wrapper div for the button */}
                <Button
                  color="primary"
                  className={`text-sm text-white bg-blue-600 hover:bg-blue-700 ${
                    mainnetDisabled ? 'opacity-50 cursor-not-allowed filter' : ''
                  }`}
                  disabled={createWalletLoading || (selectedNetwork !== "all" && selectedNetwork.size === 0) || mainnetDisabled}
                  onClick={handleCreateWallet}
                >
                  {createWalletLoading ? <Spinner size="sm" /> : 'Create Wallet'}
                </Button>
              </div>
            </Tooltip>
          </div>
          {createWalletError && <p className="text-red-500 dark:text-red-400 mt-4 text-sm">{createWalletError}</p>}
        </CardBody>
      </Card>
    </div>
  );
}