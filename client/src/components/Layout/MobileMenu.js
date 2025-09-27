import { useState } from 'react';
import { NavLink } from 'react-router-dom';
import useAuth from '../../hooks/useAuth';
import './MobileMenu.css';

const MobileMenu = () => {
  const [open, setOpen] = useState(false);
  const { isAuthenticated, user, logout, getDashboardPath } = useAuth();

  const handleClose = () => setOpen(false);

  return (
    <div className="mobile-menu hide-desktop">
      <button type="button" onClick={() => setOpen((value) => !value)} aria-expanded={open} aria-label="Toggle menu">
        ☰
      </button>
      {open && (
        <nav className="mobile-menu__drawer">
          <NavLink to="/" onClick={handleClose}>
            Home
          </NavLink>
          <NavLink to="/about" onClick={handleClose}>
            About
          </NavLink>
          <NavLink to="/contact" onClick={handleClose}>
            Contact
          </NavLink>
          {isAuthenticated ? (
            <>
              <NavLink to={getDashboardPath(user?.role)} onClick={handleClose}>
                Dashboard
              </NavLink>
              <NavLink to="/events" onClick={handleClose}>
                Events
              </NavLink>
              <NavLink to="/certificates" onClick={handleClose}>
                Certificates
              </NavLink>
              <NavLink to="/verify" onClick={handleClose}>
                Verify NFT
              </NavLink>
              <button
                type="button"
                className="mobile-menu__action"
                onClick={() => {
                  logout();
                  handleClose();
                }}
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <NavLink to="/login" onClick={handleClose}>
                Login
              </NavLink>
              <NavLink to="/register" onClick={handleClose}>
                Get started
              </NavLink>
            </>
          )}
        </nav>
      )}
    </div>
  );
};

export default MobileMenu;
