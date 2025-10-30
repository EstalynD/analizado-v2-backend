const mongoose = require('mongoose');
const { v4: uuidv4 } = require('uuid');

const reportSchema = new mongoose.Schema({
  reportId: {
    type: String,
    required: true,
    unique: true,
    default: () => uuidv4()
  },
  speedTestResult: {
    type: mongoose.Schema.Types.Mixed,
    required: true
  },
  hardwareInfo: {
    type: mongoose.Schema.Types.Mixed,
    required: true
  },
  streamingAnalysis: {
    type: mongoose.Schema.Types.Mixed,
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  expiresAt: {
    type: Date,
    default: () => {
      const date = new Date();
      date.setDate(date.getDate() + 3); // 3 días desde ahora
      return date;
    },
    index: { expireAfterSeconds: 0 } // Índice TTL para eliminación automática cuando expire
  }
});

// No es necesario crear un índice explícito para reportId ya que unique: true lo crea automáticamente

module.exports = mongoose.model('Report', reportSchema);

