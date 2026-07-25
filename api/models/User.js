const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String }, // Optional for OAuth users
  googleId: { type: String, sparse: true, unique: true },
  githubId: { type: String, sparse: true, unique: true },
  role: { type: String, enum: ['user', 'admin'], default: 'user' },
  apiToken: { type: String, unique: true }, // The CLI token
  
  // Gamification & Identity
  score: { type: Number, default: 0 },
  streak: { type: Number, default: 0 },
  lastActive: { type: Date, default: Date.now }
});

module.exports = mongoose.model('User', userSchema);
