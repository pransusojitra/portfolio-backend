import React from 'react';
import { FiChevronUp, FiGithub, FiLinkedin, FiTwitter, FiMail } from 'react-icons/fi';
import './Footer.css';

const Footer = () => {
  const handleScrollTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  };

  return (
    <footer className="footer-wrapper">
      <div className="container">
        <div className="row g-4 align-items-center justify-content-between text-start">
          {/* Logo & Description */}
          <div className="col-md-6 col-sm-12">
            <h3 className="footer-logo mb-2">Portfolio<span className="dot">.</span></h3>
            <p className="footer-desc mb-0 max-width-350">
              A premium, design-driven portfolio showcasing MERN stack web applications and interactive architectures.
            </p>
          </div>

          {/* Social icons */}
          <div className="col-md-4 col-sm-12 text-md-end text-start">
            <div className="d-flex gap-3 justify-content-start justify-content-md-end mb-3">
              <a href="https://github.com" target="_blank" rel="noopener noreferrer" className="footer-social-icon interactive">
                <FiGithub size={18} />
              </a>
              <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="footer-social-icon interactive">
                <FiLinkedin size={18} />
              </a>
              <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="footer-social-icon interactive">
                <FiTwitter size={18} />
              </a>
              <a href="mailto:alex@example.com" className="footer-social-icon interactive">
                <FiMail size={18} />
              </a>
            </div>
            
            <p className="copyright-text mb-0">
              &copy; {new Date().getFullYear()} Alex Rivera. All rights reserved.
            </p>
          </div>
        </div>

        {/* Scroll back to top button */}
        <div className="row justify-content-center mt-4 pt-3 border-top border-secondary-subtle">
          <button 
            className="scroll-top-btn interactive d-flex align-items-center justify-content-center gap-2"
            onClick={handleScrollTop}
            aria-label="Scroll back to top"
          >
            <span>Back to top</span>
            <FiChevronUp size={18} className="scroll-arrow-icon" />
          </button>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
