const Client = require('bitcoin-core');
require('dotenv').config({ path: '../.env' });


const isRunningInDocker = process.env.RUNNING_IN_DOCKER === 'true';
const authHeader = `Basic ${new Buffer.from(process.env.BITCOIN_CORE_USERNAME + ':' + process.env.BITCOIN_CORE_PASSWORD).toString('base64')}`;

const client = new Client({
  host: process.env.BITCOIN_CORE_HOST,
  network: process.env.BITCOIN_CORE_NETWORK,
  username: process.env.BITCOIN_CORE_USERNAME,
  password: process.env.BITCOIN_CORE_PASSWORD,
  port: process.env.BITCOIN_CORE_PORT,
  headers: {
    'Authorization': authHeader
  },
  ssl: {
    enabled: false, // Temporarily disable SSL to test connectivity without it
    strict: false
  }
});

module.exports = client;
