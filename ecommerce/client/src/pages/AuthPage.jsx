import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';

export default function AuthPage({ mode }) {
  const isLogin = mode === 'login';
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const [error, setError] = useState('');
  const { login, register } = useAuth();
  const nav = useNavigate();
  const loc = useLocation();
  const set = (k) => (e) => setForm({ ...form, [k]: e.target.value });

  const submit = async (e) => {
    e.preventDefault();
    setError('');
    try { await (isLogin ? login(form) : register(form)); nav(loc.state?.from || '/', { replace: true }); }
    catch (err) { setError(err.message); }
  };

  return (
    <form className="narrow form" onSubmit={submit}>
      <h1>{isLogin ? 'Log in' : 'Create an account'}</h1>
      {!isLogin && <label>Name<input required value={form.name} onChange={set('name')} /></label>}
      <label>Email<input type="email" required value={form.email} onChange={set('email')} /></label>
      <label>Password<input type="password" required minLength={6} value={form.password} onChange={set('password')} /></label>
      {error && <p className="error">{error}</p>}
      <button>{isLogin ? 'Log in' : 'Sign up'}</button>
      <p className="muted">{isLogin ? <>New here? <Link to="/register">Create an account</Link></> : <>Have an account? <Link to="/login">Log in</Link></>}</p>
    </form>
  );
}
