const { v4: uuidv4 } = require('uuid');
const { processChat } = require('../services/aiService');
const ChatHistory = require('../models/ChatHistory');
const asyncHandler = require('../utils/asyncHandler');
const { sendSuccess, sendError, sendNotFound } = require('../utils/apiResponse');

// ─── POST /api/ai/chat ────────────────────────────────────────────────────────

/**
 * Handle an incoming chat message.
 * Creates a session ID automatically if none is provided.
 */
const chat = asyncHandler(async (req, res) => {
  const { message, sessionId } = req.body;

  if (!message || !message.trim()) {
    return sendError(res, 'Message is required', 400);
  }

  const session = sessionId || uuidv4();
  const userId  = req.user ? req.user._id : null;
  const ip      = req.ip || '';

  const result = await processChat(message.trim(), session, userId, ip);

  return sendSuccess(
    res,
    {
      reply: result.reply,
      sessionId: session,
      tokensUsed: result.tokensUsed,
      projectsFound: result.projectsFound,
    },
    'AI response generated'
  );
});

// ─── GET /api/ai/history/:sessionId ──────────────────────────────────────────

/**
 * Retrieve conversation history for a session.
 */
const getChatHistory = asyncHandler(async (req, res) => {
  const { sessionId } = req.params;
  const history = await ChatHistory.findOne({ sessionId });
  if (!history) return sendNotFound(res, 'Chat session not found');
  return sendSuccess(res, history, 'Chat history fetched');
});

// ─── DELETE /api/ai/history/:sessionId ───────────────────────────────────────

/**
 * Delete a specific chat session (admin or owner).
 */
const deleteChatHistory = asyncHandler(async (req, res) => {
  const { sessionId } = req.params;
  const history = await ChatHistory.findOneAndDelete({ sessionId });
  if (!history) return sendNotFound(res, 'Chat session not found');
  return sendSuccess(res, null, 'Chat history deleted');
});

// ─── GET /api/ai/sessions (admin) ────────────────────────────────────────────

/**
 * Admin — list all chat sessions with pagination.
 */
const getAllSessions = asyncHandler(async (req, res) => {
  const page  = parseInt(req.query.page)  || 1;
  const limit = parseInt(req.query.limit) || 20;
  const skip  = (page - 1) * limit;

  const [sessions, total] = await Promise.all([
    ChatHistory.find({})
      .sort({ updatedAt: -1 })
      .skip(skip)
      .limit(limit)
      .select('sessionId userId totalTokensUsed model createdAt updatedAt')
      .populate('userId', 'name email'),
    ChatHistory.countDocuments(),
  ]);

  return sendSuccess(res, sessions, 'Chat sessions fetched', 200, {
    total, page, limit, pages: Math.ceil(total / limit),
  });
});

module.exports = { chat, getChatHistory, deleteChatHistory, getAllSessions };
