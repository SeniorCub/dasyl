const User = require('../models/User');

exports.requireAdmin = async (req, res, next) => {
  try {
    // req.userId is set by the requireAuth middleware which must run before this
    const user = await User.findById(req.userId);
    
    if (!user || user.role !== 'admin') {
      return res.status(403).json({ error: 'Forbidden. Admin access required.' });
    }
    
    next();
  } catch (err) {
    return res.status(500).json({ error: 'Server error checking admin role.' });
  }
};
