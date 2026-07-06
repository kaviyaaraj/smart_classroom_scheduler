const express = require('express');
const router = express.Router();
const {
  createNotification,
  getNotifications,
  markAsRead,
  deleteNotification
} = require('../controllers/notificationController');
const { protect, authorize } = require('../middleware/auth');

router.post('/', protect, authorize('admin'), createNotification);
router.get('/', protect, getNotifications);
router.put('/:id/read', protect, markAsRead);
router.delete('/:id', protect, authorize('admin'), deleteNotification);

module.exports = router;
