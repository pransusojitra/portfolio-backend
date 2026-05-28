import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiArrowRight, FiCode, FiSmartphone, FiCpu, FiChevronDown } from 'react-icons/fi';
import Hero from '../components/Hero/Hero';
import ProjectCard from '../components/Projects/ProjectCard';
import Testimonials from '../components/Testimonials/Testimonials';
import { useProjects } from '../context/ProjectContext';
import LoadingSkeleton from '../components/Common/LoadingSkeleton';

const FAQ_DATA = [
  {
    question: 'What is your core tech stack specialization?',
    answer: 'I specialize in the MERN Stack (MongoDB, Express, React, Node.js) for full-stack applications. On the frontend, I also use Tailwind CSS, Bootstrap 5, Framer Motion, and GSAP. For databases, I work with MongoDB and PostgreSQL.',
  },
  {
    question: 'Are you available for freelance or contract engagements?',
    answer: 'Yes. I am available for freelance integrations, API development consultancies, and short-to-medium term contract positions. Send a message with your requirements and timeline.',
  },
  {
    question: 'Do you support remote work environments?',
    answer: 'Absolutely. I am comfortable with distributed development workflows across Slack, GitHub, Jira, Zoom, and async documentation.',
  },
  {
    question: 'How do you handle API security in SaaS systems?',
    answer: 'I use JWT session validation, CORS configuration, bcrypt password hashing, helmet headers, rate limiters, and MongoDB input sanitization to protect endpoints.',
  },
];

const Home = () => {
  const { projects, loading } = useProjects();
  const [openFaq, setOpenFaq] = useState(null);

  // Show only 3 recent projects on homepage
  const recentProjects = projects.slice(0, 3);
  const toggleFaq = (index) => setOpenFaq(openFaq === index ? null : index);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { staggerChildren: 0.2 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { type: 'spring', stiffness: 100, damping: 10 }
    }
  };

  return (
    <div className="page-wrapper pb-5">
      {/* Hero Section */}
      <section id="hero">
        <Hero />
      </section>

      {/* Services Highlights */}
      <section id="services-highlights" className="section-padding bg-secondary-subtle">
        <div className="container">
          <div className="row justify-content-center mb-5 text-center">
            <div className="col-md-8">
              <h2 className="section-title text-gradient fs-1 fw-bold">Core Specializations</h2>
              <div className="title-line mx-auto mb-3" style={{ width: '80px', height: '3px', background: 'var(--color-primary)' }} />
              <p className="section-subtitle text-muted">
                Leveraging next-gen engineering practices to build scalable, premium web solutions.
              </p>
            </div>
          </div>

          <div className="row g-4">
            {/* Service 1 */}
            <div className="col-md-4 text-start">
              <div className="service-card glass-card p-4 h-100">
                <div className="info-icon-wrapper mb-3">
                  <FiCode size={24} />
                </div>
                <h3 className="fs-5 fw-bold mb-2">Full-Stack Development</h3>
                <p className="text-secondary small mb-0">
                  Building responsive, accessible interfaces in React coupled with high-speed RESTful backend microservices in Node/Express.
                </p>
              </div>
            </div>

            {/* Service 2 */}
            <div className="col-md-4 text-start">
              <div className="service-card glass-card p-4 h-100">
                <div className="info-icon-wrapper mb-3" style={{ background: 'var(--color-secondary-glow)', color: 'var(--color-secondary)' }}>
                  <FiCpu size={24} />
                </div>
                <h3 className="fs-5 fw-bold mb-2">AI Integrations</h3>
                <p className="text-secondary small mb-0">
                  Connecting GPT LLMs, semantic vector embeddings, cognitive search agents, and automated prompt layouts to standard SaaS platforms.
                </p>
              </div>
            </div>

            {/* Service 3 */}
            <div className="col-md-4 text-start">
              <div className="service-card glass-card p-4 h-100">
                <div className="info-icon-wrapper mb-3" style={{ background: 'rgba(244, 63, 94, 0.15)', color: 'var(--color-accent)' }}>
                  <FiSmartphone size={24} />
                </div>
                <h3 className="fs-5 fw-bold mb-2">Interactive Architectures</h3>
                <p className="text-secondary small mb-0">
                  Creating responsive, premium interfaces equipped with Framer Motion, GSAP, canvas layouts, and custom scroll triggers.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Projects Highlight */}
      <section id="recent-projects" className="section-padding">
        <div className="container">
          <div className="row justify-content-between align-items-end mb-5 text-start">
            <div className="col-md-8">
              <h2 className="section-title text-gradient fs-1 fw-bold">Recent Projects</h2>
              <div className="title-line mb-3" style={{ width: '80px', height: '3px', background: 'var(--color-primary)' }} />
              <p className="section-subtitle text-muted mb-0">
                Explore a selected showcase of web engineering projects.
              </p>
            </div>
            <div className="col-md-4 text-md-end text-start mt-3 mt-md-0">
              <Link to="/projects" className="btn-premium d-inline-flex align-items-center gap-2 interactive">
                Browse Full Portfolio <FiArrowRight />
              </Link>
            </div>
          </div>

          {loading ? (
            <LoadingSkeleton type="card" count={3} />
          ) : (
            <div className="row g-4 justify-content-start">
              {recentProjects.map((project) => (
                <div key={project.id} className="col-lg-4 col-md-6 col-sm-12 text-start">
                  <ProjectCard project={project} />
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Testimonials */}
      <section id="testimonials" className="section-padding bg-secondary-subtle">
        <div className="container">
          <div className="row justify-content-center mb-5 text-center">
            <div className="col-md-8">
              <h2 className="section-title text-gradient fs-1 fw-bold">Kind Words</h2>
              <div className="title-line mx-auto mb-3" style={{ width: '80px', height: '3px', background: 'var(--color-primary)' }} />
              <p className="section-subtitle text-muted">
                What clients and colleagues say about collaborating on software builds.
              </p>
            </div>
          </div>
          <Testimonials />
        </div>
      </section>

      {/* Frequently Asked Questions */}
      <section id="faq" className="section-padding">
        <div className="container">
          <div className="row justify-content-center mb-5 text-center">
            <div className="col-md-8">
              <h2 className="section-title text-gradient fs-1 fw-bold">Frequently Asked Questions</h2>
              <div className="title-line mx-auto mb-3" style={{ width: '80px', height: '3px', background: 'var(--color-primary)' }} />
              <p className="section-subtitle text-muted">
                Quick answers about services, availability, and development workflow.
              </p>
            </div>
          </div>

          <div className="row justify-content-center">
            <div className="col-lg-9">
              <div className="faq-accordion">
                {FAQ_DATA.map((faq, index) => {
                  const isOpened = openFaq === index;
                  return (
                    <div key={faq.question} className="accordion-item-custom glass-card mb-3">
                      <button
                        onClick={() => toggleFaq(index)}
                        className="faq-trigger d-flex justify-content-between align-items-center interactive"
                        aria-expanded={isOpened}
                      >
                        <span>{faq.question}</span>
                        <FiChevronDown
                          size={18}
                          className="transition-fast"
                          style={{ transform: isOpened ? 'rotate(180deg)' : 'rotate(0deg)' }}
                        />
                      </button>
                      {isOpened && (
                        <div className="faq-content text-start animate-fade-in">
                          {faq.answer}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Call-To-Action */}
      <section id="contact-cta" className="section-padding py-5">
        <div className="container">
          <div className="glass-card p-5 text-center max-width-800 mx-auto">
            <h2 className="fs-1 text-gradient fw-bold mb-3">Have a Project in Mind?</h2>
            <p className="text-secondary mb-4 max-width-600 mx-auto">
              I am open to freelance collaborations, full-time engineering roles, and AI integration consultancies. Let's build something exceptional together!
            </p>
            <Link to="/contact" className="btn-premium px-5 py-3 interactive">
              Get In Touch
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
