import React from 'react';
import { FiSearch, FiX } from 'react-icons/fi';
import './Projects.css';

const SearchBar = ({ 
  searchQuery = '', 
  onSearchChange, 
  placeholder = 'Search by project name, tech stack, or description...' 
}) => {
  return (
    <div className="row justify-content-center mb-4">
      <div className="col-md-8 col-sm-12">
        <div className="search-bar-container glass-card d-flex align-items-center px-3 py-2">
          <FiSearch className="search-icon text-muted me-2" size={20} />
          <input
            type="text"
            className="search-input w-100 bg-transparent border-0 text-white"
            style={{ outline: 'none', color: 'var(--text-primary)' }}
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder={placeholder}
          />
          {searchQuery && (
            <button 
              onClick={() => onSearchChange('')} 
              className="clear-search-btn bg-transparent border-0 text-muted interactive"
              title="Clear Search"
            >
              <FiX size={18} />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default SearchBar;
