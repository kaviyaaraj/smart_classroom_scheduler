const mongoose = require('mongoose');

const classroomSchema = new mongoose.Schema({
  name: { type: String, required: true },
  roomNumber: { type: String, required: true, unique: true },
  capacity: { type: Number, required: true },
  building: String,
  floor: String,
  facilities: [String],
  isAvailable: { type: Boolean, default: true },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Classroom', classroomSchema);
