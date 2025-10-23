const express = require('express');
const router = express.Router();
const Item = require('../models/Item');

// Create item
router.post('/', async (req, res) => {
  try {
    const item = await Item.create(req.body);
    res.json(item);
  } catch (e) {
    res.status(400).json({ error: e.message });
  }
});

// Read all items
router.get('/', async (_req, res) => {
  try {
    const items = await Item.find();
    res.json(items);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// Update item
router.put('/:id', async (req, res) => {
  try {
    const item = await Item.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(item);
  } catch (e) {
    res.status(400).json({ error: e.message });
  }
});

// Delete item
router.delete('/:id', async (req, res) => {
  try {
    await Item.findByIdAndDelete(req.params.id);
    res.json({ message: 'Item deleted' });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

module.exports = router;
