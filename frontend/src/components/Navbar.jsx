import React, { useState } from 'react';
import { NavLink, Link } from 'react-router-dom';

const Navbar = () => {
  const [isNavCollapsed, setIsNavCollapsed] = useState(true);

  const handleNavCollapse = () => setIsNavCollapsed(!isNavCollapsed);
  const closeNav = () => setIsNavCollapsed(true);

  return (
    <nav className="navbar navbar-expand-lg navbar-dark admin-navbar sticky-top">
      <div className="container">
        {/* Brand */}
        <Link className="navbar-brand d-flex align-items-center gap-2 fw-bold" to="/" onClick={closeNav}>
          <span className="fs-4">🎓</span>
          <span className="text-white tracking-tight">Sreenandha Feedback Admin</span>
          <span className="navbar-brand-badge ms-1 d-none d-sm-inline-block">ICT ACADEMY</span>
        </Link>

        {/* Mobile Hamburger Toggle Button */}
        <button
          className="navbar-toggler border-0 shadow-none"
          type="button"
          onClick={handleNavCollapse}
          aria-controls="adminNavbar"
          aria-expanded={!isNavCollapsed}
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        {/* Navigation Links */}
        <div className={`${isNavCollapsed ? 'collapse' : ''} navbar-collapse justify-content-end`} id="adminNavbar">
          <ul className="navbar-nav gap-1 mt-2 mt-lg-0">
            <li className="nav-item">
              <NavLink
                to="/"
                end
                className={({ isActive }) =>
                  `nav-link nav-link-custom ${isActive ? 'active' : ''}`
                }
                onClick={closeNav}
              >
                <i className="bi bi-speedometer2"></i> Dashboard
              </NavLink>
            </li>
            <li className="nav-item">
              <NavLink
                to="/add"
                className={({ isActive }) =>
                  `nav-link nav-link-custom ${isActive ? 'active' : ''}`
                }
                onClick={closeNav}
              >
                <i className="bi bi-plus-circle"></i> Add Feedback
              </NavLink>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
