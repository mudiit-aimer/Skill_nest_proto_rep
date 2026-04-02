import React, { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import CourseCard from '../components/CourseCard';
import { getFeaturedSampleCourses } from '../data/sampleCourses';
import './Landing.css';

let featuredCoursesRequest = null;

const loadFeaturedCourses = () => {
  if (!featuredCoursesRequest) {
    featuredCoursesRequest = fetch('/api/courses?limit=3')
      .then(res => (res.ok ? res.json() : Promise.reject(new Error('failed to load courses'))))
      .then(data => data.courses || [])
      .catch(() => getFeaturedSampleCourses(3));
  }

  return featuredCoursesRequest;
};

const STATS = [
  { num: '50K+', label: 'learners enrolled' },
  { num: '200+', label: 'curated courses' },
  { num: '4.9', label: 'average rating' },
  { num: '98%', label: 'completion rate' },
];

const CATEGORIES = [
  { name: 'Development', icon: '⌨', desc: 'Build real products' },
  { name: 'Design', icon: '◈', desc: 'Create with intent' },
  { name: 'Data Science', icon: '◎', desc: 'Decode the world' },
  { name: 'Marketing', icon: '◐', desc: 'Grow anything' },
  { name: 'Business', icon: '◆', desc: 'Build empires' },
  { name: 'Photography', icon: '◉', desc: 'See differently' },
];

export default function Landing() {
  const [courses, setCourses] = useState([]);
  const [coursesLoaded, setCoursesLoaded] = useState(false);
  const heroRef = useRef(null);

  useEffect(() => { window.scrollTo(0, 0); }, []);

  useEffect(() => {
    let mounted = true;

    loadFeaturedCourses()
      .then(items => {
        if (mounted) setCourses(items);
      })
      .finally(() => {
        if (mounted) setCoursesLoaded(true);
      });

    return () => {
      mounted = false;
    };
  }, []);

  useEffect(() => {
    const el = heroRef.current;
    if (!el) return;
    const onMove = e => {
      const { clientX, clientY } = e;
      const { innerWidth: w, innerHeight: h } = window;
      const x = (clientX / w - 0.5) * 20;
      const y = (clientY / h - 0.5) * 20;
      el.style.setProperty('--px', `${x}px`);
      el.style.setProperty('--py', `${y}px`);
    };
    window.addEventListener('mousemove', onMove);
    return () => window.removeEventListener('mousemove', onMove);
  }, []);

  return (
    <main className="landing">

      {/* ── HERO ── */}
      <section className="hero" ref={heroRef}>
        <div className="hero__bg">
          <div className="hero__orb hero__orb--1" />
          <div className="hero__orb hero__orb--2" />
          <div className="hero__grid" />
        </div>
        <div className="hero__content container">
          <h1 className="hero__headline anim-fade-up anim-delay-1">
            <span className="t-hero">knowledge</span><br />
            <span className="t-hero-italic">worth having.</span>
          </h1>
          <p className="hero__sub anim-fade-up anim-delay-2 t-body">
            a curated club for ambitious learners. short courses and workshops,<br className="hero__br" /> taught by the best. earn your place.
          </p>
          <div className="hero__cta anim-fade-up anim-delay-3">
            <Link to="/courses" className="btn btn-cream btn-lg">explore courses</Link>
            <Link to="/auth" className="btn btn-ghost btn-lg">join for free</Link>
          </div>
          <div className="hero__scroll anim-fade-up anim-delay-4">
            <span className="t-label">scroll to discover</span>
            <div className="hero__scroll-line" />
          </div>
        </div>
      </section>

      {/* ── MARQUEE ── */}
      <div className="marquee-wrap">
        <div className="marquee">
          {['development', 'design', 'data science', 'marketing', 'photography', 'business', 'music production', 'ui/ux'].map((t, i) => (
            <React.Fragment key={i}>
              <span>{t}</span>
              <span className="marquee__dot">◆</span>
            </React.Fragment>
          ))}
          {['development', 'design', 'data science', 'marketing', 'photography', 'business', 'music production', 'ui/ux'].map((t, i) => (
            <React.Fragment key={`b${i}`}>
              <span>{t}</span>
              <span className="marquee__dot">◆</span>
            </React.Fragment>
          ))}
        </div>
      </div>

      {/* ── STATEMENT ── */}
      <section className="statement section">
        <div className="container">
          <div className="statement__inner">
            <div className="statement__left">
              <span className="t-label">the manifesto</span>
              <div className="statement__line" />
            </div>
            <div className="statement__right">
              <p className="t-display">
                we believe the best learners<br />
                <em>deserve better</em>, better teachers,<br />
                better structure, better outcomes.
              </p>
              <p className="t-body" style={{ marginTop: 24 }}>
                skillnest is built on selectivity. every course is hand-picked. every instructor is vetted. not everyone makes it in, but the ones who do ascend fast.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ── STATS ── */}
      <section className="stats section-sm">
        <div className="container">
          <div className="stats__grid">
            {STATS.map((s, i) => (
              <div className="stats__item" key={i}>
                <div className="stats__num">{s.num}</div>
                <div className="stats__label t-label">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CATEGORIES ── */}
      <section className="categories section">
        <div className="container">
          <div className="categories__header">
            <span className="t-label">disciplines</span>
            <h2 className="t-display" style={{ marginTop: 16 }}>master what<br /><em>matters.</em></h2>
          </div>
          <div className="categories__grid">
            {CATEGORIES.map((c, i) => (
              <Link to={`/courses?category=${c.name}`} className="cat-card" key={i}>
                <span className="cat-card__icon">{c.icon}</span>
                <h3 className="cat-card__name">{c.name}</h3>
                <p className="cat-card__desc t-small">{c.desc}</p>
                <span className="cat-card__arrow">→</span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ── FEATURED COURSES ── */}
      {courses.length > 0 && (
        <section className="featured section">
          <div className="container">
            <div className="featured__header">
              <div>
                <span className="t-label">handpicked</span>
                <h2 className="t-display" style={{ marginTop: 16 }}>courses worth<br /><em>your time.</em></h2>
              </div>
              <Link to="/courses" className="btn btn-ghost">view all →</Link>
            </div>
            <div className="grid-3" style={{ marginTop: 48 }}>
              {courses.map(c => <CourseCard key={c._id} course={c} />)}
            </div>
          </div>
        </section>
      )}

      {coursesLoaded && courses.length === 0 && (
        <section className="featured section">
          <div className="container">
            <div className="featured__header">
              <div>
                <span className="t-label">handpicked</span>
                <h2 className="t-display" style={{ marginTop: 16 }}>featured courses are<br /><em>loading soon.</em></h2>
              </div>
              <Link to="/courses" className="btn btn-ghost">browse catalog →</Link>
            </div>
          </div>
        </section>
      )}

      {/* ── TRUST STRIP ── */}
      <section className="trust section">
        <div className="container">
          <div className="trust__inner">
            <div className="trust__left">
              <span className="t-label">trusted by</span>
              <div className="trust__big">50,000</div>
              <p className="t-body">ambitious learners who chose quality over quantity.</p>
            </div>
            <div className="trust__items">
              {[
                { icon: '◈', title: 'curated content', desc: 'every course hand-selected for quality and impact' },
                { icon: '◉', title: 'expert instructors', desc: 'practitioners, not just theorists, teaching what works' },
                { icon: '◆', title: 'lifetime access', desc: 'enroll once, learn at your own pace, forever' },
                { icon: '◎', title: 'community', desc: 'join a club of driven, like-minded professionals' },
              ].map((item, i) => (
                <div className="trust__item" key={i}>
                  <span className="trust__icon">{item.icon}</span>
                  <div>
                    <div className="trust__item-title">{item.title}</div>
                    <div className="t-small" style={{ marginTop: 4 }}>{item.desc}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── CTA STRIP ── */}
      <section className="cta-strip section">
        <div className="container">
          <div className="cta-strip__inner">
            <div className="cta-strip__glow" />
            <span className="t-label">ready?</span>
            <h2 className="t-display" style={{ marginTop: 12 }}>
              earn your place<br />in the <em>club.</em>
            </h2>
            <p className="t-body" style={{ marginTop: 16, maxWidth: 420 }}>
              like all good things, a skillnest membership is earned. start with one course and discover what you're capable of.
            </p>
            <div style={{ display: 'flex', gap: 16, marginTop: 36, flexWrap: 'wrap' }}>
              <Link to="/auth" className="btn btn-gold btn-lg">get started. it's free</Link>
              <Link to="/courses" className="btn btn-ghost btn-lg">browse courses</Link>
            </div>
          </div>
        </div>
      </section>

    </main>
  );
}
