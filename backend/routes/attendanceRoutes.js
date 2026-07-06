const express = require('express');
const router = express.Router();
const {
  markAttendance,
  getAttendance,
  getStudentAttendance,
  updateAttendance
} = require('../controllers/attendanceController');
const { protect, authorize } = require('../middleware/auth');

router.post('/', protect, authorize('teacher'), markAttendance);
router.get('/', protect, getAttendance);
router.get('/student', protect, authorize('student'), getStudentAttendance);
router.put('/:id', protect, authorize('teacher'), updateAttendance);

module.exports = router;
