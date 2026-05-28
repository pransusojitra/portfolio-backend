import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiX } from 'react-icons/fi';
import './Common.css';

const Modal = ({ 
  isOpen, 
  onClose, 
  title, 
  children, 
  size = 'md' // 'sm' | 'md'
}) => {
  
  // Close on Escape key press
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleEscape);
    }
    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', handleEscape);
    };
  }, [isOpen, onClose]);

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="modal-overlay-custom"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.9, y: 30 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0.9, y: 30 }}
            transition={{ type: 'spring', damping: 25, stiffness: 350 }}
            className={`modal-card-custom glass-card ${size === 'sm' ? 'modal-sm' : ''}`}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="modal-header-custom d-flex justify-content-between align-items-center mb-3">
              <h3 className="m-0 text-gradient fs-4">{title}</h3>
              <button onClick={onClose} className="close-btn interactive" aria-label="Close modal">
                <FiX size={20} />
              </button>
            </div>

            {/* Scrollable Content */}
            <div className="modal-scrollable-content container-fluid p-0">
              {children}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default Modal;
