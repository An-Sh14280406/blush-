const WellnessLog = require('../models/WellnessLog');

// @route   GET /api/wellness
exports.getAllWellness = async (req, res, next) => {
  try {
    const { startDate, endDate } = req.query;
    const query = { userId: req.user._id };
    if (startDate && endDate) {
      query.date = { $gte: startDate, $lte: endDate };
    }
    const logs = await WellnessLog.find(query).sort({ date: -1 });
    res.json({ success: true, count: logs.length, data: logs });
  } catch (err) {
    next(err);
  }
};

// @route   POST /api/wellness
exports.createOrUpdateWellness = async (req, res, next) => {
  try {
    const { date, energy, sleepHours, sleepQuality, cravings, waterIntakeGlasses, notes } = req.body;
    if (!date) {
      return res.status(400).json({ success: false, message: 'Date is required (YYYY-MM-DD)' });
    }

    const updated = await WellnessLog.findOneAndUpdate(
      { userId: req.user._id, date },
      {
        userId: req.user._id,
        date,
        energy: energy || 'normal',
        sleepHours: sleepHours !== undefined ? Number(sleepHours) : 7.5,
        sleepQuality: sleepQuality || 'good',
        cravings: cravings || [],
        waterIntakeGlasses: waterIntakeGlasses !== undefined ? Number(waterIntakeGlasses) : 6,
        notes: notes || '',
      },
      { upsert: true, new: true, runValidators: true }
    );

    res.status(200).json({ success: true, data: updated });
  } catch (err) {
    next(err);
  }
};

// @route   DELETE /api/wellness/:id
exports.deleteWellness = async (req, res, next) => {
  try {
    const log = await WellnessLog.findOneAndDelete({ _id: req.params.id, userId: req.user._id });
    if (!log) {
      return res.status(404).json({ success: false, message: 'Wellness log not found' });
    }
    res.json({ success: true, message: 'Wellness log deleted successfully' });
  } catch (err) {
    next(err);
  }
};
