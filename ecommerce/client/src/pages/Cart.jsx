import { Link, useNavigate } from 'react-router-dom';
import { inr } from '../api.js';
import { useCart } from '../context/CartContext.jsx';

export default function Cart() {
  const { items, setQty, remove, total } = useCart();
  const nav = useNavigate();
  if (!items.length) return <p className="note">Your cart is empty. <Link to="/">Browse products</Link></p>;
  return (
    <div className="narrow">
      <h1>Cart</h1>
      {items.map(({ product: p, qty }) => (
        <div key={p._id} className="line">
          <img src={p.image} alt="" />
          <div className="grow"><strong>{p.name}</strong><div className="muted">{inr(p.price)} each</div></div>
          <input type="number" min="1" max={p.stock} value={qty} onChange={(e) => setQty(p._id, +e.target.value)} />
          <strong>{inr(p.price * qty)}</strong>
          <button className="link" onClick={() => remove(p._id)}>Remove</button>
        </div>
      ))}
      <div className="row total"><span>Total</span><strong>{inr(total)}</strong></div>
      <button onClick={() => nav('/checkout')}>Go to checkout</button>
    </div>
  );
                 }
        
