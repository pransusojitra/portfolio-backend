const Project = require('../models/Project');
const Contact = require('../models/Contact');
const User = require('../models/User');
const ChatHistory = require('../models/ChatHistory');
const asyncHandler = require('../utils/asyncHandler');
const { sendSuccess } = require('../utils/apiResponse');

// ─── GET /api/admin/dashboard ─────────────────────────────────────────────────

/**
 * Return high-level statistics for the admin dashboard.
 */
const getDashboardStats = asyncHandler(async (req, res) => {
  const [
    totalProjects,
    totalContacts,
    totalUsers,
    totalChatSessions,
    unreadMessages,
    featuredProjects,
    projectsByCategory,
    projectsByStatus,
    recentProjects,
    recentMessages,
    recentChats,
    totalViews,
  ] = await Promise.all([
    Project.countDocuments(),
    Contact.countDocuments(),
    User.countDocuments(),
    ChatHistory.countDocuments(),
    Contact.countDocuments({ status: 'unread' }),
    Project.countDocuments({ featured: true }),

    // Projects grouped by category
    Project.aggregate([
      { $group: { _id: '$category', count: { $sum: 1 } } },
      { $sort: { count: -1 } },
    ]),

    // Projects grouped by status
    Project.aggregate([
      { $group: { _id: '$status', count: { $sum: 1 } } },
    ]),

    // 5 most recent projects
    Project.find().sort({ createdAt: -1 }).limit(5).select('title category createdAt views'),

    // 5 most recent contact messages
    Contact.find().sort({ createdAt: -1 }).limit(5).select('name email subject status createdAt'),

    // 5 most recent chat sessions
    ChatHistory.find().sort({ updatedAt: -1 }).limit(5)
      .select('sessionId totalTokensUsed updatedAt'),

    // Sum of all project views
    Project.aggregate([{ $group: { _id: null, total: { $sum: '$views' } } }]),
  ]);

  const stats = {
    overview: {
      totalProjects,
      totalContacts,
      totalUsers,
      totalChatSessions,
      unreadMessages,
      featuredProjects,
      totalViews: totalViews[0]?.total || 0,
    },
    charts: {
      projectsByCategory: projectsByCategory.map((c) => ({ name: c._id, count: c.count })),
      projectsByStatus:   projectsByStatus.map((s) => ({ name: s._id, count: s.count })),
    },
    recent: {
      projects: recentProjects,
      messages: recentMessages,
      chats:    recentChats,
    },
  };

  return sendSuccess(res, stats, 'Dashboard statistics fetched successfully');
});

// ─── GET /api/admin/users ─────────────────────────────────────────────────────

const getAllUsers = asyncHandler(async (req, res) => {
  const page  = parseInt(req.query.page)  || 1;
  const limit = parseInt(req.query.limit) || 20;
  const skip  = (page - 1) * limit;

  const [users, total] = await Promise.all([
    User.find().sort({ createdAt: -1 }).skip(skip).limit(limit),
    User.countDocuments(),
  ]);

  return sendSuccess(res, users, 'Users fetched successfully', 200, {
    total, page, limit, pages: Math.ceil(total / limit),
  });
});

// ─── PUT /api/admin/users/:id/role ───────────────────────────────────────────

const updateUserRole = asyncHandler(async (req, res) => {
  const { role } = req.body;
  if (!['user', 'admin'].includes(role)) {
    return res.status(400).json({ success: false, message: 'Invalid role' });
  }
  const user = await User.findByIdAndUpdate(
    req.params.id,
    { role },
    { new: true }
  );
  return sendSuccess(res, user, 'User role updated');
});

// ─── DELETE /api/admin/users/:id ─────────────────────────────────────────────

const deleteUser = asyncHandler(async (req, res) => {
  // Prevent self-deletion
  if (req.params.id === req.user._id.toString()) {
    return res.status(400).json({ success: false, message: 'You cannot delete your own account' });
  }
  await User.findByIdAndDelete(req.params.id);
  return sendSuccess(res, null, 'User deleted successfully');
});

module.exports = { getDashboardStats, getAllUsers, updateUserRole, deleteUser };
