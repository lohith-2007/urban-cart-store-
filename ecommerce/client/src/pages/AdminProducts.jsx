import { useEffect, useState } from 'react';
import { api, inr } from '../api.js';

const blank = { name: '', description: '', price: '', image: '', category: '', stock: '' };

export default function AdminProducts() {
  const [list, setList] = useState([]);
  const [form, setForm] = useState(blank);
  const [editing, setEditing] = useState(null);
  const [error, setError] = useState('');
  const load = () => api('/products').then(setList);
  useEffect(() => { load(); }, []);
  const set = (k) => (e) => setForm({ ...form, [k]: e.target.value });

  const save = async (e) => {
    e.preventDefault(); setError('');
    const body = { ...form, price: +form.price, stock: +form.stock };
    try {
      await api(editing ? `/products/${editing}` : '/products', { method: editing ? 'PUT' : 'POST', body });
      setForm(blank); setEditing(null); load();
    } catch (err) { setError(err.message); }
  };
  const del = async (id) => { if (confirm('Delete this product?')) { await api(`/products/${id}`, { method: 'DELETE' }); load(); } };

  return (
    <div className="narrow">
      <h1>Manage products</h1>
      <form className="form" onSubmit={save}>
        <label>Name<input required value={form.name} onChange={set('name')} /></label>
        <label>Description<input value={form.description} onChange={set('description')} /></label>
        <label>Category<input value={form.category} onChange={set('category')} /></label>
        <label>Image URL<input value={form.image} onChange={set('image')} /></label>
        <div className="row">
          <label>Price (₹)<input type="number" min="0" required value={form.price} onChange={set('price')} /></label>
          <label>Stock<input type="number" min="0" required value={form.stock} onChange={set('stock')} /></label>
        </div>
        {error && <p className="error">{error}</p>}
        <button>{editing ? 'Save changes' : 'Add product'}</button>
      </form>
      {list.map((p) => (
        <div key={p._id} className="row order">
          <span>{p.name} · {inr(p.price)} · {p.stock} left</span>
          <span><button className="link" onClick={() => { setEditing(p._id); setForm(p); window.scrollTo(0, 0); }}>Edit</button>
            <button className="link" onClick={() => del(p._id)}>Delete</button></span>
        </div>
      ))}
    </div>
  );
}
