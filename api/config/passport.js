const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const GitHubStrategy = require('passport-github2').Strategy;
const { v4: uuidv4 } = require('uuid');
const User = require('../models/User');
const Subscription = require('../models/Subscription');

// Serialize/Deserialize not strictly needed if we only use passport for the handshake, 
// but we'll include it to prevent passport errors if session is used.
passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findById(id);
    done(null, user);
  } catch (err) {
    done(err, null);
  }
});

const handleOAuthLogin = async (email, providerId, providerField, done) => {
  try {
    // Check if user exists by email
    let user = await User.findOne({ email });

    if (user) {
      // Link the provider ID if not already linked
      if (!user[providerField]) {
        user[providerField] = providerId;
        await user.save();
      }
      return done(null, user);
    }

    // Otherwise, create a new user
    const apiToken = 'dsl_' + uuidv4().replace(/-/g, '');
    user = new User({
      email,
      [providerField]: providerId,
      apiToken
    });
    await user.save();

    // Create Subscription
    const subscription = new Subscription({ userId: user._id });
    await subscription.save();

    return done(null, user);
  } catch (err) {
    return done(err, null);
  }
};

// Google Strategy
passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID || 'dummy-google-client-id',
    clientSecret: process.env.GOOGLE_CLIENT_SECRET || 'dummy-google-client-secret',
    callbackURL: '/api/oauth/google/callback'
  },
  async (accessToken, refreshToken, profile, done) => {
    const email = profile.emails[0].value;
    const googleId = profile.id;
    return handleOAuthLogin(email, googleId, 'googleId', done);
  }
));

// GitHub Strategy
passport.use(new GitHubStrategy({
    clientID: process.env.GITHUB_CLIENT_ID || 'dummy-github-client-id',
    clientSecret: process.env.GITHUB_CLIENT_SECRET || 'dummy-github-client-secret',
    callbackURL: '/api/oauth/github/callback',
    scope: ['user:email']
  },
  async (accessToken, refreshToken, profile, done) => {
    // GitHub might return multiple emails or hide them. We try to grab the primary one.
    let email = profile.emails && profile.emails.length > 0 ? profile.emails[0].value : null;
    if (!email) {
      email = `${profile.username}@github.dummy.com`; // Fallback if no public email
    }
    const githubId = profile.id;
    return handleOAuthLogin(email, githubId, 'githubId', done);
  }
));

module.exports = passport;
