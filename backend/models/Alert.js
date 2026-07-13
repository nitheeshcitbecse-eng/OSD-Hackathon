const mongoose = require('mongoose');

const AlertSchema = new mongoose.Schema({
  imageUrl: {
    type: String,
    required: true
  },
  confidenceScore: {
    type: Number,
    required: true
  },
  riskLevel: {
    type: String,
    enum: ['low', 'medium', 'critical'],
    default: 'medium'
  },
  resolved: {
    type: Boolean,
    default: false
  },
  location: {
    type: String,
    default: 'Front Door'
  },
  timestamp: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Alert', AlertSchema);
