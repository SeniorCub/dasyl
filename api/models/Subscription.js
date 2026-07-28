const mongoose = require('mongoose');

const subscriptionSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
  tier: { type: String, enum: ['free', 'pro'], default: 'free' },
  buildsThisMonth: { type: Number, default: 0 },
  buildLimit: { type: Number, default: 10 },
  totalProjects: { type: Number, default: 0 },
  renewalDate: { type: Date }
});

// Pre-save hook to set a renewal date 30 days from now if not set
subscriptionSchema.pre('save', function() {
  if (!this.renewalDate) {
    const nextMonth = new Date();
    nextMonth.setDate(nextMonth.getDate() + 30);
    this.renewalDate = nextMonth;
  }
});

module.exports = mongoose.model('Subscription', subscriptionSchema);
