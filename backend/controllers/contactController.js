const Contact = require('../models/Contact');
const asyncHandler = require('../utils/asyncHandler');
const { sendSuccess, sendCreated, sendNotFound } = require('../utils/apiResponse');

// ─── Submit contact message ───────────────────────────────────────────────────

/**
 * POST /api/contact
 * Public — submit a new contact message.
 */
const submitContact = asyncHandler(async (req, res) => {
  const { name, email, phone, subject, message } = req.body;

  const contact = await Contact.create({
    name,
    email,
    phone,
    subject,
    message,
    ipAddress: req.ip,
    userAgent: req.headers['user-agent'] || '',
  });

  return sendCreated(
    res,
    { id: contact._id },
    "Thank you for reaching out! I'll get back to you soon."
  );
});

// ─── Get all messages (admin) ─────────────────────────────────────────────────

/**
 * GET /api/contact
 * Admin — paginated list of all contact messages.
 */
const getAllContacts = asyncHandler(async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 20;
  const skip = (page - 1) * limit;
  const status = req.query.status;

  const filter = {};
  if (status && ['unread', 'read', 'replied', 'archived'].includes(status)) {
    filter.status = status;
  }

  const [contacts, total] = await Promise.all([
    Contact.find(filter).sort({ createdAt: -1 }).skip(skip).limit(limit),
    Contact.countDocuments(filter),
  ]);

  return sendSuccess(res, contacts, 'Contacts fetched successfully', 200, {
    total,
    page,
    limit,
    pages: Math.ceil(total / limit),
  });
});

// ─── Get single contact ───────────────────────────────────────────────────────

/**
 * GET /api/contact/:id
 * Admin — fetch a single contact message and mark as read.
 */
const getContactById = asyncHandler(async (req, res) => {
  const contact = await Contact.findById(req.params.id);
  if (!contact) return sendNotFound(res, 'Contact message not found');

  if (contact.status === 'unread') {
    contact.status = 'read';
    await contact.save();
  }

  return sendSuccess(res, contact, 'Contact fetched successfully');
});

// ─── Update contact status ────────────────────────────────────────────────────

/**
 * PUT /api/contact/:id
 * Admin — update status (read / replied / archived).
 */
const updateContactStatus = asyncHandler(async (req, res) => {
  const { status } = req.body;
  const contact = await Contact.findByIdAndUpdate(
    req.params.id,
    { status },
    { new: true, runValidators: true }
  );
  if (!contact) return sendNotFound(res, 'Contact message not found');
  return sendSuccess(res, contact, 'Contact status updated');
});

// ─── Delete contact ───────────────────────────────────────────────────────────

/**
 * DELETE /api/contact/:id
 * Admin — permanently delete a contact message.
 */
const deleteContact = asyncHandler(async (req, res) => {
  const contact = await Contact.findByIdAndDelete(req.params.id);
  if (!contact) return sendNotFound(res, 'Contact message not found');
  return sendSuccess(res, null, 'Contact message deleted successfully');
});

module.exports = {
  submitContact,
  getAllContacts,
  getContactById,
  updateContactStatus,
  deleteContact,
};
