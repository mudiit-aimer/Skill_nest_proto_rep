import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import './About.css';

export default function About() {
  useEffect(() => { window.scrollTo(0, 0); }, []);
  return (
    <main className="static-page about-page">
      <div className="static-hero">
        <div className="container">
          <h1 className="static-title">about skillnest</h1>
          <p className="static-subtitle">we believe the best learners deserve better — better teachers, better structure, better outcomes.</p>
        </div>
      </div>

      <div className="container static-body">
        <section className="static-section">
          <h2>Our Mission</h2>
          <p>
            Skillnest is built on selectivity. Every course is hand-picked. Every instructor is vetted. Not everyone makes it in — but the ones who do, ascend fast.
          </p>
          <p>
            We're not trying to be everything to everyone. We're building a members-only learning club for the ambitious, where quality trumps quantity and outcomes matter more than vanity metrics.
          </p>
        </section>

        <section className="static-section">
          <h2>What Sets Us Apart</h2>
          <div className="static-grid">
            <div className="static-card">
              <div className="static-card__icon">◈</div>
              <h3>Curated Content</h3>
              <p>Every course is hand-selected for quality and impact. We say no to mediocrity.</p>
            </div>
            <div className="static-card">
              <div className="static-card__icon">◉</div>
              <h3>Expert Instructors</h3>
              <p>Practitioners, not just theorists. People who actually do the work, teaching what works.</p>
            </div>
            <div className="static-card">
              <div className="static-card__icon">◆</div>
              <h3>Lifetime Access</h3>
              <p>Enroll once, learn at your own pace, access materials forever.</p>
            </div>
            <div className="static-card">
              <div className="static-card__icon">◎</div>
              <h3>Community</h3>
              <p>Join a club of driven, like-minded professionals. Real relationships, real growth.</p>
            </div>
          </div>
        </section>

        <section className="static-section">
          <h2>Our Story</h2>
          <p>
            Skillnest started because we saw a gap in the learning landscape. Course platforms are flooded with content, but quality is rare. Most "learners" don't actually learn anything useful. They enroll, watch videos, and forget it all within weeks.
          </p>
          <p>
            We decided to build differently. Start with the best instructors. Build courses that actually change how people work. Create a community where learning leads to real outcomes.
          </p>
          <p>
            Today, thousands of ambitious learners trust Skillnest to fast-track their growth. And we're just getting started.
          </p>
        </section>

        <section className="static-section-cta">
          <h2>Ready to accelerate?</h2>
          <p>Browse our collection of hand-picked courses and join a community of serious learners.</p>
          <Link to="/courses" className="btn btn-cream btn-lg">explore courses</Link>
        </section>
      </div>
    </main>
  );
}
