const mongoose = require('mongoose');

const TokenSchema = new mongoose.Schema({
  address: {
    type: String,
    required: true,
    unique: true
  },
  name: {
    type: String,
  },
  symbol: {
    type: String,
  },
  proxy: {
    type: String,
  },
  owner: {
    type: String,
  },
  pausable: {
    type: Boolean
  },
  unlock: {
    type: String
  },
  devWallet: [String],
  totalSupply: {
    type: Number
  }
});

module.exports = mongoose.model('token', TokenSchema);
