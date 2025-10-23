const mongoose = require('mongoose');

const PurchaseSchema = new mongoose.Schema({
  items: [{
    itemId: { type: mongoose.Schema.Types.ObjectId, ref: 'Item' },
    quantity: Number
  }],
  notes: { type: String, default: "N/A" },
  totalPrice: Number,
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Purchase', PurchaseSchema);
