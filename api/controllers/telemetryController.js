const User = require('../models/User');
const Subscription = require('../models/Subscription');

exports.track = async (req, res) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ error: 'Unauthorized. Missing Bearer token' });
    }

    const apiToken = authHeader.split(' ')[1];
    if (!apiToken) {
      return res.status(401).json({ error: 'Unauthorized. Empty Bearer token' });
    }

    const user = await User.findOne({ apiToken });
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    if (user.apiTokenExpires && new Date() > user.apiTokenExpires) {
      return res.status(401).json({ error: 'API Token has expired. Please generate a new one in the dashboard.' });
    }

    // Increment Gamification Metrics
    user.score += 1;
    user.lastActive = new Date();
    
    // Check Streak logic (simple implementation: +1 if lastActive was today/yesterday)
    // For now we just naively increment it, we can harden streak logic later
    user.streak += 1; 
    
    await user.save();

    // Increment Subscription Limits
    const subscription = await Subscription.findOneAndUpdate(
      { userId: user._id },
      { 
        $inc: { buildsThisMonth: 1, totalProjects: 1 }
      },
      { new: true }
    );

    if (!subscription) {
       // Failsafe in case they registered before the Subscription schema existed
       const newSub = new Subscription({ userId: user._id, buildsThisMonth: 1, totalProjects: 1 });
       await newSub.save();
    }

    res.json({ success: true, score: user.score, buildsThisMonth: subscription ? subscription.buildsThisMonth : 1 });
  } catch (error) {
    console.error('Telemetry error:', error);
    res.status(500).json({ error: 'Server error during tracking' });
  }
};

exports.verify = async (req, res) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ error: 'Unauthorized. Missing Bearer token' });
    }

    const apiToken = authHeader.split(' ')[1];
    if (!apiToken) {
      return res.status(401).json({ error: 'Unauthorized. Empty Bearer token' });
    }

    const user = await User.findOne({ apiToken });
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    if (user.apiTokenExpires && new Date() > user.apiTokenExpires) {
      return res.status(401).json({ error: 'API Token has expired. Please generate a new one in the dashboard.' });
    }

    res.json({ success: true, email: user.email });
  } catch (error) {
    console.error('Verify error:', error);
    res.status(500).json({ error: 'Server error during verification' });
  }
};
