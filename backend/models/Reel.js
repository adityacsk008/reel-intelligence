const mongoose = require('mongoose');

const reelSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  reelId: {
    type: String,
    required: true,
    unique: true
  },
  reelUrl: {
    type: String,
    required: true
  },
  viewCount: {
    type: Number,
    required: true,
    default: 0
  },
  category: {
    type: String,
    enum: ['Movie', 'Comedy', 'Motivation', 'Trending Audio', 'Other'],
    default: 'Other'
  },
  qualityScore: {
    type: Number,
    min: 0,
    max: 100,
    default: 0
  },
  isViral: {
    type: Boolean,
    default: false
  },
  viralScore: {
    type: Number,
    default: 0
  },
  viewHistory: [{
    views: Number,
    timestamp: {
      type: Date,
      default: Date.now
    }
  }],
  scannedAt: {
    type: Date,
    default: Date.now
  },
  lastUpdated: {
    type: Date,
    default: Date.now
  }
});

// Index for faster queries
reelSchema.index({ userId: 1, scannedAt: -1 });
reelSchema.index({ reelId: 1 });

module.exports = mongoose.model('Reel', reelSchema);