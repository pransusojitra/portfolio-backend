import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import ProjectCard from './ProjectCard';
import './Projects.css';

const ProjectGrid = ({ projects = [], loading = false }) => {
  if (loading) {
    return null; // Parent will handle showing skeletons
  }

  if (projects.length === 0) {
    return (
      <div className="col-12 text-center py-5">
        <div className="glass-card p-5 max-width-500 mx-auto">
          <h3 className="text-muted mb-3">No Projects Found</h3>
          <p className="mb-0 text-secondary">
            Try adjusting your search criteria or checking another category.
          </p>
        </div>
      </div>
    );
  }

  return (
    <motion.div layout className="row g-4 justify-content-start">
      <AnimatePresence mode="popLayout">
        {projects.map((project) => (
          <div key={project.id} className="col-lg-4 col-md-6 col-sm-12 text-start">
            <ProjectCard project={project} />
          </div>
        ))}
      </AnimatePresence>
    </motion.div>
  );
};

export default ProjectGrid;
