import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiMessageSquare, FiX, FiSend, FiMic, FiMicOff } from 'react-icons/fi';
import { RiRobotLine } from 'react-icons/ri';
import ChatBubble from './ChatBubble';
import TypingLoader from './TypingLoader';
import apiService from '../../services/api';
import useSpeech from '../hooks/useSpeech';
import './AIChatbot.css';

const SUGGESTED_QUESTIONS = [
  'Show React projects',
  'Skills and technologies',
  'Contact information',
  'Latest projects',
  'Open portfolio section'
];

const AIChatbot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      id: 1,
      sender: 'ai',
      text: "Hello! I am Alex's AI Assistant. Ask me anything about his projects, skills, or contact info!",
      timestamp: Date.now()
    }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);

  const messagesEndRef = useRef(null);
  
  // Custom Speech hook
  const { 
    transcript, 
    listening, 
    startListening, 
    stopListening, 
    supported 
  } = useSpeech();

  // Auto-scroll to bottom of chat history
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  // Sync speech transcript to input field
  useEffect(() => {
    if (transcript) {
      setInputValue(transcript);
    }
  }, [transcript]);

  // Toggle voice recognition
  const handleVoiceInput = () => {
    if (listening) {
      stopListening();
    } else {
      startListening();
    }
  };

  const handleSendMessage = async (text) => {
    if (!text.trim()) return;

    // Append User message
    const userMsg = {
      id: Date.now(),
      sender: 'user',
      text: text,
      timestamp: Date.now()
    };
    
    setMessages((prev) => [...prev, userMsg]);
    setInputValue('');
    setIsTyping(true);

    try {
      // Fetch AI response
      const response = await apiService.chatSendMessage(text);
      
      setIsTyping(false);
      // Append AI response
      setMessages((prev) => [...prev, {
        id: Date.now() + 1,
        sender: 'ai',
        text: response.text || "I'm having trouble retrieving details right now.",
        timestamp: Date.now()
      }]);
    } catch (error) {
      setIsTyping(false);
      setMessages((prev) => [...prev, {
        id: Date.now() + 1,
        sender: 'ai',
        text: "Apologies, I encountered a temporary connection glitch. Please try again.",
        timestamp: Date.now()
      }]);
    }
  };

  const handleSuggestionClick = (question) => {
    handleSendMessage(question);
  };

  return (
    <>
      {/* Floating Robot Icon Toggle Button */}
      <motion.button
        className={`floating-chatbot-toggle-btn interactive d-flex align-items-center justify-content-center ${isOpen ? 'active' : ''}`}
        onClick={() => setIsOpen(!isOpen)}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        title="Chat with AI Assistant"
      >
        {isOpen ? <FiX size={24} /> : <RiRobotLine size={24} />}
        {!isOpen && (
          <span className="toggle-notification-dot" />
        )}
      </motion.button>

      {/* Chat Window Panel */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.85 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 50, scale: 0.85 }}
            transition={{ type: 'spring', damping: 20 }}
            className="chatbot-window-panel glass-card text-start"
          >
            {/* Header */}
            <div className="chat-window-header d-flex justify-content-between align-items-center p-3 border-bottom border-secondary-subtle">
              <div className="d-flex align-items-center gap-2">
                <div className="header-avatar bg-primary d-flex align-items-center justify-content-center">
                  <RiRobotLine size={18} color="#fff" />
                </div>
                <div>
                  <h4 className="chat-title mb-0 fs-6 text-white fw-bold">Alex's Assistant</h4>
                  <span className="online-indicator d-flex align-items-center gap-1">
                    <span className="dot-pulse" /> Online
                  </span>
                </div>
              </div>
              <button 
                onClick={() => setIsOpen(false)} 
                className="close-panel-btn bg-transparent border-0 text-muted interactive"
              >
                <FiX size={20} />
              </button>
            </div>

            {/* Messages Box */}
            <div className="chat-messages-box p-3">
              {messages.map((msg) => (
                <ChatBubble
                  key={msg.id}
                  sender={msg.sender}
                  text={msg.text}
                  timestamp={msg.timestamp}
                />
              ))}
              {isTyping && (
                <div className="chat-bubble-container d-flex justify-content-start mb-3">
                  <div className="chat-bubble-wrapper d-flex gap-2 align-items-center">
                    <div className="bubble-avatar bg-primary d-flex align-items-center justify-content-center" style={{ width: '28px', height: '28px', borderRadius: '50%' }}>
                      <RiRobotLine size={12} color="#fff" />
                    </div>
                    <TypingLoader />
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Suggestions Badges */}
            <div className="chat-suggestions-wrapper px-3 py-2 border-top border-secondary-subtle">
              <small className="text-muted d-block mb-1" style={{ fontSize: '0.75rem' }}>SUGGESTIONS:</small>
              <div className="d-flex flex-wrap gap-1.5 scrollable-suggestions">
                {SUGGESTED_QUESTIONS.map((question) => (
                  <button
                    key={question}
                    onClick={() => handleSuggestionClick(question)}
                    className="suggestion-badge-btn interactive px-2.5 py-1 rounded-pill bg-dark border-secondary text-secondary"
                  >
                    {question}
                  </button>
                ))}
              </div>
            </div>

            {/* Text & Speech Input Bar */}
            <div className="chat-input-bar p-3 border-top border-secondary-subtle">
              <form 
                onSubmit={(e) => {
                  e.preventDefault();
                  handleSendMessage(inputValue);
                }}
                className="d-flex gap-2"
              >
                {/* Voice button */}
                {supported && (
                  <button
                    type="button"
                    onClick={handleVoiceInput}
                    className={`btn-mic-toggle d-flex align-items-center justify-content-center rounded interactive ${listening ? 'listening bg-danger text-white border-danger' : 'bg-dark border-secondary text-muted'}`}
                    title={listening ? "Stop Recording" : "Record voice input"}
                  >
                    {listening ? <FiMicOff size={18} /> : <FiMic size={18} />}
                  </button>
                )}

                {/* Input Text Box */}
                <input
                  type="text"
                  className="form-control bg-dark border-secondary text-white"
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  placeholder={listening ? "Listening... Speak now..." : "Ask me a question..."}
                  disabled={listening}
                  style={{ outline: 'none' }}
                />

                {/* Send Button */}
                <button
                  type="submit"
                  className="btn btn-primary d-flex align-items-center justify-content-center interactive px-3"
                  disabled={!inputValue.trim() || listening}
                >
                  <FiSend size={16} />
                </button>
              </form>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default AIChatbot;
