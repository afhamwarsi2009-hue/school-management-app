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

const corsOptions = {
  origin: [
    'https://school-management-app-w814.vercel.app',
    'https://school-management-app-w814-bb4wc3uk6-afham-s-projects.vercel.app',
    'https://school-management-app-lac.vercel.app'
  ],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'Accept']
};

app.use(cors(corsOptions));
app.options('*', cors(corsOptions));

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
    res.json({
      status: 'connected',
      database: await testDatabaseConnection()
    });
  } catch (error) {
    next(error);
  }
});

app.use('/api', routes);

app.use('/api', (req, res) => {
  res.status(404).json({
    message: `API route not found: ${req.method} ${req.originalUrl}`
  });
});

app.use(errorHandler);

app.get('/', (req, res) => {
  res.send('School Management Backend is Live 🚀');
});

module.exports = app;