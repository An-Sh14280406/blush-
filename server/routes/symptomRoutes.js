const express = require('express');
const router = express.Router();
const {
  getAllSymptoms,
  createOrUpdateSymptom,
  deleteSymptom,
} = require('../controllers/symptomController');
const { protect } = require('../middleware/authMiddleware');

router.use(protect);

router.get('/', getAllSymptoms);
router.post('/', createOrUpdateSymptom);
router.delete('/:id', deleteSymptom);

module.exports = router;
