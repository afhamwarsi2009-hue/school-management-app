const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const bodyParser = require('body-parser');
const routes = require('./routes');
const { errorHandler } = require('./middleware/errorHandler');
const { env } = require('./config/env');
const { testDatabaseConnection } = require('./database/initializeDatabase');

const app = express();

app.use(helmet());
app.use(cors({
  origin(origin, callback) {
    if (!origin || env.clientOrigin.includes(origin)) return callback(null, true);
    return callback(new Error('Not allowed by CORS'));
  },
  credentials: true
}));
app.use(express.json({ limit: '1mb' }));
app.use(bodyParser.json({ limit: '1mb' }));
app.use(express.urlencoded({ extended: true }));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(morgan('combined'));

app.get('/health', (req, res) => {
  res.json({ status: 'healthy', service: 'school-management-api' });
});

app.get('/api/health', (req, res) => {
  res.json({ status: 'healthy', service: 'school-management-api' });
});

app.get('/health/db', async (req, res, next) => {
  try {
    res.json({ status: 'connected', database: await testDatabaseConnection() });
  } catch (error) {
    next(error);
  }
});

app.use('/api', routes);
app.use('/api', (req, res) => {
  res.status(404).json({ message: `API route not found: ${req.method} ${req.originalUrl}` });
});
app.use(errorHandler);

module.exports = app;
