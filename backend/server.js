const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const cors = require('cors');
const mongoose = require('mongoose');
require('dotenv').config();

const app = express();
const server = http.createServer(app);

// Configure Socket.io with CORS
const io = socketIo(server, {
  cors: {
    origin: '*', // Adjust this to match your frontend URL in production
    methods: ['GET', 'POST']
  }
});

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Attach Socket.io to app to access it in routes
app.set('io', io);

// Database Connection
const mongoURI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/osd_hackathon';
mongoose
  .connect(mongoURI)
  .then(() => console.log('MongoDB Connected Successfully'))
  .catch((err) => console.error('MongoDB Connection Error:', err));

// Socket.io Connection Logic
io.on('connection', (socket) => {
  console.log('New client connected:', socket.id);

  socket.on('disconnect', () => {
    console.log('Client disconnected:', socket.id);
  });
});

// Basic Route for testing
app.get('/', (req, res) => {
  res.send('OSD Hackathon Security API is running...');
});

// Import Routes
const authRoutes = require('./routes/auth');
const alertRoutes = require('./routes/alerts');
const faceRoutes = require('./routes/faces');
const contactRoutes = require('./routes/contacts');
const settingsRoutes = require('./routes/settings');
const emergencyRoutes = require('./routes/emergency');

// Register Routes
app.use('/api/auth', authRoutes);
app.use('/api/alerts', alertRoutes);
app.use('/api/family-faces', faceRoutes);
app.use('/api/contacts', contactRoutes);
app.use('/api/settings', settingsRoutes);
app.use('/api/emergency', emergencyRoutes);

// Start Server
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
