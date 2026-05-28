import React, { useState, useEffect } from 'react';
import { NavLink, Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { FiSun, FiMoon, FiMenu, FiX, FiLock, FiLogOut } from 'react-icons/fi';
import { useTheme } from '../../context/ThemeContext';
import { useAuth } from '../../context/AuthContext';
import './Navbar.css';

const navLinks = [
  { path: '/', label: 'Home' },
  { path: '/about', label: 'About' },
  { path: '/projects', label: 'Projects' },
  { path: '/contact', label: 'Contact' },
  { path: '/ai-assistant', label: 'AI Chat' },
];

const Navbar = () => {
  const { theme, toggleTheme } = useTheme();
  const { isAuthenticated, logout } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();

  // Monitor scroll height to add backdrop styling
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 50) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close drawer on path change
  useEffect(() => {
    setIsOpen(false);
  }, [location.pathname]);

  return (
    <nav className={`navbar-custom ${scrolled ? 'scrolled' : ''}`}>
      <div className="container d-flex justify-content-between align-items-center h-100">
        {/* Logo */}
        <Link to="/" className="navbar-logo">
          Portfolio<span className="dot">.</span>
        </Link>

        {/* Desktop Navigation */}
        <div className="d-none d-md-flex align-items-center gap-4">
          <ul className="nav-list mb-0">
            {navLinks.map((link) => (
              <li key={link.path} className="nav-item">
                <NavLink
                  to={link.path}
                  className={({ isActive }) => 
                    `nav-link-custom ${isActive ? 'active' : ''}`
                  }
                >
                  {({ isActive }) => (
                    <>
                      {link.label}
                      {isActive && (
                        <motion.div
                          layoutId="activeIndicator"
                          className="active-indicator"
                          transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                        />
                      )}
                    </>
                  )}
                </NavLink>
              </li>
            ))}

            {/* Conditionally show admin link if logged in */}
            {isAuthenticated ? (
              <>
                <li className="nav-item">
                  <NavLink
                    to="/admin"
                    className={({ isActive }) => 
                      `nav-link-custom ${isActive ? 'active' : ''}`
                    }
                  >
                    Dashboard
                  </NavLink>
                </li>
                <li className="nav-item">
                  <button 
                    onClick={logout} 
                    className="nav-link-custom border-0 bg-transparent text-danger d-flex align-items-center gap-1 interactive"
                    title="Logout"
                  >
                    <FiLogOut size={16} /> Logout
                  </button>
                </li>
              </>
            ) : (
              <li className="nav-item">
                <NavLink
                  to="/login"
                  className={({ isActive }) => 
                    `nav-link-custom d-flex align-items-center gap-1 ${isActive ? 'active' : ''}`
                  }
                >
                  <FiLock size={14} /> Login
                </NavLink>
              </li>
            )}
          </ul>

          {/* Theme Switcher Toggle */}
          <button 
            onClick={toggleTheme} 
            className="theme-toggle-btn interactive"
            aria-label="Toggle light/dark theme"
          >
            {theme === 'dark' ? <FiSun size={20} /> : <FiMoon size={20} />}
          </button>
        </div>

        {/* Mobile Navbar Buttons */}
        <div className="d-flex d-md-none align-items-center gap-3">
          <button 
            onClick={toggleTheme} 
            className="theme-toggle-btn interactive"
            aria-label="Toggle light/dark theme"
          >
            {theme === 'dark' ? <FiSun size={20} /> : <FiMoon size={20} />}
          </button>
          
          <button 
            onClick={() => setIsOpen(!isOpen)} 
            className="hamburger-btn interactive"
            aria-label="Toggle navigation menu"
          >
            {isOpen ? <FiX size={24} /> : <FiMenu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className="mobile-menu"
          >
            <ul className="mobile-nav-list">
              {navLinks.map((link) => (
                <li key={link.path} className="mobile-nav-item">
                  <NavLink
                    to={link.path}
                    className={({ isActive }) => 
                      `mobile-nav-link-custom ${isActive ? 'active' : ''}`
                    }
                  >
                    {link.label}
                  </NavLink>
                </li>
              ))}

              {isAuthenticated ? (
                <>
                  <li className="mobile-nav-item">
                    <NavLink
                      to="/admin"
                      className={({ isActive }) => 
                        `mobile-nav-link-custom ${isActive ? 'active' : ''}`
                      }
                    >
                      Dashboard
                    </NavLink>
                  </li>
                  <li className="mobile-nav-item">
                    <button
                      onClick={() => {
                        logout();
                        setIsOpen(false);
                      }}
                      className="mobile-nav-link-custom border-0 bg-transparent text-danger text-start w-100 d-flex align-items-center gap-2 interactive"
                    >
                      <FiLogOut size={18} /> Logout
                    </button>
                  </li>
                </>
              ) : (
                <li className="mobile-nav-item">
                  <NavLink
                    to="/login"
                    className={({ isActive }) => 
                      `mobile-nav-link-custom d-flex align-items-center gap-2 ${isActive ? 'active' : ''}`
                    }
                  >
                    <FiLock size={16} /> Login
                  </NavLink>
                </li>
              )}
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default Navbar;
