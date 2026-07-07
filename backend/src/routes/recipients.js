const express = require('express');
const {
  createRecipient,
  listRecipients,
  getMyRecipientProfile,
  getRecipientById,
  updateRecipient,
  deleteRecipient
} = require('../controllers/recipientController');
const { protect, authorize } = require('../middleware/auth');

const router = express.Router();

router.route('/me').get(protect, getMyRecipientProfile);

router
  .route('/')
  .get(listRecipients)
  .post(protect, authorize('recipient', 'admin', 'coordinator'), createRecipient);

router
  .route('/:id')
  .get(getRecipientById)
  .put(protect, updateRecipient)
  .delete(protect, deleteRecipient);

module.exports = router;
