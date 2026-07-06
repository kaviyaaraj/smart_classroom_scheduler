const express = require('express');
const router = express.Router();
const {
  createClassroom,
  getAllClassrooms,
  getClassroom,
  updateClassroom,
  deleteClassroom
} = require('../controllers/classroomController');
const { protect, authorize } = require('../middleware/auth');

router.route('/')
  .post(protect, authorize('admin'), createClassroom)
  .get(protect, getAllClassrooms);

router.route('/:id')
  .get(protect, getClassroom)
  .put(protect, authorize('admin'), updateClassroom)
  .delete(protect, authorize('admin'), deleteClassroom);

module.exports = router;
