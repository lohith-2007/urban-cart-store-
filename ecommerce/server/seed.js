import 'dotenv/config';
import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import Product from './models/Product.js';
import User from './models/User.js';

await mongoose.connect(process.env.MONGO_URI);
await Product.deleteMany();
await Product.insertMany([
  { name: 'Wireless Earbuds', category: 'Electronics', price: 1999, stock: 50, description: 'Bluetooth 5.3, 24-hour battery with case.', image: 'https://picsum.photos/seed/wireless/600/600' },
  { name: 'Smart Watch', category: 'Electronics', price: 3499, stock: 25, description: '1.8 inch display, heart-rate and sleep tracking.', image: 'https://picsum.photos/seed/smart/600/600' },
  { name: 'Power Bank 20000mAh', category: 'Electronics', price: 1499, stock: 40, description: 'Fast charging, dual USB-C ports.', image: 'https://picsum.photos/seed/power/600/600' },
  { name: 'Cotton Hoodie', category: 'Fashion', price: 1299, stock: 35, description: 'Soft brushed cotton, relaxed fit.', image: 'https://picsum.photos/seed/cotton/600/600' },
  { name: 'Running Shoes', category: 'Fashion', price: 2799, stock: 20, description: 'Lightweight mesh, cushioned sole.', image: 'https://picsum.photos/seed/running/600/600' },
  { name: 'Canvas Backpack', category: 'Accessories', price: 1099, stock: 30, description: '25 L with padded laptop sleeve.', image: 'https://picsum.photos/seed/canvas/600/600' },
  { name: 'Steel Water Bottle', category: 'Home', price: 599, stock: 60, description: '750 ml, keeps drinks cold for 24 hours.', image: 'https://picsum.photos/seed/steel/600/600' },
  { name: 'Desk Lamp', category: 'Home', price: 899, stock: 18, description: 'Dimmable LED with USB charging port.', image: 'https://picsum.photos/seed/desk/600/600' },
]);
await User.deleteOne({ email: 'admin@urbancart.test' });
await User.create({ name: 'Admin', email: 'admin@urbancart.test', password: await bcrypt.hash('admin123', 10), role: 'admin' });
console.log('Seeded. Admin: admin@urbancart.test / admin123');
process.exit();
