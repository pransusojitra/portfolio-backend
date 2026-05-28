import React, { useState } from 'react';
import { FiChevronLeft, FiChevronRight } from 'react-icons/fi';
import './Common.css';

const ImageSlider = ({ images = [] }) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  if (!images || images.length === 0) {
    return (
      <div className="image-slider-wrapper d-flex align-items-center justify-content-center bg-dark text-muted">
        <span>No project images available</span>
      </div>
    );
  }

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  };

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
  };

  const setSlide = (idx) => {
    setCurrentIndex(idx);
  };

  return (
    <div className="image-slider-wrapper">
      {/* Slides */}
      {images.map((img, idx) => (
        <div 
          key={idx} 
          className={`slider-slide ${idx === currentIndex ? 'active' : ''}`}
        >
          <img 
            src={img} 
            alt={`Slide ${idx + 1}`} 
            className="slider-img"
            onError={(e) => {
              e.target.src = 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=800&q=80';
            }} 
          />
        </div>
      ))}

      {/* Control Buttons (Only if > 1 images) */}
      {images.length > 1 && (
        <>
          <button 
            className="slider-btn prev interactive" 
            onClick={prevSlide}
            aria-label="Previous image"
          >
            <FiChevronLeft size={20} />
          </button>
          
          <button 
            className="slider-btn next interactive" 
            onClick={nextSlide}
            aria-label="Next image"
          >
            <FiChevronRight size={20} />
          </button>

          {/* Dots Indicator */}
          <div className="slider-dots">
            {images.map((_, idx) => (
              <button
                key={idx}
                className={`slider-dot ${idx === currentIndex ? 'active' : ''}`}
                onClick={() => setSlide(idx)}
                aria-label={`Go to slide ${idx + 1}`}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default ImageSlider;
