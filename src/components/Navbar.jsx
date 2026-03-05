import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './Navbar.css';

const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate();

  const toggleMenu = () => setMenuOpen(!menuOpen);

  return (
    <nav className="navbar">
      <Link to="/" className="navbar-brand">
        <img src="/favicon.ico" alt="Scholar Sync Logo" className="navbar-logo" />
        <span className="brand-name">Scholar Sync</span>
      </Link>

      <button className="navbar-toggle" onClick={toggleMenu}>
        <div className="bar"></div>
        <div className="bar"></div>
        <div className="bar"></div>
      </button>

      <div className={`navbar-links ${menuOpen ? 'active' : ''}`}>
        <Link to="/about" className="nav-link" onClick={toggleMenu}>
          About
        </Link>
        <button className="login-button" onClick={() => { navigate('/login'); setMenuOpen(false); }}>
          Login
        </button>
      </div>
    </nav>
  );
};

export default Navbar;