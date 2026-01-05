const express = require('express');
const router = express.Router();
const {
  getOverview,
  getGrowth,
  getViralReels,
  compareCreators,
  exportData,
  getBrandMatch
} = require('../controllers/analyticsController');
const { protect } = require('../middleware/auth');

// All routes are protected
router.use(protect);

router.get('/overview', getOverview);
router.get('/growth', getGrowth);
router.get('/viral', getViralReels);
router.post('/compare', compareCreators);
router.get('/export', exportData);
router.get('/agency/brand-match', getBrandMatch);

module.exports = router;