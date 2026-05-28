import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { FiLayout, FiFolder, FiMail, FiArrowLeft, FiLogOut } from 'react-icons/fi';
import { useAuth } from '../../context/AuthContext';
import './Sidebar.css';

const Sidebar = ({ activeTab = 'overview', setActiveTab }) => {
  const { logout } = useAuth();
  const location = useLocation();

  const menuItems = [
    { id: 'overview', label: 'Overview', icon: <FiLayout size={18} /> },
    { id: 'projects', label: 'Manage Projects', icon: <FiFolder size={18} /> },
    { id: 'messages', label: 'Inquiries', icon: <FiMail size={18} /> },
  ];

  return (
    <aside className="admin-sidebar glass-card d-flex flex-column p-4">
      {/* Brand logo */}
      <div className="sidebar-brand mb-5">
        <Link to="/" className="navbar-logo fs-4 text-white">
          AdminPanel<span className="dot">.</span>
        </Link>
      </div>

      {/* Navigation tabs */}
      <nav className="sidebar-nav d-flex flex-column gap-2 flex-grow-1">
        {menuItems.map((item) => (
          <button
            key={item.id}
            onClick={() => setActiveTab(item.id)}
            className={`sidebar-nav-item d-flex align-items-center gap-3 px-3 py-2 rounded border-0 bg-transparent text-start interactive ${
              activeTab === item.id ? 'active' : ''
            }`}
          >
            <span className="nav-icon">{item.icon}</span>
            <span className="nav-label">{item.label}</span>
          </button>
        ))}
      </nav>

      {/* Footer operations */}
      <div className="sidebar-footer d-flex flex-column gap-2 pt-4 border-top border-secondary-subtle">
        <Link 
          to="/" 
          className="sidebar-nav-item d-flex align-items-center gap-3 px-3 py-2 rounded text-start text-secondary interactive"
        >
          <FiArrowLeft size={18} />
          <span>Exit Workspace</span>
        </Link>
        <button 
          onClick={logout} 
          className="sidebar-nav-item d-flex align-items-center gap-3 px-3 py-2 rounded text-start text-danger border-0 bg-transparent interactive"
        >
          <FiLogOut size={18} />
          <span>Logout</span>
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
