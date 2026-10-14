import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { api, inr } from '../api.js';
import { useCart } from '../context/CartContext.jsx';

export default function ProductDetail() {
  const { id } = useParams();
  const [p, setP] = useState(null);
  const [qty, setQty] = useState(1);
  const [error, setError] = useState('');
  const { add } = useCart();
  const nav = useNavigate();

  useEffect(() => { api(`/products/${id}`).then(setP).catch((e) => setError(e.message)); }, [id]);
  if (error) return <p className="error">{error}</p>;
  if (!p) return <p className="note">Loading…</p>;

  return (
    <div className="detail">
      <img src={p.image} alt={p.name} />
      <div>
        <h1>{p.name}</h1>
        <p className="muted">{p.category}</p>
        <p>{p.description}</p>
        <h2>{inr(p.price)}</h2>
        <p className="muted">{p.stock ? `${p.stock} in stock` : 'Sold out'}</p>
        <div className="row">
          <input type="number" min="1" max={p.stock} value={qty} onChange={(e) => setQty(Math.max(1, +e.target.value))} />
          <button disabled={!p.stock} onClick={() => { add(p, qty); nav('/cart'); }}>Add to cart</button>
        </div>
      </div>
    </div>
  );
}
