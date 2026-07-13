const express = require('express');
const router = express.Router();
const Contact = require('../models/Contact');

// @route   GET /api/contacts
// @desc    Get all emergency contacts
router.get('/', async (req, res) => {
  try {
    const contacts = await Contact.find();
    res.json(contacts);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// @route   POST /api/contacts
// @desc    Add a new emergency contact
router.post('/', async (req, res) => {
  try {
    const { name, phoneNumber, notifyOnCritical } = req.body;
    if (!name || !phoneNumber) {
      return res.status(400).json({ message: 'Name and Phone Number are required' });
    }

    const newContact = new Contact({ name, phoneNumber, notifyOnCritical });
    const savedContact = await newContact.save();
    res.status(201).json(savedContact);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// @route   PUT /api/contacts/:id
// @desc    Update an emergency contact
router.put('/:id', async (req, res) => {
  try {
    const contact = await Contact.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!contact) return res.status(404).json({ message: 'Contact not found' });
    res.json(contact);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// @route   DELETE /api/contacts/:id
// @desc    Delete an emergency contact
router.delete('/:id', async (req, res) => {
  try {
    const contact = await Contact.findByIdAndDelete(req.params.id);
    if (!contact) return res.status(404).json({ message: 'Contact not found' });
    res.json({ message: 'Contact deleted successfully', id: req.params.id });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
