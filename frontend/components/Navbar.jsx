import { useState } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { ChevronDown, LogIn, Menu, MessageCircle, Phone, ShieldCheck, X } from 'lucide-react';
import { schoolLogo } from '../constants/branding.js';

const navGroups = [
  {
    label: 'About',
    links: [
      ['About Us', '/about'],
      ['Faculty', '/faculty']
    ]
  },
  {
    label: 'Portals',
    links: [
      ['Admissions', '/admissions'],
      ['Fee Payment', '/payments'],
      ['Student Login', '/login/student'],
      ['Admin Login', '/login/admin']
    ]
  }
];

const directLinks = [
  ['Home', '/'],
  ['Principal', '/principal-message'],
  ['Academics', '/academics'],
  ['Gallery', '/gallery'],
  ['Activities', '/#activities'],
  ['Contact', '/contact'],
  ['Student Login', '/login/student']
];

export function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  function closeMenu() {
    setIsMenuOpen(false);
  }

  return (
    <>
      <div className="top-strip">
        <div>
          <strong>Admissions Open for Session 2026-27</strong>
          <a href="tel:+919955367376"><Phone size={14} /> +91 99553 67376</a>
          <a href="mailto:info@gurugrambish.in">info@gurugrambish.in</a>
        </div>
        <div>
          <Link to="/admissions">Admission Enquiry</Link>
          <Link to="/payments">Payment</Link>
          <Link to="/login/student"><LogIn size={14} /> Student Login</Link>
          <Link to="/login/admin"><ShieldCheck size={14} /> Admin Login</Link>
        </div>
      </div>
      <header className="navbar">
        <Link to="/" className="brand" onClick={closeMenu}>
          <img src={schoolLogo} alt="Gurugram Public School logo" />
          <span>
            <strong>Gurugram Public School</strong>
            <small>Affiliated to C.B.S.E.</small>
          </span>
        </Link>
        <nav className="nav-links" aria-label="Primary navigation">
          {directLinks.map(([label, to]) => (
            to.includes('#') ? (
              <Link key={to} to={to} onClick={closeMenu}>{label}</Link>
            ) : (
              <NavLink key={to} to={to} onClick={closeMenu}>
                {label}
              </NavLink>
            )
          ))}
          {navGroups.map((group) => (
            <div className="nav-dropdown" key={group.label}>
              <button type="button">
                {group.label}
                <ChevronDown size={15} />
              </button>
              <div className="dropdown-menu">
                {group.links.map(([label, to]) => (
                  <NavLink key={to} to={to} onClick={closeMenu}>
                    {label}
                  </NavLink>
                ))}
              </div>
            </div>
          ))}
        </nav>
        <Link className="navbar-cta" to="/admissions">
          Admissions
        </Link>
        <a className="icon-button" href="https://wa.me/919955367376" aria-label="WhatsApp admissions" target="_blank" rel="noreferrer">
          <MessageCircle size={18} />
        </a>
        <button className="mobile-menu" type="button" aria-label={isMenuOpen ? 'Close menu' : 'Open menu'} onClick={() => setIsMenuOpen((open) => !open)}>
          {isMenuOpen ? <X size={22} /> : <Menu size={22} />}
        </button>
      </header>
      <nav className={`mobile-nav-panel ${isMenuOpen ? 'open' : ''}`} aria-label="Mobile navigation">
        {directLinks.map(([label, to]) => (
          to.includes('#') ? (
            <Link key={to} to={to} onClick={closeMenu}>{label}</Link>
          ) : (
            <NavLink key={to} to={to} onClick={closeMenu}>
              {label}
            </NavLink>
          )
        ))}
        {navGroups.flatMap((group) => group.links).map(([label, to]) => (
          <NavLink key={to} to={to} onClick={closeMenu}>
            {label}
          </NavLink>
        ))}
      </nav>
    </>
  );
}


