const User = require('../models/User');
const Subscription = require('../models/Subscription');

exports.getStats = async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    const totalSubscriptions = await Subscription.countDocuments();
    
    // Sum all builds this month across all subscriptions
    const buildsAgg = await Subscription.aggregate([
      { $group: { _id: null, totalBuilds: { $sum: '$buildsThisMonth' } } }
    ]);
    const totalBuildsThisMonth = buildsAgg.length > 0 ? buildsAgg[0].totalBuilds : 0;

    // Get top 10 users by score
    const topUsers = await User.find()
      .sort({ score: -1 })
      .limit(10)
      .select('email score streak role createdAt');

    res.json({
      totalUsers,
      totalSubscriptions,
      totalBuildsThisMonth,
      topUsers
    });
  } catch (error) {
    console.error('Admin stats error:', error);
    res.status(500).json({ error: 'Server error fetching admin stats' });
  }
};
