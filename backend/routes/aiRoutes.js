const express = require('express');
const router = express.Router();

const {
  chat,
  getChatHistory,
  deleteChatHistory,
  getAllSessions,
} = require('../controllers/aiController');

const { protect, adminOnly } = require('../middleware/auth');
const { chatLimiter } = require('../middleware/rateLimiter');

// Public — chat endpoint with rate limiting
// Optionally attach user if token is present (non-blocking)
router.post('/chat', chatLimiter, chat);

// Session history — accessible by anyone with the session ID
router.get('/history/:sessionId',    getChatHistory);
router.delete('/history/:sessionId', protect, deleteChatHistory);

// Admin — view all sessions
router.get('/sessions', protect, adminOnly, getAllSessions);

module.exports = router;
