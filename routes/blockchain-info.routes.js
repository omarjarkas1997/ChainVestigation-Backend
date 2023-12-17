const express = require('express');
const router = express.Router();
const { exec } = require('child_process');
const client = require('../bitcoinClient');
const Block = require('../models/bitcoin/bitcoin.block.model');
const Transaction = require('../models/bitcoin/bitcoin.transaction.model');


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

router.get('/get-block/:hash/get-rawtransaction/:txid', async (req, res) => {
    const txid = req.params.txid;
    const blockhash = req.params.hash;

    try {
        const transactionData = await getTransactionData(txid, blockhash);
        res.json(transactionData);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.get('/get-transaction/:txid', async (req, res) => {
    try {
        const txid = req.params.txid;
        const transaction = await client.getTransaction(txid);
        res.json(transaction);1
    } catch (err) {
        res.status(500).json({ error: err.toString() });
    }
});

router.get('/get-rawtransaction/:txid', async (req, res) => {
    try {
        const txid = req.params.txid;
        const rawTransaction = await client.getRawTransaction(txid);

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

router.get('/scanutxo/:address', async (req, res) => {
    const address = req.params.address;
    const command = `bitcoin-cli scantxoutset start '["addr(${address})"]'`;
    exec(command, (error, stdout, stderr) => {
      if (error) {
        console.error(`Error executing command: ${error.message}`);
        return res.status(500).send({ success: false, error: error.message });
      }
      if (stderr) {
        console.error(`Error in command output: ${stderr}`);
        return res.status(500).send({ success: false, error: stderr });
      }
      try {
        const result = JSON.parse(stdout);
        res.send(result);
      } catch (parseError) {
        console.error(`Error parsing JSON: ${parseError}`);
        res.status(500).send({ success: false, error: parseError.message });
      }
    });
});




// Function to save a block
async function saveBlock(blockHeight) {
    const blockHash = await client.getBlockHash(blockHeight);
    const blockData = await client.getBlock(blockHash);

    const existingBlock = await Block.findOne({ hash: blockData.hash });
    if (!existingBlock) {
        const block = new Block(blockData);
        await block.save();
    }
}

function getTransactionData(txid, blockhash) {
    return new Promise((resolve, reject) => {
        const command = `bitcoin-cli getrawtransaction "${txid}" true "${blockhash}"`;
        console.log(command);

        exec(command, (error, stdout, stderr) => {
            if (error) {
                reject(new Error(`Execution error: ${error.message}`));
                return;
            }

            if (stderr) {
                reject(new Error(`Execution stderr: ${stderr}`));
                return;
            }

            try {
                const parsedOutput = JSON.parse(stdout);
                resolve(parsedOutput);
            } catch (parseError) {
                reject(new Error(`Failed to parse bitcoin-cli output: ${parseError.message}`));
            }
        });
    });
}


async function getSaveTransaction(txid, blockhash) {
    try {
        const transactionData = await getTransactionData(txid, blockhash);

        const existingTransaction = await Transaction.findOne({ txid: transactionData.txid });
        if (!existingTransaction) {
            const newTransaction = new Transaction(transactionData);
            await newTransaction.save();
        }
    } catch (error) {
        console.error("Error in saveTransaction:", error);
    }
}

async function saveTransaction(transactionData) {
    try {
        const existingTransaction = await Transaction.findOne({ txid: transactionData.txid });
        if (!existingTransaction) {
            const newTransaction = new Transaction(transactionData);
            await newTransaction.save();
        }
    } catch (error) {
        console.error("Error in saveTransaction:", error);
        // Depending on your error handling strategy, you might want to rethrow the error or handle it here
    }
}

// Route to save a block at a specific height
router.get('/save-block/:height', async (req, res) => {
    try {
        const blockHeight = parseInt(req.params.height, 10); 
        if (isNaN(blockHeight)) {
            return res.status(400).json({ error: "Invalid block height provided." });
        }
        await saveBlock(blockHeight);
        res.status(200).json({ message: `Block at height ${blockHeight} saved successfully.` });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "An error occurred while processing your request." });
    }
});

// Route to save blocks up to a certain height
router.get('/save-blocks-up-to/:lowerBoundHeight/:upperBoundHeight', async (req, res) => {
    try {
        const upperBoundHeight = parseInt(req.params.upperBoundHeight, 10);
        const lowerBoundHeight = parseInt(req.params.lowerBoundHeight, 10);

        const startHeight = Math.max(lowerBoundHeight, upperBoundHeight - 99);

        for (let height = startHeight; height <= upperBoundHeight; height++) {
            await saveBlock(height);
        }

        res.status(200).json({ message: `Blocks up to height ${upperBoundHeight} saved successfully.` });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "An error occurred while saving the blocks." });
    }
});

router.get('/save-all-transactions-on-the-block', async (req, res) => {
    
});

router.get('/save-transactions-in-block/:hash', async (req, res) => {
    try {
        const blockHash = req.params.hash; // Corrected variable name
        let existingBlock = await Block.findOne({ hash: blockHash });

        if (!existingBlock) {
            existingBlock = await client.getBlock(blockHash);
            await saveBlock(existingBlock.height);
        }

        // Process the transactions in existingBlock
        console.log(existingBlock.tx);

        for (let transaction of existingBlock.tx) {
            const transactionData = await getSaveTransaction(transaction, blockHash); 
        }
        

        res.status(200).json({ message: `Transactions in block ${blockHash} processed successfully.` });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "An error occurred while processing the block." });
    }
});

router.get('/get-last-10-blocks/:nbrBlock', async (req, res) => {
    try {
        const nbrBlock = req.params.nbrBlock;
        const blockchainInfo = await client.getBlockchainInfo();
        let currentHash = blockchainInfo.bestblockhash;
        const blocks = [];
        for (let i = 0; i < nbrBlock; i++) {
            const block = await client.getBlock(currentHash);
            blocks.push(block);

            // Break if there's no previous block (in case the chain is shorter than 10 blocks)
            if (!block.previousblockhash) break;

            currentHash = block.previousblockhash;
        }
        res.json(blocks);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

router.get('/all-blocks', async (req, res) => {
    try {
        const blocks = await Block.find({});
        res.status(200).json(blocks);
    } catch (err) {
        console.error(err); // Log the error for debugging
        res.status(500).json({ error: "An error occurred while fetching the blocks." });
    }
});

router.get('/all-transaction', async (req, res) => {
    try {
        const transaction = await Transaction.find({});
        res.status(200).json(transaction);
    } catch (err) {
        console.error(err); // Log the error for debugging
        res.status(500).json({ error: "An error occurred while fetching the blocks." });
    }
});

router.delete('/delete-all-blocks', async (req, res) => {
    try {
        await Block.deleteMany({});
        res.status(200).json({ message: "All blocks have been deleted successfully." });
    } catch (err) {
        console.error(err); // Log the actual error
        res.status(500).json({ error: "An error occurred while deleting the blocks." });
    }
});


module.exports = router;