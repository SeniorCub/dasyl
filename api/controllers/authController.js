const { v4: uuidv4 } = require('uuid');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const Subscription = require('../models/Subscription');

const JWT_SECRET = process.env.JWT_SECRET || 'fallback-secret-for-development';

exports.register = async (req, res) => {
  try {
    const { email, password } = req.body;
    
    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' });
    }

    let user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({ error: 'Email already in use' });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Generate unique CLI API Token
    const apiToken = 'dsl_' + uuidv4().replace(/-/g, '');

    // Create User
    user = new User({ 
      email, 
      password: hashedPassword,
      apiToken
    });
    await user.save();

    // Create linked Subscription (Free Tier)
    const subscription = new Subscription({
      userId: user._id
    });
    await subscription.save();

    // Mint JWT for the Dashboard
    const token = jwt.sign({ userId: user._id }, JWT_SECRET, { expiresIn: '7d' });

    res.status(201).json({ 
      token, 
      apiToken, 
      email: user.email,
      message: 'Registered successfully!' 
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ error: 'Server error during registration' });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    
    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const token = jwt.sign({ userId: user._id }, JWT_SECRET, { expiresIn: '7d' });

    res.json({ 
      token, 
      apiToken: user.apiToken, 
      email: user.email,
      message: 'Logged in successfully!' 
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Server error during login' });
  }
};

exports.me = async (req, res) => {
  try {
    const user = await User.findById(req.userId).select('-password');
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    
    const subscription = await Subscription.findOne({ userId: user._id });
    
    res.json({ user, subscription });
  } catch (error) {
    console.error('Me error:', error);
    res.status(500).json({ error: 'Server error fetching profile' });
  }
};
