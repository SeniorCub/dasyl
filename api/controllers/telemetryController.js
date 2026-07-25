const User = require('../models/User');

exports.track = async (req, res) => {
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
};
