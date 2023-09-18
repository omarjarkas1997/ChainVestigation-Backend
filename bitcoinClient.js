const Client = require('bitcoin-core');
const config = require('./config');

const client = new Client({
  network: config.bitcoinClient.network,
  username: config.bitcoinClient.username,
  password: config.bitcoinClient.password,
  port: config.bitcoinClient.port,
});

module.exports = client;
