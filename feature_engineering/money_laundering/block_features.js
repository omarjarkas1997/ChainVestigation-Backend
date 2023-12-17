const blocks = [ /* your JSON array of blocks */ ];


// Temporal Patterns
function computeTemporalPatterns(blocks) {
    let dailyCounts = {};

    blocks.forEach(block => {
        let date = new Date(block.time * 1000).toDateString();
        if (!dailyCounts[date]) {
            dailyCounts[date] = 0;
        }
        dailyCounts[date] += block.nTx;
    });

    console.log('Daily Transaction Counts:', dailyCounts);
}

// Address Analysis
function computeAddressAnalysis(blocks) {
    let addressCounts = {};

    blocks.forEach(block => {
        block.tx.forEach(tx => {
            if (!addressCounts[tx]) {
                addressCounts[tx] = 0;
            }
            addressCounts[tx]++;
        });
    });

    let newAddresses = Object.keys(addressCounts).length;
    console.log('New Addresses:', newAddresses);
}

// Transaction Patterns
function computeTransactionPatterns(blocks) {
    let totalTransactions = 0;

    blocks.forEach(block => {
        totalTransactions += block.nTx;
    });

    console.log('Average Transactions per Block:', totalTransactions / blocks.length);
}

// Connectedness
function computeConnectedness(blocks) {
    let addressLinks = {};

    blocks.forEach(block => {
        block.tx.forEach((tx, idx) => {
            if (idx === 0) return; // Assuming the first transaction is always a coinbase and skip it

            if (!addressLinks[tx]) {
                addressLinks[tx] = [];
            }
            block.tx.forEach(innerTx => {
                if (innerTx !== tx) {
                    addressLinks[tx].push(innerTx);
                }
            });
        });
    });

    let interconnectedAddresses = 0;
    for (let addr in addressLinks) {
        if (addressLinks[addr].length > 1) {
            interconnectedAddresses++;
        }
    }

    console.log('Interconnected Addresses:', interconnectedAddresses);
}



// Execute functions
computeTemporalPatterns(blocks);
computeAddressAnalysis(blocks);
computeTransactionPatterns(blocks);
computeConnectedness(blocks);