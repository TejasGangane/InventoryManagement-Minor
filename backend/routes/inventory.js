import express from 'express';
import Inventory from '../models/Inventory.js';
import StockHistory from '../models/StockHistory.js';
import { authenticate, requireStaff } from '../middleware/auth.js';
import jwt from 'jsonwebtoken';

const router = express.Router();

// Get all inventory items
router.get('/', authenticate, async (req, res) => {
  try {
    const items = await Inventory.find().sort({ createdAt: -1 });
    res.json(items);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Get single inventory item
router.get('/:id', authenticate, async (req, res) => {
  try {
    const item = await Inventory.findById(req.params.id);
    if (!item) {
      return res.status(404).json({ message: 'Item not found' });
    }
    res.json(item);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Create new inventory item (staff only)
router.post('/', authenticate, requireStaff, async (req, res) => {
  try {
    const { name, description, quantity, category, price, minStockLevel } = req.body;

    if (!name || quantity === undefined) {
      return res.status(400).json({ message: 'Name and quantity are required' });
    }

    const token = req.headers.authorization?.split(' ')[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key-change-in-production');

    const item = new Inventory({
      name,
      description,
      quantity,
      category,
      price,
      minStockLevel
    });

    await item.save();

    // Create history record
    const history = new StockHistory({
      inventoryId: item._id,
      inventoryName: item.name,
      action: 'created',
      quantity: item.quantity,
      userId: decoded.userId,
      username: decoded.username
    });
    await history.save();

    res.status(201).json(item);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Update inventory item (staff only)
router.put('/:id', authenticate, requireStaff, async (req, res) => {
  try {
    const item = await Inventory.findById(req.params.id);
    if (!item) {
      return res.status(404).json({ message: 'Item not found' });
    }

    const previousQuantity = item.quantity;
    const { name, description, quantity, category, price, minStockLevel } = req.body;

    if (name) item.name = name;
    if (description !== undefined) item.description = description;
    if (quantity !== undefined) item.quantity = quantity;
    if (category !== undefined) item.category = category;
    if (price !== undefined) item.price = price;
    if (minStockLevel !== undefined) item.minStockLevel = minStockLevel;

    await item.save();

    const token = req.headers.authorization?.split(' ')[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key-change-in-production');

    // Create history record
    let action = 'updated';
    if (quantity !== undefined && quantity > previousQuantity) {
      action = 'added';
    } else if (quantity !== undefined && quantity < previousQuantity) {
      action = 'removed';
    }

    const history = new StockHistory({
      inventoryId: item._id,
      inventoryName: item.name,
      action,
      quantity: Math.abs(item.quantity - previousQuantity),
      previousQuantity,
      userId: decoded.userId,
      username: decoded.username
    });
    await history.save();

    res.json(item);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Delete inventory item (staff only)
router.delete('/:id', authenticate, requireStaff, async (req, res) => {
  try {
    const item = await Inventory.findById(req.params.id);
    if (!item) {
      return res.status(404).json({ message: 'Item not found' });
    }

    const token = req.headers.authorization?.split(' ')[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key-change-in-production');

    // Create history record
    const history = new StockHistory({
      inventoryId: item._id,
      inventoryName: item.name,
      action: 'deleted',
      quantity: item.quantity,
      userId: decoded.userId,
      username: decoded.username
    });
    await history.save();

    await Inventory.findByIdAndDelete(req.params.id);
    res.json({ message: 'Item deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Get stock history
router.get('/history/all', authenticate, async (req, res) => {
  try {
    const history = await StockHistory.find()
      .sort({ createdAt: -1 })
      .limit(100);
    res.json(history);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Get stock history for specific item
router.get('/history/:id', authenticate, async (req, res) => {
  try {
    const history = await StockHistory.find({ inventoryId: req.params.id })
      .sort({ createdAt: -1 });
    res.json(history);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

export default router;

