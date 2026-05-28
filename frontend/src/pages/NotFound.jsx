import React from 'react';
import { Link } from 'react-router-dom';
import { FiHome, FiAlertTriangle } from 'react-icons/fi';

const NotFound = () => {
  return (
    <div className="page-wrapper notfound-page-container d-flex align-items-center justify-content-center">
      {/* Background Interactive Nodes */}
      <div className="floating-icons-container">
        <div className="floating-icon icon-1" style={{ color: 'var(--color-accent)' }}><FiAlertTriangle size={36} /></div>
      </div>

      <div className="container">
        <div className="glass-card p-5 max-width-600 mx-auto text-center">
          {/* Large Gradient Code */}
          <h1 className="notfound-code">404</h1>
          
          <h2 className="fs-3 fw-bold text-white mb-3">Page Not Found</h2>
          <p className="text-secondary mb-4">
            The page you are trying to access doesn't exist, has been removed, or has had its address changed.
          </p>

          <Link to="/" className="btn-premium d-inline-flex align-items-center gap-2 px-4 py-2.5 interactive">
            <FiHome /> Return to Home
          </Link>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
