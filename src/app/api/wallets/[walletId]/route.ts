import { NextResponse } from 'next/server';
import { Wallet } from '@coinbase/coinbase-sdk';
import { formatNetworkId } from '@/utils/stringUtils';
import '@/lib/server/coinbase';
import { addSeedRecord, getSeed } from '@/app/db/db';

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


export async function POST(request: Request, { params }: { params: { walletId: string } }) {
  try {
    const body = await request.json();
    const { destination_address, amount, asset } = body;

    // Validate required fields
    if (!destination_address) {
      return NextResponse.json({ error: 'Destination address is required' }, { status: 400 });
    }
    if (!amount) {
      return NextResponse.json({ error: 'Amount is required' }, { status: 400 });
    }
    if (!asset) {
      return NextResponse.json({ error: 'Asset is required' }, { status: 400 });
    }

    // Validate amount is a positive number
    const numAmount = parseFloat(amount);
    if (isNaN(numAmount) || numAmount <= 0) {
      return NextResponse.json({ error: 'Amount must be a positive number' }, { status: 400 });
    }
  
    const wallet = await Wallet.fetch(params.walletId);
    const walletId = wallet.getId() as string;

    const seed = await getSeed(walletId, process.env.ENCRYPTION_KEY as string);

    wallet.setSeed(seed as string);
    
   const transfer = await wallet.createTransfer({
      amount: numAmount,
      assetId: asset,
      destination: destination_address,
   });

    return NextResponse.json({ success: true, transfer }, { status: 201 });
  } catch (error) {
    console.error('Error creating transfer request:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}