const mysql = require('mysql2/promise');
const { env } = require('./env');

let poolPromise;

function buildConfig(database = env.db.database) {
  const config = {
    host: env.db.host,
    user: env.db.user,
    password: env.db.password,
    port: env.db.port,
    waitForConnections: true,
    connectionLimit: env.db.poolMax,
    queueLimit: 0,
    connectTimeout: env.db.connectionTimeout,
    timezone: 'Z',
    multipleStatements: false,
    namedPlaceholders: false,
    ssl: env.db.ssl ? { rejectUnauthorized: env.db.sslRejectUnauthorized } : undefined
  };
  if (database) config.database = database;
  return config;
}

async function createPool(database = env.db.database) {
  const pool = mysql.createPool(buildConfig(database));
  await pool.query('SELECT 1');
  return pool;
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
  await pool.end();
  poolPromise = null;
}

const sql = {
  Int: 'int',
  Bit: 'bit',
  Date: 'date',
  DateTime2: 'datetime',
  MAX: 'max',
  NVarChar: () => 'varchar',
  Decimal: () => 'decimal'
};

module.exports = { sql, getPool, closePool, createPool, buildConfig };
