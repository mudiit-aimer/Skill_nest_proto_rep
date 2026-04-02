import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';
import './AuthPage.css';

export default function AuthPage() {
  const [mode, setMode] = useState('login');
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { login, register } = useAuth();
  const navigate = useNavigate();

  useEffect(() => { window.scrollTo(0, 0); }, []);

  const set = key => e => setForm(f => ({ ...f, [key]: e.target.value }));

  const handleSubmit = async e => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      if (mode === 'login') {
        const user = await login(form.email, form.password);
        toast.success(`welcome back, ${user.name.split(' ')[0]}.`);
        navigate(user.role === 'admin' ? '/admin' : '/dashboard');
      } else {
        if (!form.name.trim()) { setError('name is required'); setLoading(false); return; }
        const user = await register(form.name, form.email, form.password);
        toast.success(`welcome to skillnest, ${user.name.split(' ')[0]}.`);
        navigate('/dashboard');
      }
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'something went wrong');
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="auth-page">
      <div className="auth-bg">
        <div className="auth-orb" />
        <div className="auth-grid" />
      </div>

      <div className="auth-card anim-fade-up">
        <div className="auth-card__header">
          <div className="auth-logo">skillnest<span>.</span></div>
          <h1 className="auth-title">
            {mode === 'login' ? <>welcome<br /><em>back.</em></> : <>earn your<br /><em>place.</em></>}
          </h1>
          <p className="t-body" style={{ fontSize: 13, marginTop: 8 }}>
            {mode === 'login' ? 'sign in to continue your learning journey' : 'join the club. start learning today.'}
          </p>
        </div>

        <div className="auth-tabs">
          <button
            className={`auth-tab ${mode === 'login' ? 'auth-tab--active' : ''}`}
            onClick={() => { setMode('login'); setError(''); }}>
            sign in
          </button>
          <button
            className={`auth-tab ${mode === 'register' ? 'auth-tab--active' : ''}`}
            onClick={() => { setMode('register'); setError(''); }}>
            join now
          </button>
        </div>

        <form className="auth-form" onSubmit={handleSubmit}>
          {mode === 'register' && (
            <div className="form-group">
              <label className="form-label">full name</label>
              <input type="text" className="form-input" placeholder="your name"
                value={form.name} onChange={set('name')} required />
            </div>
          )}
          <div className="form-group">
            <label className="form-label">email</label>
            <input type="email" className="form-input" placeholder="you@example.com"
              value={form.email} onChange={set('email')} required />
          </div>
          <div className="form-group">
            <label className="form-label">password</label>
            <input type="password" className="form-input"
              placeholder={mode === 'register' ? 'min. 6 characters' : '••••••••'}
              value={form.password} onChange={set('password')} required minLength={6} />
          </div>

          {error && <p className="error-text">{error}</p>}

          <button type="submit" className="btn btn-cream btn-lg auth-submit" disabled={loading}>
            {loading ? 'please wait…' : mode === 'login' ? 'sign in' : 'create account'}
          </button>
        </form>

        <div className="auth-demo">
          <p className="t-small">demo credentials</p>
          <div className="auth-demo__pills">
            <button className="auth-demo__pill"
              onClick={() => setForm({ name: '', email: 'admin@skillnest.com', password: 'admin123' })}>
              admin account
            </button>
            <button className="auth-demo__pill"
              onClick={() => setForm({ name: '', email: 'test@test.com', password: 'test123' })}>
              test user
            </button>
          </div>
        </div>
      </div>
    </main>
  );
}
