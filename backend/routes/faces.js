const express = require('express');
const router = express.Router();
const Face = require('../models/Face');

// @route   GET /api/family-faces
// @desc    Get all family face metadata
router.get('/', async (req, res) => {
  try {
    const faces = await Face.find().sort({ createdAt: -1 });
    res.json(faces);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// @route   POST /api/family-faces
// @desc    Add a new family face
router.post('/', async (req, res) => {
  try {
    const { name, imageUrl } = req.body;
    if (!name || !imageUrl) {
      return res.status(400).json({ message: 'Name and Image URL are required' });
    }

    const newFace = new Face({ name, imageUrl });
    const savedFace = await newFace.save();
    res.status(201).json(savedFace);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// @route   DELETE /api/family-faces/:id
// @desc    Delete a family face record
router.delete('/:id', async (req, res) => {
  try {
    const face = await Face.findByIdAndDelete(req.params.id);
    if (!face) return res.status(404).json({ message: 'Face record not found' });
    res.json({ message: 'Face record deleted successfully', id: req.params.id });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
