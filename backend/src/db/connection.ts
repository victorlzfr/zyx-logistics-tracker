import { Pool, PoolConfig } from 'pg';
import dotenv from 'dotenv';

dotenv.config();

const poolConfig: PoolConfig = {
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '5433'),
  user: process.env.DB_USER || 'admin',
  password: process.env.DB_PASSWORD || 'admin123',
  database: process.env.DB_NAME || 'zyx_logistics',
  max: 20,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 2000,
};

const pool = new Pool(poolConfig);

// Event listeners
pool.on('connect', () => {
  console.log('Conectado ao banco de dados PostgreSQL');
});

pool.on('error', (err: Error) => {
  console.error('Erro na conexão com o banco:', err);
});

// Query wrapper com tipos
export const query = async <T = any>(
  text: string,
  params?: any[]
): Promise<{ rows: T[]; rowCount: number }> => {
  const start = Date.now();
  try {
    const res = await pool.query(text, params);
    const duration = Date.now() - start;
    console.log(`Query executada em ${duration}ms: ${text.substring(0, 50)}...`);
    return res;
  } catch (error) {
    console.error(`Erro na query: ${text}`, error);
    throw error;
  }
};

export default { query, pool };
