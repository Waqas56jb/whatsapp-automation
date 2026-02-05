import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import './Header.css';

const Header = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const isActive = (path) => location.pathname === path;

  return (
    <header className={`header ${isScrolled ? 'scrolled' : ''}`}>
      <div className="header-container">
        <Link to="/" className="logo">
          <div className="logo-icon">💬</div>
          <span className="logo-text">WhatsApp Bot</span>
        </Link>

        <nav className={`nav ${isMobileMenuOpen ? 'mobile-open' : ''}`}>
          <Link 
            to="/" 
            className={`nav-link ${isActive('/') ? 'active' : ''}`}
            onClick={() => setIsMobileMenuOpen(false)}
          >
            Home
          </Link>
          <Link 
            to="/features" 
            className={`nav-link ${isActive('/features') ? 'active' : ''}`}
            onClick={() => setIsMobileMenuOpen(false)}
          >
            Features
          </Link>
          <Link 
            to="/about" 
            className={`nav-link ${isActive('/about') ? 'active' : ''}`}
            onClick={() => setIsMobileMenuOpen(false)}
          >
            About
          </Link>
          <Link 
            to="/dashboard" 
            className={`nav-link ${isActive('/dashboard') ? 'active' : ''}`}
            onClick={() => setIsMobileMenuOpen(false)}
          >
            Dashboard
          </Link>
          <Link 
            to="/contact" 
            className={`nav-link ${isActive('/contact') ? 'active' : ''}`}
            onClick={() => setIsMobileMenuOpen(false)}
          >
            Contact
          </Link>
        </nav>

        <button 
          className="mobile-menu-toggle"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          aria-label="Toggle menu"
        >
          <span className={`hamburger ${isMobileMenuOpen ? 'open' : ''}`}>
            <span></span>
            <span></span>
            <span></span>
          </span>
        </button>
      </div>
    </header>
  );
};

export default Header;
