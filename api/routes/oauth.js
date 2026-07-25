const express = require('express');
const passport = require('passport');
const jwt = require('jsonwebtoken');
const router = express.Router();

const JWT_SECRET = process.env.JWT_SECRET || 'fallback-secret-for-development';
const FRONTEND_URL = process.env.FRONTEND_URL || 'http://localhost:5173';

// Generate JWT and redirect
const handleCallback = (req, res) => {
  if (!req.user) {
    return res.redirect(`${FRONTEND_URL}/login?error=oauth_failed`);
  }
  const token = jwt.sign({ userId: req.user._id }, JWT_SECRET, { expiresIn: '7d' });
  // Send the token in the query string so the frontend can save it
  res.redirect(`${FRONTEND_URL}/oauth/callback?token=${token}`);
};

// Google Routes
router.get('/google', passport.authenticate('google', { scope: ['profile', 'email'] }));
router.get('/google/callback', passport.authenticate('google', { failureRedirect: `${FRONTEND_URL}/login` }), handleCallback);

// GitHub Routes
router.get('/github', passport.authenticate('github', { scope: ['user:email'] }));
router.get('/github/callback', passport.authenticate('github', { failureRedirect: `${FRONTEND_URL}/login` }), handleCallback);

module.exports = router;
