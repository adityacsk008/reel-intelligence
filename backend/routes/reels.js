const express = require('express');
const router = express.Router();
const {
  scanReels,
  getReels,
  getReel,
  deleteReel
} = require('../controllers/reelController');
const { protect } = require('../middleware/auth');

// All routes are protected
router.use(protect);

router.post('/scan', scanReels);
router.get('/', getReels);
router.get('/:id', getReel);
router.delete('/:id', deleteReel);

module.exports = router;