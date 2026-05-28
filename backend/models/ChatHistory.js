const mongoose = require('mongoose');

const MessageSchema = new mongoose.Schema({
  role: {
    type: String,
    enum: ['user', 'assistant', 'system'],
    required: true,
  },
  content: {
    type: String,
    required: true,
  },
  timestamp: {
    type: Date,
    default: Date.now,
  },
});

const ChatHistorySchema = new mongoose.Schema(
  {
    sessionId: {
      type: String,
      required: true,
      index: true,
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null,
    },
    messages: [MessageSchema],
    ipAddress: {
      type: String,
      default: '',
    },
    totalTokensUsed: {
      type: Number,
      default: 0,
    },
    model: {
      type: String,
      default: 'gpt-3.5-turbo',
    },
  },
  { timestamps: true }
);

// Auto-expire chat history after 30 days
ChatHistorySchema.index({ createdAt: 1 }, { expireAfterSeconds: 30 * 24 * 60 * 60 });

module.exports = mongoose.model('ChatHistory', ChatHistorySchema);
