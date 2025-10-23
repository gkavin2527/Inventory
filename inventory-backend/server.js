require('dotenv').config();

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const axios = require('axios');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
const itemRoutes = require('./routes/items');
const purchaseRoutes = require('./routes/purchase');
const shoppingRoutes = require('./routes/shopping');


app.use('/api', shoppingRoutes);
app.use('/api/items', itemRoutes);
app.use('/api/purchase', purchaseRoutes);

// MongoDB connect
const MONGO_URI = process.env.MONGO_URI;
mongoose.connect(MONGO_URI)
  .then(() => console.log("✅ Connected to MongoDB"))
  .catch(err => console.error("❌ MongoDB connection error:", err));

// Health check
app.get('/', (_req, res) => res.send('Node.js Backend running'));
app.get('/check-java', async (_req, res) => {
  try {
    const r = await axios.get(`${process.env.JAVA_BASE}/inventory/check`);
    res.send(r.data);
  } catch {
    res.status(500).send('Java service not reachable');
  }
});

app.get('/check-inventory', async (_req, res) => {
  try {
    const r = await axios.get(`${process.env.JAVA_BASE}/inventory/check`);
    res.send(r.data); // "Inventory service is running!"
  } catch {
    res.status(500).send('Error connecting to Java service');
  }
});

// Expired items
const Item = require('./models/Item');
app.get('/api/expired', async (_req, res) => {
  try {
    const today = new Date();
    const expired = await Item.find({
      perishable: true,
      expiryDate: { $ne: null, $lt: today }
    }).sort({ expiryDate: 1 });
    res.json(expired);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// Shopping list
app.get('/api/shopping-list', async (req, res) => {
  try {
    const allItems = await Item.find(); // get all items
    const needed = allItems.filter(item => item.quantity <= (item.minThreshold || 10));
    res.json({ needed, items: allItems });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Start server
const PORT = process.env.PORT || 5001;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
