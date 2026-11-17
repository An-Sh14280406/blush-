const SymptomLog = require('../models/SymptomLog');

// @route   GET /api/symptoms
exports.getAllSymptoms = async (req, res, next) => {
  try {
    const { startDate, endDate } = req.query;
    const query = { userId: req.user._id };
    if (startDate && endDate) {
      query.date = { $gte: startDate, $lte: endDate };
    }
    const symptoms = await SymptomLog.find(query).sort({ date: -1 });
    res.json({ success: true, count: symptoms.length, data: symptoms });
  } catch (err) {
    next(err);
  }
};

// @route   POST /api/symptoms
exports.createOrUpdateSymptom = async (req, res, next) => {
  try {
    const { date, symptoms, notes } = req.body;
    if (!date) {
      return res.status(400).json({ success: false, message: 'Date is required (YYYY-MM-DD)' });
    }

    const updated = await SymptomLog.findOneAndUpdate(
      { userId: req.user._id, date },
      {
        userId: req.user._id,
        date,
        symptoms: symptoms || [],
        notes: notes || '',
      },
      { upsert: true, new: true, runValidators: true }
    );

    res.status(200).json({ success: true, data: updated });
  } catch (err) {
    next(err);
  }
};

// @route   DELETE /api/symptoms/:id
exports.deleteSymptom = async (req, res, next) => {
  try {
    const item = await SymptomLog.findOneAndDelete({ _id: req.params.id, userId: req.user._id });
    if (!item) {
      return res.status(404).json({ success: false, message: 'Symptom log not found' });
    }
    res.json({ success: true, message: 'Symptom log deleted successfully' });
  } catch (err) {
    next(err);
  }
};
