import React, { useEffect } from 'react';
import './Careers.css';

export default function Careers() {
  useEffect(() => { window.scrollTo(0, 0); }, []);
  const openings = [
    {
      title: 'Course Curator',
      type: 'Full-time',
      location: 'Remote',
      description: 'Identify, vet, and onboard exceptional instructors. Shape our curriculum.',
    },
    {
      title: 'Instructor Relations',
      type: 'Full-time',
      location: 'Remote',
      description: 'Support our instructor community. Ensure courses deliver exceptional outcomes.',
    },
    {
      title: 'Product Manager',
      type: 'Full-time',
      location: 'Remote',
      description: 'Drive product strategy. Build features that matter. Solve real problems.',
    },
    {
      title: 'Marketing Lead',
      type: 'Full-time',
      location: 'Remote',
      description: 'Tell our story. Build our brand. Reach ambitious learners worldwide.',
    },
  ];

  return (
    <main className="static-page careers-page">
      <div className="static-hero">
        <div className="container">
          <h1 className="static-title">we're hiring</h1>
          <p className="static-subtitle">join a team building the future of learning. work on problems that matter.</p>
        </div>
      </div>

      <div className="container static-body">
        <section className="static-section">
          <h2>Why Join Skillnest</h2>
          <div className="static-grid">
            <div className="static-card">
              <div className="static-card__icon">◎</div>
              <h3>Mission-Driven</h3>
              <p>We're building something that matters. Every day, you work to help ambitious learners reach new heights.</p>
            </div>
            <div className="static-card">
              <div className="static-card__icon">◈</div>
              <h3>Selective & Small</h3>
              <p>We don't hire everyone. Just exceptional people who share our values and vision.</p>
            </div>
            <div className="static-card">
              <div className="static-card__icon">◉</div>
              <h3>Full Remote</h3>
              <p>Work from anywhere. We believe in hiring the best talent, period.</p>
            </div>
            <div className="static-card">
              <div className="static-card__icon">◆</div>
              <h3>Growth</h3>
              <p>Learn from brilliant people. Grow your skills. Take on bigger challenges.</p>
            </div>
          </div>
        </section>

        <section className="static-section">
          <h2>Open Positions</h2>
          <div className="careers-grid">
            {openings.map((job, i) => (
              <div key={i} className="job-card">
                <div className="job-card__header">
                  <h3 className="job-card__title">{job.title}</h3>
                  <div className="job-card__tags">
                    <span className="tag">{job.type}</span>
                    <span className="tag">{job.location}</span>
                  </div>
                </div>
                <p className="job-card__desc">{job.description}</p>
                <button className="btn btn-cream btn-sm">view role</button>
              </div>
            ))}
          </div>
        </section>

        <section className="static-section-cta">
          <h2>Don't see your role?</h2>
          <p>We're always looking for exceptional talent. Send us your portfolio and let's talk.</p>
          <a href="mailto:careers@skillnest.com" className="btn btn-cream btn-lg">get in touch</a>
        </section>
      </div>
    </main>
  );
}
