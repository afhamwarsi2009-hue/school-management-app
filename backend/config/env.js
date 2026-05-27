const required = [
  'DB_HOST',
  'DB_USER',
  'DB_PASSWORD',
  'DB_DATABASE',
  'JWT_SECRET'
];

const missing = required.filter((key) => !process.env[key]);

if (missing.length) {
  throw new Error(
    `Missing required environment variables: ${missing.join(', ')}`
  );
}

const env = {
  db: {
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE,
    port: Number(process.env.DB_PORT || 3306),
    poolMax: 10,
    connectionTimeout: 60000,
    ssl: false,
    sslRejectUnauthorized: false
  },

  jwt: {
    secret: process.env.JWT_SECRET
  }
};

module.exports = { env };