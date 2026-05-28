const express = require('express');
const router = express.Router();

const {
  submitContact,
  getAllContacts,
  getContactById,
  updateContactStatus,
  deleteContact,
} = require('../controllers/contactController');

const { protect, adminOnly } = require('../middleware/auth');
const validate = require('../middleware/validate');
const { contactValidation } = require('../validations/contactValidation');
const { apiLimiter } = require('../middleware/rateLimiter');

// Public — submit a contact message
router.post('/', apiLimiter, contactValidation, validate, submitContact);

// Admin — manage contact messages
router.get('/',      protect, adminOnly, getAllContacts);
router.get('/:id',   protect, adminOnly, getContactById);
router.put('/:id',   protect, adminOnly, updateContactStatus);
router.delete('/:id', protect, adminOnly, deleteContact);

module.exports = router;
