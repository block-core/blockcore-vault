'use strict';

/**
 * Expose
 */

module.exports = {
  db: process.env.MONGODB_URL || 'mongodb://localhost:27017/BlockcoreVault',
  port: process.env.PORT || 6000,
  ws: process.env.PORT_WS || 9090,
  environment: 'PRD',
};