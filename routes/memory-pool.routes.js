const express = require('express');
const router = express.Router();
const client = require('../bitcoinClient');



router.get('/get-mempool-info', async (req, res) => {
    try {
        const mempoolInfo = await client.getMempoolInfo();
        res.json(mempoolInfo);
    } catch (err) {
        res.status(500).json({ error: err });
    }
});

router.get('/get-raw-mempool', async (req, res) => {
    try {
        const rawMempool = await client.getRawMempool();
        res.json(rawMempool);
    } catch (err) {
        res.status(500).json({ error: err.toString() });
    }
});


module.exports = router;