import React from 'react';
import { Link } from 'react-router-dom';
import './NotFound.css';

export default function NotFound() {
  return (
    <main className="nf-page">
      <div className="nf-bg">
        <div className="nf-orb" />
        <div className="nf-grid" />
      </div>
      <div className="nf-inner container">
        <div className="nf-glyph anim-fade-up">◎</div>
        <p className="t-label anim-fade-up anim-delay-1">error 404</p>
        <h1 className="nf-headline anim-fade-up anim-delay-2">
          not everyone<br />
          <em>finds this page.</em>
        </h1>
        <p className="t-body anim-fade-up anim-delay-3" style={{ maxWidth: 380, margin: '0 auto' }}>
          the page you're looking for doesn't exist, or was never meant to be found. some things are like that.
        </p>
        <div className="nf-actions anim-fade-up anim-delay-4">
          <Link to="/" className="btn btn-cream btn-lg">go home</Link>
          <Link to="/courses" className="btn btn-ghost btn-lg">browse courses</Link>
        </div>
      </div>
    </main>
  );
}
