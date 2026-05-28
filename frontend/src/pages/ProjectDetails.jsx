import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { FiArrowLeft, FiGithub, FiExternalLink, FiCheck } from 'react-icons/fi';
import { useProjects } from '../context/ProjectContext';
import ImageSlider from '../components/Common/ImageSlider';
import LoadingSkeleton from '../components/Common/LoadingSkeleton';
import ProjectCard from '../components/Projects/ProjectCard';

const ProjectDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { getProject, projects } = useProjects();
  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCurrentProject = async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await getProject(id);
        setProject(data);
      } catch (err) {
        console.error('Failed to load project details:', err);
        setError('Project details could not be found or retrieved.');
      } finally {
        setLoading(false);
      }
    };

    fetchCurrentProject();
  }, [id, getProject]);

  if (loading) {
    return (
      <div className="page-wrapper pt-5 pb-5">
        <div className="container pt-5 mt-5">
          <LoadingSkeleton type="details" />
        </div>
      </div>
    );
  }

  if (error || !project) {
    return (
      <div className="page-wrapper pt-5 pb-5">
        <div className="container pt-5 mt-5 text-center">
          <div className="glass-card p-5 max-width-600 mx-auto">
            <h2 className="text-danger mb-4">Error</h2>
            <p className="text-secondary mb-4">{error || 'Project not found'}</p>
            <Link to="/projects" className="btn btn-primary d-inline-flex align-items-center gap-2 interactive">
              <FiArrowLeft /> Back to Projects
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // Find related projects (same category, excluding current project)
  const relatedProjects = projects
    .filter((p) => p.category === project.category && p.id !== project.id)
    .slice(0, 3);

  return (
    <div className="page-wrapper pt-5 pb-5 text-start">
      <div className="container pt-5">
        {/* Back navigation */}
        <div className="mb-4">
          <button 
            onClick={() => navigate(-1)} 
            className="btn btn-outline-secondary d-inline-flex align-items-center gap-2 interactive"
          >
            <FiArrowLeft /> Back
          </button>
        </div>

        {/* Project Layout Header */}
        <div className="row g-5 mb-5">
          {/* Left Column: Image Slider */}
          <div className="col-lg-6">
            <ImageSlider images={project.images} />
          </div>

          {/* Right Column: Specifications Card */}
          <div className="col-lg-6">
            <div className="d-flex align-items-center gap-3 mb-3">
              <span className="badge bg-primary px-3 py-2 text-uppercase letter-spacing-1">{project.category}</span>
              <small className="text-muted">Created: {project.createdDate}</small>
            </div>
            
            <h1 className="text-gradient fs-2 fw-extrabold mb-3">{project.title}</h1>
            <p className="lead text-secondary mb-4">{project.summary}</p>
            
            <h4 className="fs-6 fw-bold text-white mb-3">TECHNOLOGIES USED</h4>
            <div className="d-flex flex-wrap gap-2 mb-4">
              {project.tech.map((t) => (
                <span key={t} className="project-tech-badge badge-modal px-2.5 py-1">{t}</span>
              ))}
            </div>

            {/* Actions Links */}
            <div className="d-flex flex-wrap gap-3 pt-3 border-top border-secondary-subtle">
              {project.liveUrl && (
                <a 
                  href={project.liveUrl} 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="btn-premium d-flex align-items-center gap-2 interactive"
                >
                  Live Preview <FiExternalLink />
                </a>
              )}
              {project.githubUrl && (
                <a 
                  href={project.githubUrl} 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="btn-premium-outline d-flex align-items-center gap-2 interactive"
                >
                  Source Code <FiGithub />
                </a>
              )}
            </div>
          </div>
        </div>

        {/* Project Body: Detailed Description & Features */}
        <div className="row g-5 mb-5">
          <div className="col-lg-8">
            <div className="glass-card p-4 p-md-5 mb-4">
              <h3 className="text-white mb-4">Project Overview</h3>
              <p className="text-secondary" style={{ whiteSpace: 'pre-line', fontSize: '1.05rem', lineHeight: '1.8' }}>
                {project.description}
              </p>
            </div>
          </div>

          <div className="col-lg-4">
            <div className="glass-card p-4 h-100">
              <h3 className="text-white mb-4">Key Features</h3>
              <ul className="features-list-custom p-0">
                {project.features && project.features.map((feat, idx) => (
                  <li key={idx} className="feature-item d-flex gap-2 align-items-start mb-3">
                    <FiCheck className="feature-check-icon mt-1" />
                    <span className="small">{feat}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* Related Projects Section */}
        {relatedProjects.length > 0 && (
          <div className="pt-4 border-top border-secondary-subtle">
            <h3 className="text-white mb-4">Related Projects</h3>
            <div className="row g-4">
              {relatedProjects.map((related) => (
                <div key={related.id} className="col-lg-4 col-md-6 col-sm-12">
                  <ProjectCard project={related} />
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProjectDetails;
