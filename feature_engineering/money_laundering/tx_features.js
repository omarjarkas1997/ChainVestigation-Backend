/** Detecting money laundering activities in blockchain transactions can be complex, 
 * but several features from the raw transaction JSON can provide useful insights 
 * when aggregated.  */

let transactions = [
    // 20230923165239
// http://localhost:4200/blockchain-info/get-block/00000000000000000357589cac19871ee79621149c2b0de9393e8e07bd0de228/get-rawtransaction/66094e52780355be9731f46243a6f48960e22bdd4ae7595a58249b5dccd202a2
{
    "in_active_chain": true,
    "txid": "66094e52780355be9731f46243a6f48960e22bdd4ae7595a58249b5dccd202a2",
    "hash": "66094e52780355be9731f46243a6f48960e22bdd4ae7595a58249b5dccd202a2",
    "version": 1,
    "size": 226,
    "vsize": 226,
    "weight": 904,
    "locktime": 430987,
    "vin": [
      {
        "txid": "59930b6ee898e3369da57e424e36bc356ab4a64c8d73cadc68bc6253e5540781",
        "vout": 1,
        "scriptSig": {
          "asm": "3045022100dafd65bdddb1202a4960a1db61a1372c277a6279d5a5ae0e180cb3abcd15b3370220201dfa3b8dcfc1846e4afde8f3a2e96c928502d321b1cf9cb0e5267599745026[ALL] 02ec86163dc2b3f94207446f4bd68e35279ef8aaf8d29aef4d25b4b29fcad36e07",
          "hex": "483045022100dafd65bdddb1202a4960a1db61a1372c277a6279d5a5ae0e180cb3abcd15b3370220201dfa3b8dcfc1846e4afde8f3a2e96c928502d321b1cf9cb0e5267599745026012102ec86163dc2b3f94207446f4bd68e35279ef8aaf8d29aef4d25b4b29fcad36e07"
        },
        "sequence": 4294967294
      }
    ],
    "vout": [
      {
        "value": 0.0793,
        "n": 0,
        "scriptPubKey": {
          "asm": "OP_DUP OP_HASH160 8d0abd6b80744d21d36ff6b40164866e3746a6ac OP_EQUALVERIFY OP_CHECKSIG",
          "desc": "addr(1Drm9GiPW5XNK5smLgztgaSxnv8iV2fmT8)#68gl3q03",
          "hex": "76a9148d0abd6b80744d21d36ff6b40164866e3746a6ac88ac",
          "address": "1Drm9GiPW5XNK5smLgztgaSxnv8iV2fmT8",
          "type": "pubkeyhash"
        }
      },
      {
        "value": 68.1529712,
        "n": 1,
        "scriptPubKey": {
          "asm": "OP_DUP OP_HASH160 382d4859302421da5c9d36d4ebf3364e64b7d867 OP_EQUALVERIFY OP_CHECKSIG",
          "desc": "addr(168362waqgAZnzw835Vrt9VYrq1PudD4me)#tmqva6mq",
          "hex": "76a914382d4859302421da5c9d36d4ebf3364e64b7d86788ac",
          "address": "168362waqgAZnzw835Vrt9VYrq1PudD4me",
          "type": "pubkeyhash"
        }
      }
    ],
    "hex": "0100000001810754e55362bc68dcca738d4ca6b46a35bc364e427ea59d36e398e86e0b9359010000006b483045022100dafd65bdddb1202a4960a1db61a1372c277a6279d5a5ae0e180cb3abcd15b3370220201dfa3b8dcfc1846e4afde8f3a2e96c928502d321b1cf9cb0e5267599745026012102ec86163dc2b3f94207446f4bd68e35279ef8aaf8d29aef4d25b4b29fcad36e07feffffff0290007900000000001976a9148d0abd6b80744d21d36ff6b40164866e3746a6ac88ac602e3996010000001976a914382d4859302421da5c9d36d4ebf3364e64b7d86788ac8b930600",
    "blockhash": "00000000000000000357589cac19871ee79621149c2b0de9393e8e07bd0de228",
    "confirmations": 24261,
    "time": 1474618289,
    "blocktime": 1474618289
  }
  ];

// 1. Average transaction value over a specific time frame
function computeAverageTransactionValue(transactions) {
    let totalValue = 0;
    transactions.forEach(tx => {
      tx.vout.forEach(vout => {
        totalValue += vout.value;
      });
    });
    return totalValue / transactions.length;
  }

// 2. Number of transactions to a particular address over a time frame
function countTransactionsToAddress(transactions, address) {
    let count = 0;
    transactions.forEach(tx => {
      tx.vout.forEach(vout => {
        if (vout.scriptPubKey.address === address) {
          count++;
        }
      });
    });
    return count;
  }


// 3. Standard deviation of transaction values to highlight unusual value spikes or drops
function computeStdDevOfTransactionValues(transactions) {
    let values = [];
    transactions.forEach(tx => {
      tx.vout.forEach(vout => {
        values.push(vout.value);
      });
    });
  
    let avg = values.reduce((a, b) => a + b, 0) / values.length;
    let sumOfSquareDiffs = values.reduce((sum, value) => {
      let diff = value - avg;
      let squareDiff = diff * diff;
      return sum + squareDiff;
    }, 0);
  
    return Math.sqrt(sumOfSquareDiffs / values.length);
  }

// 4. Total number of unique addresses transacted with over a specific period
function computeUniqueAddresses(transactions) {
    let uniqueAddresses = new Set();
    transactions.forEach(tx => {
      tx.vout.forEach(vout => {
        uniqueAddresses.add(vout.scriptPubKey.address);
      });
    });
    return uniqueAddresses.size;
  }


// 5. Frequency distribution of transaction types
function computeTransactionTypeFrequency(transactions) {
    let frequency = {};
    transactions.forEach(tx => {
      tx.vout.forEach(vout => {
        if (!frequency[vout.scriptPubKey.type]) {
          frequency[vout.scriptPubKey.type] = 1;
        } else {
          frequency[vout.scriptPubKey.type]++;
        }
      });/home/omarjarkas/Desktop/blockchain-work/blockchain-explorer/bitcoin-rest-api/feature_engineering
    });
    return frequency;
  }


// 6. Average number of inputs or outputs per transaction over a given period
function computeAverageInputsOutputs(transactions) {
    let totalInputs = 0, totalOutputs = 0;
    transactions.forEach(tx => {
      totalInputs += tx.vin.length;
      totalOutputs += tx.vout.length;
    });
    return {
      avgInputs: totalInputs / transactions.length,
      avgOutputs: totalOutputs / transactions.length
    };
  }


// Usage:
console.log("Average Transaction Value:", computeAverageTransactionValue(transactions));
console.log("Transactions to Address 1Drm9GiPW5XNK5smLgztgaSxnv8iV2fmT8:", countTransactionsToAddress(transactions, "1Drm9GiPW5XNK5smLgztgaSxnv8iV2fmT8"));
console.log("Standard Deviation of Transaction Values:", computeStdDevOfTransactionValues(transactions));
console.log("Unique Addresses:", computeUniqueAddresses(transactions));
console.log("Transaction Type Frequency:", computeTransactionTypeFrequency(transactions));
console.log("Average Inputs/Outputs:", computeAverageInputsOutputs(transactions));