// models/Purchase.js
const mongoose = require('mongoose');

const PurchasedItemSchema = new mongoose.Schema({
  name: { type: String, required: true },
  quantity: { type: Number, required: true, min: 1 },
  unitPrice: { type: Number, default: 0 }
}, { _id: false });

const PurchaseSchema = new mongoose.Schema({
  items: { type: [PurchasedItemSchema], required: true },
  total: { type: Number, default: 0 },
  notes: { type: String }
}, { timestamps: true });

module.exports = mongoose.model('Purchase', PurchaseSchema);
