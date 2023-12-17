
const mongoose = require('mongoose');

const transactionSchema = new mongoose.Schema({
    hash: String,
    time: Number,
    amount: Number,
    amountUSD: Number
});

const ransomwareSchema = new mongoose.Schema({
    address: String,
    balance: Number,
    blockchain: String,
    createdAt: Date,
    transactions: [transactionSchema],
    updatedAt: Date,
    family: String,
    balanceUSD: Number
});


module.exports = mongoose.model('Ransomware', ransomwareSchema);