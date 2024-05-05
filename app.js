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

require('dotenv').config({ path: '../.env' });

const config = require('./config');
const fs = require('fs');
const https = require('https');
const path = require('path');
const morgan = require('morgan');
const cors = require('cors');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const app = express();

// app.use(cors({ origin: ['http://10.89.112.144:4200', 'https://d8da-130-102-13-44.ngrok-free.app'] }));


// Check if the app is running inside a Docker container
const isRunningInsideDocker = process.env.RUNNING_IN_DOCKER === 'true';

const sslKeyPath = isRunningInsideDocker 
    ? '/usr/src/app/ssl/chainvestigation-developement-key.key' 
    : path.join(__dirname, '../certs/chainvestigation-developement-key.key');

const sslCertPath = isRunningInsideDocker 
    ? '/usr/src/app/ssl/chainvestigation-development-key.crt' 
    : path.join(__dirname, '../certs/chainvestigation-development-key.crt');

const sslOptions = {
  key: fs.readFileSync(sslKeyPath),
  cert: fs.readFileSync(sslCertPath)
};


app.use(cors({
  origin: 'https://10.89.114.188:8443', // Only allow this origin
  credentials: true, // if your front-end needs to send cookies or other credentials
  methods: ['GET', 'POST', 'DELETE', 'UPDATE', 'PUT', 'PATCH']
}));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(morgan('dev'));
morgan(':method :url :status :res[content-length] - :response-time ms');
const accessLogStream = fs.createWriteStream(path.join(__dirname, 'access.log'), { flags: 'a' });


app.use(morgan('combined', { stream: accessLogStream }));

console.log(`http://${process.env.MONGO_INITDB_ROOT_USERNAME}:${process.env.MONGO_INITDB_ROOT_PASSWORD}`);

mongoose.connect(`mongodb://${process.env.MONGO_INITDB_ROOT_USERNAME}:${process.env.MONGO_INITDB_ROOT_PASSWORD}@${process.env.MONGO_HOST}:27017/blockchain-explorer`, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  authSource: "admin"  // This is often needed when connecting with username and password
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
    const response = await axios.post(`http://${process.env.EXPRESS_JS_SERVER_IP}:${process.env.EXPRESS_JS_SERVER_PORT}/`, {
      "jsonrpc": "1.0",
      "id": "nodeRequest",
      "method": "getblockchaininfo",
      "params": []
    }, {
      "headers": {
        "Content-Type": "text/plain"
      },
      "auth": {
        "username": process.env.BITCOIN_CORE_USERNAME,
        "password": process.env.BITCOIN_CORE_PASSWORD
      }
    });


    res.json(response.data.result);
  } catch (err) {
    res.status(500).json({ error: err.toString() });
  }
});

const net = require('net');
const port = process.env.EXPRESS_JS_SERVER_PORT;
const fallbackPort = 4200;

// const server = net.createServer().listen(port);

// server.on('listening', () => {
//   server.close();
//   app.listen(port, () => {
//     console.log(`Server running on http://${process.env.EXPRESS_JS_SERVER_IP}:${port}`);
//   });
// });

// server.on('error', () => {
//   app.listen(fallbackPort, () => {
//     console.log(`Server running on http://${process.env.EXPRESS_JS_SERVER_IP}:${fallbackPort}`);
//   });
// });

const httpsServer = https.createServer(sslOptions, app);

httpsServer.listen(port, () => {
  console.log(`HTTPS server running on https://${process.env.EXPRESS_JS_SERVER_IP}:${port}`);
});

httpsServer.on('error', (err) => {
  if (err.code === 'EADDRINUSE') {
    console.log(`Port ${port} is already in use, switching to fallback port ${fallbackPort}`);
    httpsServer.listen(fallbackPort);
  } else {
    console.error('Error starting HTTPS server:', err);
  }
});
