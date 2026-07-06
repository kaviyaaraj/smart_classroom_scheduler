const express = require('express');
const router = express.Router();
const {
  generateTimetable,
  getTimetable,
  getTeacherTimetable,
  updateTimetable,
  deleteTimetable
} = require('../controllers/timetableController');
const { protect, authorize } = require('../middleware/auth');

router.post('/generate', protect, authorize('admin'), generateTimetable);
router.get('/', protect, getTimetable);
router.get('/teacher', protect, authorize('teacher'), getTeacherTimetable);
router.put('/:id', protect, authorize('admin'), updateTimetable);
router.delete('/:id', protect, authorize('admin'), deleteTimetable);

module.exports = router;
