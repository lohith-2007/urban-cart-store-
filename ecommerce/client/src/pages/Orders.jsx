import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { api, inr } from '../api.js';

export default function Orders() {
  const [orders, setOrders] = useState(null);
  useEffect(() => { api('/orders/my').then(setOrders).catch(() => setOrders([])); }, []);
  if (!orders) return <p className="note">Loading…</p>;
  if (!orders.length) return <p className="note">No orders yet. <Link to="/">Browse products</Link></p>;
  return (
    <div className="narrow">
      <h1>My orders</h1>
      {orders.map((o) => (
        <Link key={o._id} to={`/order/${o._id}`} className="row order">
          <span>{new Date(o.createdAt).toLocaleDateString('en-IN')} · {o.items.length} item(s)</span><strong>{inr(o.totalAmount)}</strong>
        </Link>
      ))}
    </div>
  );
}
