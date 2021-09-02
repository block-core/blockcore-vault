// const path = require('path');
// const development = require('./env/development');
// const test = require('./env/test');
// const production = require('./env/production');

// const defaults = {
//     root: path.join(__dirname, '..')
// };

// module.exports = {
//     development: Object.assign({}, development, defaults),
//     test: Object.assign({}, test, defaults),
//     production: Object.assign({}, production, defaults)
// }[process.env.NODE_ENV || 'development'];


// Default configuration.

export const config = {
    db: process.env.MONGODB_URL || 'mongodb://localhost:27017/BlockcoreVault',
    port: process.env.PORT || 3000,
    ws: process.env.PORT_WS || 9000,
    apiKey: process.env.API_KEY,
    environment: process.env.NODE_ENV,
    sync: {
        limit: 2
    }
};