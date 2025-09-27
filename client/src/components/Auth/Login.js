/**
 * Login - User login component
 * Handles user authentication with email and password
 */
import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';

const Login = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  
  // Get the page the user was trying to access
  const from = location.state?.from?.pathname || '/profile';

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Clear error when user starts typing
    if (error) setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError('');

    try {
      const result = await login(formData);
      
      if (result.success) {
        navigate(from, { replace: true });
      } else {
        setError(result.error || 'Login failed. Please try again.');
      }
    } catch (err) {
      setError('An unexpected error occurred. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="container">
      <div style={{ 
        maxWidth: '400px', 
        margin: '2rem auto',
        padding: '2rem',
        border: '1px solid var(--border-primary)',
        borderRadius: 'var(--radius-lg)',
        backgroundColor: 'var(--bg-elevated)'
      }}>
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <h1>Welcome Back</h1>
          <p className="text-secondary">Sign in to your EventChain account</p>
        </div>

        {error && (
          <div style={{
            padding: '0.75rem 1rem',
            backgroundColor: 'var(--error-50)',
            border: '1px solid var(--error-200)',
            borderRadius: 'var(--radius-base)',
            color: 'var(--error-700)',
            marginBottom: '1rem'
          }}>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: '1rem' }}>
            <label 
              htmlFor="email"
              style={{ 
                display: 'block', 
                marginBottom: '0.5rem',
                fontWeight: '500',
                color: 'var(--text-primary)'
              }}
            >
              Email Address
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              style={{
                width: '100%',
                padding: '0.75rem 1rem',
                border: '1px solid var(--border-primary)',
                borderRadius: 'var(--radius-base)',
                fontSize: '1rem',
                backgroundColor: 'var(--bg-primary)',
                color: 'var(--text-primary)'
              }}
              placeholder="Enter your email"
            />
          </div>

          <div style={{ marginBottom: '1.5rem' }}>
            <label 
              htmlFor="password"
              style={{ 
                display: 'block', 
                marginBottom: '0.5rem',
                fontWeight: '500',
                color: 'var(--text-primary)'
              }}
            >
              Password
            </label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
              style={{
                width: '100%',
                padding: '0.75rem 1rem',
                border: '1px solid var(--border-primary)',
                borderRadius: 'var(--radius-base)',
                fontSize: '1rem',
                backgroundColor: 'var(--bg-primary)',
                color: 'var(--text-primary)'
              }}
              placeholder="Enter your password"
            />
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            style={{
              width: '100%',
              padding: '0.75rem 1rem',
              backgroundColor: isSubmitting ? 'var(--secondary-400)' : 'var(--primary-600)',
              color: 'white',
              border: 'none',
              borderRadius: 'var(--radius-base)',
              fontSize: '1rem',
              fontWeight: '600',
              cursor: isSubmitting ? 'not-allowed' : 'pointer',
              opacity: isSubmitting ? 0.6 : 1
            }}
          >
            {isSubmitting ? 'Signing in...' : 'Sign In'}
          </button>
        </form>

        <div style={{ 
          textAlign: 'center', 
          marginTop: '1.5rem',
          padding: '1rem 0',
          borderTop: '1px solid var(--border-primary)'
        }}>
          <p className="text-secondary">
            Don't have an account?{' '}
            <Link 
              to="/register"
              style={{ 
                color: 'var(--primary-600)', 
                fontWeight: '600',
                textDecoration: 'none' 
              }}
            >
              Create one here
            </Link>
          </p>
        </div>

        {/* Demo credentials hint */}
        <div style={{
          marginTop: '1rem',
          padding: '1rem',
          backgroundColor: 'var(--bg-secondary)',
          borderRadius: 'var(--radius-base)',
          fontSize: '0.875rem'
        }}>
          <p style={{ fontWeight: '600', marginBottom: '0.5rem' }}>Demo Credentials:</p>
          <p className="text-secondary">
            Email: organizer@example.com (Organizer)<br/>
            Email: attendee@example.com (Attendee)<br/>
            Password: Any password works in demo mode
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;