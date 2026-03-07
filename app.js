'use strict';

require('dotenv').config();

const express = require('express');
const helmet = require('helmet');
const cors = require('cors');
const compression = require('compression');
const requestLogger = require('./src/middleware/requestLogger');
const { globalLimiter } = require('./src/middleware/rateLimiter');
const { errorHandler, notFoundHandler } = require('./src/utils/errorHandler');
const routes = require('./src/routes');
const logger = require('./src/utils/logger');

const app = express();

// ─── Security & Parsing ───────────────────────────────────────────────────────
app.use(helmet());
app.use(cors({
  origin: process.env.CORS_ORIGINS ? process.env.CORS_ORIGINS.split(',') : '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Tenant-Id'],
}));
app.use(compression());
app.use(express.json({ limit: '2mb' }));
app.use(express.urlencoded({ extended: true, limit: '2mb' }));

// ─── Request Logging ─────────────────────────────────────────────────────────
app.use(requestLogger);

// ─── Global Rate Limit ───────────────────────────────────────────────────────
app.use(globalLimiter);

// ─── Routes ──────────────────────────────────────────────────────────────────
const API_PREFIX = process.env.API_PREFIX || '/api/v1';
app.use(API_PREFIX, routes);

// ─── 404 & Error Handling ─────────────────────────────────────────────────────
app.use(notFoundHandler);
app.use(errorHandler);

// ─── Unhandled Rejections & Exceptions ───────────────────────────────────────
process.on('unhandledRejection', (reason) => {
  logger.error('Unhandled rejection', { reason: reason?.message || reason });
});
process.on('uncaughtException', (err) => {
  logger.error('Uncaught exception', { error: err.message, stack: err.stack });
  process.exit(1);
});

module.exports = app;
