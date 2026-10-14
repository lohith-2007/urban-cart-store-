import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { api, inr } from '../api.js';

export default function OrderSuccess() {
  const { id } = useParams();
  const [o, setO] = useState(null);
  const [error, setError] = useState('');
  useEffect(() => { api(`/orders/${id}`).then(setO).catch((e) => setError(e.message)); }, [id]);
  if (error) return <p className="error">{error}</p>;
  if (!o) return <p className="note">Loading…</p>;
  return (
    <div className="narrow">
      <h1>{o.paymentStatus === 'paid' ? 'Order confirmed' : 'Payment not completed'}</h1>
      <p className="muted">Order {o._id} · Payment {o.paymentId || 'none'}</p>
      {o.items.map((i) => <div key={i._id} className="row"><span>{i.name} × {i.qty}</span><span>{inr(i.price * i.qty)}</span></div>)}
      <div className="row total"><span>Total paid</span><strong>{inr(o.totalAmount)}</strong></div>
      <Link to="/">Keep shopping</Link>
    </div>
  );
}
