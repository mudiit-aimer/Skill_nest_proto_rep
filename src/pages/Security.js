import React, { useEffect } from 'react';
import './Security.css';

export default function Security() {
  useEffect(() => { window.scrollTo(0, 0); }, []);
  return (
    <main className="static-page security-page">
      <div className="static-hero">
        <div className="container">
          <h1 className="static-title">security & compliance</h1>
          <p className="static-subtitle">we take your data security seriously. here's how we protect it.</p>
        </div>
      </div>

      <div className="container static-body">
        <section className="static-section">
          <h2>Security Measures</h2>
          <div className="static-grid">
            <div className="static-card">
              <div className="static-card__icon">◎</div>
              <h3>Encryption</h3>
              <p>All data in transit and at rest is encrypted using industry-standard protocols.</p>
            </div>
            <div className="static-card">
              <div className="static-card__icon">◈</div>
              <h3>Authentication</h3>
              <p>Multi-factor authentication available for added account security.</p>
            </div>
            <div className="static-card">
              <div className="static-card__icon">◉</div>
              <h3>Monitoring</h3>
              <p>24/7 security monitoring and threat detection systems in place.</p>
            </div>
            <div className="static-card">
              <div className="static-card__icon">◆</div>
              <h3>Compliance</h3>
              <p>We comply with GDPR, CCPA, and other data protection regulations.</p>
            </div>
          </div>
        </section>

        <section className="static-section">
          <h2>Data Protection</h2>
          <p>
            We implement comprehensive data protection measures including access controls, regular security audits, and employee training. Our infrastructure is hosted on secure, ISO 27001 certified servers.
          </p>
        </section>

        <section className="static-section">
          <h2>Incident Response</h2>
          <p>
            In the unlikely event of a security incident, we have established procedures to quickly identify, contain, and resolve any issues. We will notify affected users as required by law.
          </p>
        </section>

        <section className="static-section">
          <h2>Report a Vulnerability</h2>
          <p>
            We welcome security researchers to responsibly disclose vulnerabilities. Please contact our security team at <a href="mailto:security@skillnest.com">security@skillnest.com</a> with details about any potential vulnerabilities.
          </p>
          <p>
            We commit to acknowledging reports within 48 hours and working with researchers to verify and address issues before public disclosure.
          </p>
        </section>

        <section className="static-section">
          <h2>Security Best Practices for Users</h2>
          <ul className="static-list">
            <li>Use a strong, unique password with at least 8 characters</li>
            <li>Enable multi-factor authentication if available</li>
            <li>Never share your login credentials with anyone</li>
            <li>Log out when using shared devices</li>
            <li>Keep your browser and software up to date</li>
            <li>Be cautious of phishing emails claiming to be from Skillnest</li>
          </ul>
        </section>

        <section className="static-section">
          <h2>Contact Us</h2>
          <p>
            For security questions or concerns, please contact <a href="mailto:security@skillnest.com">security@skillnest.com</a>.
          </p>
        </section>
      </div>
    </main>
  );
}
