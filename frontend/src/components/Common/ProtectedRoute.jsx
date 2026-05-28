import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import LoadingSkeleton from './LoadingSkeleton';

const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return (
      <div className="container py-5 mt-5">
        <div className="row justify-content-center">
          <div className="col-12 col-md-10">
            <h3 className="text-center text-muted mb-4">Verifying session...</h3>
            <LoadingSkeleton type="table" />
          </div>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    // Save the intended path for redirect back after login
    return <Navigate to="/login" replace />;
  }

  return children;
};

export default ProtectedRoute;
