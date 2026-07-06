// routes/generateTimetableRoute.js
const express = require('express');
const router = express.Router();
const { generateTimetable } = require('../controllers/generateTimetableController');

// POST /api/generate-timetable
// Public endpoint — no auth needed for the standalone generator
router.post('/', generateTimetable);

module.exports = router;
