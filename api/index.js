require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');

// Import routes
const authRoutes = require('./routes/auth');
const oauthRoutes = require('./routes/oauth');
const adminRoutes = require('./routes/admin');
const telemetryRoutes = require('./routes/telemetry');
const leaderboardRoutes = require('./routes/leaderboard');
const passport = require('./config/passport');
const session = require('express-session');

const app = express();

// Middleware
app.use(cors({
  origin: ['https://dasyl.seniorcub.name.ng', 'http://localhost:5173', 'http://localhost:4173'],
  credentials: true
}));
app.use(express.json());

// Initialize Passport and Session
app.use(session({
  secret: process.env.JWT_SECRET || 'fallback-secret-for-development',
  resave: false,
  saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());

// Connect to Database
connectDB();

// Root Health Check
app.get('/', (req, res) => {
  res.json({ message: 'Dasyl API is running successfully on Vercel!' });
});

// Mount Routes
app.use('/api/auth', authRoutes);
app.use('/api/oauth', oauthRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/telemetry', telemetryRoutes);
app.use('/api/leaderboard', leaderboardRoutes);

const PORT = process.env.PORT || 3000;

if (!process.env.VERCEL) {
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
}

module.exports = app;
