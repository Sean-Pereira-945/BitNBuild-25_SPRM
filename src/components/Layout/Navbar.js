
/**
 * Navbar - Main navigation component
 * Shows different navigation options based on authentication status
 */
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';

const Navbar = () => {
  const { isAuthenticated, user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <nav style={{
      padding: '1rem 0',
      borderBottom: '1px solid var(--border-primary)',
      backgroundColor: 'var(--bg-primary)'
    }}>
      <div className="container flex justify-between items-center">
        {/* Logo */}
        <Link 
          to="/" 
          style={{
            fontSize: '1.5rem',
            fontWeight: 'bold',
            color: 'var(--primary-600)',
            textDecoration: 'none'
          }}
        >
          EventChain
        </Link>

        {/* Navigation Links */}
        <div className="flex items-center gap-6">
          <Link to="/events" style={{ color: 'var(--text-primary)', textDecoration: 'none' }}>Events</Link>
          <Link to="/about" style={{ color: 'var(--text-primary)', textDecoration: 'none' }}>About</Link>
          
          {isAuthenticated ? (
            <>
              <Link to="/profile" style={{ color: 'var(--text-primary)', textDecoration: 'none' }}>Dashboard</Link>
              <Link to="/certificates" style={{ color: 'var(--text-primary)', textDecoration: 'none' }}>Certificates</Link>
              
              <div className="flex items-center gap-3">
                <span style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>
                  Hello, {user?.name || 'User'}
                </span>
                <button 
                  onClick={handleLogout}
                  style={{
                    padding: '0.5rem 1rem',
                    backgroundColor: 'var(--error-600)',
                    color: 'white',
                    border: 'none',
                    borderRadius: 'var(--radius-base)',
                    fontSize: '0.875rem',
                    cursor: 'pointer'
                  }}
                >
                  Logout
                </button>
              </div>
            </>
          ) : (
            <>
              <Link to="/login" style={{ color: 'var(--text-primary)', textDecoration: 'none' }}>Login</Link>
              <Link 
                to="/register"
                style={{
                  padding: '0.5rem 1rem',
                  backgroundColor: 'var(--primary-600)',
                  color: 'white',
                  border: 'none',
                  borderRadius: 'var(--radius-base)',
                  textDecoration: 'none',
                  fontSize: '0.875rem'
                }}
              >
                Sign Up
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
