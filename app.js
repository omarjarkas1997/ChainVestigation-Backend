const express = require('express');
const axios = require('axios');
const bitcoinRoutes = require('./routes/blockchain-info.routes');
const mempool = require('./routes/memory-pool.routes');
const networkinfo = require('./routes/network-info.routes');
const mininginfo = require('./routes/mining-info.routes');
const walletInfo = require('./routes/wallet-info.routes');
const rawTransactionInfo = require('./routes/raw-transaction-info.routes');
const miscelaneous = require('./routes/miscelaneous.routes');
const registeration = require('./routes/identity_managment');
const ransomware = require('./routes/ransomware.routes');

const config = require('./config');
const fs = require('fs');
const path = require('path');
const morgan = require('morgan');
const cors = require('cors');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const app = express();

app.use(cors({ origin: 'http://10.89.112.144:4200' }));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(morgan('dev'));
morgan(':method :url :status :res[content-length] - :response-time ms');
const accessLogStream = fs.createWriteStream(path.join(__dirname, 'access.log'), { flags: 'a' });


app.use(morgan('combined', { stream: accessLogStream }));

mongoose.connect('mongodb://localhost:27017/blockchain-explorer', {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).catch(error => {
  console.error("MongoDB connection error:", error);
});

mongoose.connection.on('connected', () => {
    console.log('MongoDB connected');
});

mongoose.connection.on('error', (err) => {
    console.error(`MongoDB connection error: ${err}`);
});



app.use('/blockchain-info', bitcoinRoutes);

app.use('/memory-pool', mempool);

app.use('/network-info', networkinfo);

app.use('/mining-info', mininginfo);

app.use('/wallet-info', walletInfo);

app.use('/raw-transaction-info', rawTransactionInfo);

app.use('/miscelaneous', miscelaneous);

app.use('/identity_management', registeration);

app.use('/ransomware', ransomware);


app.get('/get-blockchain-info', async (req, res) => {
  try {
    const response = await axios.post(`http://${config.bitcoinClient.host}:${port}/`, config.requestData, config.config);


    res.json(response.data.result);
  } catch (err) {
      res.status(500).json({ error: err.toString() });
  }
});

app.listen(config.app.port, () => {
  console.log(`Server running on http://${config.app.IP}:${config.app.port}`);
});

