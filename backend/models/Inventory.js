import mongoose from 'mongoose';

const inventorySchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    trim: true
  },
  quantity: {
    type: Number,
    required: true,
    min: 0
  },
  category: {
    type: String,
    trim: true
  },
  price: {
    type: Number,
    min: 0
  },
  minStockLevel: {
    type: Number,
    default: 0
  }
}, {
  timestamps: true
});

export default mongoose.model('Inventory', inventorySchema);

