import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';
import { getSampleCourseById } from '../data/sampleCourses';
import './CourseDetail.css';

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
    throw Object.assign(new Error(err.message || 'request failed'), { response: { data: err } });
  }
  return res.json();
};

export default function CourseDetail() {
  const { id } = useParams();
  const { user, refreshUser } = useAuth();
  const navigate = useNavigate();
  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [enrolling, setEnrolling] = useState(false);

  useEffect(() => {
    fetch(`/api/courses/${id}`)
      .then(res => res.ok ? res.json() : Promise.reject())
      .then(data => setCourse(data))
      .catch(() => {
        const fallbackCourse = getSampleCourseById(id);
        if (fallbackCourse) {
          setCourse(fallbackCourse);
          return;
        }
        navigate('/courses');
      })
      .finally(() => setLoading(false));
  }, [id, navigate]);

  const isEnrolled = user?.enrolledCourses?.some(
    c => (c._id || c) === id || (c._id || c).toString() === id
  );

  const handleEnroll = async () => {
    if (!user) { navigate('/auth'); return; }
    if (isEnrolled) { navigate('/dashboard'); return; }
    setEnrolling(true);
    try {
      await apiFetch(`/api/courses/${id}/enroll`, { method: 'POST' });
      await refreshUser();
      toast.success('enrolled successfully!');
    } catch (err) {
      toast.error(err.response?.data?.message || 'enrollment failed');
    } finally {
      setEnrolling(false);
    }
  };

  if (loading) return <div className="loading-page"><div className="spinner" /></div>;
  if (!course) return null;

  const stars = Math.round(course.rating || 4);

  return (
    <main className="detail-page">
      <div className="detail-hero">
        <div className="detail-hero__bg" style={{ backgroundImage: `url(${course.image})` }} />
        <div className="detail-hero__overlay" />
        <div className="container detail-hero__content">
          <Link to="/courses" className="detail-back">← back to courses</Link>
          <div className="detail-hero__tags">
            <span className="tag">{course.category}</span>
            <span className="tag">{course.level}</span>
          </div>
          <h1 className="detail-title">{course.title}</h1>
          <p className="detail-instructor">taught by <strong>{course.instructor}</strong></p>
          <div className="detail-meta-row">
            <div className="detail-rating">
              <span className="stars">{'★'.repeat(stars)}{'☆'.repeat(5 - stars)}</span>
              <span>{course.rating}</span>
              <span className="detail-enrolled-count">({course.enrolledCount?.toLocaleString()} enrolled)</span>
            </div>
            <span className="detail-sep">·</span>
            <span>⏱ {course.duration}</span>
          </div>
        </div>
      </div>

      <div className="container detail-body">
        <div className="detail-main">
          <section className="detail-section">
            <h2 className="detail-section__title">about this course</h2>
            <p className="t-body">{course.description}</p>
          </section>

          {course.tags?.length > 0 && (
            <section className="detail-section">
              <h2 className="detail-section__title">topics covered</h2>
              <div className="detail-tags">
                {course.tags.map((tag, i) => <span key={i} className="tag">{tag}</span>)}
              </div>
            </section>
          )}

          <section className="detail-section">
            <h2 className="detail-section__title">what you'll get</h2>
            <div className="detail-features">
              {[
                '✦  lifetime access to all course materials',
                '✦  certificate of completion',
                '✦  direct instructor Q&A',
                '✦  community access with fellow learners',
                '✦  mobile and desktop learning',
              ].map((item, i) => <div key={i} className="detail-feature">{item}</div>)}
            </div>
          </section>
        </div>

        <aside className="detail-sidebar">
          <div className="detail-card">
            <div className="detail-card__img-wrap">
              <img src={course.image} alt={course.title}
                onError={e => { e.target.src = 'https://images.unsplash.com/photo-1501504905252-473c47e087f8?w=600'; }} />
            </div>
            <div className="detail-card__body">
              <div className="detail-price">
                {course.price === 0
                  ? <span className="detail-price__free">Free</span>
                  : <span className="detail-price__num">₹{course.price.toLocaleString()}</span>
                }
              </div>
              <button
                className={`btn btn-lg detail-enroll-btn ${isEnrolled ? 'btn-ghost' : 'btn-cream'}`}
                onClick={handleEnroll}
                disabled={enrolling}
              >
                {enrolling ? 'enrolling…' : isEnrolled ? 'go to dashboard →' : course.price === 0 ? 'enroll for free' : 'enroll now'}
              </button>
              {!user && <p className="detail-card__note">sign in to enroll</p>}

              <div className="detail-card__stats">
                <div className="detail-card__stat">
                  <span className="detail-card__stat-label">duration</span>
                  <span>{course.duration}</span>
                </div>
                <div className="detail-card__stat">
                  <span className="detail-card__stat-label">level</span>
                  <span>{course.level}</span>
                </div>
                <div className="detail-card__stat">
                  <span className="detail-card__stat-label">students</span>
                  <span>{course.enrolledCount?.toLocaleString()}</span>
                </div>
                <div className="detail-card__stat">
                  <span className="detail-card__stat-label">rating</span>
                  <span>{course.rating} / 5</span>
                </div>
              </div>
            </div>
          </div>
        </aside>
      </div>
    </main>
  );
}
