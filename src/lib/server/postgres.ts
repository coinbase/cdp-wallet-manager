import { Pool } from 'pg';

let conn;

if (!conn) {
  conn = new Pool({
    connectionString: process.env.POSTGRES_URL,
    ssl: {
      rejectUnauthorized: false
    }
  });
}

export default conn;
