import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { api, inr } from '../api.js';
import { useCart } from '../context/CartContext.jsx';

const CATS = ['', 'Electronics', 'Fashion', 'Accessories', 'Home'];

export default function Home() {
  const [products, setProducts] = useState([]);
  const [q, setQ] = useState('');
  const [category, setCategory] = useState('');
  const [error, setError] = useState('');
  const { add } = useCart();

  useEffect(() => {
    const t = setTimeout(() => {
      api(`/products?q=${encodeURIComponent(q)}&category=${category}`).then(setProducts).catch((e) => setError(e.message));
    }, 250);
    return () => clearTimeout(t);
  }, [q, category]);

  return (
    <>
      <section className="hero">
        <h1>Everyday gear,<br />delivered to you.</h1>
        <p>Electronics, fashion and home picks at fair prices.</p>
      </section>
      <div className="filters">
        <input placeholder="Search products" value={q} onChange={(e) => setQ(e.target.value)} />
        {CATS.map((c) => <button key={c} className={c === category ? 'chip on' : 'chip'} onClick={() => setCategory(c)}>{c || 'All'}</button>)}
      </div>
      {error && <p className="error">{error}</p>}
      {!error && !products.length && <p className="note">No products match. Try another search.</p>}
      <div className="grid">
        {products.map((p) => (
          <article key={p._id} className="card">
            <Link to={`/product/${p._id}`}><img src={p.image} alt={p.name} /></Link>
            <h3><Link to={`/product/${p._id}`}>{p.name}</Link></h3>
            <p className="muted">{p.category}</p>
            <div className="row"><strong>{inr(p.price)}</strong>
              <button disabled={!p.stock} onClick={() => add(p)}>{p.stock ? 'Add to cart' : 'Sold out'}</button></div>
          </article>
        ))}
      </div>
    </>
  );
}
