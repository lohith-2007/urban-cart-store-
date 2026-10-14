import { useState } from 'react';
import { useNavigate, Navigate } from 'react-router-dom';
import { api, inr } from '../api.js';
import { useAuth } from '../context/AuthContext.jsx';
import { useCart } from '../context/CartContext.jsx';

const loadRazorpay = () => new Promise((resolve) => {
  if (window.Razorpay) return resolve(true);
  const s = document.createElement('script');
  s.src = 'https://checkout.razorpay.com/v1/checkout.js';
  s.onload = () => resolve(true);
  s.onerror = () => resolve(false);
  document.body.appendChild(s);
});

export default function Checkout() {
  const { items, total, clear } = useCart();
  const { user } = useAuth();
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);
  const nav = useNavigate();
  if (!items.length) return <Navigate to="/cart" replace />;

  const pay = async () => {
    setError(''); setBusy(true);
    try {
      if (!(await loadRazorpay())) throw new Error('Could not load the payment window. Check your connection.');
      const o = await api('/payment/create-order', { method: 'POST', body: { items: items.map((i) => ({ productId: i.product._id, qty: i.qty })) } });
      new window.Razorpay({
        key: o.key, amount: o.amount, currency: 'INR', order_id: o.razorpayOrderId, name: 'Urban Cart',
        prefill: { name: user.name, email: user.email },
        handler: async (resp) => {
          try {
            await api('/payment/verify', { method: 'POST', body: { orderId: o.orderId, ...resp } });
            clear();
            nav(`/order/${o.orderId}`);
          } catch (e) { setError(e.message); setBusy(false); }
        },
        modal: { ondismiss: () => setBusy(false) },
      }).open();
    } catch (e) { setError(e.message); setBusy(false); }
  };

  return (
    <div className="narrow">
      <h1>Checkout</h1>
      {items.map(({ product: p, qty }) => (
        <div key={p._id} className="row"><span>{p.name} × {qty}</span><span>{inr(p.price * qty)}</span></div>
      ))}
      <div className="row total"><span>Total</span><strong>{inr(total)}</strong></div>
      <p className="muted">Test mode: no real money is charged. Use Razorpay's test card or UPI details.</p>
      {error && <p className="error">{error}</p>}
      <button disabled={busy} onClick={pay}>{busy ? 'Waiting for payment…' : `Pay ${inr(total)}`}</button>
    </div>
  );
}
