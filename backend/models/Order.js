import mongoose from 'mongoose';

const orderSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'User',
  },
  orderItems: [
    {
      name: { type: String, required: true },
      qty: { type: Number, required: true },
      image: { type: String, required: true },
      price: { type: Number, required: true },
      book: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'Book',
      },
    }
  ],
  totalPrice: {
    type: Number,
    required: true,
    default: 0.0,
  },
  paymentStatus: {
    type: String,
    enum: ['Pending', 'Completed', 'Failed'],
    default: 'Pending',
  },
  orderStatus: {
    type: String,
    enum: ['Processing', 'Shipped', 'Delivered', 'Cancelled'],
    default: 'Processing',
  },
  paidAt: {
    type: Date,
  },
  deliveredAt: {
    type: Date,
  },
}, {
  timestamps: true
});

const Order = mongoose.model('Order', orderSchema);
export default Order;
