/**
 * Register - User registration component
 * Handles new user account creation
 */
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';

const Register = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: 'attendee'
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  const { register } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    if (error) setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError('');

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      setIsSubmitting(false);
      return;
    }

    try {
      const result = await register(formData);
      if (result.success) {
        navigate('/profile');
      } else {
        setError(result.error || 'Registration failed');
      }
    } catch (err) {
      setError('An unexpected error occurred');
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
        borderRadius: 'var(--radius-lg)'
      }}>
        <h1>Join EventChain</h1>
        
        {error && (
          <div style={{ color: 'var(--status-error)', marginBottom: '1rem' }}>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <input
            type="text"
            name="name"
            placeholder="Full Name"
            value={formData.name}
            onChange={handleChange}
            required
            style={{
              width: '100%',
              padding: '0.75rem',
              marginBottom: '1rem',
              border: '1px solid var(--border-primary)',
              borderRadius: 'var(--radius-base)'
            }}
          />
          <input
            type="email"
            name="email"
            placeholder="Email"
            value={formData.email}
            onChange={handleChange}
            required
            style={{
              width: '100%',
              padding: '0.75rem',
              marginBottom: '1rem',
              border: '1px solid var(--border-primary)',
              borderRadius: 'var(--radius-base)'
            }}
          />
          <select
            name="role"
            value={formData.role}
            onChange={handleChange}
            style={{
              width: '100%',
              padding: '0.75rem',
              marginBottom: '1rem',
              border: '1px solid var(--border-primary)',
              borderRadius: 'var(--radius-base)'
            }}
          >
            <option value="attendee">Attendee</option>
            <option value="organizer">Organizer</option>
          </select>
          <input
            type="password"
            name="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleChange}
            required
            style={{
              width: '100%',
              padding: '0.75rem',
              marginBottom: '1rem',
              border: '1px solid var(--border-primary)',
              borderRadius: 'var(--radius-base)'
            }}
          />
          <input
            type="password"
            name="confirmPassword"
            placeholder="Confirm Password"
            value={formData.confirmPassword}
            onChange={handleChange}
            required
            style={{
              width: '100%',
              padding: '0.75rem',
              marginBottom: '1rem',
              border: '1px solid var(--border-primary)',
              borderRadius: 'var(--radius-base)'
            }}
          />
          <button
            type="submit"
            disabled={isSubmitting}
            style={{
              width: '100%',
              padding: '0.75rem',
              backgroundColor: 'var(--primary-600)',
              color: 'white',
              border: 'none',
              borderRadius: 'var(--radius-base)',
              cursor: 'pointer'
            }}
          >
            {isSubmitting ? 'Creating...' : 'Create Account'}
          </button>
        </form>

        <p style={{ textAlign: 'center', marginTop: '1rem' }}>
          Already have an account?{' '}
          <Link to="/login" style={{ color: 'var(--primary-600)' }}>
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Register;
