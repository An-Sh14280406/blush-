const express = require('express');
const router = express.Router();
const {
  getAllMoods,
  createOrUpdateMood,
  deleteMood,
} = require('../controllers/moodController');
const { protect } = require('../middleware/authMiddleware');

router.use(protect);

router.get('/', getAllMoods);
router.post('/', createOrUpdateMood);
router.delete('/:id', deleteMood);

module.exports = router;
