import React from 'react';
import EventForm from '../Events/EventForm';
import Analytics from './Analytics';

const OrganizerDashboard = () => {
  return (
    <div>
      <h2>Organizer Dashboard</h2>
      <Analytics />
      <EventForm />
      {/* List of events created by this organizer */}
    </div>
  );
};

export default OrganizerDashboard;
