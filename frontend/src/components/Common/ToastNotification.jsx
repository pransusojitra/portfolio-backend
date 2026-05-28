import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiCheckCircle, FiAlertCircle, FiInfo } from 'react-icons/fi';
import './Common.css';

const ToastNotification = ({
  show,
  message,
  type = 'success', // 'success' | 'error' | 'info'
  onClose,
  duration = 3000
}) => {
  
  useEffect(() => {
    if (show && onClose) {
      const timer = setTimeout(() => {
        onClose();
      }, duration);
      return () => clearTimeout(timer);
    }
  }, [show, duration, onClose]);

  const getIcon = () => {
    switch (type) {
      case 'success':
        return <FiCheckCircle size={20} className="text-success" />;
      case 'error':
        return <FiAlertCircle size={20} className="text-danger" />;
      default:
        return <FiInfo size={20} className="text-info" />;
    }
  };

  return (
    <div className="toast-container-custom">
      <AnimatePresence>
        {show && message && (
          <motion.div
            initial={{ opacity: 0, x: -50, y: 0 }}
            animate={{ opacity: 1, x: 0, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, x: -30 }}
            transition={{ type: 'spring', damping: 20 }}
            className={`toast-custom ${type}`}
          >
            {getIcon()}
            <span className="toast-message-text">{message}</span>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ToastNotification;
