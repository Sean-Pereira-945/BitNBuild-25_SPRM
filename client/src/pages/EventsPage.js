import { useState } from 'react';
import Button from '../components/UI/Button';
import Modal from '../components/UI/Modal';
import EventForm from '../components/Events/EventForm';
import { parseAPIError } from '../utils/errorHandling';
import { createEvent } from '../services/eventService';
import { useNotifications } from '../context/NotificationContext';
import './pages.css';

const EventsPage = () => {
  const [isSubmittingEvent, setIsSubmittingEvent] = useState(false);
  const { showNotification } = useNotifications();

  const handleCreateEvent = async (payload) => {
    try {
      setIsSubmittingEvent(true);
      await createEvent(payload);
      showNotification({
        type: 'success',
        title: 'Event created',
        message: 'Your event is ready. Publish it when you are set to go live.',
      });
    } catch (error) {
      showNotification({
        type: 'error',
        title: 'Unable to create event',
        message: parseAPIError(error),
      });
    } finally {
      setIsSubmittingEvent(false);
    }
  };

  return (
    <section className="page page--events" aria-labelledby="events-heading">
      <header className="page__header">
        <h1 id="events-heading">Create a New Event</h1>
        <p>Fill out the details below to enroll and host your event on EventChain.</p>
      </header>
      <div className="page__content">
        <EventForm
          initialValues={{ status: 'draft', isPublic: true, allowWaitlist: false, requiresApproval: false }}
          onSubmit={handleCreateEvent}
          isSubmitting={isSubmittingEvent}
          submitLabel="Create event"
        />
      </div>
    </section>
  );
};

export default EventsPage;
