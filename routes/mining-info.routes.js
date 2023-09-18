const express = require('express');
const router = express.Router();
const client = require('../bitcoinClient');


router.get('/get-mining-info', async (req, res) => {
    try {
        const miningInfo = await client.getMiningInfo();
        res.json(miningInfo);
    } catch (err) {
        res.status(500).json({ error: err.toString() });
    }
});



module.exports = router;