const MoodLog = require('../models/MoodLog');

// @route   GET /api/moods
exports.getAllMoods = async (req, res, next) => {
  try {
    const { startDate, endDate } = req.query;
    const query = { userId: req.user._id };
    if (startDate && endDate) {
      query.date = { $gte: startDate, $lte: endDate };
    }
    const moods = await MoodLog.find(query).sort({ date: -1 });
    res.json({ success: true, count: moods.length, data: moods });
  } catch (err) {
    next(err);
  }
};

// @route   POST /api/moods
exports.createOrUpdateMood = async (req, res, next) => {
  try {
    const { date, moods, intensity, notes } = req.body;
    if (!date) {
      return res.status(400).json({ success: false, message: 'Date is required (YYYY-MM-DD)' });
    }

    const updated = await MoodLog.findOneAndUpdate(
      { userId: req.user._id, date },
      {
        userId: req.user._id,
        date,
        moods: moods || [],
        intensity: intensity || 3,
        notes: notes || '',
      },
      { upsert: true, new: true, runValidators: true }
    );

    res.status(200).json({ success: true, data: updated });
  } catch (err) {
    next(err);
  }
};

// @route   DELETE /api/moods/:id
exports.deleteMood = async (req, res, next) => {
  try {
    const mood = await MoodLog.findOneAndDelete({ _id: req.params.id, userId: req.user._id });
    if (!mood) {
      return res.status(404).json({ success: false, message: 'Mood log not found' });
    }
    res.json({ success: true, message: 'Mood entry deleted successfully' });
  } catch (err) {
    next(err);
  }
};
