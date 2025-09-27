/**
 * EventsPage - Browse and search events
 */
import React from 'react';
import { useEvents } from '../context/EventContext';

const EventsPage = () => {
  const { events, loading, error } = useEvents();

  if (loading) {
    return (
      <div className="container">
        <div style={{ textAlign: 'center', padding: '2rem' }}>
          <p>Loading events...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container">
        <div style={{ textAlign: 'center', padding: '2rem', color: 'var(--status-error)' }}>
          <p>Error loading events: {error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container">
      <h1>Upcoming Events</h1>
      <p className="text-secondary">Discover amazing events and start building your credential collection</p>
      
      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', 
        gap: '1.5rem',
        marginTop: '2rem'
      }}>
        {events.map(event => (
          <div 
            key={event.id}
            style={{
              border: '1px solid var(--border-primary)',
              borderRadius: 'var(--radius-lg)',
              padding: '1.5rem',
              backgroundColor: 'var(--bg-elevated)'
            }}
          >
            <h3 style={{ marginBottom: '0.5rem' }}>{event.title}</h3>
            <p className="text-secondary" style={{ marginBottom: '1rem' }}>{event.description}</p>
            
            <div style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>
              <p>📅 {new Date(event.date).toLocaleDateString()}</p>
              <p>📍 {event.location.name}</p>
              <p>👥 {event.currentAttendees}/{event.maxAttendees} attendees</p>
              <p>💰 ${event.price}</p>
            </div>

            <button
              style={{
                width: '100%',
                padding: '0.75rem',
                backgroundColor: 'var(--primary-600)',
                color: 'white',
                border: 'none',
                borderRadius: 'var(--radius-base)',
                marginTop: '1rem',
                cursor: 'pointer'
              }}
            >
              Register
            </button>
          </div>
        ))}
      </div>
      
      {events.length === 0 && (
        <div style={{ textAlign: 'center', padding: '2rem' }}>
          <p className="text-secondary">No events found. Check back soon!</p>
        </div>
      )}
    </div>
  );
};

export default EventsPage;