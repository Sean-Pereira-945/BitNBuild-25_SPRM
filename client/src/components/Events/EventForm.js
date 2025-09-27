import React, { useState } from 'react';

const EventForm = () => {
  const [eventName, setEventName] = useState('');
  // Add other form fields here

  const handleSubmit = (e) => {
    e.preventDefault();
    // Logic to create/update event
    console.log('Submitting event:', eventName);
  };

  return (
    <form onSubmit={handleSubmit}>
      <h3>Create Event</h3>
      <input
        type="text"
        placeholder="Event Name"
        value={eventName}
        onChange={(e) => setEventName(e.target.value)}
      />
      <button type="submit">Submit</button>
    </form>
  );
};

export default EventForm;
