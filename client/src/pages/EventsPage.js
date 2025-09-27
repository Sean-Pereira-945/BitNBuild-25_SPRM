import { useEffect, useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { format, formatDistanceStrict, parseISO } from 'date-fns';
import { useQuery } from '@tanstack/react-query';
import Button from '../components/UI/Button';
import LoadingSpinner from '../components/UI/LoadingSpinner';
import ErrorState from '../components/UI/ErrorState';
import EventMap from '../components/Events/EventMap';
import Modal from '../components/UI/Modal';
import EventForm from '../components/Events/EventForm';
import useAuth from '../hooks/useAuth';
import { useNotifications } from '../context/NotificationContext';
import { parseAPIError } from '../utils/errorHandling';
import { createEvent, getEvents, updateEvent } from '../services/eventService';
import './pages.css';

const getEventsFromPayload = (payload) => {
  if (!payload) return [];
  if (Array.isArray(payload)) return payload;
  if (Array.isArray(payload.data)) return payload.data;
  if (Array.isArray(payload.data?.data)) return payload.data.data;
  if (Array.isArray(payload.items)) return payload.items;
  return [];
};

const deriveEventStats = (events) => {
  if (!events.length) {
    return {
      total: 0,
      live: 0,
      completed: 0,
      averageAttendance: 0,
      capacityUtilization: 0,
    };
  }

  const total = events.length;
  const live = events.filter((event) => ['published', 'ongoing'].includes(event.status)).length;
  const completed = events.filter((event) => event.status === 'completed').length;
  const attendanceTotals = events.reduce(
    (acc, event) => {
      const registered = event.analytics?.registrations ?? event.attendees?.length ?? 0;
      const attended = event.analytics?.attendanceRate
        ? Math.round((event.analytics.attendanceRate / 100) * registered)
        : event.attendees?.filter((attendee) => attendee.attended).length ?? 0;

      return {
        registered: acc.registered + registered,
        attended: acc.attended + attended,
        capacity: acc.capacity + (event.maxCapacity ?? 0),
      };
    },
    { registered: 0, attended: 0, capacity: 0 }
  );

  const averageAttendance = attendanceTotals.registered
    ? Math.round((attendanceTotals.attended / attendanceTotals.registered) * 100)
    : 0;

  const capacityUtilization = attendanceTotals.capacity
    ? Math.min(100, Math.round((attendanceTotals.registered / attendanceTotals.capacity) * 100))
    : 0;

  return {
    total,
    live,
    completed,
    averageAttendance,
    capacityUtilization,
  };
};

const formatEventSchedule = (event) => {
  if (!event.date) return 'Schedule TBA';
  const start = parseISO(event.date);
  const formattedDate = format(start, 'MMMM d, yyyy');
  const timeRange = event.startTime && event.endTime ? `${event.startTime} → ${event.endTime}` : event.startTime || '';
  return `${formattedDate}${timeRange ? ` · ${timeRange}` : ''}`;
};

const formatEventDistance = (event) => {
  if (!event?.location?.city && !event?.location?.country) return event?.location?.address ?? 'Location TBA';
  return [event.location.city, event.location.country].filter(Boolean).join(', ');
};

const getTimeUntil = (event) => {
  if (!event?.date) return null;
  try {
    const start = parseISO(event.date);
    if (Number.isNaN(start.getTime())) return null;
    return formatDistanceStrict(start, new Date(), { addSuffix: true });
  } catch (error) {
    return null;
  }
};

const EventsPage = () => {
  const [selectedEventId, setSelectedEventId] = useState(null);
  const [searchParams, setSearchParams] = useSearchParams();
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [eventBeingManaged, setEventBeingManaged] = useState(null);
  const [eventDetails, setEventDetails] = useState(null);
  const [isSubmittingEvent, setIsSubmittingEvent] = useState(false);
  const [isUpdatingEvent, setIsUpdatingEvent] = useState(false);
  const { user } = useAuth();
  const { showNotification } = useNotifications();

  const {
    data: eventsPayload,
    isFetching,
    isError,
    refetch,
  } = useQuery({
    queryKey: ['events', 'all'],
    queryFn: async () => {
      const response = await getEvents();
      return response.data;
    },
    staleTime: 1000 * 60 * 5,
  });

  const events = useMemo(() => getEventsFromPayload(eventsPayload), [eventsPayload]);
  const stats = useMemo(() => deriveEventStats(events), [events]);
  const canManageEvents = ['organizer', 'admin'].includes(user?.role);

  useEffect(() => {
    if (!selectedEventId && events.length) {
      setSelectedEventId(events[0]._id);
    }
  }, [events, selectedEventId]);

  useEffect(() => {
    if (searchParams.get('create') === '1') {
      setIsCreateOpen(true);
    }
  }, [searchParams]);

  const openCreateModal = () => {
    const next = new URLSearchParams(searchParams);
    next.set('create', '1');
    setSearchParams(next, { replace: true });
    setIsCreateOpen(true);
  };

  const closeCreateModal = () => {
    setIsCreateOpen(false);
    if (searchParams.get('create')) {
      const next = new URLSearchParams(searchParams);
      next.delete('create');
      setSearchParams(next, { replace: true });
    }
  };

  const handleCreateEvent = async (payload) => {
    try {
      setIsSubmittingEvent(true);
      await createEvent(payload);
      showNotification({
        type: 'success',
        title: 'Event created',
        message: 'Your event is ready. Publish it when you are set to go live.',
      });
      closeCreateModal();
      await refetch();
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

  const handleUpdateEvent = async (eventId, payload) => {
    try {
      setIsUpdatingEvent(true);
      await updateEvent(eventId, payload);
      showNotification({
        type: 'success',
        title: 'Event updated',
        message: 'Changes saved successfully.',
      });
      setEventBeingManaged(null);
      await refetch();
    } catch (error) {
      showNotification({
        type: 'error',
        title: 'Update failed',
        message: parseAPIError(error),
      });
    } finally {
      setIsUpdatingEvent(false);
    }
  };

  if (isError) {
    return (
      <section className="page" aria-labelledby="events-heading">
        <ErrorState
          title="We hit a snag loading events"
          message="Our event feed is momentarily unavailable. Refresh to try again."
          onRetry={refetch}
        />
      </section>
    );
  }

  return (
    <section className="page page--events" aria-labelledby="events-heading">
      <header className="page__header">
        <div>
          <h1 id="events-heading">Mission control for every event</h1>
          <p>Track live attendance, orchestrate logistics, and mint blockchain certificates from a single adaptive cockpit.</p>
        </div>
        <div className="page__header-actions">
          <Button size="sm" variant="outline" onClick={() => refetch()} disabled={isFetching}>
            {isFetching ? 'Syncing…' : 'Refresh feed'}
          </Button>
          {canManageEvents && (
            <Button size="sm" onClick={openCreateModal}>
              Create event
            </Button>
          )}
        </div>
      </header>

      <section className="events-stats" aria-label="Event status summary">
        <StatCard label="Active programs" value={stats.live} subvalue={`${stats.total} total`} />
        <StatCard label="Completed" value={stats.completed} subvalue="Ready for certificate issuing" />
        <StatCard label="Avg attendance" value={`${stats.averageAttendance}%`} subvalue="Attendance vs registrations" />
        <StatCard label="Capacity utilization" value={`${stats.capacityUtilization}%`} subvalue="Seats claimed" />
      </section>

      <div className="events-grid">
        <div className="events-grid__list" role="list" aria-label="Event roster">
          {isFetching && !events.length ? (
            <LoadingSpinner message="Synchronizing the event roster…" />
          ) : events.length === 0 ? (
            <div className="empty-state">
              <h3>No events yet</h3>
              <p>Create your first event to unlock live dashboards, attendee badges, and spatial analytics.</p>
              {canManageEvents && (
                <Button size="sm" onClick={openCreateModal}>
                  Launch event
                </Button>
              )}
            </div>
          ) : (
            events.map((event) => (
              <article
                key={event._id}
                role="listitem"
                className={`event-card ${selectedEventId === event._id ? 'event-card--active' : ''}`}
                onClick={() => setSelectedEventId(event._id)}
              >
                <div className="event-card__header">
                  <div>
                    <span className={`event-chip event-chip--${event.status}`}>{event.status}</span>
                    <h3>{event.title}</h3>
                    <p>{event.shortDescription || event.description}</p>
                  </div>
                  {event.images?.[0]?.url && (
                    <img src={event.images[0].url} alt="Event visual" className="event-card__media" />
                  )}
                </div>
                <dl className="event-card__meta">
                  <div>
                    <dt>Schedule</dt>
                    <dd>{formatEventSchedule(event)}</dd>
                  </div>
                  <div>
                    <dt>Location</dt>
                    <dd>{formatEventDistance(event)}</dd>
                  </div>
                  <div>
                    <dt>Capacity</dt>
                    <dd>{`${event.attendees?.length ?? 0} / ${event.maxCapacity ?? '∞'}`}</dd>
                  </div>
                  <div>
                    <dt>Time</dt>
                    <dd>{getTimeUntil(event) ?? 'Syncing timeline…'}</dd>
                  </div>
                </dl>
                <footer className="event-card__footer">
                  <div className="event-card__avatars" aria-label="Registered attendees">
                    {event.attendees?.slice(0, 4).map((attendee) => (
                      <span key={attendee.user?._id || attendee.user} className="event-avatar" title={attendee.user?.name}>
                        {(attendee.user?.name || 'A')[0]}
                      </span>
                    ))}
                    {event.attendees?.length > 4 && (
                      <span className="event-avatar event-avatar--more">+{event.attendees.length - 4}</span>
                    )}
                  </div>
                  <div className="event-card__actions">
                    {canManageEvents && (
                      <Button
                        size="xs"
                        variant="ghost"
                        onClick={(clickEvent) => {
                          clickEvent.stopPropagation();
                          setEventBeingManaged(event);
                        }}
                      >
                        Manage
                      </Button>
                    )}
                    <Button
                      size="xs"
                      variant="outline"
                      onClick={(clickEvent) => {
                        clickEvent.stopPropagation();
                        setEventDetails(event);
                      }}
                    >
                      View details
                    </Button>
                  </div>
                </footer>
              </article>
            ))
          )}
        </div>
        <div className="events-grid__map" aria-label="Event map">
          <EventMap events={events} selectedEventId={selectedEventId} onSelectEvent={setSelectedEventId} />
        </div>
      </div>

      {selectedEventId && (
        <EventIntelPanel event={events.find((event) => event._id === selectedEventId)} />
      )}

      <Modal isOpen={isCreateOpen} title="Create new event" onClose={closeCreateModal}>
        <EventForm
          initialValues={{ status: 'draft', isPublic: true, allowWaitlist: false, requiresApproval: false }}
          onSubmit={handleCreateEvent}
          onCancel={closeCreateModal}
          isSubmitting={isSubmittingEvent}
          submitLabel="Create event"
        />
      </Modal>

      <Modal
        isOpen={Boolean(eventBeingManaged)}
        title={eventBeingManaged ? `Manage “${eventBeingManaged.title}”` : 'Manage event'}
        onClose={() => setEventBeingManaged(null)}
      >
        {eventBeingManaged && (
          <EventForm
            initialValues={eventBeingManaged}
            onSubmit={(payload) => handleUpdateEvent(eventBeingManaged._id, payload)}
            onCancel={() => setEventBeingManaged(null)}
            isSubmitting={isUpdatingEvent}
            submitLabel="Save changes"
          />
        )}
      </Modal>

      <Modal
        isOpen={Boolean(eventDetails)}
        title={eventDetails ? `${eventDetails.title}` : 'Event details'}
        onClose={() => setEventDetails(null)}
      >
        {eventDetails && <EventDetails event={eventDetails} />}
      </Modal>
    </section>
  );
};

const StatCard = ({ label, value, subvalue }) => (
  <article className="stat-card">
    <dt>{label}</dt>
    <dd>
      <strong>{value}</strong>
      <span>{subvalue}</span>
    </dd>
  </article>
);

const EventIntelPanel = ({ event }) => {
  if (!event) return null;

  return (
    <section className="event-intel" aria-label="Event insights">
      <header>
        <h2>Live mission feed</h2>
        <p>Real-time metrics synced from the analytics engine. Deploy new actions or trigger QR checkpoints instantly.</p>
      </header>
      <div className="event-intel__grid">
        <div className="event-intel__card">
          <h3>Attendance signals</h3>
          <ul>
            <li>
              Registered attendees
              <span>{event.attendees?.length ?? 0}</span>
            </li>
            <li>
              Confirmed check-ins
              <span>{event.attendees?.filter((attendee) => attendee.attended).length ?? 0}</span>
            </li>
            <li>
              Certificates ready
              <span>{event.attendees?.filter((attendee) => attendee.certificateIssued).length ?? 0}</span>
            </li>
          </ul>
        </div>
        <div className="event-intel__card">
          <h3>Mission settings</h3>
          <ul>
            <li>
              Attendance radius
              <span>{event.attendanceRadius ?? 100} m</span>
            </li>
            <li>
              Credits awarded
              <span>{event.credits ?? 1}</span>
            </li>
            <li>
              Strict check-in
              <span>{event.strictAttendance ? 'Enabled' : 'Flexible'}</span>
            </li>
          </ul>
        </div>
        <div className="event-intel__card">
          <h3>Organizer</h3>
          <ul>
            <li>
              {event.organizer?.name || '—'}
              <span>{event.organizer?.email || 'Private'}</span>
            </li>
            <li>
              Venue
              <span>{event.location?.venue}</span>
            </li>
            <li>
              Address
              <span>{event.location?.address}</span>
            </li>
          </ul>
        </div>
      </div>
    </section>
  );
};

export default EventsPage;

const EventDetails = ({ event }) => {
  if (!event) return null;

  const shareLink = `${window.location.origin}/events/${event._id}`;

  const copyShareLink = async () => {
    try {
      await navigator.clipboard.writeText(shareLink);
    } catch (error) {
      console.error('Unable to copy link', error);
    }
  };

  return (
    <div className="event-details">
      <section className="event-details__section">
        <h3>Overview</h3>
        <p>{event.description}</p>
        <dl>
          <div>
            <dt>Status</dt>
            <dd>{event.status}</dd>
          </div>
          <div>
            <dt>Schedule</dt>
            <dd>{formatEventSchedule(event)}</dd>
          </div>
          <div>
            <dt>Location</dt>
            <dd>{formatEventDistance(event)}</dd>
          </div>
          <div>
            <dt>Capacity</dt>
            <dd>{`${event.attendees?.length ?? 0} / ${event.maxCapacity ?? '∞'}`}</dd>
          </div>
        </dl>
        <Button size="sm" variant="outline" onClick={copyShareLink}>
          Copy share link
        </Button>
      </section>
      <section className="event-details__section">
        <h3>Attendees</h3>
        {event.attendees?.length ? (
          <ul className="event-details__list">
            {event.attendees.map((attendee) => (
              <li key={attendee.user?._id || attendee.user}>
                <span>{attendee.user?.name || 'Unnamed attendee'}</span>
                <small>{attendee.attended ? 'Checked in' : 'Registered'}</small>
              </li>
            ))}
          </ul>
        ) : (
          <p>No attendees registered yet.</p>
        )}
      </section>
    </div>
  );
};
