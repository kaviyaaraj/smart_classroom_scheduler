const mongoose = require('mongoose');

const timetableSchema = new mongoose.Schema({
  class: { type: String, required: true },
  day: { type: String, required: true, enum: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'] },
  timeSlot: { type: String, required: true },
  subject: { type: mongoose.Schema.Types.ObjectId, ref: 'Subject', required: true },
  teacher: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  classroom: { type: mongoose.Schema.Types.ObjectId, ref: 'Classroom', required: true },
  startTime: String,
  endTime: String,
  semester: String,
  createdAt: { type: Date, default: Date.now }
});

timetableSchema.index({ day: 1, timeSlot: 1, teacher: 1 });
timetableSchema.index({ day: 1, timeSlot: 1, classroom: 1 });

module.exports = mongoose.model('Timetable', timetableSchema);
