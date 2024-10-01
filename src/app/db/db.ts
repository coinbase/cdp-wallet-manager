import { Pool } from 'pg';
import CryptoJS from 'crypto-js';

// Initialize the database pool
const pool = new Pool({
  connectionString: process.env.POSTGRES_URL,
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false
});

// Function to add a new seed record
export async function addSeedRecord(walletId: string, seed: string, encryptionKey: string): Promise<number> {
  const client = await pool.connect();
  try {
    // Encrypt the seed
    const encryptedSeed = CryptoJS.AES.encrypt(seed, encryptionKey).toString();

    // SQL query to insert the new record
    const query = `
      INSERT INTO wallets (wallet_id, encrypted_seed)
      VALUES ($1, $2)
      RETURNING id
    `;

    // Execute the query
    const result = await client.query(query, [walletId, encryptedSeed]);

    console.log('New seed record added:', result.rows[0].id);

    // Return the new record's ID
    return result.rows[0].id;
  } catch (error) {
    console.error('Error adding seed record:', error);
    throw error;
  } finally {
    client.release();
  }
}

// Function to retrieve and decrypt a seed
export async function getSeed(id: string, encryptionKey: string): Promise<string | null> {
  const client = await pool.connect();
  try {
    const query = 'SELECT encrypted_seed FROM wallets WHERE wallet_id = $1';
    const result = await client.query(query, [id]);

    if (result.rows.length === 0) {
      return null;
    }

    const encryptedSeed = result.rows[0].encrypted_seed;
    const bytes = CryptoJS.AES.decrypt(encryptedSeed, encryptionKey);
    return bytes.toString(CryptoJS.enc.Utf8);
  } catch (error) {
    console.error('Error retrieving seed:', error);
    throw error;
  } finally {
    client.release();
  }
}
