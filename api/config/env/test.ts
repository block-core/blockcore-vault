'use strict';

/**
 * Expose
 */

module.exports = {
  db: process.env.MONGODB_URL || 'mongodb://blockcore-vault-db:27017/BlockcoreVaultTest',
  port: process.env.PORT || 4000,
  ws: process.env.PORT_WS || 5000,
  environment: 'TEST',
  sync: {
    limit: 2
  }
};