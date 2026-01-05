const express = require('express');
const router = express.Router();
const {
  getAllUsers,
  getPlatformStats,
  updateUser,
  deleteUser
} = require('../controllers/adminController');
const { protect } = require('../middleware/auth');
const { adminAuth } = require('../middleware/adminAuth');

// All routes are protected and require admin role
router.use(protect);
router.use(adminAuth);

router.get('/users', getAllUsers);
router.get('/stats', getPlatformStats);
router.put('/users/:id', updateUser);
router.delete('/users/:id', deleteUser);

module.exports = router;