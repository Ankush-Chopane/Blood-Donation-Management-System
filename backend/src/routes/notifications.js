const express = require('express');
const {
  createNotification,
  listNotifications,
  getNotificationById,
  markAllAsRead,
  updateNotification,
  deleteNotification
} = require('../controllers/notificationController');
const { protect, authorize } = require('../middleware/auth');

const router = express.Router();

router.patch('/mark-all-read', protect, markAllAsRead);

router
  .route('/')
  .get(protect, listNotifications)
  .post(protect, authorize('admin', 'coordinator'), createNotification);

router
  .route('/:id')
  .get(protect, getNotificationById)
  .put(protect, updateNotification)
  .delete(protect, deleteNotification);

module.exports = router;
