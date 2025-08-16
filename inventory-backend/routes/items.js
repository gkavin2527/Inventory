const express = require("express");
const router = express.Router();
const Item = require("../models/Item");

// Create
router.post("/", async (req, res) => {
  try {
    const doc = await Item.create(req.body);
    res.json(doc);
  } catch (e) {
    res.status(400).json({ error: e.message });
  }
});

// Read all
router.get("/", async (_req, res) => {
  const docs = await Item.find().sort({ createdAt: -1 });
  res.json(docs);
});

// Read one by id
router.get("/:id", async (req, res) => {
  try {
    const doc = await Item.findById(req.params.id);
    if (!doc) return res.status(404).json({ error: "Not found" });
    res.json(doc);
  } catch {
    res.status(400).json({ error: "Invalid id" });
  }
});

// Update (partial)
router.put("/:id", async (req, res) => {
  try {
    const doc = await Item.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!doc) return res.status(404).json({ error: "Not found" });
    res.json(doc);
  } catch (e) {
    res.status(400).json({ error: e.message });
  }
});

// Delete
router.delete("/:id", async (req, res) => {
  try {
    const doc = await Item.findByIdAndDelete(req.params.id);
    if (!doc) return res.status(404).json({ error: "Not found" });
    res.json({ ok: true });
  } catch {
    res.status(400).json({ error: "Invalid id" });
  }
});

module.exports = router;
