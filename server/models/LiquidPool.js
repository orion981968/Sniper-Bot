const mongoose = require('mongoose');

const LiquidPoolSchema = new mongoose.Schema({
  address: {
    type: String,
    required: true,
    unique: true
  },
  token0: {
    type: String,
    required: true
  },
  token1: {
    type: String,
    required: true
  },
  name: {
    type: String,
  },
  symbol: {
    type: String,
  },
  factory: {
    type: String,
  },
  totalSupply: {
    type: Number
  }
});

module.exports = mongoose.model('liquidpool', LiquidPoolSchema);
