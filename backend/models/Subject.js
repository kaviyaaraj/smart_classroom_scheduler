const mongoose = require('mongoose');

const subjectSchema = new mongoose.Schema({
  name: { type: String, required: true },
  code: { type: String, required: true, unique: true },
  department: String,
  semester: Number,
  credits: Number,
  teacher: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  class: String,
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Subject', subjectSchema);
