import { NextResponse } from 'next/server';
import { Wallet } from '@coinbase/coinbase-sdk';
import '@/lib/server/coinbase';

export interface WalletResponse {
  id: string;
  network: string;
  addresses: string[];
  defaultAddress: string | null;
  balances: Record<string, number>;
} 

export async function GET(request: Request, { params }: { params: { walletId: string } }) {
  let walletResponse: WalletResponse;
  try {
    const walletId = params.walletId;
    const wallet = await Wallet.fetch(walletId);
    const addresses = await wallet.listAddresses();
    const addressIds = await Promise.all(addresses.map(async (address) => address.getId()));
    const defaultAddress = await wallet.getDefaultAddress();
    const defaultAddressId = defaultAddress ? defaultAddress.getId() : null;
    
    // Fetch balances
    const balances = await wallet.listBalances();
    const formattedBalances: Record<string, number> = {};
    balances.forEach((balance, currency) => {
      formattedBalances[currency] = parseFloat(balance.toString());
    });

    walletResponse = {
      id: wallet.getId() as string,
      network: wallet.getNetworkId(),
      addresses: addressIds,
      defaultAddress: defaultAddressId,
      balances: formattedBalances,
    };

    return NextResponse.json(walletResponse);
  } catch (error) {
    console.error('Error fetching wallet:', error);
    return NextResponse.json({ error: 'Failed to fetch wallet' }, { status: 500 });
  }
}
