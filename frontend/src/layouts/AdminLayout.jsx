import React from 'react';
import Sidebar from '../components/Dashboard/Sidebar';
import { useAuth } from '../context/AuthContext';
import './AdminLayout.css';

const AdminLayout = ({ children, activeTab, setActiveTab }) => {
  const { logout, user } = useAuth();

  return (
    <div className="admin-layout-container">
      {/* Sidebar navigation */}
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />

      {/* Main Administrative Dashboard Area */}
      <div className="admin-main-area">
        <header className="admin-header glass-card d-flex justify-content-between align-items-center p-3 mb-4">
          <div className="admin-welcome">
            <h2 className="fs-5 mb-0 text-gradient">Admin Workspace</h2>
            <small className="text-muted">Welcome back, {user?.username || 'Administrator'}</small>
          </div>
          <div className="d-flex align-items-center gap-3">
            <span className="badge bg-primary px-3 py-2">Role: {user?.role || 'Admin'}</span>
            <button 
              onClick={logout} 
              className="btn btn-outline-danger btn-sm px-3 interactive"
            >
              Sign Out
            </button>
          </div>
        </header>

        <main className="admin-content-workspace">
          {children}
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
