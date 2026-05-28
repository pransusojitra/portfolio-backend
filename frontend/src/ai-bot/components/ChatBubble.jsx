import React from 'react';
import { Link } from 'react-router-dom';
import { FiMonitor, FiUser } from 'react-icons/fi';
import './AIChatbot.css';

const ChatBubble = ({ sender, text, timestamp }) => {
  const isAi = sender === 'ai';

  // Custom parser to safely render markdown links [label](url) and bold text **bold**
  const renderMessageContent = (msgText) => {
    if (!msgText) return '';

    // Split text by markdown link syntax: [label](url)
    const linkRegex = /\[([^\]]+)\]\(([^)]+)\)/g;
    const boldRegex = /\*\*([^*]+)\*\*/g;
    
    // We will do a simple text replace/parsing into React elements
    let parts = [];
    let lastIndex = 0;
    let match;

    // Helper to replace bold elements in a text block
    const parseBoldText = (subText, baseKey) => {
      const boldParts = [];
      let boldLastIndex = 0;
      let boldMatch;
      
      // Reset regex index
      boldRegex.lastIndex = 0;
      
      while ((boldMatch = boldRegex.exec(subText)) !== null) {
        // Text before bold
        if (boldMatch.index > boldLastIndex) {
          boldParts.push(subText.substring(boldLastIndex, boldMatch.index));
        }
        // Bold text
        boldParts.push(
          <strong key={`bold-${baseKey}-${boldMatch.index}`}>
            {boldMatch[1]}
          </strong>
        );
        boldLastIndex = boldRegex.lastIndex;
      }
      
      if (boldLastIndex < subText.length) {
        boldParts.push(subText.substring(boldLastIndex));
      }
      
      return boldParts.length > 0 ? boldParts : subText;
    };

    // Reset regex index
    linkRegex.lastIndex = 0;

    let indexCount = 0;
    while ((match = linkRegex.exec(msgText)) !== null) {
      // Add text before link
      if (match.index > lastIndex) {
        const textSegment = msgText.substring(lastIndex, match.index);
        parts.push(...(Array.isArray(parseBoldText(textSegment, indexCount)) ? parseBoldText(textSegment, indexCount) : [parseBoldText(textSegment, indexCount)]));
      }

      const label = match[1];
      const url = match[2];

      // Route check: internal route starting with '/' vs external link starting with 'http' or 'mailto'
      const isInternal = url.startsWith('/');

      if (isInternal) {
        parts.push(
          <Link 
            key={`link-${indexCount}`} 
            to={url} 
            className="chat-embedded-link text-decoration-underline"
          >
            {label}
          </Link>
        );
      } else {
        parts.push(
          <a 
            key={`link-${indexCount}`} 
            href={url} 
            target="_blank" 
            rel="noopener noreferrer" 
            className="chat-embedded-link text-decoration-underline"
          >
            {label}
          </a>
        );
      }

      lastIndex = linkRegex.lastIndex;
      indexCount++;
    }

    // Add trailing text
    if (lastIndex < msgText.length) {
      const textSegment = msgText.substring(lastIndex);
      parts.push(...(Array.isArray(parseBoldText(textSegment, indexCount)) ? parseBoldText(textSegment, indexCount) : [parseBoldText(textSegment, indexCount)]));
    }

    return parts.length > 0 ? parts : msgText;
  };

  const timeString = timestamp 
    ? new Date(timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) 
    : new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

  return (
    <div className={`chat-bubble-container d-flex ${isAi ? 'justify-content-start' : 'justify-content-end'} mb-3`}>
      <div className={`chat-bubble-wrapper d-flex gap-2 max-width-80 ${isAi ? 'flex-row' : 'flex-row-reverse'}`}>
        {/* Profile Avatar */}
        <div className={`bubble-avatar d-flex align-items-center justify-content-center ${isAi ? 'bg-primary' : 'bg-secondary'}`}>
          {isAi ? <FiMonitor size={14} color="#fff" /> : <FiUser size={14} color="#fff" />}
        </div>

        {/* Message bubble card */}
        <div className={`chat-bubble p-3 ${isAi ? 'ai-bubble text-start' : 'user-bubble text-end'}`}>
          <div className="chat-bubble-text text-start">
            {renderMessageContent(text)}
          </div>
          <span className="chat-bubble-time d-block mt-1 text-muted small text-end" style={{ fontSize: '0.75rem' }}>
            {timeString}
          </span>
        </div>
      </div>
    </div>
  );
};

export default ChatBubble;
