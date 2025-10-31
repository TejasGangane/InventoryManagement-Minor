import mongoose from 'mongoose';
import User from '../models/User.js';
import dotenv from 'dotenv';

dotenv.config();

const checkUsers = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/inventory-management');
    console.log('Connected to MongoDB');

    const users = await User.find().select('username role');
    console.log('\nUsers in database:');
    users.forEach(user => {
      console.log(`  - ${user.username} (${user.role})`);
    });

    if (users.length === 0) {
      console.log('\nNo users found. Creating initial users...');
      const admin = new User({
        username: 'admin',
        password: 'admin123',
        role: 'admin'
      });
      await admin.save();
      console.log('Admin user created');

      const staff = new User({
        username: 'staff',
        password: 'staff123',
        role: 'staff'
      });
      await staff.save();
      console.log('Staff user created');
    }

    // Test password comparison
    const admin = await User.findOne({ username: 'admin' });
    if (admin) {
      const isMatch = await admin.comparePassword('admin123');
      console.log(`\nPassword test for admin: ${isMatch ? '✓ Match' : '✗ No match'}`);
    }

    const staff = await User.findOne({ username: 'staff' });
    if (staff) {
      const isMatch = await staff.comparePassword('staff123');
      console.log(`Password test for staff: ${isMatch ? '✓ Match' : '✗ No match'}`);
    }

    process.exit(0);
  } catch (error) {
    console.error('Error:', error.message);
    if (error.message.includes('ECONNREFUSED')) {
      console.error('\nMongoDB is not running. Please start MongoDB first.');
      console.error('On macOS: brew services start mongodb-community');
      console.error('Or: mongod');
    }
    process.exit(1);
  }
};

checkUsers();

