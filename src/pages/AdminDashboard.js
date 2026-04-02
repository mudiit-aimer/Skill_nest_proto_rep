import React, { useState, useEffect, useCallback } from 'react';
import toast from 'react-hot-toast';
import './AdminDashboard.css';

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

const TABS = ['overview', 'courses', 'users'];

const EMPTY_COURSE = {
  title: '', description: '', instructor: '', category: 'Development',
  level: 'Beginner', price: 0, duration: '', image: '', tags: '',
};

const CATEGORIES = ['Development', 'Design', 'Data Science', 'Marketing', 'Business', 'Photography', 'Music'];
const LEVELS = ['Beginner', 'Intermediate', 'Advanced'];

export default function AdminDashboard() {
  const [tab, setTab] = useState('overview');
  const [stats, setStats] = useState(null);
  const [courses, setCourses] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [courseModal, setCourseModal] = useState(false);
  const [editingCourse, setEditingCourse] = useState(null);
  const [courseForm, setCourseForm] = useState(EMPTY_COURSE);
  const [formLoading, setFormLoading] = useState(false);
  const [deleteModal, setDeleteModal] = useState(null); // { type, id, name }

  const fetchAll = useCallback(async () => {
    setLoading(true);
    try {
      const [statsData, coursesData, usersData] = await Promise.all([
        apiFetch('/api/admin/stats'),
        apiFetch('/api/admin/courses'),
        apiFetch('/api/admin/users'),
      ]);
      setStats(statsData);
      setCourses(coursesData);
      setUsers(usersData);
    } catch {
      toast.error('failed to load admin data');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchAll(); }, [fetchAll]);

  const openAdd = () => {
    setEditingCourse(null);
    setCourseForm(EMPTY_COURSE);
    setCourseModal(true);
  };

  const openEdit = course => {
    setEditingCourse(course);
    setCourseForm({
      title: course.title || '',
      description: course.description || '',
      instructor: course.instructor || '',
      category: course.category || 'Development',
      level: course.level || 'Beginner',
      price: course.price ?? 0,
      duration: course.duration || '',
      image: course.image || '',
      tags: (course.tags || []).join(', '),
    });
    setCourseModal(true);
  };

  const handleCourseSubmit = async e => {
    e.preventDefault();
    setFormLoading(true);
    const payload = {
      ...courseForm,
      price: Number(courseForm.price),
      tags: courseForm.tags.split(',').map(t => t.trim()).filter(Boolean),
    };
    try {
      if (editingCourse) {
        await apiFetch(`/api/admin/courses/${editingCourse._id}`, {
          method: 'PUT', body: JSON.stringify(payload),
        });
        toast.success('course updated.');
      } else {
        await apiFetch('/api/admin/courses', {
          method: 'POST', body: JSON.stringify(payload),
        });
        toast.success('course created.');
      }
      setCourseModal(false);
      fetchAll();
    } catch (err) {
      toast.error(err.message || 'save failed');
    } finally {
      setFormLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteModal) return;
    try {
      const endpoint = deleteModal.type === 'course'
        ? `/api/admin/courses/${deleteModal.id}`
        : `/api/admin/users/${deleteModal.id}`;
      await apiFetch(endpoint, { method: 'DELETE' });
      toast.success(`${deleteModal.type} deleted.`);
      setDeleteModal(null);
      fetchAll();
    } catch (err) {
      toast.error(err.message || 'delete failed');
    }
  };

  const toggleAdmin = async (userId, currentRole) => {
    try {
      await apiFetch(`/api/admin/users/${userId}/role`, {
        method: 'PUT',
        body: JSON.stringify({ role: currentRole === 'admin' ? 'user' : 'admin' }),
      });
      toast.success('role updated.');
      fetchAll();
    } catch (err) {
      toast.error(err.message || 'role update failed');
    }
  };

  if (loading) return <div className="loading-page"><div className="spinner" /></div>;

  return (
    <main className="admin-page">
      {/* ── TOP BAR ── */}
      <div className="admin-topbar">
        <div className="container-wide admin-topbar__inner">
          <div>
            <span className="t-label">control room</span>
            <h1 className="admin-headline">admin panel</h1>
          </div>
          <div className="admin-tabs">
            {TABS.map(t => (
              <button key={t} className={`admin-tab ${tab === t ? 'admin-tab--active' : ''}`} onClick={() => setTab(t)}>
                {t}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="container-wide admin-body">

        {/* ── OVERVIEW ── */}
        {tab === 'overview' && stats && (
          <div className="admin-overview anim-fade-up">
            <div className="admin-stats-grid">
              {[
                { label: 'total users', val: stats.totalUsers, icon: '◉' },
                { label: 'total courses', val: stats.totalCourses, icon: '◈' },
                { label: 'total enrollments', val: stats.totalEnrollments, icon: '◆' },
                { label: 'revenue', val: `₹${(stats.totalRevenue || 0).toLocaleString()}`, icon: '◎' },
              ].map((s, i) => (
                <div className="admin-stat-card" key={i}>
                  <span className="admin-stat-card__icon">{s.icon}</span>
                  <div className="admin-stat-card__val">{s.val}</div>
                  <div className="admin-stat-card__label t-label">{s.label}</div>
                </div>
              ))}
            </div>

            <div className="admin-overview-grid">
              <div className="admin-panel">
                <div className="admin-panel__header">
                  <h3 className="admin-panel__title">recent users</h3>
                </div>
                <div className="admin-table-wrap">
                  <table className="admin-table">
                    <thead>
                      <tr>
                        <th>name</th>
                        <th>email</th>
                        <th>role</th>
                        <th>enrolled</th>
                      </tr>
                    </thead>
                    <tbody>
                      {users.slice(0, 5).map(u => (
                        <tr key={u._id}>
                          <td>{u.name}</td>
                          <td className="admin-table__dim">{u.email}</td>
                          <td>
                            <span className={`admin-role-tag ${u.role === 'admin' ? 'admin-role-tag--admin' : ''}`}>
                              {u.role}
                            </span>
                          </td>
                          <td className="admin-table__dim">{u.enrolledCourses?.length || 0}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              <div className="admin-panel">
                <div className="admin-panel__header">
                  <h3 className="admin-panel__title">top courses</h3>
                </div>
                <div className="admin-table-wrap">
                  <table className="admin-table">
                    <thead>
                      <tr>
                        <th>title</th>
                        <th>enrolled</th>
                        <th>price</th>
                      </tr>
                    </thead>
                    <tbody>
                      {[...courses]
                        .sort((a, b) => (b.enrolledCount || 0) - (a.enrolledCount || 0))
                        .slice(0, 5)
                        .map(c => (
                          <tr key={c._id}>
                            <td className="admin-table__course-title">{c.title}</td>
                            <td className="admin-table__dim">{c.enrolledCount || 0}</td>
                            <td>{c.price === 0 ? <span className="admin-free">free</span> : `₹${c.price.toLocaleString()}`}</td>
                          </tr>
                        ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ── COURSES ── */}
        {tab === 'courses' && (
          <div className="admin-section anim-fade-up">
            <div className="admin-section__header">
              <div>
                <span className="t-label">catalogue</span>
                <h2 className="admin-section__title">courses <span>({courses.length})</span></h2>
              </div>
              <button className="btn btn-cream btn-sm" onClick={openAdd}>+ add course</button>
            </div>
            <div className="admin-panel">
              <div className="admin-table-wrap">
                <table className="admin-table admin-table--courses">
                  <thead>
                    <tr>
                      <th>title</th>
                      <th>category</th>
                      <th>level</th>
                      <th>price</th>
                      <th>enrolled</th>
                      <th>rating</th>
                      <th>actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {courses.map(c => (
                      <tr key={c._id}>
                        <td>
                          <div className="admin-table__course-cell">
                            {c.image && (
                              <img src={c.image} alt={c.title}
                                onError={e => { e.target.style.display = 'none'; }} />
                            )}
                            <span>{c.title}</span>
                          </div>
                        </td>
                        <td><span className="tag">{c.category}</span></td>
                        <td className="admin-table__dim">{c.level}</td>
                        <td>{c.price === 0 ? <span className="admin-free">free</span> : `₹${c.price.toLocaleString()}`}</td>
                        <td className="admin-table__dim">{c.enrolledCount || 0}</td>
                        <td>
                          <span className="admin-rating">★ {c.rating || '—'}</span>
                        </td>
                        <td>
                          <div className="admin-actions">
                            <button className="admin-action-btn" onClick={() => openEdit(c)}>edit</button>
                            <button className="admin-action-btn admin-action-btn--danger"
                              onClick={() => setDeleteModal({ type: 'course', id: c._id, name: c.title })}>
                              delete
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* ── USERS ── */}
        {tab === 'users' && (
          <div className="admin-section anim-fade-up">
            <div className="admin-section__header">
              <div>
                <span className="t-label">members</span>
                <h2 className="admin-section__title">users <span>({users.length})</span></h2>
              </div>
            </div>
            <div className="admin-panel">
              <div className="admin-table-wrap">
                <table className="admin-table admin-table--users">
                  <thead>
                    <tr>
                      <th>name</th>
                      <th>email</th>
                      <th>role</th>
                      <th>enrolled courses</th>
                      <th>actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {users.map(u => (
                      <tr key={u._id}>
                        <td>
                          <div className="admin-user-cell">
                            <div className="admin-user-avatar">{u.name?.charAt(0).toUpperCase()}</div>
                            <span>{u.name}</span>
                          </div>
                        </td>
                        <td className="admin-table__dim">{u.email}</td>
                        <td>
                          <span className={`admin-role-tag ${u.role === 'admin' ? 'admin-role-tag--admin' : ''}`}>
                            {u.role}
                          </span>
                        </td>
                        <td className="admin-table__dim">{u.enrolledCourses?.length || 0}</td>
                        <td>
                          <div className="admin-actions">
                            <button className="admin-action-btn" onClick={() => toggleAdmin(u._id, u.role)}>
                              {u.role === 'admin' ? 'revoke admin' : 'make admin'}
                            </button>
                            <button className="admin-action-btn admin-action-btn--danger"
                              onClick={() => setDeleteModal({ type: 'user', id: u._id, name: u.name })}>
                              delete
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* ── COURSE FORM MODAL ── */}
      {courseModal && (
        <div className="modal-overlay" onClick={() => setCourseModal(false)}>
          <div className="modal admin-modal" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <div>
                <p className="t-label">{editingCourse ? 'edit course' : 'new course'}</p>
                <h3 className="admin-modal-title">{editingCourse ? editingCourse.title : 'add to catalogue'}</h3>
              </div>
              <button className="modal-close" onClick={() => setCourseModal(false)}>✕</button>
            </div>
            <form onSubmit={handleCourseSubmit} className="admin-form">
              <div className="form-group">
                <label className="form-label">title</label>
                <input type="text" className="form-input" required
                  value={courseForm.title}
                  onChange={e => setCourseForm(f => ({ ...f, title: e.target.value }))} />
              </div>
              <div className="form-group">
                <label className="form-label">description</label>
                <textarea className="form-input" required rows={3}
                  value={courseForm.description}
                  onChange={e => setCourseForm(f => ({ ...f, description: e.target.value }))} />
              </div>
              <div className="admin-form__row">
                <div className="form-group">
                  <label className="form-label">instructor</label>
                  <input type="text" className="form-input" required
                    value={courseForm.instructor}
                    onChange={e => setCourseForm(f => ({ ...f, instructor: e.target.value }))} />
                </div>
                <div className="form-group">
                  <label className="form-label">duration</label>
                  <input type="text" className="form-input" placeholder="e.g. 4h 30m" required
                    value={courseForm.duration}
                    onChange={e => setCourseForm(f => ({ ...f, duration: e.target.value }))} />
                </div>
              </div>
              <div className="admin-form__row">
                <div className="form-group">
                  <label className="form-label">category</label>
                  <select className="form-input"
                    value={courseForm.category}
                    onChange={e => setCourseForm(f => ({ ...f, category: e.target.value }))}>
                    {CATEGORIES.map(c => <option key={c}>{c}</option>)}
                  </select>
                </div>
                <div className="form-group">
                  <label className="form-label">level</label>
                  <select className="form-input"
                    value={courseForm.level}
                    onChange={e => setCourseForm(f => ({ ...f, level: e.target.value }))}>
                    {LEVELS.map(l => <option key={l}>{l}</option>)}
                  </select>
                </div>
                <div className="form-group">
                  <label className="form-label">price (₹)</label>
                  <input type="number" className="form-input" min={0}
                    value={courseForm.price}
                    onChange={e => setCourseForm(f => ({ ...f, price: e.target.value }))} />
                </div>
              </div>
              <div className="form-group">
                <label className="form-label">image url</label>
                <input type="url" className="form-input" placeholder="https://…"
                  value={courseForm.image}
                  onChange={e => setCourseForm(f => ({ ...f, image: e.target.value }))} />
              </div>
              <div className="form-group">
                <label className="form-label">tags (comma separated)</label>
                <input type="text" className="form-input" placeholder="react, hooks, frontend"
                  value={courseForm.tags}
                  onChange={e => setCourseForm(f => ({ ...f, tags: e.target.value }))} />
              </div>
              <button type="submit" className="btn btn-cream" style={{ marginTop: 8 }} disabled={formLoading}>
                {formLoading ? 'saving…' : editingCourse ? 'save changes' : 'create course'}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* ── DELETE CONFIRM MODAL ── */}
      {deleteModal && (
        <div className="modal-overlay" onClick={() => setDeleteModal(null)}>
          <div className="modal admin-delete-modal" onClick={e => e.stopPropagation()}>
            <div className="admin-delete-modal__icon">◎</div>
            <h3 className="admin-modal-title">confirm delete</h3>
            <p className="t-body" style={{ marginTop: 12, textAlign: 'center' }}>
              delete <strong style={{ color: 'var(--cream)' }}>{deleteModal.name}</strong>?<br />
              this action cannot be undone.
            </p>
            <div style={{ display: 'flex', gap: 12, marginTop: 28, justifyContent: 'center' }}>
              <button className="btn btn-ghost" onClick={() => setDeleteModal(null)}>cancel</button>
              <button className="btn admin-delete-btn" onClick={handleDelete}>delete</button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
