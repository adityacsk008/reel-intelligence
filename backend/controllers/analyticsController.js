const Reel = require('../models/Reel');
const Analytics = require('../models/Analytics');
const AIEngine = require('../utils/aiEngine');
const ViralDetector = require('../utils/viralDetector');

// @desc    Get dashboard overview
// @route   GET /api/analytics/overview
// @access  Private
exports.getOverview = async (req, res) => {
  try {
    const userId = req.user.id;

    const reels = await Reel.find({ userId });

    if (reels.length === 0) {
      return res.status(200).json({
        success: true,
        data: {
          totalReels: 0,
          totalViews: 0,
          averageViews: 0,
          highestViews: 0,
          lowestViews: 0,
          viralReels: 0,
          viralRatio: 0,
          message: 'No reels scanned yet'
        }
      });
    }

    // Calculate metrics
    const totalReels = reels.length;
    const totalViews = reels.reduce((sum, reel) => sum + reel.viewCount, 0);
    const averageViews = Math.round(totalViews / totalReels);
    const highestViews = Math.max(...reels.map(r => r.viewCount));
    const lowestViews = Math.min(...reels.map(r => r.viewCount));
    const viralReels = reels.filter(r => r.isViral).length;
    const viralRatio = Math.round((viralReels / totalReels) * 100);

    // Category breakdown
    const categoryBreakdown = {
      Movie: reels.filter(r => r.category === 'Movie').length,
      Comedy: reels.filter(r => r.category === 'Comedy').length,
      Motivation: reels.filter(r => r.category === 'Motivation').length,
      'Trending Audio': reels.filter(r => r.category === 'Trending Audio').length,
      Other: reels.filter(r => r.category === 'Other').length
    };

    // Growth rate
    const growthRate = AIEngine.calculateGrowthRate(reels);

    // Consistency score
    const consistencyScore = AIEngine.calculateConsistencyScore(reels);

    // Top performing reels
    const topReels = reels
      .sort((a, b) => b.viewCount - a.viewCount)
      .slice(0, 5)
      .map(r => ({
        reelId: r.reelId,
        reelUrl: r.reelUrl,
        viewCount: r.viewCount,
        category: r.category,
        qualityScore: r.qualityScore,
        isViral: r.isViral
      }));

    // Save/update analytics
    await Analytics.findOneAndUpdate(
      { userId },
      {
        totalReels,
        totalViews,
        averageViews,
        highestViews,
        lowestViews,
        viralReels,
        viralRatio,
        growthRate,
        consistencyScore,
        categoryBreakdown,
        lastCalculated: Date.now()
      },
      { upsert: true, new: true }
    );

    res.status(200).json({
      success: true,
      data: {
        totalReels,
        totalViews,
        averageViews,
        highestViews,
        lowestViews,
        viralReels,
        viralRatio,
        growthRate,
        consistencyScore,
        categoryBreakdown,
        topReels
      }
    });

  } catch (error) {
    console.error('Get overview error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

// @desc    Get growth metrics
// @route   GET /api/analytics/growth
// @access  Private
exports.getGrowth = async (req, res) => {
  try {
    const userId = req.user.id;
    const { timeframe = '7d' } = req.query;

    // Calculate cutoff date
    const days = parseInt(timeframe) || 7;
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - days);

    const reels = await Reel.find({
      userId,
      scannedAt: { $gte: cutoffDate }
    }).sort({ scannedAt: 1 });

    if (reels.length === 0) {
      return res.status(200).json({
        success: true,
        data: {
          growthData: [],
          message: 'No data available for selected timeframe'
        }
      });
    }

    // Group by day
    const growthData = [];
    const dayMap = new Map();

    reels.forEach(reel => {
      const day = new Date(reel.scannedAt).toISOString().split('T')[0];
      
      if (!dayMap.has(day)) {
        dayMap.set(day, {
          date: day,
          reels: 0,
          totalViews: 0,
          avgViews: 0
        });
      }

      const dayData = dayMap.get(day);
      dayData.reels += 1;
      dayData.totalViews += reel.viewCount;
      dayData.avgViews = Math.round(dayData.totalViews / dayData.reels);
    });

    dayMap.forEach(value => growthData.push(value));

    res.status(200).json({
      success: true,
      data: {
        timeframe: `${days} days`,
        growthData
      }
    });

  } catch (error) {
    console.error('Get growth error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

// @desc    Get viral detection results
// @route   GET /api/analytics/viral
// @access  Private
exports.getViralReels = async (req, res) => {
  try {
    const userId = req.user.id;

    const viralReels = await Reel.find({ userId, isViral: true })
      .sort({ viralScore: -1 });

    const viralAlerts = [];

    for (const reel of viralReels) {
      const viralPotential = ViralDetector.checkViralPotential(reel);
      const spike = ViralDetector.detectSpike(reel);

      viralAlerts.push({
        reel: {
          reelId: reel.reelId,
          reelUrl: reel.reelUrl,
          viewCount: reel.viewCount,
          category: reel.category,
          qualityScore: reel.qualityScore,
          viralScore: reel.viralScore
        },
        viralPotential,
        spike
      });
    }

    res.status(200).json({
      success: true,
      data: {
        totalViralReels: viralReels.length,
        viralAlerts
      }
    });

  } catch (error) {
    console.error('Get viral reels error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

// @desc    Compare creators
// @route   POST /api/analytics/compare
// @access  Private
exports.compareCreators = async (req, res) => {
  try {
    const { creator1Id, creator2Id } = req.body;

    if (!creator1Id || !creator2Id) {
      return res.status(400).json({
        success: false,
        message: 'Please provide both creator IDs'
      });
    }

    const analytics1 = await Analytics.findOne({ userId: creator1Id });
    const analytics2 = await Analytics.findOne({ userId: creator2Id });

    if (!analytics1 || !analytics2) {
      return res.status(404).json({
        success: false,
        message: 'Analytics not found for one or both creators'
      });
    }

    const comparison = {
      creator1: {
        totalReels: analytics1.totalReels,
        averageViews: analytics1.averageViews,
        viralRatio: analytics1.viralRatio,
        consistencyScore: analytics1.consistencyScore,
        growthRate: analytics1.growthRate
      },
      creator2: {
        totalReels: analytics2.totalReels,
        averageViews: analytics2.averageViews,
        viralRatio: analytics2.viralRatio,
        consistencyScore: analytics2.consistencyScore,
        growthRate: analytics2.growthRate
      },
      winner: {
        averageViews: analytics1.averageViews > analytics2.averageViews ? 'creator1' : 'creator2',
        viralRatio: analytics1.viralRatio > analytics2.viralRatio ? 'creator1' : 'creator2',
        consistency: analytics1.consistencyScore > analytics2.consistencyScore ? 'creator1' : 'creator2',
        growth: analytics1.growthRate > analytics2.growthRate ? 'creator1' : 'creator2'
      }
    };

    res.status(200).json({
      success: true,
      data: comparison
    });

  } catch (error) {
    console.error('Compare creators error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

// @desc    Export analytics data
// @route   GET /api/analytics/export
// @access  Private
exports.exportData = async (req, res) => {
  try {
    const userId = req.user.id;
    const { format = 'json' } = req.query;

    const reels = await Reel.find({ userId });
    const analytics = await Analytics.findOne({ userId });

    const exportData = {
      exportDate: new Date().toISOString(),
      analytics,
      reels: reels.map(r => ({
        reelId: r.reelId,
        reelUrl: r.reelUrl,
        viewCount: r.viewCount,
        category: r.category,
        qualityScore: r.qualityScore,
        isViral: r.isViral,
        viralScore: r.viralScore,
        scannedAt: r.scannedAt
      }))
    };

    if (format === 'csv') {
      // Convert to CSV
      let csv = 'Reel ID,Reel URL,Views,Category,Quality Score,Is Viral,Viral Score,Scanned At\n';
      
      exportData.reels.forEach(reel => {
        csv += `${reel.reelId},${reel.reelUrl},${reel.viewCount},${reel.category},${reel.qualityScore},${reel.isViral},${reel.viralScore},${reel.scannedAt}\n`;
      });

      res.setHeader('Content-Type', 'text/csv');
      res.setHeader('Content-Disposition', 'attachment; filename=reel-analytics.csv');
      return res.send(csv);
    }

    res.status(200).json({
      success: true,
      data: exportData
    });

  } catch (error) {
    console.error('Export data error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

// @desc    Get brand match score and pricing
// @route   GET /api/analytics/agency/brand-match
// @access  Private
exports.getBrandMatch = async (req, res) => {
  try {
    const userId = req.user.id;
    const { targetAudience = 'general' } = req.query;

    const analytics = await Analytics.findOne({ userId });

    if (!analytics) {
      return res.status(404).json({
        success: false,
        message: 'Analytics not found. Please scan some reels first.'
      });
    }

    const brandMatchScore = AIEngine.calculateBrandMatchScore(analytics, targetAudience);
    const pricing = AIEngine.recommendPricing(analytics);

    res.status(200).json({
      success: true,
      data: {
        brandMatchScore,
        pricing,
        analytics: {
          averageViews: analytics.averageViews,
          viralRatio: analytics.viralRatio,
          consistencyScore: analytics.consistencyScore,
          totalReels: analytics.totalReels
        }
      }
    });

  } catch (error) {
    console.error('Get brand match error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};