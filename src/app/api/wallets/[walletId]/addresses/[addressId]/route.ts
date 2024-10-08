import { NextResponse } from 'next/server';
import { Wallet, WalletAddress } from '@coinbase/coinbase-sdk';
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
      network: address.getNetworkId(),
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

export async function POST(
  request: Request,
  { params }: { params: { walletId: string; addressId: string } }
) {
  try {
    const { walletId, addressId } = params;

    const wallet = await Wallet.fetch(walletId);

    // Get the address object
    const addresses = await wallet.listAddresses()
    
    const address = addresses.find(addr => addr.getId() === addressId);

    if (!address) {
      return NextResponse.json({ error: 'Address not found' }, { status: 404 });
    }

    // Request faucet funds
    const faucetResult = await address.faucet();

    return NextResponse.json({ 
      success: true, 
      message: 'Faucet request successful',
      result: faucetResult
    }, { status: 200 });

  } catch (error) {
    console.error('Error requesting faucet:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}