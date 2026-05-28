import React from 'react';
import { motion } from 'framer-motion';
import { FiBriefcase } from 'react-icons/fi';
import './Experience.css';

const experiences = [
  {
    id: 1,
    role: 'Senior Full-Stack Engineer',
    company: 'Aetheria Labs',
    duration: '2024 - Present',
    description: 'Lead engineering for AI integration dashboards. Established robust CI/CD testing procedures, shaving deployment times by 40%. Maintained code architectures leveraging NestJS, React, and MongoDB.',
    techs: ['React', 'NestJS', 'MongoDB', 'AWS', 'Docker']
  },
  {
    id: 2,
    role: 'Full-Stack Developer',
    company: 'Synergy Tech Solutions',
    duration: '2022 - 2024',
    description: 'Collaborated on SaaS database migrations. Refactored high-traffic endpoints to optimize query times. Managed state libraries and styled component kits for fluid rendering across user states.',
    techs: ['React', 'Redux', 'Node.js', 'Express', 'PostgreSQL']
  },
  {
    id: 3,
    role: 'Frontend Developer',
    company: 'PixelForge Studios',
    duration: '2020 - 2022',
    description: 'Designed interactive web portfolios and brand landing pages. Implemented custom scroll libraries, vector visual layouts, and responsive elements matching strict design specifications.',
    techs: ['HTML5', 'CSS Modules', 'JavaScript', 'Bootstrap', 'GSAP']
  }
];

const Experience = () => {
  return (
    <div className="container">
      {/* Section Title */}
      <div className="row justify-content-center mb-5">
        <div className="col-md-8 text-center">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-100px' }}
            transition={{ duration: 0.6 }}
            className="section-title text-gradient"
          >
            Work History
          </motion.h2>
          <motion.div 
            initial={{ width: 0 }}
            whileInView={{ width: '80px' }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="title-line mx-auto"
          />
          <motion.p 
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="section-subtitle mt-3"
          >
            A chronological timeline of my professional journey in engineering.
          </motion.p>
        </div>
      </div>

      {/* Timeline Layout */}
      <div className="timeline-container-custom position-relative mx-auto mt-5 text-start">
        {/* Central Vertical Line */}
        <div className="timeline-track-custom" />

        {/* Timeline Items */}
        {experiences.map((exp, idx) => {
          const isEven = idx % 2 === 0;
          return (
            <div 
              key={exp.id} 
              className={`timeline-item-wrapper d-flex justify-content-start justify-content-lg-between align-items-center w-100 mb-5 position-relative ${
                isEven ? 'flex-row-reverse' : 'flex-row'
              }`}
            >
              {/* Central Circle Pin */}
              <div className="timeline-pin-custom">
                <FiBriefcase size={16} />
              </div>

              {/* Grid block mapping to card side */}
              <motion.div 
                initial={{ opacity: 0, x: isEven ? 50 : -50 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, margin: '-100px' }}
                transition={{ duration: 0.7, type: 'spring' }}
                className="timeline-card-wrapper glass-card p-4"
              >
                <div className="d-flex justify-content-between align-items-start flex-wrap gap-2 mb-3">
                  <div>
                    <h3 className="role-text mb-1">{exp.role}</h3>
                    <h4 className="company-text text-gradient mb-0">{exp.company}</h4>
                  </div>
                  <span className="duration-badge">{exp.duration}</span>
                </div>
                
                <p className="description-text mb-4">{exp.description}</p>
                
                <div className="d-flex flex-wrap gap-2">
                  {exp.techs.map((t) => (
                    <span key={t} className="project-tech-badge">{t}</span>
                  ))}
                </div>
              </motion.div>

              {/* Blank side spacer matching timeline grid spacing */}
              <div className="timeline-spacer-custom d-none d-lg-block w-50" />
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Experience;
