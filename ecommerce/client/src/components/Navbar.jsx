import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import { useCart } from '../context/CartContext.jsx';

export default function Navbar() {
  const { user, logout } = useAuth();
  const { count } = useCart();
  const nav = useNavigate();
  return (
    <header className="nav">
      <Link to="/" className="brand">Urban Cart</Link>
      <nav>
        {user?.role === 'admin' && <Link to="/admin">Manage products</Link>}
        {user && <Link to="/orders">My orders</Link>}
        <Link to="/cart">Cart ({count})</Link>
        {user ? <button className="link" onClick={() => { logout(); nav('/'); }}>Log out</button>
              : <><Link to="/login">Log in</Link><Link to="/register">Sign up</Link></>}
      </nav>
    </header>
  );
        }
