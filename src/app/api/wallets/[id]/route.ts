import { NextResponse } from 'next/server';
import { Coinbase, Wallet } from '@coinbase/coinbase-sdk';
import { formatNetworkId } from '@/utils/stringUtils';

if (!process.env.API_KEY_NAME || !process.env.API_KEY_SECRET) {
  throw new Error("API_KEY_NAME and API_KEY_SECRET must be set");
}

Coinbase.configure({
  apiKeyName: process.env.API_KEY_NAME,
  privateKey: process.env.API_KEY_SECRET,
});

export interface WalletResponse {
  id: string;
  network: string;
  addresses: string[];
  defaultAddress: string | null;
  balances: Record<string, number>;
} 

export async function GET(request: Request, { params }: { params: { id: string } }) {
  let walletResponse: WalletResponse;
  try {
    const walletId = params.id;
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
      network: formatNetworkId(wallet.getNetworkId()),
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
