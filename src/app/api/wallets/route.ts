import { NextResponse } from 'next/server';
import { Wallet } from '@coinbase/coinbase-sdk';
import { formatNetworkId } from '@/utils/stringUtils';
import  '@/lib/server/coinbase';

export interface WalletListResponse {
  id: string;
  name: string;
  network: string;
} 

export async function GET() {
  try {
    const allWallets = await Wallet.listWallets();
    const wallets = await Promise.all(
      allWallets.map(async (wallet) => {
        try {
          await wallet.getDefaultAddress();
          return wallet;
        } catch (error) {
          console.error(`Error fetching default address for wallet ${wallet.getId()}:`, error);
          return null;
        }
      })
    );
    const filteredWallets = wallets.filter((wallet): wallet is Wallet => wallet !== null);
    const walletListResponse = filteredWallets.map((wallet) => ({
      id: wallet.getId(),
      name: "My Wallet",
      network: formatNetworkId(wallet.getNetworkId()),
    }));
    return NextResponse.json(walletListResponse);
  } catch (error) {
    console.error('Error fetching wallets:', error);
    return NextResponse.json({ error: 'Failed to fetch wallets' }, { status: 500 });
  }
}
