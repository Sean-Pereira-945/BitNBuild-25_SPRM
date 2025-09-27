/**
 * AboutPage - Information about EventChain
 */
import React from 'react';

const AboutPage = () => {
  return (
    <div className="container">
      <div style={{ maxWidth: '800px', margin: '0 auto' }}>
        <h1>About EventChain</h1>
        <p className="text-secondary">
          Revolutionizing event management with blockchain technology
        </p>

        <section style={{ marginTop: '3rem' }}>
          <h2>Our Mission</h2>
          <p>
            EventChain is committed to transforming how events are organized, attended, 
            and verified. By leveraging blockchain technology, we ensure that every 
            certificate and credential you earn is tamper-proof, verifiable, and truly yours.
          </p>
        </section>

        <section style={{ marginTop: '3rem' }}>
          <h2>How It Works</h2>
          
          <div style={{ marginTop: '1.5rem' }}>
            <h3>🎯 For Event Organizers</h3>
            <p className="text-secondary">
              Create events, set GPS boundaries, manage attendees, and issue blockchain 
              certificates automatically. Get detailed analytics and insights about 
              your events and audience.
            </p>
          </div>

          <div style={{ marginTop: '1.5rem' }}>
            <h3>👥 For Attendees</h3>
            <p className="text-secondary">
              Register for events, check in using GPS verification, and receive 
              verifiable certificates that you can share on LinkedIn and other 
              professional platforms.
            </p>
          </div>

          <div style={{ marginTop: '1.5rem' }}>
            <h3>🔐 Blockchain Security</h3>
            <p className="text-secondary">
              Every certificate is recorded on the blockchain, making it impossible 
              to forge or tamper with. Your achievements are permanent and verifiable 
              by anyone, anywhere in the world.
            </p>
          </div>
        </section>

        <section style={{ marginTop: '3rem' }}>
          <h2>Why Choose EventChain?</h2>
          
          <ul style={{ listStyle: 'none', padding: 0, marginTop: '1rem' }}>
            <li style={{ marginBottom: '1rem', display: 'flex', alignItems: 'flex-start' }}>
              <span style={{ marginRight: '0.5rem' }}>✅</span>
              <div>
                <strong>Tamper-Proof Certificates:</strong> Blockchain-based credentials that can't be forged
              </div>
            </li>
            <li style={{ marginBottom: '1rem', display: 'flex', alignItems: 'flex-start' }}>
              <span style={{ marginRight: '0.5rem' }}>✅</span>
              <div>
                <strong>GPS Verification:</strong> Ensure authentic attendance with location-based check-ins
              </div>
            </li>
            <li style={{ marginBottom: '1rem', display: 'flex', alignItems: 'flex-start' }}>
              <span style={{ marginRight: '0.5rem' }}>✅</span>
              <div>
                <strong>Professional Integration:</strong> Share certificates directly to LinkedIn and other platforms
              </div>
            </li>
            <li style={{ marginBottom: '1rem', display: 'flex', alignItems: 'flex-start' }}>
              <span style={{ marginRight: '0.5rem' }}>✅</span>
              <div>
                <strong>Comprehensive Analytics:</strong> Detailed insights for organizers and attendees
              </div>
            </li>
            <li style={{ marginBottom: '1rem', display: 'flex', alignItems: 'flex-start' }}>
              <span style={{ marginRight: '0.5rem' }}>✅</span>
              <div>
                <strong>Decentralized & Secure:</strong> Your data and credentials belong to you
              </div>
            </li>
          </ul>
        </section>

        <section style={{ 
          marginTop: '4rem', 
          padding: '2rem', 
          backgroundColor: 'var(--bg-secondary)', 
          borderRadius: 'var(--radius-lg)',
          textAlign: 'center'
        }}>
          <h2>Ready to Get Started?</h2>
          <p className="text-secondary">
            Join the future of event management and professional development
          </p>
          
          <div style={{ marginTop: '1.5rem', display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
            <a 
              href="/register"
              style={{
                display: 'inline-block',
                padding: '0.75rem 2rem',
                backgroundColor: 'var(--primary-600)',
                color: 'white',
                borderRadius: 'var(--radius-lg)',
                textDecoration: 'none',
                fontWeight: '600'
              }}
            >
              Create Account
            </a>
            <a 
              href="/events"
              style={{
                display: 'inline-block',
                padding: '0.75rem 2rem',
                border: '2px solid var(--primary-600)',
                color: 'var(--primary-600)',
                borderRadius: 'var(--radius-lg)',
                textDecoration: 'none',
                fontWeight: '600'
              }}
            >
              Browse Events
            </a>
          </div>
        </section>
      </div>
    </div>
  );
};

export default AboutPage;