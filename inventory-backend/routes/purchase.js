const express = require('express');
const router = express.Router();
const axios = require('axios');
const Purchase = require('../models/Purchase');
const Item = require('../models/Item');

const JAVA_BASE = process.env.JAVA_BASE || 'http://localhost:8080';

// Create a new purchase
router.post('/', async (req, res) => {
  try {
    console.log('Incoming purchase payload:', JSON.stringify(req.body));

    const items = req.body.items; // expecting [{ name, quantity }] OR [{ itemId, quantity }]
    if (!items || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ error: 'No items provided for purchase' });
    }

    // Convert item names or ids to ObjectIds stored in DB
    const dbItems = await Promise.all(
      items.map(async (it, idx) => {
        if (!it) throw new Error(`Item entry at index ${idx} is invalid`);
        const qty = Number(it.quantity) || 0;
        if (qty <= 0) throw new Error(`Invalid quantity for item at index ${idx}`);

        // Prefer itemId if provided
        if (it.itemId) {
          const itemDocById = await Item.findById(it.itemId);
          if (!itemDocById) throw new Error(`Item not found by id: ${it.itemId}`);
          return { itemId: itemDocById._id, quantity: qty };
        }

        // fallback to find by name
        if (it.name) {
          const itemDoc = await Item.findOne({ name: it.name });
          if (!itemDoc) throw new Error(`Item not found: ${it.name}`);
          return { itemId: itemDoc._id, quantity: qty };
        }

        throw new Error(`Item must include either name or itemId (index ${idx})`);
      })
    );

    // Prepare payload for Java microservice (send itemId strings)
    const javaItems = dbItems.map(it => ({
      itemId: it.itemId.toString(),
      quantity: it.quantity
    }));

    // NOTE: your Spring Boot controller currently listens at /purchase/compute
    // Update this path if you change the Java controller instead.
    const javaUrl = `${JAVA_BASE}/purchase/compute`;
    let response;
    try {
      response = await axios.post(javaUrl, { items: javaItems }, { timeout: 10000 });
    } catch (javaErr) {
      console.error('Error calling Java service:', javaErr.response?.data || javaErr.message || javaErr);
      return res.status(502).json({ error: 'Failed to compute prices from Java service', detail: javaErr.response?.data || javaErr.message });
    }

    if (!response.data || !Array.isArray(response.data.items)) {
      console.error('Invalid response from Java service:', response.data);
      return res.status(502).json({ error: 'Invalid response from Java service' });
    }

    const totalPrice = response.data.items.reduce((sum, i) => sum + (Number(i.totalPrice) || 0), 0);

    // Save purchase
    const purchase = await Purchase.create({
      items: dbItems,
      totalPrice,
      notes: req.body.notes || "No notes" // ← add this
    });
    const purchasePopulated = await purchase.populate('items.itemId'); // return with item data
    return res.status(201).json(purchasePopulated);

  } catch (err) {
    console.error('Error creating purchase:', err.response?.data || err.message || err);
    // If we threw an Error due to client input, return 400
    if (err.message && /Item must include|Invalid quantity|No items provided|Item not found/.test(err.message)) {
      return res.status(400).json({ error: err.message });
    }
    return res.status(500).json({ error: err.message || 'Failed to create purchase' });
  }
});

router.get('/', async (_req, res) => {
  try {
    const purchases = await Purchase.find().populate('items.itemId');
    res.json(purchases);
  } catch (err) {
    console.error('Error fetching purchases:', err.message || err);
    res.status(500).json({ error: err.message || 'Failed to fetch purchases' });
  }
});

module.exports = router;
