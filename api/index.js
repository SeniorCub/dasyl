require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');

// Import routes
const authRoutes = require('./routes/auth');
const telemetryRoutes = require('./routes/telemetry');
const leaderboardRoutes = require('./routes/leaderboard');

const app = express();

// Middleware
app.use(cors({
  origin: ['https://dasyl.seniorcub.name.ng', 'http://localhost:5173', 'http://localhost:4173'],
  credentials: true
}));
app.use(express.json());

// Connect to Database
connectDB();

// Root Health Check
app.get('/', (req, res) => {
  res.json({ message: 'Dasyl API is running successfully on Vercel!' });
});

// Mount Routes
app.use('/api/auth', authRoutes);
app.use('/api/telemetry', telemetryRoutes);
app.use('/api/leaderboard', leaderboardRoutes);

const PORT = process.env.PORT || 3000;

if (!process.env.VERCEL) {
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
}

module.exports = app;
