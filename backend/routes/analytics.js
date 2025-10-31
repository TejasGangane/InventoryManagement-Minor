import express from 'express';
import Inventory from '../models/Inventory.js';
import StockHistory from '../models/StockHistory.js';
import { authenticate, requireAdmin } from '../middleware/auth.js';

const router = express.Router();

// Get analytics data (admin only)
router.get('/', authenticate, requireAdmin, async (req, res) => {
  try {
    // Total items
    const totalItems = await Inventory.countDocuments();
    
    // Total quantity
    const items = await Inventory.find();
    const totalQuantity = items.reduce((sum, item) => sum + item.quantity, 0);
    
    // Low stock items (quantity <= minStockLevel)
    const lowStockItems = items.filter(item => item.quantity <= item.minStockLevel);
    
    // Items by category
    const categoryData = {};
    items.forEach(item => {
      const category = item.category || 'Uncategorized';
      categoryData[category] = (categoryData[category] || 0) + item.quantity;
    });
    
    // Recent stock activities (last 30 days)
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    
    const recentActivities = await StockHistory.find({
      createdAt: { $gte: thirtyDaysAgo }
    }).sort({ createdAt: -1 });
    
    // Activity counts by type
    const activityCounts = {
      added: 0,
      removed: 0,
      updated: 0,
      created: 0,
      deleted: 0
    };
    
    recentActivities.forEach(activity => {
      activityCounts[activity.action] = (activityCounts[activity.action] || 0) + 1;
    });
    
    // Stock changes over time (last 7 days)
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
    
    const weeklyActivities = await StockHistory.find({
      createdAt: { $gte: sevenDaysAgo },
      action: { $in: ['added', 'removed'] }
    }).sort({ createdAt: 1 });
    
    // Group by date
    const dailyChanges = {};
    weeklyActivities.forEach(activity => {
      const date = activity.createdAt.toISOString().split('T')[0];
      if (!dailyChanges[date]) {
        dailyChanges[date] = { added: 0, removed: 0 };
      }
      if (activity.action === 'added') {
        dailyChanges[date].added += activity.quantity;
      } else {
        dailyChanges[date].removed += activity.quantity;
      }
    });
    
    res.json({
      totalItems,
      totalQuantity,
      lowStockItems: lowStockItems.length,
      lowStockItemsList: lowStockItems.map(item => ({
        id: item._id,
        name: item.name,
        quantity: item.quantity,
        minStockLevel: item.minStockLevel
      })),
      categoryData,
      activityCounts,
      dailyChanges,
      recentActivities: recentActivities.slice(0, 10)
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

export default router;

