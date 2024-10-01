import { Pool } from 'pg';
import fs from 'fs';
import path from 'path';
import dotenv from 'dotenv';

dotenv.config({ path: '.env' });

const pool = new Pool({
  connectionString: process.env.POSTGRES_URL
});

async function setupLocalDb() {
  const client = await pool.connect();
  try {
    const sql = fs.readFileSync(path.join(__dirname, 'init.sql'), 'utf8');
    await client.query(sql);
    console.log('Local database setup complete');
  } catch (err) {
    console.error('Error setting up local database:', err);
  } finally {
    client.release();
  }
}

setupLocalDb();
