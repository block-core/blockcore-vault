'use strict';

/**
 * Expose
 */
module.exports = {
  db: process.env.MONGODB_URL || 'mongodb://localhost:27017/BlockcoreVaultDev',
  port: process.env.PORT || 3000,
  environment: 'DEV',
};