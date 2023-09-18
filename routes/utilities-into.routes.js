const express = require('express');
const router = express.Router();
const client = require('../bitcoinClient');



router.get('/validateaddress/:address', async (req, res) => {
    try {
        const address = req.params.address;
        const validationResult = await client.validateAddress(address); 
        // Assuming validateAddress returns { isvalid: true/false, ...otherData }

        if (validationResult.isvalid) {
            res.json({ isValid: true, address: address });
        } else {
            res.json({ isValid: false, address: address });
        }

    } catch (err) {
        res.status(500).json({ error: err.toString() });
    }
});


router.get('/estimatesmartfee/:blocks', async (req, res) => {
    try {
        const numOfBlocks = parseInt(req.params.blocks, 10);

        if (isNaN(numOfBlocks)) {
            return res.status(400).json({ error: "Invalid number of blocks provided." });
        }

        const feeEstimation = await client.estimateSmartFee(numOfBlocks);
        // Assuming estimateSmartFee returns { feerate: 0.00001000, ...otherData }

        if (feeEstimation && feeEstimation.feerate) {
            res.json({ estimatedFeeRate: feeEstimation.feerate });
        } else {
            res.json({ error: "Failed to estimate fee." });
        }

    } catch (err) {
        res.status(500).json({ error: err.toString() });
    }
});








module.exports = router;