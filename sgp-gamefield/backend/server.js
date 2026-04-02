const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');

const http = require('http');
const { Server } = require('socket.io');

dotenv.config();

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST", "PUT", "DELETE"]
  }
});

app.use(express.json({ limit: '50mb' }));
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization', 'x-auth-token']
}));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Inject socket.io into routes/controllers
app.use((req, res, next) => {
  req.io = io;
  next();
});

// Socket connection
io.on('connection', (socket) => {
  console.log('User connected:', socket.id);
  
  socket.on('join', (userId) => {
    if (userId) {
      socket.join(userId);
      console.log(`✅ User ${userId} joined their targeted room.`);
    }
  });

  socket.on('disconnect', () => {
    console.log('User disconnected');
  });
});

// DB connection
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/agriquest')
  .then(() => console.log('✅ MongoDB Connected'))
  .catch(err => console.error('❌ MongoDB Connection Error:', err));

// Routes
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/missions', require('./routes/missionRoutes'));
app.use('/api/leaderboard', require('./routes/leaderboardRoutes'));
app.use('/api/crops', require('./routes/cropRoutes'));
app.use('/api/ai', require('./routes/aiRoutes'));

app.get('/', (req, res) => {
  res.json({ 
    message: 'Vasudhaara API is running 🌾',
    version: '2.0.0',
    endpoints: ['/api/auth', '/api/missions', '/api/leaderboard', '/api/crops', '/api/ai']
  });
});

// Global error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Internal server error', error: err.message });
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
