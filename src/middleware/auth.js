'use strict';

const config = require('../config');
const { AppError } = require('../utils/errorHandler');
const { ERROR_CODES } = require('../utils/constants');
const logger = require('../utils/logger');

/**
 * API Key authentication middleware.
 * Expects: Authorization: Bearer <API_KEY>
 */
function authMiddleware(req, res, next) {
  const authHeader = req.headers['authorization'] || '';
  const token = authHeader.startsWith('Bearer ') ? authHeader.slice(7) : authHeader;

  if (!config.auth.apiKey) {
    if (process.env.NODE_ENV === 'production') {
      // Hard-fail: never silently allow in production without a key configured
      return next(new AppError('Server misconfiguration: API_KEY is not set', 500, ERROR_CODES.INTERNAL_ERROR));
    }
    // Dev-only passthrough with a visible warning
    logger.warn('API_KEY not set — authentication is disabled (dev mode only)');
    req.tenantId = req.headers['x-tenant-id'] || 'default';
    return next();
  }

  if (!token || token !== config.auth.apiKey) {
    return next(new AppError('Invalid or missing API key', 401, ERROR_CODES.UNAUTHORIZED));
  }

  req.tenantId = req.headers['x-tenant-id'] || 'default';
  next();
}

module.exports = authMiddleware;
