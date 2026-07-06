const mongoose = require('mongoose');

const materialSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: String,
  subject: { type: mongoose.Schema.Types.ObjectId, ref: 'Subject', required: true },
  teacher: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  class: { type: String, required: true },
  fileUrl: { type: String, required: true },
  fileName: String,
  fileType: String,
  uploadDate: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Material', materialSchema);
