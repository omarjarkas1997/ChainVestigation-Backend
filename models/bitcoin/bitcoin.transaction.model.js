
const mongoose = require('mongoose');

const scriptPubKeySchema = new mongoose.Schema({
    asm: String,
    desc: String,
    hex: String,
    address: String,
    type: String
});


const voutSchema = new mongoose.Schema({
    value: mongoose.Types.Decimal128,
    n: Number,
    scriptPubKey: scriptPubKeySchema
});

const vinSchema = new mongoose.Schema({
    coinbase: String,
    txinwitness: [String],
    sequence: Number
});

const transactionSchema = new mongoose.Schema({
    in_active_chain: Boolean,
    txid: String,
    hash: String,
    version: Number,
    size: Number,
    vsize: Number,
    weight: Number,
    locktime: Number,
    vin: [vinSchema],
    vout: [voutSchema],
    hex: String,
    blockhash: String,
    confirmations: Number,
    time: Number,
    blocktime: Number
});

const Transaction = mongoose.model('Transaction', transactionSchema);

module.exports = Transaction;