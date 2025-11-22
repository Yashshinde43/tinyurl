import { Pool } from 'pg';

let pool;

function getPool() {
  if (!pool) {
    if (!process.env.DATABASE_URL) {
      throw new Error('DATABASE_URL environment variable is not set');
    }
    pool = new Pool({
      connectionString: process.env.DATABASE_URL,
      ssl: process.env.DATABASE_URL?.includes('localhost') ? false : { rejectUnauthorized: false },
    });
  }
  return pool;
}

export async function query(text, params) {
  try {
    const client = getPool();
    return await client.query(text, params);
  } catch (error) {
    console.error('Database query error:', error);
    console.error('Query:', text);
    console.error('Params:', params);
    throw error;
  }
}

let initPromise = null;

export async function initDatabase() {
  // Prevent multiple simultaneous initializations
  if (initPromise) {
    return initPromise;
  }
  
  initPromise = (async () => {
    try {
      await query(`
        CREATE TABLE IF NOT EXISTS links (
          id SERIAL PRIMARY KEY,
          code VARCHAR(8) UNIQUE NOT NULL,
          target_url TEXT NOT NULL,
          total_clicks INTEGER DEFAULT 0,
          last_clicked TIMESTAMPTZ,
          created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
        );
        
        CREATE INDEX IF NOT EXISTS idx_links_code ON links(code);
      `);
      console.log('Database initialized successfully');
    } catch (error) {
      console.error('Error initializing database:', error);
      initPromise = null; // Reset on error so it can be retried
      throw error;
    }
  })();
  
  return initPromise;
}

