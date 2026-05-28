 import React from 'react';
import { motion } from 'framer-motion';
import { 
  SiReact, SiNodedotjs, SiMongodb, SiJavascript, SiBootstrap, 
  SiNextdotjs, SiExpress, SiPostgresql, SiDocker, 
  SiGit, SiGraphql 
} from 'react-icons/si';
import { FaAws } from 'react-icons/fa';
import './Skills.css';

const skillCategories = [
  {
    title: 'Frontend Frameworks',
    skills: [
      { name: 'React.js', icon: <SiReact color="#61dafb" />, level: 95 },
      { name: 'Next.js', icon: <SiNextdotjs color="#000000" />, level: 85 },
      { name: 'JavaScript (ES6+)', icon: <SiJavascript color="#f7df1e" />, level: 90 },
      { name: 'Bootstrap & CSS3', icon: <SiBootstrap color="#7952b3" />, level: 90 },
    ]
  },
  {
    title: 'Backend & Database',
    skills: [
      { name: 'Node.js', icon: <SiNodedotjs color="#339933" />, level: 90 },
      { name: 'Express.js', icon: <SiExpress color="#000000" />, level: 88 },
      { name: 'MongoDB', icon: <SiMongodb color="#47a248" />, level: 85 },
      { name: 'PostgreSQL & SQL', icon: <SiPostgresql color="#336791" />, level: 80 },
    ]
  },
  {
    title: 'DevOps & Tooling',
    skills: [
      { name: 'Docker', icon: <SiDocker color="#2496ed" />, level: 75 },
      { name: 'AWS Cloud', icon: <FaAws color="#ff9900" />, level: 80 },
      { name: 'Git & GitHub', icon: <SiGit color="#f05032" />, level: 92 },
      { name: 'GraphQL / APIs', icon: <SiGraphql color="#e10098" />, level: 85 },
    ]
  }
];

const Skills = () => {
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
            My Tech Stack
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
            A curated list of languages, databases, cloud, and tools I use to build scalable products.
          </motion.p>
        </div>
      </div>

      {/* Categories Grid */}
      <div className="row g-4">
        {skillCategories.map((category, catIdx) => (
          <div key={category.title} className="col-lg-4 col-md-6 text-start">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-50px' }}
              transition={{ duration: 0.6, delay: catIdx * 0.15 }}
              className="skill-category-card glass-card p-4 h-100"
            >
              <h3 className="category-title mb-4">{category.title}</h3>
              
              <div className="skills-list d-flex flex-column gap-4">
                {category.skills.map((skill, skillIdx) => (
                  <div key={skill.name} className="skill-item">
                    <div className="d-flex justify-content-between align-items-center mb-2">
                      <div className="skill-info d-flex align-items-center gap-2">
                        <span className="skill-icon">{skill.icon}</span>
                        <span className="skill-name">{skill.name}</span>
                      </div>
                      <span className="skill-percentage">{skill.level}%</span>
                    </div>
                    
                    {/* Custom Animated Progress Bar */}
                    <div className="progress-bar-bg">
                      <motion.div
                        initial={{ width: 0 }}
                        whileInView={{ width: `${skill.level}%` }}
                        viewport={{ once: true }}
                        transition={{ duration: 1.2, ease: 'easeOut', delay: skillIdx * 0.1 }}
                        className="progress-bar-fill"
                      />
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Skills;
