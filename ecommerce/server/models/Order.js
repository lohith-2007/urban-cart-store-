import mongoose from 'mongoose';
const s = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  items: [{ product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' }, name: String, price: Number, qty: Number }],
  totalAmount: Number,
  paymentStatus: { type: String, enum: ['pending', 'paid', 'failed'], default: 'pending' },
  razorpayOrderId: String,
  paymentId: String,
}, { timestamps: true });
export default mongoose.model('Order', s);
