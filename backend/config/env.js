require('dotenv').config();

const requiredInProduction = ['DB_USER', 'DB_PASSWORD', 'DB_SERVER', 'DB_DATABASE', 'JWT_SECRET'];

if (process.env.NODE_ENV === 'production') {
  const missing = requiredInProduction.filter((key) => !process.env[key]);
  if (missing.length) {
    throw new Error(`Missing required environment variables: ${missing.join(', ')}`);
  }
}

function parseOrigins(value) {
  const origins = String(value || 'http://localhost:5173,http://127.0.0.1:5173,http://localhost:4173,http://127.0.0.1:4173')
    .split(',')
    .map((origin) => origin.trim())
    .filter(Boolean);

  const expanded = new Set(origins);
  origins.forEach((origin) => {
    try {
      const url = new URL(origin);
      if (url.hostname === 'localhost') {
        url.hostname = '127.0.0.1';
        expanded.add(url.toString().replace(/\/$/, ''));
      } else if (url.hostname === '127.0.0.1') {
        url.hostname = 'localhost';
        expanded.add(url.toString().replace(/\/$/, ''));
      }
    } catch {
      // Keep manually configured origins as-is.
    }
  });

  return Array.from(expanded);
}

const env = {
  nodeEnv: process.env.NODE_ENV || 'development',
  port: Number(process.env.PORT || 5000),
  clientOrigin: parseOrigins(process.env.CLIENT_ORIGIN),
  jwtSecret: process.env.JWT_SECRET || 'change-this-local-secret',
  jwtExpiresIn: process.env.JWT_EXPIRES_IN || '8h',
  schoolName: process.env.SCHOOL_NAME || 'Gurugram Public School',
  schoolShortName: process.env.SCHOOL_SHORT_NAME || 'GPS',
  db: {
    user: process.env.DB_USER || 'SchoolManagement',
    password: process.env.DB_PASSWORD || 'School@$',
    server: process.env.DB_SERVER || 'AFHAMWARSI',
    database: process.env.DB_DATABASE || 'school_management',
    port: Number(process.env.DB_PORT || 1433),
    encrypt: process.env.DB_ENCRYPT === 'true',
    trustServerCertificate: process.env.DB_TRUST_SERVER_CERTIFICATE !== 'false',
    poolMax: Number(process.env.DB_POOL_MAX || 10),
    poolMin: Number(process.env.DB_POOL_MIN || 0),
    poolIdleTimeout: Number(process.env.DB_POOL_IDLE_TIMEOUT || 30000),
    requestTimeout: Number(process.env.DB_REQUEST_TIMEOUT || 30000),
    connectionTimeout: Number(process.env.DB_CONNECTION_TIMEOUT || 30000),
    autoInitialize: process.env.DB_AUTO_INITIALIZE !== 'false'
  },
  razorpay: {
    keyId: process.env.RAZORPAY_KEY_ID || '',
    keySecret: process.env.RAZORPAY_KEY_SECRET || ''
  },
  smtp: {
    host: process.env.SMTP_HOST || '',
    port: Number(process.env.SMTP_PORT || 587),
    secure: process.env.SMTP_SECURE === 'true',
    user: process.env.SMTP_USER || '',
    pass: process.env.SMTP_PASS || '',
    from: process.env.SMTP_FROM || 'Gurugram Public School <gurugramhbag@gmail.com>',
    contactTo: process.env.CONTACT_TO_EMAIL || 'gurugramhbag@gmail.com'
  }
};

module.exports = { env };
