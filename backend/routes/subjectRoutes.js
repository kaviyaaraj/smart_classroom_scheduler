const express = require('express');
const router = express.Router();
const {
  createSubject,
  getAllSubjects,
  getSubject,
  updateSubject,
  deleteSubject
} = require('../controllers/subjectController');
const { protect, authorize } = require('../middleware/auth');

router.route('/')
  .post(protect, authorize('admin'), createSubject)
  .get(protect, getAllSubjects);

router.route('/:id')
  .get(protect, getSubject)
  .put(protect, authorize('admin'), updateSubject)
  .delete(protect, authorize('admin'), deleteSubject);

module.exports = router;
