import mongoose from 'mongoose';

const stockHistorySchema = new mongoose.Schema({
  inventoryId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Inventory',
    required: true
  },
  inventoryName: {
    type: String,
    required: true
  },
  action: {
    type: String,
    enum: ['added', 'removed', 'updated', 'created', 'deleted'],
    required: true
  },
  quantity: {
    type: Number,
    required: true
  },
  previousQuantity: {
    type: Number
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  username: {
    type: String,
    required: true
  }
}, {
  timestamps: true
});

export default mongoose.model('StockHistory', stockHistorySchema);

