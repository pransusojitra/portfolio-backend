import React from 'react';
import { motion } from 'framer-motion';
import { FiLayout, FiLayers, FiCloudLightning, FiCpu } from 'react-icons/fi';
import './Services.css';

const services = [
  {
    id: 1,
    icon: <FiLayers size={30} />,
    title: 'Full-Stack Development',
    description: 'Developing end-to-end web applications with fast React.js interfaces supported by highly optimized Express/Node REST APIs and MongoDB databases.',
    color: '#7c3aed' // Violet
  },
  {
    id: 2,
    icon: <FiLayout size={30} />,
    title: 'UI/UX Design & Prototyping',
    description: 'Formulating visually impressive design layouts emphasizing user journeys, visual hierarchy, dark mode variants, and smooth interactive prototypes.',
    color: '#06b6d4' // Cyan
  },
  {
    id: 3,
    icon: <FiCloudLightning size={30} />,
    title: 'DevOps & Server Deployment',
    description: 'Configuring Amazon Web Services (AWS) infrastructure, virtualizing servers via Docker container clusters, and deploying automated CI/CD pipelines.',
    color: '#10b981' // Green
  },
  {
    id: 4,
    icon: <FiCpu size={30} />,
    title: 'AI API & Agent Integration',
    description: 'Integrating LLMs (OpenAI, Anthropic), setting up custom semantic vector database searches (RAG), and orchestrating automated workflow backends.',
    color: '#f43f5e' // Rose
  }
];

const Services = () => {
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
            My Services
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
            Leverage my technical expertise to build premium applications that scale.
          </motion.p>
        </div>
      </div>

      {/* Services Grid */}
      <div className="row g-4">
        {services.map((service, idx) => (
          <div key={service.id} className="col-lg-3 col-md-6 text-start">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-50px' }}
              transition={{ duration: 0.6, delay: idx * 0.15 }}
              whileHover={{ y: -10 }}
              className="service-card-custom glass-card p-4 h-100 d-flex flex-column justify-content-between"
              style={{ '--hover-accent': service.color }}
            >
              <div>
                <div 
                  className="service-icon-box mb-4" 
                  style={{ 
                    backgroundColor: `${service.color}15`, 
                    color: service.color,
                    borderColor: `${service.color}40`
                  }}
                >
                  {service.icon}
                </div>
                <h3 className="service-card-title mb-3">{service.title}</h3>
                <p className="service-card-desc mb-0">{service.description}</p>
              </div>

              {/* Decorative accent card line */}
              <div className="service-accent-line" style={{ backgroundColor: service.color }} />
            </motion.div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Services;
