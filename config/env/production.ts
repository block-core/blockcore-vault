'use strict';

/**
 * Expose
 */

module.exports = {
  db: process.env.MONGODB_URL || 'mongodb://localhost:27017/BlockcoreVault',
  port: process.env.PORT || 3001,
  ws: process.env.PORT_WS || 9001,
  environment: 'PRD',
  sync: {
    limit: 2
  }
};