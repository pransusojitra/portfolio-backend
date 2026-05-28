import React from 'react';
import { motion } from 'framer-motion';
import { FiCode, FiAward, FiCoffee, FiUsers } from 'react-icons/fi';
import './About.css';

const stats = [
  { id: 1, icon: <FiAward size={24} />, count: '5+', label: 'Years Experience' },
  { id: 2, icon: <FiCode size={24} />, count: '50+', label: 'Completed Projects' },
  { id: 3, icon: <FiUsers size={24} />, count: '30+', label: 'Happy Clients' },
  { id: 4, icon: <FiCoffee size={24} />, count: '1000+', label: 'Cups of Coffee' },
];

const About = () => {
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
            About Me
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
            Discover my journey, my core philosophy, and what drives my work.
          </motion.p>
        </div>
      </div>

      <div className="row align-items-center g-5">
        {/* Left Side: Mock Dev Dashboard Info */}
        <div className="col-lg-5 col-md-12">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: '-100px' }}
            transition={{ duration: 0.8, type: 'spring' }}
            className="about-dashboard glass-card"
          >
            <div className="dashboard-header d-flex justify-content-between align-items-center border-bottom pb-3 mb-3">
              <div className="d-flex gap-2">
                <span className="dot-indicator red"></span>
                <span className="dot-indicator yellow"></span>
                <span className="dot-indicator green"></span>
              </div>
              <span className="dashboard-title">developer_profile.json</span>
            </div>

            <div className="dashboard-content font-monospace text-start">
              <p className="line"><span className="token-keyword">const</span> <span className="token-variable">developer</span> = &#123;</p>
              <p className="line indent-1"><span className="token-key">name</span>: <span className="token-string">"Alex Rivera"</span>,</p>
              <p className="line indent-1"><span className="token-key">role</span>: <span className="token-string">"Fullstack Software Engineer"</span>,</p>
              <p className="line indent-1"><span className="token-key">focus</span>: <span className="token-string">"MERN Stack & AI Engineering"</span>,</p>
              <p className="line indent-1"><span className="token-key">skills</span>: [</p>
              <p className="line indent-2"><span className="token-string">"React"</span>, <span className="token-string">"Node.js"</span>, <span className="token-string">"Express"</span>, </p>
              <p className="line indent-2"><span className="token-string">"MongoDB"</span>, <span className="token-string">"Next.js"</span>, <span className="token-string">"GSAP"</span></p>
              <p className="line indent-1">],</p>
              <p className="line indent-1"><span className="token-key">location</span>: <span className="token-string">"San Francisco, CA"</span>,</p>
              <p className="line indent-1"><span className="token-key">availability</span>: <span className="token-keyword">true</span>,</p>
              <p className="line">&#125;;</p>
            </div>
          </motion.div>
        </div>

        {/* Right Side: Narrative and Stats */}
        <div className="col-lg-7 col-md-12 text-start">
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: '-100px' }}
            transition={{ duration: 0.8 }}
            className="about-details"
          >
            <h3 className="about-title mb-4">Designing Solutions, Building Experiences</h3>
            
            <p className="mb-4">
              I am a dedicated software engineer with a passion for designing premium frontend interfaces backed by robust server infrastructures. Having worked with various startups and design-centric companies, I focus heavily on the bridge between high-fidelity layouts and fast, secure code execution.
            </p>
            
            <p className="mb-5">
              My strategy relies on modern standards: modular component designs, rigorous performance profiling, responsive cross-device layouts, and fluid micro-animations that complement rather than distract. Let's make something remarkable together.
            </p>

            {/* Stats Grid */}
            <div className="row g-4">
              {stats.map((stat, i) => (
                <div key={stat.id} className="col-sm-6">
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: i * 0.1 }}
                    className="stat-card glass-card p-4 d-flex align-items-center gap-3"
                  >
                    <div className="stat-icon-wrapper">
                      {stat.icon}
                    </div>
                    <div>
                      <h4 className="stat-count mb-0">{stat.count}</h4>
                      <span className="stat-label">{stat.label}</span>
                    </div>
                  </motion.div>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default About;
