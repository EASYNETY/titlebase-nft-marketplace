import mysql from 'mysql2/promise';

const dbConfig = {
  host: process.env.DB_HOST || '3.80.241.11',
  user: process.env.DB_USER || 'admin',
  password: process.env.DB_PASSWORD || 'Qw3rtyUIOP!#2025',
  database: process.env.DB_NAME || 'nft_marketplace',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
};

let pool: mysql.Pool;

export const connectDB = async (): Promise<void> => {
  try {
    pool = mysql.createPool(dbConfig);
    const connection = await pool.getConnection();
    console.log('Connected to MySQL database', dbConfig);
    connection.release();
  } catch (error) {
    console.error('Database connection failed:', error);
    throw error;
  }
};

export const getPool = (): mysql.Pool => {
  if (!pool) {
    throw new Error('Database not connected');
  }
  return pool;
};

export const query = async (sql: string, params?: any[]): Promise<any> => {
  const connection = await getPool().getConnection();
  try {
    const [rows] = await connection.query(sql, params);
    return rows;
  } finally {
    connection.release();
  }
};