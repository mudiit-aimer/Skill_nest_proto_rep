import React, { useEffect } from 'react';
import './Privacy.css';

export default function Privacy() {
  useEffect(() => { window.scrollTo(0, 0); }, []);
  return (
    <main className="static-page privacy-page">
      <div className="static-hero">
        <div className="container">
          <h1 className="static-title">privacy policy</h1>
          <p className="static-subtitle">last updated: april 2026</p>
        </div>
      </div>

      <div className="container static-body">
        <section className="static-section">
          <h2>1. Introduction</h2>
          <p>
            At Skillnest, we respect your privacy and are committed to protecting your personal data. This privacy policy explains how we collect, use, disclose, and otherwise process your information in connection with our websites, applications, and services.
          </p>
        </section>

        <section className="static-section">
          <h2>2. Information We Collect</h2>
          <p>We collect information you provide directly to us, such as when you:</p>
          <ul className="static-list">
            <li>Create or update your account</li>
            <li>Enroll in a course</li>
            <li>Make a payment</li>
            <li>Contact us for support</li>
            <li>Subscribe to our communications</li>
          </ul>
          <p>
            We also automatically collect certain information about your device and how you interact with our services, including IP addresses, browser type, pages visited, and time spent on pages.
          </p>
        </section>

        <section className="static-section">
          <h2>3. How We Use Your Information</h2>
          <p>We use the information we collect to:</p>
          <ul className="static-list">
            <li>Provide and improve our services</li>
            <li>Process transactions and send related information</li>
            <li>Send technical notices and support messages</li>
            <li>Respond to your inquiries</li>
            <li>Send promotional communications (you can opt out)</li>
            <li>Monitor and analyze trends and usage</li>
            <li>Detect and prevent fraud</li>
          </ul>
        </section>

        <section className="static-section">
          <h2>4. Data Sharing</h2>
          <p>
            We do not sell your personal information. We may share your information with service providers who assist us in operating our website and conducting our business, subject to strict confidentiality agreements.
          </p>
        </section>

        <section className="static-section">
          <h2>5. Data Security</h2>
          <p>
            We implement appropriate technical and organizational measures to protect your personal information against unauthorized access, alteration, disclosure, or destruction. However, no method of transmission over the internet is 100% secure.
          </p>
        </section>

        <section className="static-section">
          <h2>6. Your Rights</h2>
          <p>You have the right to:</p>
          <ul className="static-list">
            <li>Access your personal information</li>
            <li>Correct inaccurate data</li>
            <li>Request deletion of your data</li>
            <li>Opt out of marketing communications</li>
            <li>Data portability</li>
          </ul>
        </section>

        <section className="static-section">
          <h2>7. Contact Us</h2>
          <p>
            If you have questions about this privacy policy or our privacy practices, please contact us at <a href="mailto:privacy@skillnest.com">privacy@skillnest.com</a>.
          </p>
        </section>
      </div>
    </main>
  );
}
