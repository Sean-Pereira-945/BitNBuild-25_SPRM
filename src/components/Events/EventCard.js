import React from 'react';

const EventCard = ({ event }) => {
  if (!event) return null;

  return (
    <div className="event-card">
      <h3>{event.name}</h3>
      <p>{new Date(event.date).toLocaleDateString()}</p>
      <p>{event.location}</p>
      <button>View Details</button>
    </div>
  );
};

export default EventCard;
