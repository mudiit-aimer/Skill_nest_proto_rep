import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './Navbar.css';

const Navbar = () => {
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 40);
    window.addEventListener('scroll', fn);
    return () => window.removeEventListener('scroll', fn);
  }, []);

  useEffect(() => { setMenuOpen(false); }, [location]);

  const handleLogout = () => { logout(); navigate('/'); };

  return (
    <header className={`nav ${scrolled ? 'nav--scrolled' : ''}`}>
      <div className="nav__inner container-wide">
        <Link to="/" className="nav__logo">
          skillnest<span className="nav__logo-dot">.</span>
        </Link>
        <nav className={`nav__links ${menuOpen ? 'nav__links--open' : ''}`}>
          <Link to="/" className={`nav__link ${location.pathname === '/' ? 'nav__link--active' : ''}`}>home</Link>
          <Link to="/courses" className={`nav__link ${location.pathname === '/courses' ? 'nav__link--active' : ''}`}>courses</Link>
          {user && <Link to="/dashboard" className={`nav__link ${location.pathname === '/dashboard' ? 'nav__link--active' : ''}`}>dashboard</Link>}
          {user?.role === 'admin' && <Link to="/admin" className={`nav__link nav__link--gold ${location.pathname === '/admin' ? 'nav__link--active' : ''}`}>admin</Link>}
        </nav>
        <div className="nav__actions">
          {user ? (
            <>
              <div className="nav__avatar" title={user.name}>{user.name?.charAt(0).toUpperCase()}</div>
              <button className="btn btn-ghost btn-sm" onClick={handleLogout}>sign out</button>
            </>
          ) : (
            <Link to="/auth" className="btn btn-cream btn-sm">join now</Link>
          )}
          <button
            className={`nav__burger ${menuOpen ? 'nav__burger--open' : ''}`}
            onClick={() => setMenuOpen(v => !v)}
            aria-label="menu"
          >
            <span /><span /><span />
          </button>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
