import { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { FiSend, FiMic, FiMicOff } from 'react-icons/fi';
import { RiRobotLine } from 'react-icons/ri';
import ChatBubble from './components/ChatBubble';
import TypingLoader from './components/TypingLoader';
import apiService from '../services/api';
import useSpeech from './hooks/useSpeech';

const SUGGESTED_QUESTIONS = [
  'Show React projects',
  'Skills and technologies',
  'Contact information',
  'Latest projects',
  'Open portfolio section'
];

const AIAssistant = () => {
  const [messages, setMessages] = useState(() => [{
  id: 1,
  sender: 'ai',
  text: "Welcome to the Dedicated AI Assistant console. I have direct access to Alex's portfolio registry, bio logs, and skill statistics. Ask me anything!",
  timestamp: Date.now()
}]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);

  const chatEndRef = useRef(null);
  const { transcript, listening, startListening, stopListening, supported } = useSpeech();

  const scrollToBottom = () => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  useEffect(() => {
    if (transcript) {
      setInputValue(transcript);
    }
  }, [transcript]);

  const handleVoiceToggle = () => {
    if (listening) {
      stopListening();
    } else {
      startListening();
    }
  };

  const handleSendMessage = async (text) => {
    if (!text.trim()) return;

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
      const response = await apiService.chatSendMessage(text);
      setIsTyping(false);
      setMessages((prev) => [...prev, {
        id: Date.now() + 1,
        sender: 'ai',
        text: response.text || "I was unable to process that. Please try another request.",
        timestamp: Date.now()
      }]);
    } catch (error) {
      setIsTyping(false);
      setMessages((prev) => [...prev, {
        id: Date.now() + 1,
        sender: 'ai',
        text: "Apologies, I encountered a communication error with the core. Please try again.",
        timestamp: Date.now()
      }]);
    }
  };

  return (
    <div className="page-wrapper ai-assistant-page-wrapper pb-5">
      <div className="container">
        {/* Page title */}
        <div className="text-center mb-4">
          <h1 className="text-gradient fs-1 fw-extrabold mb-2">AI Copilot Terminal</h1>
          <div className="title-line mx-auto mb-3" style={{ width: '80px', height: '3px', background: 'var(--color-primary)' }} />
          <p className="text-muted max-width-600 mx-auto">
            Interact with the portfolio database using natural language queries or voice commands.
          </p>
        </div>

        {/* Console Box */}
        <div className="row justify-content-center">
          <div className="col-lg-9 col-md-11 col-sm-12">
            <div className="terminal-box glass-card d-flex flex-column" style={{ height: '620px', borderRadius: 'var(--border-radius-lg)', border: '1px solid var(--glass-border)' }}>
              
              {/* Terminal Header */}
              <div className="terminal-header d-flex justify-content-between align-items-center p-3 border-bottom border-secondary-subtle">
                <div className="d-flex align-items-center gap-2">
                  <div className="avatar bg-primary rounded-circle d-flex align-items-center justify-content-center" style={{ width: '32px', height: '32px' }}>
                    <RiRobotLine size={16} color="#fff" />
                  </div>
                  <div>
                    <h5 className="mb-0 text-white fs-6 fw-bold">Portfolio AI Agent</h5>
                    <span className="online-indicator d-flex align-items-center gap-1">
                      <span className="dot-pulse" /> Active Node Connect
                    </span>
                  </div>
                </div>
                <div className="terminal-actions d-flex gap-2">
                  <span className="badge bg-secondary-subtle text-muted">v1.2.0</span>
                </div>
              </div>

              {/* Chat Body */}
              <div className="terminal-body flex-grow-1 overflow-auto p-4 bg-dark bg-opacity-20">
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
                <div ref={chatEndRef} />
              </div>

              {/* Suggestions Grid */}
              <div className="terminal-suggestions p-3 border-top border-secondary-subtle">
                <span className="text-secondary small fw-semibold d-block mb-2">QUICK SUGGESTIONS:</span>
                <div className="d-flex flex-wrap gap-2">
                  {SUGGESTED_QUESTIONS.map((question) => (
                    <button
                      key={question}
                      onClick={() => handleSendMessage(question)}
                      className="btn btn-dark btn-sm rounded-pill px-3 py-1.5 interactive border-secondary text-secondary"
                      style={{ fontSize: '0.85rem' }}
                    >
                      {question}
                    </button>
                  ))}
                </div>
              </div>

              {/* Input Area */}
              <div className="terminal-input p-3 border-top border-secondary-subtle bg-dark bg-opacity-40">
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    handleSendMessage(inputValue);
                  }}
                  className="d-flex gap-3"
                >
                  {supported && (
                    <button
                      type="button"
                      onClick={handleVoiceToggle}
                      className={`btn-mic-toggle d-flex align-items-center justify-content-center rounded-circle interactive ${
                        listening ? 'listening bg-danger text-white border-danger' : 'bg-dark border-secondary text-muted'
                      }`}
                      style={{ width: '45px', height: '45px' }}
                      title={listening ? "Stop Recording" : "Record voice input"}
                    >
                      {listening ? <FiMicOff size={20} /> : <FiMic size={20} />}
                    </button>
                  )}

                  <input
                    type="text"
                    className="form-control bg-dark border-secondary text-white py-2"
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    placeholder={listening ? "Listening... Speak your query..." : "Ask the AI agent a query..."}
                    disabled={listening}
                    style={{ outline: 'none' }}
                  />

                  <button
                    type="submit"
                    className="btn btn-primary d-flex align-items-center justify-content-center px-4 interactive"
                    disabled={!inputValue.trim() || listening}
                  >
                    <FiSend size={18} />
                  </button>
                </form>
              </div>

            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AIAssistant;
