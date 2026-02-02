import pg from 'pg';

const { Pool } = pg;

const isProduction = process.env.DB_HOST?.includes('render.com');
const pool = new Pool({
  host: process.env.DB_HOST ?? 'localhost',
  port: Number(process.env.DB_PORT) ?? 5432,
  user: process.env.DB_USER ?? 'postgres',
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME ?? 'order_app',
  ...(isProduction && { ssl: { rejectUnauthorized: false } }),
});

export async function query(text, params) {
  const client = await pool.connect();
  try {
    return await client.query(text, params);
  } finally {
    client.release();
  }
}

export async function getPool() {
  return pool;
}
