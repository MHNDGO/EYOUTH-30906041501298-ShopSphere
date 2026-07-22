import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  async function handleLogout() {
    await logout();
    navigate('/login');
  }

  return (
    <nav className="navbar">
      <div className="container navbar-inner">
        <Link to="/" className="brand">ShopEasy</Link>
        <div className="nav-links">
          <Link to="/products">Products</Link>
          {user && <Link to="/cart">Cart</Link>}
          {user?.role === 'ADMIN' && <Link to="/admin">Admin</Link>}
          {user ? (
            <>
              <span>Hi, {user.name}</span>
              <button className="btn btn-outline" onClick={handleLogout}>Logout</button>
            </>
          ) : (
            <>
              <Link to="/login">Login</Link>
              <Link to="/register" className="btn">Sign up</Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}
