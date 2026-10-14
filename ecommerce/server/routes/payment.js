import { Router } from 'express';
import crypto from 'crypto';
import Razorpay from 'razorpay';
import Product from '../models/Product.js';
import Order from '../models/Order.js';
import { protect } from '../middleware/auth.js';

const r = Router();
const rzp = () => new Razorpay({ key_id: process.env.RAZORPAY_KEY_ID, key_secret: process.env.RAZORPAY_KEY_SECRET });

// Prices come from the database, never from the client.
r.post('/create-order', protect, async (req, res) => {
  const { items } = req.body;
  if (!Array.isArray(items) || !items.length) return res.status(400).json({ message: 'Cart is empty' });
  const lines = [];
  for (const { productId, qty } of items) {
    const p = await Product.findById(productId).catch(() => null);
    if (!p || !(qty >= 1) || p.stock < qty) return res.status(400).json({ message: `${p?.name || 'An item'} is out of stock` });
    lines.push({ product: p._id, name: p.name, price: p.price, qty });
  }
  const total = lines.reduce((s, l) => s + l.price * l.qty, 0);
  const rzpOrder = await rzp().orders.create({ amount: Math.round(total * 100), currency: 'INR' });
  const order = await Order.create({ user: req.user._id, items: lines, totalAmount: total, razorpayOrderId: rzpOrder.id });
  res.json({ orderId: order._id, razorpayOrderId: rzpOrder.id, amount: rzpOrder.amount, key: process.env.RAZORPAY_KEY_ID });
});

r.post('/verify', protect, async (req, res) => {
  const { orderId, razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;
  const order = await Order.findOne({ _id: orderId, user: req.user._id, razorpayOrderId: razorpay_order_id });
  if (!order) return res.status(404).json({ message: 'Order not found' });
  const expected = crypto.createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
    .update(`${razorpay_order_id}|${razorpay_payment_id}`).digest('hex');
  if (expected !== razorpay_signature) {
    order.paymentStatus = 'failed';
    await order.save();
    return res.status(400).json({ message: 'Payment could not be verified' });
  }
  if (order.paymentStatus !== 'paid') {
    order.paymentStatus = 'paid';
    order.paymentId = razorpay_payment_id;
    await order.save();
    for (const i of order.items) await Product.updateOne({ _id: i.product }, { $inc: { stock: -i.qty } });
  }
  res.json(order);
});
export default r;
