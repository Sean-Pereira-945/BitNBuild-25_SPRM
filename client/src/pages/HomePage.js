/**
 * HomePage - Landing page for EventChain
 * Main entry point showcasing app features and value proposition
 */
import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

const HomePage = () => {
  const { isAuthenticated, user } = useAuth();

  return (
    <div className="container">
      {/* Hero Section */}
      <section className="hero-section text-center" style={{ padding: '4rem 0' }}>
        <h1 style={{ fontSize: '3rem', marginBottom: '1rem', fontWeight: 'bold' }}>
          Welcome to EventChain
        </h1>
        <p style={{ fontSize: '1.25rem', color: 'var(--text-secondary)', marginBottom: '2rem', maxWidth: '600px', margin: '0 auto 2rem' }}>
          The decentralized event management platform that issues verifiable, 
          tamper-proof attendance certificates on the blockchain.
        </p>
        
        {!isAuthenticated ? (
          <div className="flex gap-4 justify-center">
            <Link 
              to="/register" 
              style={{
                display: 'inline-block',
                padding: '0.75rem 2rem',
                backgroundColor: 'var(--primary-600)',
                color: 'white',
                borderRadius: 'var(--radius-lg)',
                textDecoration: 'none',
                fontWeight: '600',
                transition: 'background-color var(--transition-fast)'
              }}
            >
              Get Started
            </Link>
            <Link 
              to="/login"
              style={{
                display: 'inline-block',
                padding: '0.75rem 2rem',
                border: '2px solid var(--primary-600)',
                color: 'var(--primary-600)',
                borderRadius: 'var(--radius-lg)',
                textDecoration: 'none',
                fontWeight: '600',
                transition: 'all var(--transition-fast)'
              }}
            >
              Sign In
            </Link>
          </div>
        ) : (
          <div>
            <h2>Welcome back, {user?.name}!</h2>
            <div className="flex gap-4 justify-center" style={{ marginTop: '1rem' }}>
              <Link 
                to="/profile"
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
                Go to Dashboard
              </Link>
              <Link 
                to="/events"
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
              </Link>
            </div>
          </div>
        )}
      </section>

      {/* Features Section */}
      <section style={{ padding: '4rem 0', borderTop: '1px solid var(--border-primary)' }}>
        <div className="text-center" style={{ marginBottom: '3rem' }}>
          <h2>Why Choose EventChain?</h2>
          <p className="text-secondary">Revolutionizing event management with blockchain technology</p>
        </div>
        
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem' }}>
          {/* Blockchain Certificates */}
          <div className="feature-card" style={{ padding: '2rem', border: '1px solid var(--border-primary)', borderRadius: 'var(--radius-lg)' }}>
            <h3>🔐 Blockchain Certificates</h3>
            <p className="text-secondary">
              Issue tamper-proof attendance certificates that can be verified on the blockchain 
              and shared on professional networks like LinkedIn.
            </p>
          </div>

          {/* GPS Attendance */}
          <div className="feature-card" style={{ padding: '2rem', border: '1px solid var(--border-primary)', borderRadius: 'var(--radius-lg)' }}>
            <h3>📍 GPS-Based Attendance</h3>
            <p className="text-secondary">
              Ensure authentic attendance with GPS verification and geofence technology. 
              No more proxy attendance or fraudulent check-ins.
            </p>
          </div>

          {/* Organizer Tools */}
          <div className="feature-card" style={{ padding: '2rem', border: '1px solid var(--border-primary)', borderRadius: 'var(--radius-lg)' }}>
            <h3>🎯 Organizer Dashboard</h3>
            <p className="text-secondary">
              Comprehensive analytics, attendee management, and real-time insights 
              to make your events successful.
            </p>
          </div>

          {/* Attendee Experience */}
          <div className="feature-card" style={{ padding: '2rem', border: '1px solid var(--border-primary)', borderRadius: 'var(--radius-lg)' }}>
            <h3>✨ Seamless Experience</h3>
            <p className="text-secondary">
              Simple registration, QR code check-ins, and a personal certificate 
              collection that showcases your learning journey.
            </p>
          </div>

          {/* Decentralized */}
          <div className="feature-card" style={{ padding: '2rem', border: '1px solid var(--border-primary)', borderRadius: 'var(--radius-lg)' }}>
            <h3>🌐 Decentralized & Secure</h3>
            <p className="text-secondary">
              Built on blockchain technology ensuring data integrity, transparency, 
              and ownership of your credentials.
            </p>
          </div>

          {/* Social Integration */}
          <div className="feature-card" style={{ padding: '2rem', border: '1px solid var(--border-primary)', borderRadius: 'var(--radius-lg)' }}>
            <h3>🤝 Social Integration</h3>
            <p className="text-secondary">
              Share your achievements directly to LinkedIn and other social platforms 
              with verified blockchain credentials.
            </p>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section style={{ padding: '4rem 0', textAlign: 'center', backgroundColor: 'var(--bg-secondary)', borderRadius: 'var(--radius-lg)', margin: '2rem 0' }}>
        <h2>Ready to Transform Your Events?</h2>
        <p className="text-secondary" style={{ marginBottom: '2rem' }}>
          Join thousands of organizers and attendees who trust EventChain 
          for their professional development and networking needs.
        </p>
        
        {!isAuthenticated && (
          <Link 
            to="/register"
            style={{
              display: 'inline-block',
              padding: '1rem 2.5rem',
              backgroundColor: 'var(--primary-600)',
              color: 'white',
              borderRadius: 'var(--radius-lg)',
              textDecoration: 'none',
              fontWeight: '600',
              fontSize: '1.125rem'
            }}
          >
            Start Your Journey
          </Link>
        )}
      </section>
    </div>
  );
};

export default HomePage;