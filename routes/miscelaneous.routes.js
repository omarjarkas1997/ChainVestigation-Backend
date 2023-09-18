const express = require('express');
const router = express.Router();
const client = require('../bitcoinClient');


// Ping the network for connectivity
router.get('/ping', async (req, res) => {
    try {
        await client.ping();
        res.json({ status: "Network is reachable" });
    } catch (err) {
        res.status(500).json({ error: "Unable to reach the network: " + err.toString() });
    }
});

module.exports = router;