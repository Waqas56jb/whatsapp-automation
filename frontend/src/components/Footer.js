import React from 'react';
import { Link } from 'react-router-dom';
import './Footer.css';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="footer">
      <div className="footer-container">
        <div className="footer-content">
          <div className="footer-section">
            <h3 className="footer-title">
              <span className="footer-logo-icon">💬</span>
              WhatsApp Bot
            </h3>
            <p className="footer-description">
              Intelligent WhatsApp automation powered by AI. Transform your customer communication with automated, intelligent responses.
            </p>
            <div className="social-links">
              <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="social-link" aria-label="Facebook">📘</a>
              <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="social-link" aria-label="Twitter">🐦</a>
              <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="social-link" aria-label="LinkedIn">💼</a>
              <a href="https://github.com" target="_blank" rel="noopener noreferrer" className="social-link" aria-label="GitHub">🔗</a>
            </div>
          </div>

          <div className="footer-section">
            <h4 className="footer-heading">Quick Links</h4>
            <ul className="footer-links">
              <li><Link to="/">Home</Link></li>
              <li><Link to="/features">Features</Link></li>
              <li><Link to="/about">About Us</Link></li>
              <li><Link to="/dashboard">Dashboard</Link></li>
              <li><Link to="/contact">Contact</Link></li>
            </ul>
          </div>

          <div className="footer-section">
            <h4 className="footer-heading">Features</h4>
            <ul className="footer-links">
              <li><Link to="/features">AI-Powered Responses</Link></li>
              <li><Link to="/features">24/7 Automation</Link></li>
              <li><Link to="/features">Easy Integration</Link></li>
              <li><Link to="/features">Analytics & Insights</Link></li>
              <li><Link to="/features">Secure & Reliable</Link></li>
            </ul>
          </div>

          <div className="footer-section">
            <h4 className="footer-heading">Support</h4>
            <ul className="footer-links">
              <li><Link to="/contact">Documentation</Link></li>
              <li><Link to="/contact">API Reference</Link></li>
              <li><Link to="/contact">Tutorials</Link></li>
              <li><Link to="/contact">FAQ</Link></li>
              <li><Link to="/contact">Help Center</Link></li>
            </ul>
          </div>

          <div className="footer-section">
            <h4 className="footer-heading">Contact Info</h4>
            <ul className="footer-contact">
              <li>📧 support@whatsappbot.com</li>
              <li>📱 +1 (555) 123-4567</li>
              <li>📍 123 Tech Street, San Francisco, CA</li>
            </ul>
          </div>
        </div>

        <div className="footer-bottom">
          <div className="footer-bottom-content">
            <p>&copy; {currentYear} WhatsApp Bot. All rights reserved.</p>
            <div className="footer-legal">
              <Link to="/contact">Privacy Policy</Link>
              <span>|</span>
              <Link to="/contact">Terms of Service</Link>
              <span>|</span>
              <Link to="/contact">Cookie Policy</Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
