const Reel = require('../models/Reel');
const User = require('../models/User');
const AIEngine = require('../utils/aiEngine');
const ViralDetector = require('../utils/viralDetector');

// @desc    Scan and save reels
// @route   POST /api/reels/scan
// @access  Private
exports.scanReels = async (req, res) => {
  try {
    const { reels } = req.body;
    const userId = req.user.id;

    if (!reels || !Array.isArray(reels) || reels.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Please provide reels array'
      });
    }

    // Check scan limit
    const user = await User.findById(userId);
    if (user.scansUsed + reels.length > user.scanLimit) {
      return res.status(403).json({
        success: false,
        message: `Scan limit exceeded. You have ${user.scanLimit - user.scansUsed} scans remaining.`
      });
    }

    const savedReels = [];
    const errors = [];

    for (const reelData of reels) {
      try {
        const { reelId, reelUrl, viewCount } = reelData;

        // Check if reel already exists
        let reel = await Reel.findOne({ reelId });

        if (reel) {
          // Update existing reel
          reel.viewCount = viewCount;
          reel.viewHistory.push({ views: viewCount, timestamp: Date.now() });
          reel.lastUpdated = Date.now();
        } else {
          // Create new reel
          const category = AIEngine.classifyContent(reelUrl, reelId);
          
          reel = new Reel({
            userId,
            reelId,
            reelUrl,
            viewCount,
            category,
            viewHistory: [{ views: viewCount, timestamp: Date.now() }]
          });
        }

        // Get user's all reels for AI calculations
        const userReels = await Reel.find({ userId });

        // Calculate quality score
        reel.qualityScore = AIEngine.calculateQualityScore(reel, userReels);

        // Detect viral
        const viralData = AIEngine.detectViral(reel, userReels);
        reel.isViral = viralData.isViral;
        reel.viralScore = viralData.viralScore;

        await reel.save();
        savedReels.push(reel);

      } catch (error) {
        errors.push({
          reelId: reelData.reelId,
          error: error.message
        });
      }
    }

    // Update user's scan count
    user.scansUsed += savedReels.length;
    await user.save();

    res.status(200).json({
      success: true,
      message: `Successfully scanned ${savedReels.length} reels`,
      data: {
        savedReels: savedReels.length,
        errors: errors.length,
        scansRemaining: user.scanLimit - user.scansUsed,
        reels: savedReels,
        errorDetails: errors
      }
    });

  } catch (error) {
    console.error('Scan reels error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error during reel scanning',
      error: error.message
    });
  }
};

// @desc    Get user's reels
// @route   GET /api/reels
// @access  Private
exports.getReels = async (req, res) => {
  try {
    const userId = req.user.id;
    const { page = 1, limit = 20, sortBy = 'scannedAt', order = 'desc' } = req.query;

    const skip = (page - 1) * limit;
    const sortOrder = order === 'asc' ? 1 : -1;

    const reels = await Reel.find({ userId })
      .sort({ [sortBy]: sortOrder })
      .skip(skip)
      .limit(parseInt(limit));

    const total = await Reel.countDocuments({ userId });

    res.status(200).json({
      success: true,
      data: {
        reels,
        pagination: {
          total,
          page: parseInt(page),
          pages: Math.ceil(total / limit),
          limit: parseInt(limit)
        }
      }
    });

  } catch (error) {
    console.error('Get reels error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

// @desc    Get specific reel
// @route   GET /api/reels/:id
// @access  Private
exports.getReel = async (req, res) => {
  try {
    const reel = await Reel.findById(req.params.id);

    if (!reel) {
      return res.status(404).json({
        success: false,
        message: 'Reel not found'
      });
    }

    // Check ownership
    if (reel.userId.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to access this reel'
      });
    }

    // Get viral potential
    const viralPotential = ViralDetector.checkViralPotential(reel);

    res.status(200).json({
      success: true,
      data: {
        reel,
        viralPotential
      }
    });

  } catch (error) {
    console.error('Get reel error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

// @desc    Delete reel
// @route   DELETE /api/reels/:id
// @access  Private
exports.deleteReel = async (req, res) => {
  try {
    const reel = await Reel.findById(req.params.id);

    if (!reel) {
      return res.status(404).json({
        success: false,
        message: 'Reel not found'
      });
    }

    // Check ownership
    if (reel.userId.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to delete this reel'
      });
    }

    await reel.deleteOne();

    res.status(200).json({
      success: true,
      message: 'Reel deleted successfully'
    });

  } catch (error) {
    console.error('Delete reel error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};