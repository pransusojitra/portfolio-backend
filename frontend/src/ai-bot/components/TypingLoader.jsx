import React from 'react';
import './AIChatbot.css';

const TypingLoader = () => {
  return (
    <div className="typing-loader-bubble">
      <div className="dot-pulse-item" />
      <div className="dot-pulse-item delay-1" />
      <div className="dot-pulse-item delay-2" />
    </div>
  );
};

export default TypingLoader;
