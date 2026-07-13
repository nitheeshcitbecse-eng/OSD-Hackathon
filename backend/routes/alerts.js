const express = require('express');
const router = express.Router();
const Alert = require('../models/Alert');

// @route   GET /api/alerts
// @desc    Get all historical alerts (sorted newest first)
router.get('/', async (req, res) => {
  try {
    const alerts = await Alert.find().sort({ timestamp: -1 });
    res.json(alerts);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// @route   POST /api/alerts/trigger
// @desc    Ingest new alert from ML model and broadcast via WebSocket
router.post('/trigger', async (req, res) => {
  try {
    const { imageUrl, confidenceScore, riskLevel, location } = req.body;

    const newAlert = new Alert({
      imageUrl,
      confidenceScore,
      riskLevel,
      location
    });

    const savedAlert = await newAlert.save();

    // Broadcast the alert to all WebSocket clients instantly
    const io = req.app.get('io');
    if (io) {
      io.emit('new-alert', savedAlert);
      console.log('Socket broadcasted new alert:', savedAlert._id);
    }

    res.status(201).json(savedAlert);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// @route   PUT /api/alerts/:id/resolve
// @desc    Mark an alert as resolved
router.put('/:id/resolve', async (req, res) => {
  try {
    const alert = await Alert.findByIdAndUpdate(
      req.params.id,
      { resolved: true },
      { new: true }
    );
    if (!alert) return res.status(404).json({ message: 'Alert not found' });
    res.json(alert);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
