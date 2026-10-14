import { Router } from 'express';
import Product from '../models/Product.js';
import { protect, adminOnly } from '../middleware/auth.js';

const r = Router();
r.get('/', async (req, res) => {
  const { q, category } = req.query;
  const filter = {};
  if (q) filter.name = new RegExp(q.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'i');
  if (category) filter.category = category;
  res.json(await Product.find(filter).sort('-createdAt'));
});
r.get('/:id', async (req, res) => {
  const p = await Product.findById(req.params.id).catch(() => null);
  p ? res.json(p) : res.status(404).json({ message: 'Product not found' });
});
r.post('/', protect, adminOnly, async (req, res) => res.status(201).json(await Product.create(req.body)));
r.put('/:id', protect, adminOnly, async (req, res) =>
  res.json(await Product.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true })));
r.delete('/:id', protect, adminOnly, async (req, res) => {
  await Product.findByIdAndDelete(req.params.id);
  res.json({ ok: true });
});
export default r;
