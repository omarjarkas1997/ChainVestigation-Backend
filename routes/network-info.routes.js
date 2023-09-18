// Assuming you have these already:
const express = require('express');
const router = express.Router();
const client = require('../bitcoinClient');

// 2. Network Info

// Information about the node's connection to the network.
router.get('/get-network-info', async (req, res) => {
    try {
        const networkInfo = await client.getNetworkInfo();
        res.json(networkInfo);
    } catch (err) {
        res.status(500).json({ error: err.toString() });
    }
});

// Data about each connected network peer.
router.get('/get-peer-info', async (req, res) => {
    try {
        const peerInfo = await client.getPeerInfo();
        res.json(peerInfo);
    } catch (err) {
        res.status(500).json({ error: err.toString() });
    }
});

// Total bandwidth usage for network traffic.
router.get('/get-net-totals', async (req, res) => {
    try {
        const netTotals = await client.getNetTotals();
        res.json(netTotals);
    } catch (err) {
        res.status(500).json({ error: err.toString() });
    }
});

// Number of connections to other nodes.
router.get('/get-connection-count', async (req, res) => {
    try {
        const connectionCount = await client.getConnectionCount();
        res.json({ connectionCount }); // Sending it as an object for clarity, adjust if needed
    } catch (err) {
        res.status(500).json({ error: err.toString() });
    }
});

module.exports = router;
