// routes/purchase.js
const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const axios = require('axios');

const Item = require('../models/Item');        // your inventory model
const Purchase = require('../models/Purchase');

const JAVA_BASE = process.env.JAVA_BASE || 'http://localhost:8080';

// POST /api/purchase  -> create purchase and decrement quantities
router.post('/', async (req, res) => {
  const payload = req.body; // { items: [{name, quantity, unitPrice}], notes }
  if (!Array.isArray(payload.items) || payload.items.length === 0) {
    return res.status(400).json({ error: 'items[] required' });
  }

  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    // 1) Validate and decrement stock in Mongo (atomic)
    const updatedItems = [];
    for (const it of payload.items) {
      // find item by name (case sensitive - adjust if you prefer insensitive)
      const doc = await Item.findOne({ name: it.name }).session(session);
      if (!doc) {
        throw new Error(`Item not found: ${it.name}`);
      }
      if ((doc.quantity || 0) < it.quantity) {
        throw new Error(`Not enough stock for ${it.name}`);
      }
      // decrement
      doc.quantity = doc.quantity - it.quantity;
      await doc.save({ session });
      updatedItems.push({ name: doc.name, newQty: doc.quantity });
    }

    // 2) Save purchase record
    const total = payload.items.reduce((s, x) => s + (x.unitPrice || 0) * x.quantity, 0);
    const purchaseDoc = await Purchase.create([{
      items: payload.items,
      total,
      notes: payload.notes || ''
    }], { session });

    // 3) Commit transaction
    await session.commitTransaction();
    session.endSession();

    // 4) (Optional but recommended) Notify Java microservice to update its in-memory inventory
    // We call Java after DB commit; if Java fails, we log but do not rollback DB
    (async () => {
      try {
        for (const u of updatedItems) {
          await axios.put(
            `${JAVA_BASE}/inventory/items/${encodeURIComponent(u.name)}/quantity`,
            { quantity: u.newQty },
            { timeout: 3000 }
          );
        }
      } catch (err) {
        console.error('Warning: failed to sync purchase quantities to Java service:', err.message);
      }
    })();

    return res.status(201).json({ ok: true, purchase: purchaseDoc[0] });
  } catch (err) {
    await session.abortTransaction();
    session.endSession();
    return res.status(400).json({ error: err.message });
  }
});

// GET /api/purchase -> last purchases
router.get('/', async (_req, res) => {
  const docs = await Purchase.find().sort({ createdAt: -1 }).limit(50);
  res.json(docs);
});

module.exports = router;
