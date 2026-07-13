const mongoose = require('mongoose');

const SettingsSchema = new mongoose.Schema({
  alertSensitivity: {
    type: Number,
    min: 0,
    max: 100,
    default: 80
  },
  nightMode: {
    type: Boolean,
    default: false
  },
  autoEmergencyTimer: {
    type: Number, // duration in seconds
    default: 10
  },
  sirenVolume: {
    type: Number,
    min: 0,
    max: 100,
    default: 100
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Settings', SettingsSchema);
