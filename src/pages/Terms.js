import React, { useEffect } from 'react';
import './Terms.css';

export default function Terms() {
  useEffect(() => { window.scrollTo(0, 0); }, []);
  return (
    <main className="static-page terms-page">
      <div className="static-hero">
        <div className="container">
          <h1 className="static-title">terms of service</h1>
          <p className="static-subtitle">last updated: april 2026</p>
        </div>
      </div>

      <div className="container static-body">
        <section className="static-section">
          <h2>1. Acceptance of Terms</h2>
          <p>
            By accessing and using Skillnest, you accept and agree to be bound by the terms and provision of this agreement. If you do not agree to abide by the above, please do not use this service.
          </p>
        </section>

        <section className="static-section">
          <h2>2. License and Access</h2>
          <p>
            Skillnest grants you a limited, non-exclusive, non-transferable license to access and use our services in accordance with these Terms. You may not: (a) modify or alter any content; (b) reproduce or distribute the content; (c) use the content for commercial purposes.
          </p>
        </section>

        <section className="static-section">
          <h2>3. User Accounts</h2>
          <p>
            When you create an account, you agree to provide accurate and complete information. You are responsible for maintaining the confidentiality of your account credentials and for all activities that occur under your account. You agree to notify us immediately of any unauthorized use of your account.
          </p>
        </section>

        <section className="static-section">
          <h2>4. Course Enrollment</h2>
          <p>
            Course enrollment grants you access to course materials for your personal, non-commercial use. You receive lifetime access to enrolled courses. However, Skillnest reserves the right to modify course content at any time.
          </p>
          <p>
            Refunds are available within 14 days of enrollment. After this period, all sales are final.
          </p>
        </section>

        <section className="static-section">
          <h2>5. Payment Terms</h2>
          <p>
            By making a purchase, you authorize Skillnest to charge the payment method you provide. You are responsible for all applicable taxes. Skillnest is not responsible for any declined payments or fraud.
          </p>
        </section>

        <section className="static-section">
          <h2>6. Intellectual Property</h2>
          <p>
            All content on Skillnest, including courses, materials, and designs, are the property of Skillnest or our instructors and are protected by copyright laws. You may not reproduce, distribute, or transmit any content without permission.
          </p>
        </section>

        <section className="static-section">
          <h2>7. User Conduct</h2>
          <p>You agree not to:</p>
          <ul className="static-list">
            <li>Violate any applicable laws or regulations</li>
            <li>Infringe on any intellectual property rights</li>
            <li>Harass, abuse, or harm others</li>
            <li>Upload malware or harmful code</li>
            <li>Attempt to gain unauthorized access to systems</li>
            <li>Share course access with others</li>
          </ul>
        </section>

        <section className="static-section">
          <h2>8. Disclaimer of Warranties</h2>
          <p>
            Skillnest is provided "as is" and "as available" without warranties of any kind. We do not warrant that the service will be uninterrupted, error-free, or secure. Some jurisdictions do not allow the exclusion of implied warranties, so some of the above may not apply to you.
          </p>
        </section>

        <section className="static-section">
          <h2>9. Limitation of Liability</h2>
          <p>
            In no event shall Skillnest be liable for any indirect, incidental, special, consequential, or punitive damages, even if advised of the possibility thereof. Our total liability to you is limited to the amount you paid us.
          </p>
        </section>

        <section className="static-section">
          <h2>10. Changes to Terms</h2>
          <p>
            Skillnest may update these terms at any time. We will notify users of material changes. Your continued use of the service after changes constitutes your acceptance of the new terms.
          </p>
        </section>

        <section className="static-section">
          <h2>11. Contact Us</h2>
          <p>
            If you have questions about these terms, please contact us at <a href="mailto:legal@skillnest.com">legal@skillnest.com</a>.
          </p>
        </section>
      </div>
    </main>
  );
}
