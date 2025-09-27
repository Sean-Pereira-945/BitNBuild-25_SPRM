/**
 * NotFoundPage - 404 error page
 */
import React from 'react';
import { Link } from 'react-router-dom';

const NotFoundPage = () => {
  return (
    <div className="container">
      <div style={{ 
        textAlign: 'center', 
        padding: '4rem 2rem',
        maxWidth: '500px',
        margin: '0 auto'
      }}>
        <h1 style={{ fontSize: '6rem', margin: '0', color: 'var(--primary-600)' }}>
          404
        </h1>
        
        <h2 style={{ marginBottom: '1rem' }}>
          Oops! Page Not Found
        </h2>
        
        <p className="text-secondary" style={{ marginBottom: '2rem' }}>
          The page you're looking for doesn't exist. It might have been moved, 
          deleted, or you entered the wrong URL.
        </p>
        
        <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
          <Link 
            to="/"
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
            Go Home
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
        
        <div style={{ marginTop: '3rem', fontSize: '0.875rem', color: 'var(--text-muted)' }}>
          <p>Need help? <a href="#" style={{ color: 'var(--primary-600)' }}>Contact Support</a></p>
        </div>
      </div>
    </div>
  );
};

export default NotFoundPage;