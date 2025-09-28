import { NavLink } from 'react-router-dom';
import useAuth from '../../hooks/useAuth';
import { ROLE_DASHBOARD_PATHS } from '../../utils/constants';
import './Sidebar.css';

const organizerLinks = [
  { to: ROLE_DASHBOARD_PATHS.organizer, label: 'Overview', end: true },
  { to: `${ROLE_DASHBOARD_PATHS.organizer}/finance`, label: 'Gas & Wallet' }
];

const attendeeLinks = [
  { to: ROLE_DASHBOARD_PATHS.attendee, label: 'My Feed', end: true },
  { to: `${ROLE_DASHBOARD_PATHS.attendee}/events`, label: 'Discover Events' },
  { to: `${ROLE_DASHBOARD_PATHS.attendee}/scanner`, label: 'QR Scanner' },
  { to: `${ROLE_DASHBOARD_PATHS.attendee}/collection`, label: 'NFT Collection' },
  { to: `${ROLE_DASHBOARD_PATHS.attendee}/social`, label: 'Social & Alerts' }
];

const sharedLinks = [
  { to: '/profile', label: 'Profile' },
  { to: '/verify', label: 'Public Verification' }
];

const guestLinks = [
  { to: '/', label: 'Home', end: true },
  { to: '/about', label: 'About' },
  { to: '/contact', label: 'Contact' }
];

const Sidebar = () => {
  const { isAuthenticated, user } = useAuth();

  if (!isAuthenticated) {
    return (
      <aside className="sidebar hide-mobile">
        <h3 className="sidebar__title">Explore EventChain</h3>
        <nav className="sidebar__nav">
          {guestLinks.map((link) => (
            <NavLink key={link.to} to={link.to} end={link.end}>
              {link.label}
            </NavLink>
          ))}
        </nav>
      </aside>
    );
  }

  const roleLinks = user?.role === 'organizer' || user?.role === 'admin' ? organizerLinks : attendeeLinks;

  return (
    <aside className="sidebar hide-mobile">
      <h3 className="sidebar__title">{user?.role === 'organizer' || user?.role === 'admin' ? 'Organizer Hub' : 'Attendee Hub'}</h3>
      <nav className="sidebar__nav">
        {roleLinks.map((link) => (
          <NavLink key={link.to} to={link.to} end={link.end}>
            {link.label}
          </NavLink>
        ))}
        <div className="sidebar__divider" aria-hidden />
        {sharedLinks.map((link) => (
          <NavLink key={link.to} to={link.to}>
            {link.label}
          </NavLink>
        ))}
      </nav>
      <div className="sidebar__card">
        <h4>Pro tip</h4>
        <p>Check your role dashboard for quick actions tailored to your workflow.</p>
        <a href="/docs" className="sidebar__link">
          Read the playbook
        </a>
      </div>
    </aside>
  );
};

export default Sidebar;
