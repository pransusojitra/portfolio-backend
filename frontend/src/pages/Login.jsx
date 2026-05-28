import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { FiUser, FiLock, FiAlertCircle } from 'react-icons/fi';
import { useAuth } from '../context/AuthContext';

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { login, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  // Redirect if already logged in
  useEffect(() => {
    if (isAuthenticated) {
      navigate('/admin');
    }
  }, [isAuthenticated, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!username.trim() || !password.trim()) {
      setError('Please provide both username and password fields.');
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await login(username, password);
      if (res.success) {
        navigate('/admin');
      } else {
        setError(res.error || 'Authentication failed. Please verify credentials.');
      }
    } catch (err) {
      setError('An unexpected error occurred. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="login-page-container">
      <div className="login-card glass-card text-center">
        {/* Header */}
        <h2 className="text-gradient fs-2 fw-bold mb-2">Portal Entrance</h2>
        <p className="text-muted small mb-4">Provide administrator credentials to manage projects.</p>

        {/* Info Banner showing default credentials */}
        <div className="alert alert-info py-2 px-3 mb-4 text-start" style={{ fontSize: '0.85rem' }}>
          💡 **Developer Credentials:**<br />
          • Username: `admin`<br />
          • Password: `password123`
        </div>

        {/* Error Alert */}
        {error && (
          <div className="alert alert-danger py-2.5 px-3 mb-4 text-start d-flex align-items-center gap-2" style={{ fontSize: '0.9rem' }}>
            <FiAlertCircle size={16} className="flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* Credentials Form */}
        <form onSubmit={handleSubmit} noValidate>
          {/* Username */}
          <div className="mb-3 text-start">
            <label htmlFor="username-login" className="form-label text-secondary small fw-semibold">
              USERNAME
            </label>
            <div className="input-group">
              <span className="input-group-text bg-dark border-secondary text-muted">
                <FiUser size={16} />
              </span>
              <input
                type="text"
                id="username-login"
                className="form-control bg-dark border-secondary text-white"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="admin"
                disabled={isSubmitting}
              />
            </div>
          </div>

          {/* Password */}
          <div className="mb-4 text-start">
            <label htmlFor="password-login" className="form-label text-secondary small fw-semibold">
              PASSWORD
            </label>
            <div className="input-group">
              <span className="input-group-text bg-dark border-secondary text-muted">
                <FiLock size={16} />
              </span>
              <input
                type="password"
                id="password-login"
                className="form-control bg-dark border-secondary text-white"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                disabled={isSubmitting}
              />
            </div>
          </div>

          {/* Action button */}
          <button
            type="submit"
            className="btn-premium w-100 py-2.5 d-flex align-items-center justify-content-center gap-2 interactive"
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <>
                <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true" />
                Validating Entry...
              </>
            ) : (
              'Authenticate Session'
            )}
          </button>
        </form>

        <div className="mt-4 pt-3 border-top border-secondary-subtle">
          <Link to="/" className="text-secondary small interactive">
            ← Return to Portfolio Home
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Login;
