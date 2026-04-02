import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';
import './UserDashboard.css';

const apiFetch = async (url, options = {}) => {
  const token = localStorage.getItem('sn_token');
  const res = await fetch(url, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...options.headers,
    },
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.message || 'request failed');
  }
  return res.json();
};

export default function UserDashboard() {
  const { user, refreshUser } = useAuth();
  const [enrolledCourses, setEnrolledCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editOpen, setEditOpen] = useState(false);
  const [editForm, setEditForm] = useState({ name: '', currentPassword: '', newPassword: '' });
  const [editLoading, setEditLoading] = useState(false);

  useEffect(() => {
    const fetchEnrolled = async () => {
      try {
        const data = await apiFetch('/api/users/enrolled');
        setEnrolledCourses(data);
      } catch {
        setEnrolledCourses([]);
      } finally {
        setLoading(false);
      }
    };
    fetchEnrolled();
  }, []);

  useEffect(() => {
    if (user) setEditForm(f => ({ ...f, name: user.name || '' }));
  }, [user]);

  const handleEditSubmit = async e => {
    e.preventDefault();
    setEditLoading(true);
    try {
      await apiFetch('/api/users/profile', {
        method: 'PUT',
        body: JSON.stringify(editForm),
      });
      await refreshUser();
      toast.success('profile updated.');
      setEditOpen(false);
      setEditForm(f => ({ ...f, currentPassword: '', newPassword: '' }));
    } catch (err) {
      toast.error(err.message || 'update failed');
    } finally {
      setEditLoading(false);
    }
  };

  const initials = user?.name?.split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2);

  return (
    <main className="dash-page">
      {/* ── HEADER ── */}
      <div className="dash-header">
        <div className="dash-header__bg" />
        <div className="container dash-header__inner">
          <div className="dash-header__left">
            <span className="t-label anim-fade-up">your space</span>
            <h1 className="dash-headline anim-fade-up anim-delay-1">
              welcome back,<br />
              <em>{user?.name?.split(' ')[0]}.</em>
            </h1>
            <p className="t-body anim-fade-up anim-delay-2" style={{ marginTop: 8 }}>
              {enrolledCourses.length === 0
                ? 'your learning journey starts here.'
                : `${enrolledCourses.length} course${enrolledCourses.length !== 1 ? 's' : ''} in your collection.`}
            </p>
          </div>
          <div className="dash-header__avatar anim-fade-up anim-delay-2">
            <div className="dash-avatar">
              <span>{initials}</span>
            </div>
            <div className="dash-avatar__meta">
              <div className="dash-avatar__name">{user?.name}</div>
              <div className="dash-avatar__email">{user?.email}</div>
              <button className="dash-edit-btn" onClick={() => setEditOpen(true)}>
                edit profile →
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* ── STATS BAR ── */}
      <div className="dash-stats-bar">
        <div className="container">
          <div className="dash-stats">
            <div className="dash-stat">
              <div className="dash-stat__num">{enrolledCourses.length}</div>
              <div className="dash-stat__label t-label">enrolled</div>
            </div>
            <div className="dash-stat__div" />
            <div className="dash-stat">
              <div className="dash-stat__num">
                {enrolledCourses.filter(c => c.completed).length}
              </div>
              <div className="dash-stat__label t-label">completed</div>
            </div>
            <div className="dash-stat__div" />
            <div className="dash-stat">
              <div className="dash-stat__num">
                {enrolledCourses.reduce((sum, c) => sum + (c.xpEarned || 0), 0)}
              </div>
              <div className="dash-stat__label t-label">xp earned</div>
            </div>
            <div className="dash-stat__div" />
            <div className="dash-stat">
              <div className="dash-stat__num">{user?.role === 'admin' ? '∞' : '1'}</div>
              <div className="dash-stat__label t-label">membership tier</div>
            </div>
          </div>
        </div>
      </div>

      {/* ── COURSES ── */}
      <div className="container dash-body">
        <div className="dash-section-header">
          <div>
            <span className="t-label">your collection</span>
            <h2 className="dash-section-title">enrolled courses</h2>
          </div>
          <Link to="/courses" className="btn btn-ghost btn-sm">browse more →</Link>
        </div>

        {loading ? (
          <div className="dash-loading"><div className="spinner" /></div>
        ) : enrolledCourses.length === 0 ? (
          <div className="dash-empty">
            <div className="dash-empty__glyph">◎</div>
            <h3 className="dash-empty__title">your collection is empty.</h3>
            <p className="t-body">find a course worth your time and add it to your collection.</p>
            <Link to="/courses" className="btn btn-cream" style={{ marginTop: 28 }}>
              explore courses
            </Link>
          </div>
        ) : (
          <div className="dash-courses-grid">
            {enrolledCourses.map(course => (
              <DashCourseCard key={course._id} course={course} />
            ))}
          </div>
        )}
      </div>

      {/* ── EDIT MODAL ── */}
      {editOpen && (
        <div className="modal-overlay" onClick={() => setEditOpen(false)}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <div>
                <p className="t-label">your profile</p>
                <h3 className="dash-modal-title">edit details</h3>
              </div>
              <button className="modal-close" onClick={() => setEditOpen(false)}>✕</button>
            </div>
            <form onSubmit={handleEditSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              <div className="form-group">
                <label className="form-label">full name</label>
                <input
                  type="text" className="form-input"
                  value={editForm.name}
                  onChange={e => setEditForm(f => ({ ...f, name: e.target.value }))}
                  required
                />
              </div>
              <div className="form-group">
                <label className="form-label">current password</label>
                <input
                  type="password" className="form-input" placeholder="leave blank to keep"
                  value={editForm.currentPassword}
                  onChange={e => setEditForm(f => ({ ...f, currentPassword: e.target.value }))}
                />
              </div>
              <div className="form-group">
                <label className="form-label">new password</label>
                <input
                  type="password" className="form-input" placeholder="min. 6 characters"
                  value={editForm.newPassword}
                  onChange={e => setEditForm(f => ({ ...f, newPassword: e.target.value }))}
                  minLength={editForm.newPassword ? 6 : undefined}
                />
              </div>
              <button type="submit" className="btn btn-cream" style={{ marginTop: 8 }} disabled={editLoading}>
                {editLoading ? 'saving…' : 'save changes'}
              </button>
            </form>
          </div>
        </div>
      )}
    </main>
  );
}

function DashCourseCard({ course }) {
  const stars = Math.round(course.rating || 4);
  return (
    <Link to={`/courses/${course._id}`} className="dash-ccard">
      <div className="dash-ccard__img-wrap">
        <img
          src={course.image || 'https://images.unsplash.com/photo-1501504905252-473c47e087f8?w=600'}
          alt={course.title}
          onError={e => { e.target.src = 'https://images.unsplash.com/photo-1501504905252-473c47e087f8?w=600'; }}
        />
        <div className="dash-ccard__overlay" />
        <span className="dash-ccard__category t-label">{course.category}</span>
        <span className="dash-ccard__enrolled-badge">enrolled ✦</span>
      </div>
      <div className="dash-ccard__body">
        <h3 className="dash-ccard__title">{course.title}</h3>
        <p className="dash-ccard__instructor">by {course.instructor}</p>
        <div className="dash-ccard__footer">
          <span className="stars" style={{ fontSize: 11 }}>{'★'.repeat(stars)}{'☆'.repeat(5 - stars)}</span>
          <span className="tag">{course.level}</span>
          <span style={{ fontSize: 11, color: 'var(--cream3)' }}>⏱ {course.duration}</span>
        </div>
      </div>
    </Link>
  );
}
