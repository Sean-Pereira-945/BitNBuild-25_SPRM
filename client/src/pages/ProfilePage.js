/**
 * ProfilePage - User dashboard that conditionally renders based on role
 */
import React from 'react';
import { useAuth } from '../hooks/useAuth';

// Placeholder dashboard components
const AttendeeDashboard = () => (
  <div>
    <h2>Attendee Dashboard</h2>
    <div style={{ 
      display: 'grid', 
      gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', 
      gap: '1rem',
      marginTop: '1.5rem'
    }}>
      <div style={{ padding: '1.5rem', border: '1px solid var(--border-primary)', borderRadius: 'var(--radius-lg)' }}>
        <h3>Events Attended</h3>
        <p style={{ fontSize: '2rem', fontWeight: 'bold', color: 'var(--primary-600)' }}>12</p>
      </div>
      <div style={{ padding: '1.5rem', border: '1px solid var(--border-primary)', borderRadius: 'var(--radius-lg)' }}>
        <h3>Certificates</h3>
        <p style={{ fontSize: '2rem', fontWeight: 'bold', color: 'var(--success-600)' }}>8</p>
      </div>
      <div style={{ padding: '1.5rem', border: '1px solid var(--border-primary)', borderRadius: 'var(--radius-lg)' }}>
        <h3>Upcoming Events</h3>
        <p style={{ fontSize: '2rem', fontWeight: 'bold', color: 'var(--warning-600)' }}>3</p>
      </div>
    </div>
    
    <section style={{ marginTop: '2rem' }}>
      <h3>Recent Activity</h3>
      <div style={{ marginTop: '1rem' }}>
        <p className="text-secondary">• Attended "React Conference 2025" - Certificate issued</p>
        <p className="text-secondary">• Registered for "Blockchain Summit 2025"</p>
        <p className="text-secondary">• Shared certificate on LinkedIn</p>
      </div>
    </section>
  </div>
);

const OrganizerDashboard = () => (
  <div>
    <h2>Organizer Dashboard</h2>
    <div style={{ 
      display: 'grid', 
      gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', 
      gap: '1rem',
      marginTop: '1.5rem'
    }}>
      <div style={{ padding: '1.5rem', border: '1px solid var(--border-primary)', borderRadius: 'var(--radius-lg)' }}>
        <h3>Events Created</h3>
        <p style={{ fontSize: '2rem', fontWeight: 'bold', color: 'var(--primary-600)' }}>5</p>
      </div>
      <div style={{ padding: '1.5rem', border: '1px solid var(--border-primary)', borderRadius: 'var(--radius-lg)' }}>
        <h3>Total Attendees</h3>
        <p style={{ fontSize: '2rem', fontWeight: 'bold', color: 'var(--success-600)' }}>234</p>
      </div>
      <div style={{ padding: '1.5rem', border: '1px solid var(--border-primary)', borderRadius: 'var(--radius-lg)' }}>
        <h3>Certificates Issued</h3>
        <p style={{ fontSize: '2rem', fontWeight: 'bold', color: 'var(--warning-600)' }}>187</p>
      </div>
    </div>
    
    <section style={{ marginTop: '2rem' }}>
      <h3>Your Events</h3>
      <div style={{ marginTop: '1rem' }}>
        <div style={{ 
          padding: '1rem', 
          border: '1px solid var(--border-primary)', 
          borderRadius: 'var(--radius-base)',
          marginBottom: '0.5rem'
        }}>
          <strong>React Conference 2025</strong> - 234 attendees - Active
        </div>
        <div style={{ 
          padding: '1rem', 
          border: '1px solid var(--border-primary)', 
          borderRadius: 'var(--radius-base)',
          marginBottom: '0.5rem'
        }}>
          <strong>Blockchain Summit 2025</strong> - 156 attendees - Upcoming
        </div>
      </div>
      
      <button 
        style={{
          marginTop: '1rem',
          padding: '0.75rem 1.5rem',
          backgroundColor: 'var(--primary-600)',
          color: 'white',
          border: 'none',
          borderRadius: 'var(--radius-base)',
          cursor: 'pointer'
        }}
      >
        Create New Event
      </button>
    </section>
  </div>
);

const ProfilePage = () => {
  const { user } = useAuth();

  return (
    <div className="container">
      <div style={{ marginBottom: '2rem' }}>
        <h1>Welcome, {user?.name || 'User'}!</h1>
        <p className="text-secondary">
          Role: <span style={{ 
            padding: '0.25rem 0.5rem', 
            backgroundColor: user?.role === 'organizer' ? 'var(--primary-100)' : 'var(--success-100)',
            color: user?.role === 'organizer' ? 'var(--primary-800)' : 'var(--success-800)',
            borderRadius: 'var(--radius-sm)',
            fontSize: '0.875rem'
          }}>
            {user?.role === 'organizer' ? 'Event Organizer' : 'Attendee'}
          </span>
        </p>
      </div>

      {user?.role === 'organizer' ? <OrganizerDashboard /> : <AttendeeDashboard />}
    </div>
  );
};

export default ProfilePage;