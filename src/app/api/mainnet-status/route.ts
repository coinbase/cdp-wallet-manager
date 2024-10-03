import { NextResponse } from 'next/server';

export async function GET() {
  const mainnetDisabled = process.env.MAINNET_DISABLED === 'true';
  return NextResponse.json({ disabled: mainnetDisabled });
}