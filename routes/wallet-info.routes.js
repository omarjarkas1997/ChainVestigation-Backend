const express = require('express');
const router = express.Router();
const client = require('../bitcoinClient');

router.get('/getwalletinfo', async (req, res) => {
    try {
        const walletInfo = await client.getWalletInfo();
        res.json(walletInfo);
    } catch (err) {
        res.status(500).json({ error: err.toString() });
    }
});

router.get('/listtransactions', async (req, res) => {
    try {
        const transactions = await client.listTransactions();
        res.json(transactions);
    } catch (err) {
        res.status(500).json({ error: err.toString() });
    }
});

router.get('/listunspent', async (req, res) => {
    try {
        const unspent = await client.listUnspent();
        res.json(unspent);
    } catch (err) {
        res.status(500).json({ error: err.toString() });
    }
});

router.post('/sendtoaddress', async (req, res) => {
    try {
        const { address, amount } = req.body;

        if (!address || !amount) {
            return res.status(400).json({ error: "Both address and amount are required." });
        }

        const txid = await client.sendToAddress(address, amount);
        res.json({ txid });
    } catch (err) {
        res.status(500).json({ error: err.toString() });
    }
});

module.exports = router;