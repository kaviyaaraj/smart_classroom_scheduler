const express = require('express');
const router = express.Router();
const {
  uploadMaterial,
  getMaterials,
  getStudentMaterials,
  deleteMaterial
} = require('../controllers/materialController');
const { protect, authorize } = require('../middleware/auth');

router.post('/', protect, authorize('teacher'), uploadMaterial);
router.get('/', protect, getMaterials);
router.get('/student', protect, authorize('student'), getStudentMaterials);
router.delete('/:id', protect, authorize('teacher', 'admin'), deleteMaterial);

module.exports = router;
