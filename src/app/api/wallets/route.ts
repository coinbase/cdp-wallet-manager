import { NextResponse } from 'next/server';
import { Coinbase, Wallet } from '@coinbase/coinbase-sdk';
import { formatNetworkId } from '@/utils/stringUtils';

if (!process.env.API_KEY_NAME || !process.env.API_KEY_SECRET) {
  throw new Error("API_KEY_NAME and API_KEY_SECRET must be set");
}

export const coinbase = new Coinbase({
  apiKeyName: process.env.API_KEY_NAME,
  privateKey: process.env.API_KEY_SECRET,
});

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
