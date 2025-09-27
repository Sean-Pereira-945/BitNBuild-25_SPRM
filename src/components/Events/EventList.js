import React, { useContext } from 'react';
import { EventContext } from '../../context/EventContext';
import EventCard from './EventCard';

const EventList = () => {
  const { events, loading } = useContext(EventContext);

  if (loading) {
    return <div>Loading events...</div>;
  }

  return (
    <div className="event-list">
      {events.map((event) => (
        <EventCard key={event.id} event={event} />
      ))}
    </div>
  );
};

export default EventList;
