const express = require('express');
const router = express.Router();
const client = require('../bitcoinClient');


router.post('/create-raw-transaction', async (req, res) => {
    try {
        const { inputs, outputs } = req.body;
        
        if (!inputs || !outputs) {
            return res.status(400).json({ error: "Invalid inputs or outputs provided." });
        }

        const rawTransaction = await client.createRawTransaction(inputs, outputs);
        res.json({ rawTransaction });
    } catch (err) {
        res.status(500).json({ error: err.toString() });
    }
});


router.post('/sign-rawtransaction-with-wallet', async (req, res) => {
    try {
        const { rawTransaction } = req.body;

        if (!rawTransaction) {
            return res.status(400).json({ error: "Raw transaction data is required." });
        }

        const signedTransaction = await client.signRawTransactionWithWallet(rawTransaction);
        res.json({ signedTransaction });
    } catch (err) {
        res.status(500).json({ error: err.toString() });
    }
});

router.post('/send-raw-transaction', async (req, res) => {
    try {
        const { signedTransaction } = req.body;

        if (!signedTransaction) {
            return res.status(400).json({ error: "Signed transaction data is required." });
        }

        const txid = await client.sendRawTransaction(signedTransaction);
        res.json({ txid });
    } catch (err) {
        res.status(500).json({ error: err.toString() });
    }
});



module.exports = router;