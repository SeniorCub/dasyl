const User = require('../models/User');

exports.getLeaderboard = async (req, res) => {
  try {
    const topUsers = await User.find()
      .sort({ score: -1 })
      .limit(50)
      .select('username score lastActive -_id'); // Exclude _id
      
    res.json(topUsers);
  } catch (error) {
    res.status(500).json({ error: 'Server error fetching leaderboard' });
  }
};
