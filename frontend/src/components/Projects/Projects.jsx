import React, { useState } from 'react';
import { motion as framerMotion, AnimatePresence as FramerAnimatePresence } from 'framer-motion';
import { FiExternalLink, FiGithub, FiX, FiCheck } from 'react-icons/fi';
import './Projects.css';

// Mock projects data
const projectsData = [
  {
    id: 1,
    title: 'Aether AI - SaaS Dashboard',
    category: 'Fullstack',
    tech: ['React', 'Node.js', 'Express', 'MongoDB', 'OpenAI API'],
    summary: 'Next-gen AI assistant dashboard with document ingestion, text synthesis, and metrics tracking.',
    description: 'Aether AI is a production-ready SaaS workspace that integrates OpenAI models to parse uploaded documents, summarize long-form text, and generate key business insights. It includes real-time telemetry, user tier billing gates, and configurable agent behaviors.',
    features: [
      'Document parsing (PDF/Txt/Docx) via secure buffer stream.',
      'Custom AI prompt workflows and vector storage for RAG.',
      'Visual workspace with draggable insight cards.',
      'Comprehensive Admin dashboard showing API usage and cost allocation.'
    ],
    image: '/assets/projects/aether_ai.png',
    liveUrl: 'https://aether-ai.example.com',
    githubUrl: 'https://github.com/alexrivera/aether-ai'
  },
  {
    id: 2,
    title: 'Chronos Builder - Page CMS',
    category: 'Frontend',
    tech: ['React', 'Framer Motion', 'Tailwind', 'HTML5', 'LocalStorage'],
    summary: 'Visual drag-and-drop page builder tool with customizable blocks and live code generator.',
    description: 'Chronos Builder provides a graphical canvas for modern web design. Users can drag pre-styled components (Hero, Features, Pricing) to assemble pages, adjust sizing via layout sliders, edit content live, and export raw HTML/CSS packages instantly.',
    features: [
      'Visual drag-and-drop layout canvas with grid-snapping guidelines.',
      'Responsive testing mode (Mobile, Tablet, Desktop viewports).',
      'Advanced component styling controllers (colors, radii, spacing).',
      'Export production-ready JSX/CSS zip packages.'
    ],
    image: '/assets/projects/chronos_builder.png',
    liveUrl: 'https://chronos-builder.example.com',
    githubUrl: 'https://github.com/alexrivera/chronos-builder'
  },
  {
    id: 3,
    title: 'Apex Analytics Dashboard',
    category: 'Fullstack',
    tech: ['React', 'Node.js', 'Socket.io', 'PostgreSQL', 'Chart.js'],
    summary: 'Real-time telemetry stats showing active users, click events, and server process load.',
    description: 'Apex Analytics collects event packets from external clients via a lightweight tracker script and pushes them to a live WebSocket server. The resulting dashboards graph telemetry instantly, warning engineers of system bottlenecks or error spikes.',
    features: [
      'Sub-100ms real-time event pipeline using Socket.io cluster.',
      'Dynamic telemetry graphs (lines, radars, charts) powered by Chart.js.',
      'Drill-down search parameters for user agent, geolocation, and referrers.',
      'Customizable alerts that trigger webhooks/Slack messages on spike events.'
    ],
    image: '/assets/projects/apex_analytics.png',
    liveUrl: 'https://apex-analytics.example.com',
    githubUrl: 'https://github.com/alexrivera/apex-analytics'
  },
  {
    id: 4,
    title: 'Nova Portfolio Experiential',
    category: 'UI/UX',
    tech: ['React', 'GSAP', 'CSS Modules', 'Web Audio API'],
    summary: 'Awwwards-inspired immersive showcase using sound effects and scroll-guided timeline shifts.',
    description: 'Nova Portfolio is an experiments-based website displaying advanced interactive design. Utilizing Web Audio synthesizers on scroll trigger clicks and complex GSAP timeline parallax, it challenges normal user engagement paradigms with cinematic flow.',
    features: [
      'ScrollTrigger-powered canvas warping and background color mapping.',
      'Spatial spatialized audio assets mapped to scroll vectors.',
      'Ultra-fluid mouse tracking custom pointer morph effects.',
      '3D image matrix displacement shaders running via WebGL.'
    ],
    image: '/assets/projects/nova_portfolio.png',
    liveUrl: 'https://nova-experiential.example.com',
    githubUrl: 'https://github.com/alexrivera/nova-experiential'
  }
];

const categories = ['All', 'Fullstack', 'Frontend', 'UI/UX'];

const Projects = () => {
  const [filter, setFilter] = useState('All');
  const [selectedProject, setSelectedProject] = useState(null);

  const filteredProjects = filter === 'All'
    ? projectsData
    : projectsData.filter(p => p.category.toLowerCase() === filter.toLowerCase());

  return (
    <div className="container">
      {/* Section Title */}
      <div className="row justify-content-center mb-5">
        <div className="col-md-8 text-center">
          <framerMotion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-100px' }}
            transition={{ duration: 0.6 }}
            className="section-title text-gradient"
          >
            Featured Projects
          </framerMotion.h2>
          <framerMotion.div 
            initial={{ width: 0 }}
            whileInView={{ width: '80px' }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="title-line mx-auto"
          />
          <framerMotion.p 
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="section-subtitle mt-3"
          >
            Explore my latest works. Click on any project card to review full specifications and architecture.
          </framerMotion.p>
        </div>
      </div>

      {/* Filter Buttons */}
      <div className="row justify-content-center mb-5">
        <div className="col-auto">
          <div className="filter-button-group d-flex flex-wrap gap-2 justify-content-center p-2 glass-card">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setFilter(cat)}
                className={`filter-btn interactive ${filter === cat ? 'active' : ''}`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Projects Grid */}
      <framerMotion.div layout className="row g-4 justify-content-center">
        <FramerAnimatePresence mode="popLayout">
          {filteredProjects.map((project, idx) => (
            <div key={project.id} className="col-lg-6 col-md-12 text-start">
              <framerMotion.div
                layout
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.5 }}
                className="project-card-wrapper glass-card interactive h-100"
                onClick={() => setSelectedProject(project)}
              >
                <div className="project-image-container">
                  {/* Local asset mockup */}
                  <img src={project.image} alt={project.title} className="project-image-fallback" onError={(e) => {
                    // Fallback gradient if file doesn't load
                    e.target.style.display = 'none';
                    e.target.nextSibling.style.display = 'flex';
                  }} />
                  <div className="project-image-gradient-fallback d-none">
                    <span>{project.title}</span>
                  </div>
                  <div className="project-category-badge">{project.category}</div>
                </div>

                <div className="project-info-wrapper p-4">
                  <h3 className="project-title-text mb-2">{project.title}</h3>
                  <p className="project-summary-text mb-3">{project.summary}</p>
                  
                  <div className="d-flex flex-wrap gap-2 mb-3">
                    {project.tech.map((t) => (
                      <span key={t} className="project-tech-badge">{t}</span>
                    ))}
                  </div>

                  <span className="learn-more-link text-gradient font-weight-bold">
                    View Details & Features →
                  </span>
                </div>
              </framerMotion.div>
            </div>
          ))}
        </FramerAnimatePresence>
      </framerMotion.div>

      {/* Project Details Modal */}
      <FramerAnimatePresence>
        {selectedProject && (
          <framerMotion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="modal-overlay-custom"
            onClick={() => setSelectedProject(null)}
          >
            <framerMotion.div 
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              className="modal-card-custom glass-card text-start"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Modal Header */}
              <div className="modal-header-custom d-flex justify-content-between align-items-center mb-4">
                <span className="project-category-badge modal-badge">{selectedProject.category}</span>
                <button 
                  className="close-btn interactive"
                  onClick={() => setSelectedProject(null)}
                >
                  <FiX size={24} />
                </button>
              </div>

              {/* Modal Content */}
              <div className="row g-4 overflow-auto modal-scrollable-content">
                <div className="col-lg-6">
                  <div className="modal-image-wrapper">
                    <img 
                      src={selectedProject.image} 
                      alt={selectedProject.title} 
                      className="modal-project-image"
                      onError={(e) => {
                        e.target.style.display = 'none';
                        e.target.nextSibling.style.display = 'flex';
                      }}
                    />
                    <div className="project-image-gradient-fallback d-none h-100 rounded">
                      <span>{selectedProject.title} Mockup</span>
                    </div>
                  </div>
                </div>

                <div className="col-lg-6">
                  <h3 className="modal-project-title text-gradient mb-3">{selectedProject.title}</h3>
                  <p className="modal-project-desc mb-4">{selectedProject.description}</p>
                  
                  {/* Features checklist */}
                  <h4 className="features-header-text mb-3">Key Features:</h4>
                  <ul className="features-list-custom mb-4 p-0">
                    {selectedProject.features.map((feat, idx) => (
                      <li key={idx} className="feature-item d-flex gap-2 align-items-start mb-2">
                        <FiCheck className="feature-check-icon mt-1" />
                        <span>{feat}</span>
                      </li>
                    ))}
                  </ul>

                  {/* Tech stack */}
                  <h4 className="features-header-text mb-3">Technologies Used:</h4>
                  <div className="d-flex flex-wrap gap-2 mb-4">
                    {selectedProject.tech.map((t) => (
                      <span key={t} className="project-tech-badge badge-modal">{t}</span>
                    ))}
                  </div>

                  {/* Actions Links */}
                  <div className="d-flex gap-3 mt-4 pt-3 border-top border-secondary-subtle">
                    <a 
                      href={selectedProject.liveUrl} 
                      target="_blank" 
                      rel="noopener noreferrer" 
                      className="btn-premium d-flex align-items-center gap-2 interactive"
                    >
                      Live Preview <FiExternalLink />
                    </a>
                    <a 
                      href={selectedProject.githubUrl} 
                      target="_blank" 
                      rel="noopener noreferrer" 
                      className="btn-premium-outline d-flex align-items-center gap-2 interactive"
                    >
                      Source Code <FiGithub />
                    </a>
                  </div>
                </div>
              </div>
            </framerMotion.div>
          </framerMotion.div>
        )}
      </FramerAnimatePresence>
    </div>
  );
};

export default Projects;
