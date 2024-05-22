const mongoose = require('mongoose');

const TransactionSchema = new mongoose.Schema({
  hash: {
    type: String,
    required: true,
    unique: true
  },
  from: {
    type: String,
  },
  to: {
    type: String,
  },
  amount: {
    type: String,
  },
  gasPrice: {
    type: String
  },
  gasLimit: {
    type: String
  },
  block: {
    type: Number
  },
  timestamp: {
    type: Number
  },
  data: {
    method: String,
    amountIn: Number,
    amountOut: Number,
    tokens: [String],
    recipient: String,
  }
});

module.exports = mongoose.model('transaction', TransactionSchema);
