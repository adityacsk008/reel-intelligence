const mongoose = require('mongoose');

const analyticsSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  totalReels: {
    type: Number,
    default: 0
  },
  totalViews: {
    type: Number,
    default: 0
  },
  averageViews: {
    type: Number,
    default: 0
  },
  highestViews: {
    type: Number,
    default: 0
  },
  lowestViews: {
    type: Number,
    default: 0
  },
  viralReels: {
    type: Number,
    default: 0
  },
  viralRatio: {
    type: Number,
    default: 0
  },
  growthRate: {
    type: Number,
    default: 0
  },
  consistencyScore: {
    type: Number,
    default: 0
  },
  categoryBreakdown: {
    Movie: { type: Number, default: 0 },
    Comedy: { type: Number, default: 0 },
    Motivation: { type: Number, default: 0 },
    'Trending Audio': { type: Number, default: 0 },
    Other: { type: Number, default: 0 }
  },
  lastCalculated: {
    type: Date,
    default: Date.now
  }
});

// Index for faster queries
analyticsSchema.index({ userId: 1 });

module.exports = mongoose.model('Analytics', analyticsSchema);