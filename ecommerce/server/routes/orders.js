import { Router } from 'express';
import Order from '../models/Order.js';
import { protect } from '../middleware/auth.js';

const r = Router();
r.get('/my', protect, async (req, res) =>
  res.json(await Order.find({ user: req.user._id, paymentStatus: 'paid' }).sort('-createdAt')));
r.get('/:id', protect, async (req, res) => {
  const o = await Order.findById(req.params.id).catch(() => null);
  if (!o || (String(o.user) !== String(req.user._id) && req.user.role !== 'admin'))
    return res.status(404).json({ message: 'Order not found' });
  res.json(o);
});
export default r;
