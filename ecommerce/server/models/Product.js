import mongoose from 'mongoose';
const s = new mongoose.Schema({
  name: { type: String, required: true },
  description: String,
  price: { type: Number, required: true, min: 0 },
  image: String,
  category: String,
  stock: { type: Number, default: 0, min: 0 },
}, { timestamps: true });
export default mongoose.model('Product', s);
