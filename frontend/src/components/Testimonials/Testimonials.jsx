import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiChevronLeft, FiChevronRight } from 'react-icons/fi';
import { AiFillStar } from 'react-icons/ai';
import './Testimonials.css';

const testimonials = [
  {
    id: 1,
    name: 'Sarah Jenkins',
    role: 'CTO at Nova FinTech',
    content: 'Alex delivered the AI dashboard within the agreed deadline. The user experience is stunning, the response times are optimized, and the modular code makes it simple for our team to expand features.',
    rating: 5,
    avatar: 'S'
  },
  {
    id: 2,
    name: 'Marcus Chen',
    role: 'Founder at CloudNest Solutions',
    content: 'The attention to micro-animations and custom glass layouts really sets this portfolio apart. Our startup platform conversion rates improved by 25% after launching the new React frontend.',
    rating: 5,
    avatar: 'M'
  },
  {
    id: 3,
    name: 'Elena Rostova',
    role: 'Lead Architect at CodeForge',
    content: 'Excellent collaboration. Alex integrated our OpenAI document retrieval API efficiently, structuring clean code schemas and custom styling themes. Highly recommended fullstack engineer.',
    rating: 5,
    avatar: 'E'
  }
];

const Testimonials = () => {
  const [index, setIndex] = useState(0);
  const [direction, setDirection] = useState(0); // -1 for left, 1 for right

  // Auto slide interval
  useEffect(() => {
    const timer = setInterval(() => {
      handleNext();
    }, 6000);
    return () => clearInterval(timer);
  }, [index]);

  const handlePrev = () => {
    setDirection(-1);
    setIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length);
  };

  const handleNext = () => {
    setDirection(1);
    setIndex((prev) => (prev + 1) % testimonials.length);
  };

  // Motion slide variants
  const slideVariants = {
    enter: (dir) => ({
      x: dir > 0 ? 100 : -100,
      opacity: 0
    }),
    center: {
      x: 0,
      opacity: 1,
      transition: { duration: 0.5, ease: 'easeInOut' }
    },
    exit: (dir) => ({
      x: dir > 0 ? -100 : 100,
      opacity: 0,
      transition: { duration: 0.5, ease: 'easeInOut' }
    })
  };

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
            Client Reviews
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
            Read what team leads, CTOs, and founders say about my engineering work.
          </motion.p>
        </div>
      </div>

      {/* Testimonials Slider Area */}
      <div className="row justify-content-center mt-5">
        <div className="col-lg-8 position-relative">
          
          <div className="slider-viewport-custom overflow-hidden position-relative">
            <AnimatePresence initial={false} custom={direction} mode="wait">
              <motion.div
                key={testimonials[index].id}
                custom={direction}
                variants={slideVariants}
                initial="enter"
                animate="center"
                exit="exit"
                className="testimonial-card-custom glass-card p-5 text-center"
              >
                {/* Avatar Initial Icon */}
                <div className="testimonial-avatar mx-auto mb-4">
                  {testimonials[index].avatar}
                </div>

                {/* Stars */}
                <div className="rating-stars d-flex justify-content-center gap-1 mb-3">
                  {[...Array(testimonials[index].rating)].map((_, i) => (
                    <AiFillStar key={i} size={18} className="star-active" />
                  ))}
                </div>

                {/* Review Text */}
                <blockquote className="testimonial-quote mb-4">
                  "{testimonials[index].content}"
                </blockquote>

                {/* User Details */}
                <h3 className="client-name mb-1">{testimonials[index].name}</h3>
                <span className="client-role">{testimonials[index].role}</span>
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Navigation Controls */}
          <button 
            className="nav-arrow-btn prev-btn interactive" 
            onClick={handlePrev}
            aria-label="Previous Review"
          >
            <FiChevronLeft size={24} />
          </button>
          
          <button 
            className="nav-arrow-btn next-btn interactive" 
            onClick={handleNext}
            aria-label="Next Review"
          >
            <FiChevronRight size={24} />
          </button>

          {/* Dots Indicator */}
          <div className="dots-container-custom d-flex justify-content-center gap-2 mt-4">
            {testimonials.map((_, i) => (
              <button
                key={i}
                onClick={() => {
                  setDirection(i > index ? 1 : -1);
                  setIndex(i);
                }}
                className={`dot-btn-custom interactive ${index === i ? 'active' : ''}`}
                aria-label={`Go to slide ${i + 1}`}
              />
            ))}
          </div>

        </div>
      </div>
    </div>
  );
};

export default Testimonials;
