import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FiArrowRight, FiDownload, FiGithub, FiLinkedin, FiTwitter } from 'react-icons/fi';
import { SiReact, SiNodedotjs, SiJavascript, SiPython, SiMongodb } from 'react-icons/si';
import './Hero.css';

const words = ['Full-Stack Developer', 'MERN Expert', 'UI/UX Designer', 'AI Enthusiast'];

const Hero = () => {
  const [currentWordIndex, setCurrentWordIndex] = useState(0);
  const [currentText, setCurrentText] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);
  const [typingSpeed, setTypingSpeed] = useState(150);

  // Typewriter effect logic
  useEffect(() => {
    const handleType = () => {
      const fullWord = words[currentWordIndex];
      
      if (!isDeleting) {
        // Typing
        setCurrentText(fullWord.substring(0, currentText.length + 1));
        setTypingSpeed(100);

        if (currentText === fullWord) {
          // Pause before deleting
          setTypingSpeed(2000);
          setIsDeleting(true);
        }
      } else {
        // Deleting
        setCurrentText(fullWord.substring(0, currentText.length - 1));
        setTypingSpeed(50);

        if (currentText === '') {
          setIsDeleting(false);
          setCurrentWordIndex((prev) => (prev + 1) % words.length);
          setTypingSpeed(500);
        }
      }
    };

    const timer = setTimeout(handleType, typingSpeed);
    return () => clearTimeout(timer);
  }, [currentText, isDeleting, currentWordIndex, typingSpeed]);

  const handleContactClick = (e) => {
    e.preventDefault();
    const contactSection = document.getElementById('contact');
    if (contactSection) {
      const navbarHeight = 80;
      window.scrollTo({
        top: contactSection.offsetTop - navbarHeight,
        behavior: 'smooth',
      });
    }
  };

  // Motion variants for staggered entrance
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        type: 'spring',
        stiffness: 100,
        damping: 10,
      },
    },
  };

  return (
    <div className="hero-wrapper d-flex align-items-center">
      {/* Background Interactive Nodes (Floating Tech Icons) */}
      <div className="floating-icons-container">
        <div className="floating-icon icon-1"><SiReact size={40} /></div>
        <div className="floating-icon icon-2"><SiNodedotjs size={32} /></div>
        <div className="floating-icon icon-3"><SiJavascript size={35} /></div>
        <div className="floating-icon icon-4"><SiPython size={38} /></div>
        <div className="floating-icon icon-5"><SiMongodb size={30} /></div>
      </div>

      <div className="container">
        <div className="row align-items-center justify-content-between">
          <div className="col-lg-7 text-start">
            <motion.div
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              className="hero-content"
            >
              <motion.span variants={itemVariants} className="hero-greeting text-gradient">
                Welcome to my digital space
              </motion.span>
              
              <motion.h1 variants={itemVariants} className="hero-title">
                Hi, I'm <span className="highlight-text">Alex Rivera</span>
              </motion.h1>

              <motion.h2 variants={itemVariants} className="hero-subtitle">
                I am a <span className="typewriter-text">{currentText}</span>
                <span className="cursor-blink">|</span>
              </motion.h2>

              <motion.p variants={itemVariants} className="hero-description">
                I specialize in crafting visually stunning, high-performance web applications with production-grade architectures. From pixel-perfect frontend experiences to robust MERN backend engines.
              </motion.p>

              <motion.div variants={itemVariants} className="hero-buttons d-flex flex-wrap gap-3 align-items-center">
                <a href="#contact" onClick={handleContactClick} className="btn-premium d-flex align-items-center gap-2 interactive">
                  Let's Connect <FiArrowRight />
                </a>
                
                {/* Dummy Resume Download */}
                <a 
                  href="#" 
                  className="btn-premium-outline d-flex align-items-center gap-2 interactive"
                  onClick={(e) => {
                    e.preventDefault();
                    alert("Downloading Resume sample PDF...");
                  }}
                >
                  Download CV <FiDownload />
                </a>
              </motion.div>

              <motion.div variants={itemVariants} className="hero-socials d-flex gap-3 align-items-center">
                <a href="https://github.com" target="_blank" rel="noopener noreferrer" className="social-icon-btn interactive">
                  <FiGithub size={20} />
                </a>
                <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="social-icon-btn interactive">
                  <FiLinkedin size={20} />
                </a>
                <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="social-icon-btn interactive">
                  <FiTwitter size={20} />
                </a>
              </motion.div>
            </motion.div>
          </div>

          <div className="col-lg-5 d-none d-lg-block">
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, ease: 'easeOut' }}
              className="hero-art-container"
            >
              {/* Premium geometric artwork with gradient outlines */}
              <div className="hero-art-shape outline-shape"></div>
              <div className="hero-art-shape fill-shape"></div>
              <div className="hero-art-avatar">
                {/* Glassmorphic card overlay */}
                <div className="avatar-glass-overlay">
                  <div className="tech-badge react">
                    <SiReact color="#61dafb" /> <span>React</span>
                  </div>
                  <div className="tech-badge node">
                    <SiNodedotjs color="#339933" /> <span>Node</span>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Hero;
