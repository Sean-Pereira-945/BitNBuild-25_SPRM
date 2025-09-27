/**
 * Footer - Main footer component
 * Contains copyright and links
 */
import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer style={{
      borderTop: '1px solid var(--border-primary)',
      backgroundColor: 'var(--bg-secondary)',
      padding: '2rem 0 1rem'
    }}>
      <div className="container">
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', 
          gap: '2rem',
          marginBottom: '2rem'
        }}>
          {/* Brand */}
          <div>
            <h3 style={{ marginBottom: '1rem' }}>EventChain</h3>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>
              The decentralized event management platform for the future. 
              Secure, verifiable, and built on blockchain technology.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 style={{ marginBottom: '1rem' }}>Quick Links</h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              <Link to="/events" style={{ color: 'var(--text-secondary)', textDecoration: 'none', fontSize: '0.875rem' }}>
                Browse Events
              </Link>
              <Link to="/about" style={{ color: 'var(--text-secondary)', textDecoration: 'none', fontSize: '0.875rem' }}>
                About Us
              </Link>
            </div>
          </div>

          {/* Support */}
          <div>
            <h4 style={{ marginBottom: '1rem' }}>Support</h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              <a href="#" style={{ color: 'var(--text-secondary)', textDecoration: 'none', fontSize: '0.875rem' }}>
                Documentation
              </a>
              <a href="#" style={{ color: 'var(--text-secondary)', textDecoration: 'none', fontSize: '0.875rem' }}>
                Contact Support
              </a>
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div style={{
          paddingTop: '1rem',
          borderTop: '1px solid var(--border-primary)',
          textAlign: 'center'
        }}>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>
            © 2025 EventChain. All rights reserved. Built with ❤️ for the decentralized future.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
