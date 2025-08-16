// models/Item.js
const mongoose = require('mongoose');

const ItemSchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true, trim: true },
  category: { type: String, enum: ['GROCERY','BEVERAGE','HOUSEHOLD','PERSONAL_CARE','OTHER'], default: 'OTHER' },
  minThreshold: { type: Number, default: 5 },
  quantity: { type: Number, default: 0 },
  perishable: { type: Boolean, default: false },
  expiryDate: { type: Date, default: null }
}, { timestamps: true });

module.exports = mongoose.model('Item', ItemSchema);
