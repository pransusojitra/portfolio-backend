import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiArrowRight, FiGithub, FiExternalLink } from 'react-icons/fi';
import './Projects.css';

const ProjectCard = ({ project }) => {
  const cardImage = project.images?.[0] || 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=800&q=80';

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.4 }}
      className="project-card-wrapper glass-card interactive h-100"
    >
      <Link to={`/projects/${project.id}`} className="project-card-link-wrapper">
        <div className="project-image-container">
          <img 
            src={cardImage} 
            alt={project.title} 
            className="project-image-fallback" 
            onError={(e) => {
              e.target.src = 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=800&q=80';
            }} 
          />
          <div className="project-category-badge">{project.category}</div>
        </div>

        <div className="project-info-wrapper p-4 text-start">
          <h3 className="project-title-text mb-2 text-gradient">{project.title}</h3>
          <p className="project-summary-text mb-3 line-clamp-2">{project.summary}</p>
          
          <div className="d-flex flex-wrap gap-2 mb-3">
            {project.tech.slice(0, 4).map((t) => (
              <span key={t} className="project-tech-badge">{t}</span>
            ))}
            {project.tech.length > 4 && (
              <span className="project-tech-badge text-muted">+{project.tech.length - 4} more</span>
            )}
          </div>

          <div className="d-flex justify-content-between align-items-center mt-auto pt-2 border-top border-secondary-subtle">
            <span className="learn-more-link text-gradient font-weight-bold d-inline-flex align-items-center gap-1">
              Explore Details <FiArrowRight className="arrow-icon" />
            </span>
            <div className="d-flex gap-2" onClick={(e) => e.stopPropagation()}>
              {project.githubUrl && (
                <a 
                  href={project.githubUrl} 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="card-social-link"
                  title="Source Code"
                >
                  <FiGithub size={16} />
                </a>
              )}
              {project.liveUrl && (
                <a 
                  href={project.liveUrl} 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="card-social-link"
                  title="Live Demo"
                >
                  <FiExternalLink size={16} />
                </a>
              )}
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
};

export default ProjectCard;
