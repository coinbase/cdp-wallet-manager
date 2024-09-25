import { NextResponse } from 'next/server';
import { Wallet, WalletAddress } from '@coinbase/coinbase-sdk';
import { formatNetworkId } from '@/utils/stringUtils';
import  '@/lib/server/coinbase';

export interface AddressResponse {
  id: string;
  network: string;
  address: string;
  walletId: string;
  balances: Record<string, number>;
}

export async function GET(
  request: Request,
  { params }: { params: { walletId: string; addressId: string } }
) {
  let addressResponse: AddressResponse;
  try {
    const { walletId, addressId } = params;
    console.log('walletId', walletId);
    const wallet = await Wallet.fetch(walletId);
    const address = await wallet.getAddress(addressId) as WalletAddress;
    
    // Fetch balances
    const balances = await address.listBalances();
    const formattedBalances: Record<string, number> = {};
    balances.forEach((balance, currency) => {
      formattedBalances[currency] = parseFloat(balance.toString());
    });

    addressResponse = {
      id: address.getId() as string,
      network: formatNetworkId(address.getNetworkId()),
      address: address.getId(),
      walletId: wallet.getId() as string,
      balances: formattedBalances,
    };

    return NextResponse.json(addressResponse);
  } catch (error) {
    console.error('Error fetching address:', error);
    return NextResponse.json({ error: 'Failed to fetch address' }, { status: 500 });
  }
}
