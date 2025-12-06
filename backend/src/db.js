import pkg from 'pg';
const { Pool } = pkg;

const isLocal =
  process.env.DATABASE_URL?.includes('localhost') ||
  process.env.NODE_ENV === 'development';

export const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: isLocal ? false : { rejectUnauthorized: false },
});
