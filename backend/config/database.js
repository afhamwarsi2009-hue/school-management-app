const sql = require('mssql');
const { env } = require('./env');

let poolPromise;

function buildConfig(database = env.db.database) {
  return {
    user: env.db.user,
    password: env.db.password,
    server: env.db.server,
    database,
    port: env.db.port,
    pool: {
      max: env.db.poolMax,
      min: env.db.poolMin,
      idleTimeoutMillis: env.db.poolIdleTimeout
    },
    options: {
      encrypt: env.db.encrypt,
      trustServerCertificate: env.db.trustServerCertificate,
      enableArithAbort: true
    },
    requestTimeout: env.db.requestTimeout,
    connectionTimeout: env.db.connectionTimeout
  };
}

async function createPool(database = env.db.database) {
  const pool = new sql.ConnectionPool(buildConfig(database));
  pool.on('error', (error) => {
    // Reset the cached pool so the next request can reconnect automatically.
    console.error('SQL Server pool error:', error.message);
    poolPromise = null;
  });

  return pool.connect();
}

async function getPool() {
  if (!poolPromise) {
    poolPromise = createPool();
  }

  try {
    return await poolPromise;
  } catch (error) {
    poolPromise = null;
    throw error;
  }
}

async function closePool() {
  if (!poolPromise) return;
  const pool = await poolPromise;
  await pool.close();
  poolPromise = null;
}

module.exports = { sql, getPool, closePool, createPool, buildConfig };
