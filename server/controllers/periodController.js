const Period = require('../models/Period');
const User = require('../models/User');
const { calculatePredictions } = require('../services/predictionService');

// @route   GET /api/periods
exports.getAllPeriods = async (req, res, next) => {
  try {
    const periods = await Period.find({ userId: req.user._id }).sort({ startDate: -1 });
    res.json({ success: true, count: periods.length, data: periods });
  } catch (err) {
    next(err);
  }
};

// @route   POST /api/periods
exports.createPeriod = async (req, res, next) => {
  try {
    const {
      startDate,
      endDate,
      durationDays,
      intensity,
      isSpotting,
      isUncertain,
      isPeriodStart,
      isConfirmed,
      symptoms,
      notes,
    } = req.body;

    if (!startDate) {
      return res.status(400).json({ success: false, message: 'Start date is required' });
    }

    const period = await Period.create({
      userId: req.user._id,
      startDate: new Date(startDate),
      endDate: endDate ? new Date(endDate) : null,
      durationDays: durationDays || undefined,
      intensity: intensity || 'medium',
      isSpotting: Boolean(isSpotting),
      isUncertain: Boolean(isUncertain),
      isPeriodStart: isPeriodStart !== undefined ? Boolean(isPeriodStart) : true,
      isConfirmed: isConfirmed !== undefined ? Boolean(isConfirmed) : true,
      symptoms: symptoms || [],
      notes: notes || '',
    });

    res.status(201).json({ success: true, data: period });
  } catch (err) {
    next(err);
  }
};

// @route   PUT /api/periods/:id
exports.updatePeriod = async (req, res, next) => {
  try {
    let period = await Period.findOne({ _id: req.params.id, userId: req.user._id });
    if (!period) {
      return res.status(404).json({ success: false, message: 'Period record not found' });
    }

    const {
      startDate,
      endDate,
      durationDays,
      intensity,
      isSpotting,
      isUncertain,
      isPeriodStart,
      isConfirmed,
      symptoms,
      notes,
    } = req.body;

    if (startDate) period.startDate = new Date(startDate);
    if (endDate !== undefined) period.endDate = endDate ? new Date(endDate) : null;
    if (durationDays !== undefined) period.durationDays = durationDays;
    if (intensity !== undefined) period.intensity = intensity;
    if (isSpotting !== undefined) period.isSpotting = Boolean(isSpotting);
    if (isUncertain !== undefined) period.isUncertain = Boolean(isUncertain);
    if (isPeriodStart !== undefined) period.isPeriodStart = Boolean(isPeriodStart);
    if (isConfirmed !== undefined) period.isConfirmed = Boolean(isConfirmed);
    if (symptoms !== undefined) period.symptoms = symptoms;
    if (notes !== undefined) period.notes = notes;

    await period.save();
    res.json({ success: true, data: period });
  } catch (err) {
    next(err);
  }
};

// @route   DELETE /api/periods/:id
exports.deletePeriod = async (req, res, next) => {
  try {
    const period = await Period.findOneAndDelete({ _id: req.params.id, userId: req.user._id });
    if (!period) {
      return res.status(404).json({ success: false, message: 'Period record not found' });
    }
    res.json({ success: true, message: 'Period record deleted successfully' });
  } catch (err) {
    next(err);
  }
};

// @route   GET /api/periods/predictions
exports.getPeriodPredictions = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id);
    const periods = await Period.find({ userId: req.user._id }).sort({ startDate: 1 });

    const predictions = calculatePredictions(periods, user.preferences || {});
    res.json({ success: true, data: predictions });
  } catch (err) {
    next(err);
  }
};
