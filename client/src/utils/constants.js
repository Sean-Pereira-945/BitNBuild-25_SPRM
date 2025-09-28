export const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';
export const SOCKET_URL = process.env.REACT_APP_SOCKET_URL || 'http://localhost:5000';
export const DEFAULT_THEME = process.env.REACT_APP_DEFAULT_THEME || 'light';

export const EVENT_FILTERS = {
  upcoming: 'upcoming',
  past: 'past',
  bookmarked: 'bookmarked',
  hosted: 'hosted'
};

export const NOTIFICATION_TYPES = {
  general: 'general',
  event: 'event',
  badge: 'badge', // changed from certificate
  social: 'social'
};

export const THEMES = ['light', 'dark'];

export const ROLE_DASHBOARD_PATHS = {
  organizer: '/dashboard/organizer',
  attendee: '/dashboard/attendee',
  admin: '/dashboard/organizer'
};

export const ROLE_OPTIONS = [
  { label: 'Organizer', value: 'organizer', description: 'Create events, mint NFT badges, and manage attendees.' },
  { label: 'Attendee', value: 'attendee', description: 'Discover events, collect NFT badges, and grow your reputation.' }
];
