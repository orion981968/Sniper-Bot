const mongoose = require('mongoose');

const WalletSchema = new mongoose.Schema({
  address: {
    type: String,
    required: true,
  },
  token: {
    type: String,
    required: true,
  },
  amount: {
    type: Number,
    default: 0
  }
});

module.exports = mongoose.model('wallet', WalletSchema);
