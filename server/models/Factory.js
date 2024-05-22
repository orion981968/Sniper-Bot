const mongoose = require('mongoose');

const FactorySchema = new mongoose.Schema({
  factory: {
    type: String,
    required: true,
  },
  pairaddress: {
    type: String,
    required: true,
  },
  token0: {
    type: String,
    required: true,
  },
  token1: {
    type: String,
    required: true,
  },
  index: {
    type: Number
  }
});

module.exports = mongoose.model('factory', FactorySchema);
