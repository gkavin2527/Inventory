const express = require('express');
const router = express.Router();
const Item = require('../models/Item');

// Get shopping list (items below minThreshold)
router.get('/shopping-list', async (_req, res) => {
  try {
    const items = await Item.find();
    const needed = items
      .filter(item => item.quantity < (item.minThreshold || 10))
      .map(item => ({
        _id: item._id,
        name: item.name,
        quantity: item.quantity,
        minThreshold: item.minThreshold || 10
      }));
    res.json({ needed }); // frontend expects res.data.needed
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

module.exports = router;
