/**
 * EventContext - Event state management
 * Manages events list, loading state, and event-related operations
 */
import React, { createContext, useContext, useReducer, useEffect } from 'react';

// Initial state with mock data
const initialState = {
  events: [],
  loading: false,
  error: null,
  selectedEvent: null
};

// Mock events data
const mockEvents = [
  {
    id: '1',
    title: 'React Conference 2025',
    description: 'A comprehensive conference about React and modern web development.',
    date: '2025-10-15',
    time: '09:00',
    location: {
      name: 'Tech Convention Center',
      address: '123 Tech Street, San Francisco, CA',
      coordinates: { lat: 37.7749, lng: -122.4194 }
    },
    organizer: {
      id: 'org1',
      name: 'Tech Events Inc.',
      email: 'contact@techevents.com'
    },
    maxAttendees: 500,
    currentAttendees: 234,
    tags: ['React', 'JavaScript', 'Web Development'],
    image: '/images/react-conf.jpg',
    price: 299.99,
    status: 'active',
    requiresApproval: false,
    certificateTemplate: 'default'
  },
  {
    id: '2',
    title: 'Blockchain Summit 2025',
    description: 'Exploring the future of blockchain technology and decentralized applications.',
    date: '2025-11-20',
    time: '10:00',
    location: {
      name: 'Blockchain Hub',
      address: '456 Crypto Avenue, New York, NY',
      coordinates: { lat: 40.7128, lng: -74.0060 }
    },
    organizer: {
      id: 'org2',
      name: 'Blockchain Foundation',
      email: 'events@blockchain.org'
    },
    maxAttendees: 300,
    currentAttendees: 156,
    tags: ['Blockchain', 'Cryptocurrency', 'DeFi'],
    image: '/images/blockchain-summit.jpg',
    price: 450.00,
    status: 'active',
    requiresApproval: true,
    certificateTemplate: 'blockchain'
  }
];

// Action types
const EVENT_ACTIONS = {
  FETCH_EVENTS_START: 'FETCH_EVENTS_START',
  FETCH_EVENTS_SUCCESS: 'FETCH_EVENTS_SUCCESS',
  FETCH_EVENTS_FAILURE: 'FETCH_EVENTS_FAILURE',
  CREATE_EVENT_START: 'CREATE_EVENT_START',
  CREATE_EVENT_SUCCESS: 'CREATE_EVENT_SUCCESS',
  CREATE_EVENT_FAILURE: 'CREATE_EVENT_FAILURE',
  UPDATE_EVENT: 'UPDATE_EVENT',
  DELETE_EVENT: 'DELETE_EVENT',
  SELECT_EVENT: 'SELECT_EVENT',
  CLEAR_SELECTED_EVENT: 'CLEAR_SELECTED_EVENT',
  CLEAR_ERROR: 'CLEAR_ERROR'
};

// Reducer function
const eventReducer = (state, action) => {
  switch (action.type) {
    case EVENT_ACTIONS.FETCH_EVENTS_START:
      return {
        ...state,
        loading: true,
        error: null
      };
    case EVENT_ACTIONS.FETCH_EVENTS_SUCCESS:
      return {
        ...state,
        events: action.payload.events,
        loading: false,
        error: null
      };
    case EVENT_ACTIONS.FETCH_EVENTS_FAILURE:
      return {
        ...state,
        loading: false,
        error: action.payload.error
      };
    case EVENT_ACTIONS.CREATE_EVENT_START:
      return {
        ...state,
        loading: true,
        error: null
      };
    case EVENT_ACTIONS.CREATE_EVENT_SUCCESS:
      return {
        ...state,
        events: [...state.events, action.payload.event],
        loading: false,
        error: null
      };
    case EVENT_ACTIONS.CREATE_EVENT_FAILURE:
      return {
        ...state,
        loading: false,
        error: action.payload.error
      };
    case EVENT_ACTIONS.UPDATE_EVENT:
      return {
        ...state,
        events: state.events.map(event =>
          event.id === action.payload.event.id
            ? { ...event, ...action.payload.event }
            : event
        )
      };
    case EVENT_ACTIONS.DELETE_EVENT:
      return {
        ...state,
        events: state.events.filter(event => event.id !== action.payload.eventId)
      };
    case EVENT_ACTIONS.SELECT_EVENT:
      return {
        ...state,
        selectedEvent: action.payload.event
      };
    case EVENT_ACTIONS.CLEAR_SELECTED_EVENT:
      return {
        ...state,
        selectedEvent: null
      };
    case EVENT_ACTIONS.CLEAR_ERROR:
      return {
        ...state,
        error: null
      };
    default:
      return state;
  }
};

// Create context
const EventContext = createContext();

// EventProvider component
export const EventProvider = ({ children }) => {
  const [state, dispatch] = useReducer(eventReducer, initialState);

  // Fetch events function
  const fetchEvents = async (filters = {}) => {
    try {
      dispatch({ type: EVENT_ACTIONS.FETCH_EVENTS_START });
      
      // Mock API call - replace with actual API call
      await new Promise(resolve => setTimeout(resolve, 800));
      
      let filteredEvents = [...mockEvents];
      
      // Apply filters
      if (filters.search) {
        filteredEvents = filteredEvents.filter(event =>
          event.title.toLowerCase().includes(filters.search.toLowerCase()) ||
          event.description.toLowerCase().includes(filters.search.toLowerCase())
        );
      }
      
      if (filters.tags && filters.tags.length > 0) {
        filteredEvents = filteredEvents.filter(event =>
          event.tags.some(tag => filters.tags.includes(tag))
        );
      }
      
      dispatch({
        type: EVENT_ACTIONS.FETCH_EVENTS_SUCCESS,
        payload: { events: filteredEvents }
      });
      
      return { success: true, events: filteredEvents };
    } catch (error) {
      dispatch({
        type: EVENT_ACTIONS.FETCH_EVENTS_FAILURE,
        payload: { error: error.message }
      });
      return { success: false, error: error.message };
    }
  };

  // Create event function
  const createEvent = async (eventData) => {
    try {
      dispatch({ type: EVENT_ACTIONS.CREATE_EVENT_START });
      
      // Mock API call - replace with actual API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const newEvent = {
        ...eventData,
        id: Date.now().toString(),
        currentAttendees: 0,
        status: 'active',
        createdAt: new Date().toISOString()
      };
      
      dispatch({
        type: EVENT_ACTIONS.CREATE_EVENT_SUCCESS,
        payload: { event: newEvent }
      });
      
      return { success: true, event: newEvent };
    } catch (error) {
      dispatch({
        type: EVENT_ACTIONS.CREATE_EVENT_FAILURE,
        payload: { error: error.message }
      });
      return { success: false, error: error.message };
    }
  };

  // Update event function
  const updateEvent = async (eventId, updates) => {
    try {
      // Mock API call - replace with actual API call
      await new Promise(resolve => setTimeout(resolve, 500));
      
      dispatch({
        type: EVENT_ACTIONS.UPDATE_EVENT,
        payload: { event: { id: eventId, ...updates } }
      });
      
      return { success: true };
    } catch (error) {
      return { success: false, error: error.message };
    }
  };

  // Delete event function
  const deleteEvent = async (eventId) => {
    try {
      // Mock API call - replace with actual API call
      await new Promise(resolve => setTimeout(resolve, 500));
      
      dispatch({
        type: EVENT_ACTIONS.DELETE_EVENT,
        payload: { eventId }
      });
      
      return { success: true };
    } catch (error) {
      return { success: false, error: error.message };
    }
  };

  // Select event function
  const selectEvent = (event) => {
    dispatch({
      type: EVENT_ACTIONS.SELECT_EVENT,
      payload: { event }
    });
  };

  // Clear selected event function
  const clearSelectedEvent = () => {
    dispatch({ type: EVENT_ACTIONS.CLEAR_SELECTED_EVENT });
  };

  // Clear error function
  const clearError = () => {
    dispatch({ type: EVENT_ACTIONS.CLEAR_ERROR });
  };

  // Load initial events on mount
  useEffect(() => {
    fetchEvents();
  }, []);

  const value = {
    ...state,
    fetchEvents,
    createEvent,
    updateEvent,
    deleteEvent,
    selectEvent,
    clearSelectedEvent,
    clearError
  };

  return (
    <EventContext.Provider value={value}>
      {children}
    </EventContext.Provider>
  );
};

// Custom hook to use event context
export const useEvents = () => {
  const context = useContext(EventContext);
  if (!context) {
    throw new Error('useEvents must be used within an EventProvider');
  }
  return context;
};

export default EventContext;