const Period = require('../models/Period');
const MoodLog = require('../models/MoodLog');
const SymptomLog = require('../models/SymptomLog');
const WellnessLog = require('../models/WellnessLog');
const User = require('../models/User');
const { calculatePredictions } = require('../services/predictionService');
const { generatePersonalInsights } = require('../services/insightsService');
const { subDays, subMonths, format, parseISO } = require('date-fns');

// @route   GET /api/analytics
exports.getAnalytics = async (req, res, next) => {
  try {
    const { timeframe = 'all' } = req.query; // '30d', '3m', '6m', 'all'
    const userId = req.user._id;

    const user = await User.findById(userId);

    let dateThreshold = null;
    const now = new Date();
    if (timeframe === '30d') {
      dateThreshold = subDays(now, 30);
    } else if (timeframe === '3m') {
      dateThreshold = subMonths(now, 3);
    } else if (timeframe === '6m') {
      dateThreshold = subMonths(now, 6);
    }

    const periodQuery = { userId };
    const logQuery = { userId };
    if (dateThreshold) {
      periodQuery.startDate = { $gte: dateThreshold };
      logQuery.date = { $gte: format(dateThreshold, 'yyyy-MM-dd') };
    }

    const [allPeriods, filteredPeriods, moods, symptoms, wellness] = await Promise.all([
      Period.find({ userId }).sort({ startDate: 1 }),
      Period.find(periodQuery).sort({ startDate: 1 }),
      MoodLog.find(logQuery).sort({ date: 1 }),
      SymptomLog.find(logQuery).sort({ date: 1 }),
      WellnessLog.find(logQuery).sort({ date: 1 }),
    ]);

    // Cycle stats & predictions based on confirmed records
    const predictions = calculatePredictions(allPeriods, user.preferences || {});

    // 1. Cycle lengths chart data
    const cycleLengthData = predictions.cycleLengths.map((c) => ({
      cycle: `${c.from.slice(5)} → ${c.to.slice(5)}`,
      days: c.days,
      average: predictions.averageCycleLength,
    }));

    // 2. Period duration chart data
    const durationData = filteredPeriods
      .filter((p) => p.isConfirmed && p.isPeriodStart && p.durationDays)
      .map((p) => ({
        date: format(new Date(p.startDate), 'MMM dd'),
        duration: p.durationDays,
        average: predictions.averageBleedingDuration,
      }));

    // 3. Mood distribution
    const moodDistributionMap = {};
    moods.forEach((m) => {
      (m.moods || []).forEach((name) => {
        moodDistributionMap[name] = (moodDistributionMap[name] || 0) + 1;
      });
    });
    const moodDistribution = Object.entries(moodDistributionMap)
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => b.count - a.count);

    // 4. Mood intensity over time
    const moodIntensityData = moods.map((m) => ({
      date: m.date.slice(5),
      intensity: m.intensity,
      moods: (m.moods || []).join(', '),
    }));

    // 5. Symptom frequency
    const symptomFrequencyMap = {};
    symptoms.forEach((s) => {
      (s.symptoms || []).forEach((item) => {
        const name = typeof item === 'string' ? item : item.name;
        symptomFrequencyMap[name] = (symptomFrequencyMap[name] || 0) + 1;
      });
    });
    const symptomFrequency = Object.entries(symptomFrequencyMap)
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => b.count - a.count);

    // 6. Energy levels distribution
    const energyMap = { very_low: 0, low: 0, normal: 0, high: 0, very_high: 0 };
    wellness.forEach((w) => {
      if (energyMap[w.energy] !== undefined) {
        energyMap[w.energy]++;
      }
    });
    const energyData = [
      { level: 'Very Low', count: energyMap.very_low, key: 'very_low' },
      { level: 'Low', count: energyMap.low, key: 'low' },
      { level: 'Normal', count: energyMap.normal, key: 'normal' },
      { level: 'High', count: energyMap.high, key: 'high' },
      { level: 'Very High', count: energyMap.very_high, key: 'very_high' },
    ];

    // 7. Sleep duration & quality over time
    const sleepData = wellness.map((w) => ({
      date: w.date.slice(5),
      hours: w.sleepHours,
      quality: w.sleepQuality,
    }));

    // 8. Generate personalized insights
    const personalizedInsights = generatePersonalInsights({
      moodLogs: moods,
      symptomLogs: symptoms,
      wellnessLogs: wellness,
      periods: allPeriods,
    });

    res.json({
      success: true,
      timeframe,
      predictions,
      charts: {
        cycleLengthData,
        durationData,
        moodDistribution,
        moodIntensityData,
        symptomFrequency,
        energyData,
        sleepData,
      },
      insights: personalizedInsights,
    });
  } catch (err) {
    next(err);
  }
};
