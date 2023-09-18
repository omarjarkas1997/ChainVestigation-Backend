const express = require('express');
const bitcoinRoutes = require('./routes/blockchain-info.routes');
const mempool = require('./routes/memory-pool.routes');
const networkinfo = require('./routes/network-info.routes');
const mininginfo = require('./routes/mining-info.routes');
const walletInfo = require('./routes/wallet-info.routes');
const rawTransactionInfo = require('./routes/raw-transaction-info.routes');
const miscelaneous = require('./routes/miscelaneous.routes');

const config = require('./config');
const fs = require('fs');
const path = require('path');
const morgan = require('morgan');

const app = express();
const port = 3000;



app.use(morgan('dev'));
morgan(':method :url :status :res[content-length] - :response-time ms');
const accessLogStream = fs.createWriteStream(path.join(__dirname, 'access.log'), { flags: 'a' });


app.use(morgan('combined', { stream: accessLogStream }));


app.use('/blockchain-info', bitcoinRoutes);

app.use('/memory-pool', mempool);

app.use('/network-info', networkinfo);

app.use('/mining-info', mininginfo);

app.use('/wallet-info', walletInfo);

app.use('/raw-transaction-info', rawTransactionInfo);

app.use('/miscelaneous', miscelaneous);

app.listen(config.app.port, () => {
  console.log(`Server running on http://${config.app.IP}:${config.app.port}`);
});
