# Urban Cart: MERN eCommerce store

React (Vite) + Express/Node + MongoDB (Mongoose). JWT auth, cart, Razorpay test-mode payments, order history, admin product management.

## Run locally
1. **Database:** create a free MongoDB Atlas cluster and copy its connection string.
2. **API:**
   ```
   cd server && cp .env.example .env   # fill in MONGO_URI, JWT_SECRET, Razorpay test keys
   npm install && npm run seed && npm run dev
   ```
   Seed creates 8 products and an admin: `admin@urbancart.test` / `admin123`.
3. **Client:**
   ```
   cd client && cp .env.example .env && npm install && npm run dev
   ```
4. Open http://localhost:5173.

## Razorpay test keys
Razorpay dashboard → switch to Test Mode → Account & Settings → API Keys → Generate. Use the test card or UPI details from Razorpay's docs at checkout.

## Deploy
- **API on Render:** root `server`, build `npm install`, start `npm start`. Set the env vars from `.env.example`; `CLIENT_URL` is your Vercel URL.
- **Client on Vercel/Netlify:** root `client`, build `npm run build`, output `dist`, env `VITE_API_URL=https://<your-render-app>.onrender.com/api`. Add a rewrite of all paths to `/index.html` so React Router deep links work.
- **Atlas:** allow Render's IPs (or 0.0.0.0/0 for a demo) under Network Access.

## API
Auth: `POST /api/auth/register|login`, `GET /api/auth/me`. Products: `GET /api/products[/:id]`, admin `POST|PUT|DELETE`. Payment: `POST /api/payment/create-order|verify`. Orders: `GET /api/orders/my`, `GET /api/orders/:id`.
