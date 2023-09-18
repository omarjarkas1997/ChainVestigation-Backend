const express = require('express');
const router = express.Router();
const client = require('../bitcoinClient');

router.get('/get-blockchain-info', async (req, res) => {
    try {
        const blockchainInfo = await client.getBlockchainInfo();
        res.json(blockchainInfo);
    } catch (err) {
        res.status(500).json({ error: err });
    }
});

router.get('/get-block-count', async (req, res) => {
    try {
        const blockCount = await client.getBlockCount();
        res.json(blockCount);
    } catch (err) {
        res.status(500).json({ error: err });
    }
});

router.get('/get-best-block-hash', async (req, res) => {
    try {
        const bestBlockHash = await client.getBestBlockHash();
        res.json(bestBlockHash);
    } catch (err) {
        res.status(500).json({ error: err });
    }
});

router.get('/get-difficulty', async (req, res) => {
    try {
        const difficulty = await client.getDifficulty();
        res.json(difficulty);
    } catch (err) {
        res.status(500).json({ error: err });
    }   
});
router.get('/get-block-hash/:height', async (req, res) => {
    try {
        const blockHeight = parseInt(req.params.height, 10); // Convert the height string to a number
        
        if (isNaN(blockHeight)) {
            return res.status(400).json({ error: "Invalid block height provided." });
        }

        const blockHash = await client.getBlockHash(blockHeight);
        res.json({ blockHash });
    } catch (err) {
        res.status(500).json({ error: err.toString() }); // Convert the error object to a string to ensure its message gets sent
    }
});

router.get('/get-block/:hash', async (req, res) => {
    try {
        const block = await client.getBlock(req.params.hash);
        res.json(block);
    } catch (err) {
        res.status(500).json({ error: err });
    }
});

router.get('/get-block-header/:hash', async (req, res) => {
    try {
        const blockHeader = await client.getBlockHeader(req.params.hash);
        res.json(blockHeader);
    } catch (err) {
        res.status(500).json({ error: err });
    }
});

router.get('/get-transaction/:txid', async (req, res) => {
    try {
        const txid = req.params.txid;
        const transaction = await client.getTransaction(txid);
        res.json(transaction);
    } catch (err) {
        res.status(500).json({ error: err.toString() });
    }
});

router.get('/get-block/:hash/get-rawtransaction/:txid', async (req, res) => {
    try {
        const blockHash = req.params.hash;
        const txid = req.params.txid;
        console.log(req.params.hash);

        const block = await client.getBlockByHash(blockHash);  // Fetch the block using the provided hash

        if (!block) {
            return res.status(404).json({ error: 'Block or transactions not found' });
        }

        const rawTransaction = block.tx.find((tx) => tx.txid === txid);

        if (!rawTransaction) {
            return res.status(404).json({ error: 'Transaction not found' });
        }

        res.json(rawTransaction);

    } catch (err) {
        res.status(500).json({ error: err.toString() });
    }
});



router.get('/get-block-subsidy/:height', async (req, res) => {
    try {
        const blockSubsidy = await client.getBlockSubsidy(req.params.height);
        res.json(blockSubsidy);
    } catch (err) {
        res.status(500).json({ error: err });
    }
});

router.get('/get-block-chain-tips', async (req, res) => {
    try {
        const blockChainTips = await client.getBlockchainInfo();
        res.json(blockChainTips);
    } catch (err) {
        res.status(500).json({ error: err });
    }
});




module.exports = router;