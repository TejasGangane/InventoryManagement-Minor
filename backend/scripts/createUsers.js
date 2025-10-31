import mongoose from 'mongoose';
import User from '../models/User.js';
import dotenv from 'dotenv';

dotenv.config();

const createInitialUsers = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/inventory-management');
    console.log('Connected to MongoDB');

    // Check if users already exist
    const existingAdmin = await User.findOne({ username: 'admin' });
    const existingStaff = await User.findOne({ username: 'staff' });

    if (existingAdmin) {
      console.log('Admin user already exists');
    } else {
      const admin = new User({
        username: 'admin',
        password: 'admin123',
        role: 'admin'
      });
      await admin.save();
      console.log('Admin user created: username=admin, password=admin123');
    }

    if (existingStaff) {
      console.log('Staff user already exists');
    } else {
      const staff = new User({
        username: 'staff',
        password: 'staff123',
        role: 'staff'
      });
      await staff.save();
      console.log('Staff user created: username=staff, password=staff123');
    }

    console.log('\nInitial users setup complete!');
    console.log('You can now login with:');
    console.log('  Admin: username=admin, password=admin123');
    console.log('  Staff: username=staff, password=staff123');
    
    process.exit(0);
  } catch (error) {
    console.error('Error creating users:', error);
    process.exit(1);
  }
};

createInitialUsers();

