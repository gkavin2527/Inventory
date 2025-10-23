const mongoose = require('mongoose');

const ItemSchema = new mongoose.Schema({
  name: { type: String, required: true },
  category: { type: String, required: true },
  quantity: { type: Number, default: 0 },
  minThreshold: { type: Number, default: 10 }, // added
  price: { type: Number, default: 0 }, // optional if used in purchase total
  perishable: { type: Boolean, default: false },
  expiryDate: { type: Date, default: null },
});

module.exports = mongoose.model('Item', ItemSchema);
