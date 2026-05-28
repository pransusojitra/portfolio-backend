import React from 'react';
import './Projects.css';

const ProjectFilter = ({ 
  categories = [], 
  activeCategory = 'All', 
  onCategoryChange 
}) => {
  return (
    <div className="row justify-content-center mb-5">
      <div className="col-auto">
        <div className="filter-button-group d-flex flex-wrap gap-2 justify-content-center p-2 glass-card rounded-pill">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => onCategoryChange(category)}
              className={`filter-btn rounded-pill px-4 py-2 interactive ${
                activeCategory.toLowerCase() === category.toLowerCase() ? 'active' : ''
              }`}
            >
              {category}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ProjectFilter;
