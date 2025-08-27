const { Pool } = require('pg');
const dotenv = require('dotenv');
dotenv.config();

const pool = new Pool({
  host: process.env.DB_HOST || 'localhost',
  port: Number(process.env.DB_PORT || 5432),
  user: process.env.DB_USER || 'postgres',
  password: process.env.DB_PASSWORD || 'postgres',
  database: process.env.DB_NAME || 'coworkspace_db',
  max: 10,
  idleTimeoutMillis: 30000
});

pool.on('error', err => {
  console.error('[pg] unexpected error on idle client', err);
  process.exit(-1);
});

async function query(text, params){
  const res = await pool.query(text, params);
  return res;
}

module.exports = { pool, query };
