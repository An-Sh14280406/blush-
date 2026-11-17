const express = require('express');
const router = express.Router();
const {
  register,
  login,
  getMe,
  updateProfile,
  completeOnboarding,
  seedDemoAccount,
  exportUserData,
  deleteAccount,
} = require('../controllers/authController');
const { protect } = require('../middleware/authMiddleware');

router.post('/register', register);
router.post('/login', login);
router.post('/seed-demo', seedDemoAccount);

router.get('/me', protect, getMe);
router.put('/profile', protect, updateProfile);
router.post('/onboarding', protect, completeOnboarding);
router.get('/export', protect, exportUserData);
router.delete('/account', protect, deleteAccount);

module.exports = router;
