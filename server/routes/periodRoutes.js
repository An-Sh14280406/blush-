const express = require('express');
const router = express.Router();
const {
  getAllPeriods,
  createPeriod,
  updatePeriod,
  deletePeriod,
  getPeriodPredictions,
} = require('../controllers/periodController');
const { protect } = require('../middleware/authMiddleware');

router.use(protect);

router.get('/', getAllPeriods);
router.post('/', createPeriod);
router.get('/predictions', getPeriodPredictions);
router.put('/:id', updatePeriod);
router.delete('/:id', deletePeriod);

module.exports = router;
