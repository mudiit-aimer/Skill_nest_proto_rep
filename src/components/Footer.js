import React from 'react';
import { Link } from 'react-router-dom';
import './Footer.css';

export default function Footer() {
  return (
    <footer className="footer">
      <div className="container">
        <div className="footer__inner">
          <div className="footer__brand">
            <div className="footer__logo">skillnest<span>.</span></div>
            <p className="t-body">
              a members-only learning club for the ambitious. not everyone gets in — but the ones who do, ascend fast.
            </p>
            <div className="footer__tagline">
              <span className="t-label">not everyone gets it.</span>
            </div>
          </div>
          <div className="footer__col">
            <h5 className="t-label">learn</h5>
            <Link to="/courses">all courses</Link>
            <Link to="/courses?category=Development">development</Link>
            <Link to="/courses?category=Design">design</Link>
            <Link to="/courses?category=Data+Science">data science</Link>
            <Link to="/courses?category=Business">business</Link>
          </div>
          <div className="footer__col">
            <h5 className="t-label">account</h5>
            <Link to="/auth">sign in</Link>
            <Link to="/auth">join now</Link>
            <Link to="/dashboard">dashboard</Link>
          </div>
          <div className="footer__col">
            <h5 className="t-label">company</h5>
            <Link to="/about">about</Link>
            <Link to="/about">manifesto</Link>
            <Link to="/careers">careers</Link>
            <Link to="/privacy">privacy policy</Link>
            <Link to="/terms">terms</Link>
          </div>
        </div>
        <div className="footer__bottom">
          <p>copyright © 2024 skillnest. all rights reserved.</p>
          <div className="footer__bottom-links">
            <Link to="/privacy">privacy</Link>
            <Link to="/terms">terms</Link>
            <Link to="/security">security</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
