const app = require('./app');
const { env } = require('./config/env');
const { closePool } = require('./config/database');
const { initializeDatabase, testDatabaseConnection } = require('./database/initializeDatabase');

async function startServer() {
  try {
    const database = env.db.autoInitialize
      ? await initializeDatabase()
      : await testDatabaseConnection();
    console.log(`Connected to MySQL database "${database.databaseName}" on "${database.serverName}"`);
  } catch (error) {
    console.error('MySQL connection failed:', error.message);
    if (env.nodeEnv === 'production') {
      process.exit(1);
    }
    console.error('The API will still start in development, but database routes will fail until MySQL is reachable.');
  }

  const server = app.listen(env.port, () => {
    console.log(`${env.schoolShortName} API running on http://localhost:${env.port}`);
  });

  async function shutdown(signal) {
    console.log(`${signal} received. Closing ${env.schoolShortName} API.`);
    server.close(async () => {
      await closePool();
      process.exit(0);
    });
  }

  process.on('SIGINT', () => shutdown('SIGINT'));
  process.on('SIGTERM', () => shutdown('SIGTERM'));
}

startServer();
