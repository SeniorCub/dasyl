require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const { v4: uuidv4 } = require('uuid');
const User = require('./models/User');

const app = express();
app.use(cors({
  origin: ['https://dasyl.seniorcub.name.ng', 'http://localhost:5173', 'http://localhost:4173'],
  credentials: true
}));
app.use(express.json());

const PORT = process.env.PORT || 3000;
const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/dasyl-leaderboard';

mongoose.connect(MONGO_URI)
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('MongoDB connection error:', err));

// Root Health Check
app.get('/', (req, res) => {
  res.json({ message: 'Dasyl API is running successfully on Vercel!' });
});

// Register a new user
app.post('/api/auth/register', async (req, res) => {
  try {
    const { username } = req.body;
    if (!username) return res.status(400).json({ error: 'Username is required' });

    let user = await User.findOne({ username });
    if (user) {
      // If user exists, just return their ID (in a real app, this should have a password or OAuth)
      return res.json({ userId: user.userId, username: user.username, message: 'Welcome back!' });
    }

    const userId = uuidv4();
    user = new User({ userId, username });
    await user.save();

    res.json({ userId, username, message: 'Registered successfully!' });
  } catch (error) {
    res.status(500).json({ error: 'Server error during registration' });
  }
});

// Track usage
app.post('/api/telemetry/track', async (req, res) => {
  try {
    const { userId } = req.body;
    if (!userId) return res.status(400).json({ error: 'userId is required' });

    const user = await User.findOneAndUpdate(
      { userId },
      { 
        $inc: { score: 1 },
        $set: { lastActive: new Date() }
      },
      { new: true }
    );

    if (!user) return res.status(404).json({ error: 'User not found' });

    res.json({ success: true, score: user.score });
  } catch (error) {
    res.status(500).json({ error: 'Server error during tracking' });
  }
});

// Get leaderboard
app.get('/api/leaderboard', async (req, res) => {
  try {
    const topUsers = await User.find()
      .sort({ score: -1 })
      .limit(50)
      .select('username score lastActive -_id'); // Exclude _id, only send necessary data
      
    res.json(topUsers);
  } catch (error) {
    res.status(500).json({ error: 'Server error fetching leaderboard' });
  }
});

if (!process.env.VERCEL) {
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
}

module.exports = app;
