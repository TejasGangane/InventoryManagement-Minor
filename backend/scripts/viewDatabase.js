import mongoose from 'mongoose';
import User from '../models/User.js';
import Inventory from '../models/Inventory.js';
import StockHistory from '../models/StockHistory.js';
import dotenv from 'dotenv';

dotenv.config();

const viewDatabase = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/inventory-management');
    console.log('Connected to MongoDB\n');
    console.log('='.repeat(60));
    
    // View Users
    console.log('\n USERS:');
    console.log('-'.repeat(60));
    const users = await User.find().select('username role createdAt');
    if (users.length === 0) {
      console.log('No users found.');
    } else {
      users.forEach(user => {
        console.log(`  • ${user.username} (${user.role}) - Created: ${new Date(user.createdAt).toLocaleDateString()}`);
      });
    }
    
    // View Inventory Items
    console.log('\n📦 INVENTORY ITEMS:');
    console.log('-'.repeat(60));
    const items = await Inventory.find();
    if (items.length === 0) {
      console.log('No inventory items found.');
    } else {
      items.forEach(item => {
        console.log(`  • ${item.name}`);
        console.log(`    Quantity: ${item.quantity} | Category: ${item.category || 'N/A'}`);
        console.log(`    Price: ${item.price ? '$' + item.price : 'N/A'} | Min Stock: ${item.minStockLevel || 0}`);
        console.log(`    Created: ${new Date(item.createdAt).toLocaleDateString()}`);
        console.log('');
      });
    }
    
    // View Stock History
    console.log('📜 STOCK HISTORY (Last 10 entries):');
    console.log('-'.repeat(60));
    const history = await StockHistory.find()
      .sort({ createdAt: -1 })
      .limit(10)
      .populate('inventoryId', 'name');
    
    if (history.length === 0) {
      console.log('No stock history found.');
    } else {
      history.forEach(record => {
        const date = new Date(record.createdAt).toLocaleString();
        console.log(`  • ${record.inventoryName} - ${record.action.toUpperCase()} by ${record.username}`);
        console.log(`    Quantity: ${record.quantity} | Date: ${date}`);
        console.log('');
      });
    }
    
    // Summary
    console.log('='.repeat(60));
    console.log('\n📊 SUMMARY:');
    console.log(`  Total Users: ${users.length}`);
    console.log(`  Total Inventory Items: ${items.length}`);
    const totalQuantity = items.reduce((sum, item) => sum + item.quantity, 0);
    console.log(`  Total Stock Quantity: ${totalQuantity}`);
    const historyCount = await StockHistory.countDocuments();
    console.log(`  Total History Records: ${historyCount}`);
    console.log('='.repeat(60));
    
    process.exit(0);
  } catch (error) {
    console.error('Error:', error.message);
    if (error.message.includes('ECONNREFUSED')) {
      console.error('\n❌ MongoDB is not running. Please start MongoDB first.');
      console.error('On macOS: brew services start mongodb-community');
      console.error('Or: mongod');
    }
    process.exit(1);
  }
};

viewDatabase();

