import { Link } from 'react-router-dom';
import { Facebook, Instagram, Mail, MapPin, Phone, Youtube } from 'lucide-react';
import schoolLogo from '../assets/gurugram-school-logo.png';

const policies = [
  ['Privacy Policy', '/privacy-policy'],
  ['Refund Policy', '/refund-policy'],
  ['Terms & Conditions', '/terms-and-conditions'],
  ['Disclaimer', '/disclaimer'],
  ['Cancellation Policy', '/cancellation-policy']
];
const quickLinks = ['about', 'admissions', 'academics', 'faculty', 'gallery', 'events-news', 'notice-board', 'contact'];

export function Footer() {
  return (
    <footer className="site-footer">
      <div className="footer-brand">
        <div className="footer-logo-line">
          <img src={schoolLogo} alt="Gurugram Public School logo" />
          <h2>Gurugram Public School</h2>
        </div>
        <p>Premium academics, transparent payments, connected portals, and a future-ready learning culture.</p>
        <p><MapPin size={16} /> NH-33 Ranchi-Patna Road,<br />Beside Kargil Petrol Pump,<br />Hazaribagh, Jharkhand 825301</p>
        <p><Phone size={16} /> +91 99553 67376, +91 93043 33219</p>
        <p><Mail size={16} /> <a href="mailto:info@gurugrambish.in">info@gurugrambish.in</a></p>
        <div className="footer-socials">
          <a href="https://www.facebook.com" aria-label="Facebook" target="_blank" rel="noreferrer"><Facebook size={18} /></a>
          <a href="https://www.instagram.com" aria-label="Instagram" target="_blank" rel="noreferrer"><Instagram size={18} /></a>
          <a href="https://www.youtube.com" aria-label="YouTube" target="_blank" rel="noreferrer"><Youtube size={18} /></a>
        </div>
      </div>
      <div className="footer-grid">
        <h3>Explore</h3>
        {quickLinks.map((link) => (
          <Link key={link} to={`/${link}`}>
            {link.replaceAll('-', ' ')}
          </Link>
        ))}
      </div>
      <div className="footer-grid">
        <h3>Policies</h3>
        {policies.map(([label, to]) => (
          <Link key={to} to={to}>
            {label}
          </Link>
        ))}
      </div>
      <div className="footer-panel">
        <h3>Admissions & ERP</h3>
        <Link className="footer-admission-cta" to="/admissions">Admission Enquiry</Link>
        <Link to="/login/student">Student Login</Link>
        <Link to="/login/admin">Admin Login</Link>
        <Link to="/register/student">Student Registration</Link>
      </div>
      <div className="footer-bottom">Copyright 2026 Gurugram Public School. All rights reserved.</div>
    </footer>
  );
}
