const express = require('express');
const router = express.Router();
const twilio = require('twilio');
const Contact = require('../models/Contact');
const Alert = require('../models/Alert');

// Initialize Twilio client conditionally (in case keys are not provided yet)
let twilioClient;
if (process.env.TWILIO_ACCOUNT_SID && process.env.TWILIO_AUTH_TOKEN) {
  twilioClient = twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);
}

// @route   POST /api/emergency/activate
// @desc    Trigger emergency alerts, notify contacts via SMS/Voice, and broadcast socket
router.post('/activate', async (req, res) => {
  try {
    const { latitude, longitude, triggeredBy } = req.body;
    const gpsLocation = latitude && longitude ? `Latitude: ${latitude}, Longitude: ${longitude}` : 'Location Unavailable';

    // 1. Create a critical Alert log in the DB
    const newEmergencyLog = new Alert({
      imageUrl: 'https://images.unsplash.com/photo-1582139329536-e7284fece509?q=80&w=300&auto=format&fit=crop', // Red siren emergency placeholder
      confidenceScore: 100,
      riskLevel: 'critical',
      location: `Emergency Button Pressed (${gpsLocation})`,
      resolved: false
    });
    const savedLog = await newEmergencyLog.save();

    // 2. Broadcast via socket to all frontend clients (instantly triggers red popup and siren on all interfaces)
    const io = req.app.get('io');
    if (io) {
      io.emit('emergency-activated', {
        log: savedLog,
        gps: { latitude, longitude },
        triggeredBy
      });
      console.log('Emergency activated event broadcasted!');
    }

    // 3. Send SMS to all emergency contacts using Twilio
    const contacts = await Contact.find({ notifyOnCritical: true });
    const notificationPromises = [];

    if (twilioClient && process.env.TWILIO_PHONE_NUMBER) {
      contacts.forEach((contact) => {
        const messageBody = `CRITICAL ALERT: Emergency triggered by ${triggeredBy || 'User'}. Coordinates: https://www.google.com/maps/search/?api=1&query=${latitude || 0},${longitude || 0}`;
        
        notificationPromises.push(
          twilioClient.messages.create({
            body: messageBody,
            from: process.env.TWILIO_PHONE_NUMBER,
            to: contact.phoneNumber
          })
          .then((msg) => console.log(`SMS Sent to ${contact.name}: ${msg.sid}`))
          .catch((err) => console.error(`Error sending SMS to ${contact.name}:`, err))
        );
      });
    } else {
      console.log('Twilio is not fully configured. Simulating SMS delivery.');
    }

    // Wait for all SMS attempts to finish (but don't block the API response if it takes too long)
    Promise.all(notificationPromises);

    res.json({
      message: 'Emergency activated. Contacts notified.',
      log: savedLog
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
