const { v4: uuidv4 } = require('uuid');
const User = require('../models/User');

exports.register = async (req, res) => {
  try {
    const { username } = req.body;
    if (!username) return res.status(400).json({ error: 'Username is required' });

    let user = await User.findOne({ username });
    if (user) {
      return res.json({ userId: user.userId, username: user.username, message: 'Welcome back!' });
    }

    const userId = uuidv4();
    user = new User({ userId, username });
    await user.save();

    res.json({ userId, username, message: 'Registered successfully!' });
  } catch (error) {
    res.status(500).json({ error: 'Server error during registration' });
  }
};
