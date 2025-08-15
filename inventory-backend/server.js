require('dotenv').config();

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const { generateShoppingList } = require("./inventoryService");

const app = express();

// Middleware

// Enable CORS for all requests
app.use(cors({
  origin: "*", // Allow all origins (change to specific URL in production)
  methods: "GET,POST,PUT,DELETE",
  allowedHeaders: "Content-Type,Authorization"
}));
app.use(express.json());

// MongoDB URI
const uri = process.env.MONGO_URI;
console.log("MongoDB URI from env:", uri);

// Connect to MongoDB
mongoose.connect(uri)
  .then(() => console.log("✅ Connected to MongoDB Atlas"))
  .catch(err => console.error("❌ MongoDB connection error:", err));

// Routes
app.get('/', (req, res) => {
  res.send('Inventory Backend is running');
});

app.post("/shopping-list", async (req, res) => {
  const stock = req.body; // { "item1": 3, "item2": 10 }
  const shoppingList = await generateShoppingList(stock);
  res.json({ shoppingList });
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
