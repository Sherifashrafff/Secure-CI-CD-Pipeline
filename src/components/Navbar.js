import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import './Navbar.css';

function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);

  const links = [
    { to: '/', label: 'Home' },
    { to: '/todos', label: 'To-Do' },
    { to: '/notes', label: 'Notes' },
    { to: '/counter', label: 'Counter' },
    { to: '/about', label: 'About' },
  ];

  return (
    <nav className="navbar" role="navigation" aria-label="main navigation">
      <div className="navbar-brand">
        <span className="brand-icon">&#9654;</span>
        <span className="brand-name">My Jenkins App</span>
      </div>

      <button
        className="hamburger"
        aria-label="toggle menu"
        onClick={() => setMenuOpen(!menuOpen)}
      >
        <span /><span /><span />
      </button>

      <ul className={`nav-links ${menuOpen ? 'open' : ''}`}>
        {links.map(({ to, label }) => (
          <li key={to}>
            <NavLink
              to={to}
              end={to === '/'}
              className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}
              onClick={() => setMenuOpen(false)}
            >
              {label}
            </NavLink>
          </li>
        ))}
      </ul>
    </nav>
  );
}

export default Navbar;
