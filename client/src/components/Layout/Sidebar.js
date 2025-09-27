import React from 'react';
import { NavLink } from 'react-router-dom';

const Sidebar = () => {
  return (
    <aside className="sidebar">
      <h3>Navigation</h3>
      <ul>
        <li><NavLink to="/profile">My Profile</NavLink></li>
        <li><NavLink to="/events">All Events</NavLink></li>
        <li><NavLink to="/certificates">My Certificates</NavLink></li>
      </ul>
    </aside>
  );
};

export default Sidebar;
