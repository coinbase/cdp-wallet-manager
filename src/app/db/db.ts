import { PrismaClient } from '@prisma/client';
import crypto from 'crypto';

const prisma = new PrismaClient();

export async function createWallet(walletId: string, seed: string): Promise<void> {
  const encryptedSeed = encryptSeed(seed);
  
  try {
    await prisma.wallet.create({
      data: {
        walletId,
        encryptedSeed,
      },
    });
  } catch (error) {
    console.error('Error creating wallet:', error);
    throw new Error('Failed to create wallet');
  }
}

export async function getWallet(walletId: string): Promise<string> {
  const wallet = await prisma.wallet.findFirstOrThrow({
    where: { walletId },
  });
  
  return decryptSeed(wallet.encryptedSeed);
}

function encryptSeed(seed: string): string {
  const algorithm = 'aes-256-cbc';
  const key = Buffer.from(process.env.ENCRYPTION_KEY || '', 'hex');
  const iv = crypto.randomBytes(16);

  const cipher = crypto.createCipheriv(algorithm, key, iv);
  let encrypted = cipher.update(seed, 'utf8', 'hex');
  encrypted += cipher.final('hex');

  return iv.toString('hex') + ':' + encrypted;
}

function decryptSeed(encryptedSeed: string): string {
  const algorithm = 'aes-256-cbc';
  const key = Buffer.from(process.env.ENCRYPTION_KEY || '', 'hex');

  const parts = encryptedSeed.split(':');
  const iv = Buffer.from(parts.shift() || '', 'hex');
  const encryptedText = parts.join(':');

  const decipher = crypto.createDecipheriv(algorithm, key, iv);
  let decrypted = decipher.update(encryptedText, 'hex', 'utf8');
  decrypted += decipher.final('utf8');

  return decrypted;
}