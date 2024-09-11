import { NextResponse } from 'next/server';
import { Coinbase, Wallet } from '@coinbase/coinbase-sdk';


if (!process.env.API_KEY_NAME || !process.env.API_KEY_SECRET) {
  throw new Error("API_KEY_NAME and API_KEY_SECRET must be set");
}

export const coinbase = new Coinbase({
  apiKeyName: process.env.API_KEY_NAME,
  privateKey: process.env.API_KEY_SECRET,
});

export interface WalletResponse {
  id: string;
  name: string;
  network: string;
} 

export async function GET() {
  try {
    const wallets = await Wallet.listWallets();
    const walletResponse = wallets.map((wallet) => ({
      id: wallet.getId(),
      name: "My Wallet",
      network: wallet.getNetworkId().split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' '),
    }));
    return NextResponse.json(walletResponse);
  } catch (error) {
    console.error('Error fetching wallets:', error);
    return NextResponse.json({ error: 'Failed to fetch wallets' }, { status: 500 });
  }
}
