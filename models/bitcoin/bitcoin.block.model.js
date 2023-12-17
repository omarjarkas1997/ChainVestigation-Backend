
const mongoose = require('mongoose');


const blockSchema = new mongoose.Schema({
    hash: { type: String, required: true, unique: true },
    confirmations: { type: Number, required: true },
    height: { type: Number, required: true, index: true },
    version: { type: Number, required: true },
    versionHex: { type: String, required: true },
    merkleroot: { type: String, required: true },
    time: { type: Number, required: true },
    mediantime: { type: Number, required: true },
    nonce: { type: Number, required: true },
    bits: { type: String, required: true },
    difficulty: { type: String, required: true }, // or mongoose.Decimal128 if you need to query this field
    chainwork: { type: String, required: true },
    nTx: { type: Number, required: true },
    previousblockhash: String,
    nextblockhash: String,
    strippedsize: { type: Number, required: true },
    size: { type: Number, required: true },
    weight: { type: Number, required: true },
    tx: [{ type: String }], // Array of transaction IDs
}, { timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' } });

blockSchema.pre('save', async function (next) {
    // Custom logic or validations can go here
    next();
});

// Post-save hook to perform actions after saving the block
blockSchema.post('save', async function (doc) {
  // For example, you could emit an event that a new block has been added
  console.log(`Block with hash: ${doc.hash} has been saved.`);
});

// If needed, add instance methods for the schema
blockSchema.methods.calculateHash = function() {
  // Implement the hash calculation for the block here if necessary
};

const Block = mongoose.model('Block', blockSchema);

module.exports = Block;


