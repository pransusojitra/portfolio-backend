import React, { useState, useEffect } from 'react';
import SearchBar from '../components/Projects/SearchBar';
import ProjectFilter from '../components/Projects/ProjectFilter';
import ProjectGrid from '../components/Projects/ProjectGrid';
import LoadingSkeleton from '../components/Common/LoadingSkeleton';
import { useProjects } from '../context/ProjectContext';

const ITEMS_PER_PAGE = 6;

const Projects = () => {
  const { projects, loading, error } = useProjects();
  const [filteredProjects, setFilteredProjects] = useState([]);
  const [activeCategory, setActiveCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);

  // Derive unique categories from projects list
  const categories = ['All', ...new Set(projects.map(p => p.category))];

  // Perform search & filter operations
  useEffect(() => {
    let result = [...projects];

    // Filter by Category
    if (activeCategory.toLowerCase() !== 'all') {
      result = result.filter(p => p.category.toLowerCase() === activeCategory.toLowerCase());
    }

    // Filter by Search Query
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter(p => 
        p.title.toLowerCase().includes(q) ||
        p.summary.toLowerCase().includes(q) ||
        p.description.toLowerCase().includes(q) ||
        p.tech.some(t => t.toLowerCase().includes(q))
      );
    }

    setFilteredProjects(result);
    setCurrentPage(1); // Reset page on query shift
  }, [projects, activeCategory, searchQuery]);

  // Calculate pagination variables
  const totalPages = Math.ceil(filteredProjects.length / ITEMS_PER_PAGE);
  const indexOfLastItem = currentPage * ITEMS_PER_PAGE;
  const indexOfFirstItem = indexOfLastItem - ITEMS_PER_PAGE;
  const currentProjects = filteredProjects.slice(indexOfFirstItem, indexOfLastItem);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
    window.scrollTo({ top: 180, behavior: 'smooth' });
  };

  return (
    <div className="page-wrapper pt-5 pb-5">
      {/* Banner */}
      <div className="container pt-5 text-center">
        <h1 className="text-gradient fs-1 fw-extrabold mb-2">Project Portfolio</h1>
        <div className="title-line mx-auto mb-4" style={{ width: '80px', height: '3px', background: 'var(--color-primary)' }} />
        <p className="text-muted max-width-600 mx-auto mb-5">
          Browse through my engineering works, including SaaS dashboards, analytics frameworks, and experimental graphics showcases.
        </p>

        {/* Search Input */}
        <SearchBar 
          searchQuery={searchQuery} 
          onSearchChange={setSearchQuery} 
        />

        {/* Category Filters */}
        <ProjectFilter
          categories={categories}
          activeCategory={activeCategory}
          onCategoryChange={setActiveCategory}
        />

        {/* Error handling */}
        {error && (
          <div className="alert alert-danger max-width-600 mx-auto my-4" role="alert">
            {error}
          </div>
        )}

        {/* Project Cards Workspace */}
        {loading ? (
          <LoadingSkeleton type="card" count={3} />
        ) : (
          <>
            <ProjectGrid 
              projects={currentProjects} 
              loading={loading} 
            />

            {/* Pagination Controls */}
            {totalPages > 1 && (
              <div className="d-flex justify-content-center mt-5">
                <nav aria-label="Projects page navigation">
                  <ul className="pagination gap-2 border-0">
                    <li className={`page-item ${currentPage === 1 ? 'disabled' : ''}`}>
                      <button
                        className="btn btn-outline-secondary px-3 py-2 rounded interactive"
                        onClick={() => handlePageChange(currentPage - 1)}
                        disabled={currentPage === 1}
                      >
                        Prev
                      </button>
                    </li>
                    
                    {[...Array(totalPages)].map((_, index) => (
                      <li key={index} className="page-item">
                        <button
                          className={`btn px-3.5 py-2 rounded interactive ${
                            currentPage === index + 1
                              ? 'btn-primary'
                              : 'btn-outline-secondary'
                          }`}
                          onClick={() => handlePageChange(index + 1)}
                        >
                          {index + 1}
                        </button>
                      </li>
                    ))}

                    <li className={`page-item ${currentPage === totalPages ? 'disabled' : ''}`}>
                      <button
                        className="btn btn-outline-secondary px-3 py-2 rounded interactive"
                        onClick={() => handlePageChange(currentPage + 1)}
                        disabled={currentPage === totalPages}
                      >
                        Next
                      </button>
                    </li>
                  </ul>
                </nav>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default Projects;
