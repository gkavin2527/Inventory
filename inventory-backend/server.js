require('dotenv').config();

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const axios = require('axios');
const purchaseRoutes = require('./routes/purchase');
const app = express();

// ---- Middleware ----
app.use(cors({
  origin: "*",
  methods: "GET,POST,PUT,DELETE",
  allowedHeaders: "Content-Type,Authorization"
}));
app.use(express.json());
app.use('/api/purchase', purchaseRoutes);

// ---- Config ----
const JAVA_BASE = process.env.JAVA_BASE || 'http://localhost:8080';
const MONGO_URI = process.env.MONGO_URI;
console.log("MongoDB URI from env:", MONGO_URI);

// ---- DB connect ----
mongoose.connect(MONGO_URI)
  .then(() => console.log("✅ Connected to MongoDB Atlas"))
  .catch(err => console.error("❌ MongoDB connection error:", err));

// ---- Models ----
const Item = require('./models/Item');

// ---- Health / Java check ----
app.get('/', (_req, res) => res.send('Inventory Backend is running'));

app.get('/check-inventory', async (_req, res) => {
  try {
    const r = await axios.get(`${JAVA_BASE}/inventory/check`);
    res.send(r.data); // "Inventory service is running!"
  } catch {
    res.status(500).send('Error connecting to Java service');
  }
});

// ---- CRUD via Mongo (use these going forward) ----
const itemRoutes = require('./routes/items');
app.use('/api/items', itemRoutes);

// ---- Expired (computed from Mongo) ----
app.get('/api/expired', async (_req, res) => {
  try {
    const today = new Date();
    const expired = await Item.find({
      perishable: true,
      expiryDate: { $ne: null, $lt: today }
    }).sort({ expiryDate: 1 });
    res.json(expired);
  } catch (e) {
    res.status(500).json({ error: 'Failed to fetch expired items' });
  }
});

// ---- Shopping list: build stock from Mongo, ask Java to compute ----
app.get('/api/shopping-list', async (_req, res) => {
  try {
    const items = await Item.find();
    // Build { "Milk": 2, "Eggs": 10, ... }
    const stock = {};
    for (const it of items) stock[it.name] = it.quantity;

    // Java expects: { "stock": { ... } }
    const r = await axios.post(`${JAVA_BASE}/inventory/shopping-list`, { stock });
    // r.data is [ "Milk", "Bread", ... ] (items below Java's threshold)
    res.json({ needed: r.data });
  } catch (e) {
    res.status(500).json({ error: 'Failed to generate shopping list' });
  }
});

// ---- Start ----
const PORT = process.env.PORT || 5001;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
