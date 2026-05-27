const app = require('./app');
const { initializeDatabase } = require('./database/initializeDatabase');

const PORT = process.env.PORT || 10000;

async function startServer() {
  try {
    const database = await initializeDatabase();
    console.log('Database initialized', database);

    app.listen(PORT, '0.0.0.0', () => {
      console.log(`Server running on port ${PORT}`);
    });
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
}

startServer();
