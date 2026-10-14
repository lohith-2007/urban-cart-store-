import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import authRoutes from './routes/auth.js';
import productRoutes from './routes/products.js';
import paymentRoutes from './routes/payment.js';
import orderRoutes from './routes/orders.js';

const app = express();
app.use(cors({ origin: process.env.CLIENT_URL }));
app.use(express.json());
app.get('/api/health', (_, res) => res.json({ ok: true }));
app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/payment', paymentRoutes);
app.use('/api/orders', orderRoutes);
app.use((err, req, res, next) => res.status(err.status || 500).json({ message: err.message || 'Server error' }));

await mongoose.connect(process.env.MONGO_URI);
app.listen(process.env.PORT || 5000, () => console.log('API running'));
