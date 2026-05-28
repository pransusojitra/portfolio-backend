import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import './Loader.css';

const Loader = () => {
  const [loading, setLoading] = useState(true);
  const [counter, setCounter] = useState(0);

  // Smooth counter counting up from 0 to 100
  useEffect(() => {
    if (counter >= 100) {
      const timer = setTimeout(() => {
        setLoading(false);
      }, 500);
      return () => clearTimeout(timer);
    }

    const increment = Math.floor(Math.random() * 15) + 5;
    const nextVal = Math.min(counter + increment, 100);
    const speed = Math.floor(Math.random() * 80) + 40;

    const timer = setTimeout(() => {
      setCounter(nextVal);
    }, speed);

    return () => clearTimeout(timer);
  }, [counter]);

  return (
    <AnimatePresence>
      {loading && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ 
            opacity: 0, 
            y: -100, 
            transition: { duration: 0.8, ease: [0.76, 0, 0.24, 1] } 
          }}
          className="loader-overlay"
        >
          <div className="loader-container text-center">
            {/* Logo/Brand Reveal */}
            <motion.h1 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
              className="loader-logo mb-4"
            >
              Portfolio<span className="dot">.</span>
            </motion.h1>

            {/* Glowing active progress bar */}
            <div className="loader-bar-bg mb-3 mx-auto">
              <motion.div 
                className="loader-bar-fill" 
                style={{ width: `${counter}%` }}
              />
            </div>

            {/* Counter percentage */}
            <span className="loader-percentage font-monospace">{counter}%</span>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default Loader;
