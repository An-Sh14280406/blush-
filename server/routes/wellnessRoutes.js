const express = require('express');
const router = express.Router();
const {
  getAllWellness,
  createOrUpdateWellness,
  deleteWellness,
} = require('../controllers/wellnessController');
const { protect } = require('../middleware/authMiddleware');

router.use(protect);

router.get('/', getAllWellness);
router.post('/', createOrUpdateWellness);
router.delete('/:id', deleteWellness);

module.exports = router;
