const { addDays, differenceInCalendarDays, format, parseISO, isValid } = require('date-fns');

/**
 * Normalizes input date to a Date object at UTC midnight for consistent day-based arithmetic.
 */
function normalizeDate(d) {
  if (!d) return null;
  const dateObj = typeof d === 'string' ? parseISO(d) : new Date(d);
  if (!isValid(dateObj)) return null;
  return new Date(Date.UTC(dateObj.getUTCFullYear(), dateObj.getUTCMonth(), dateObj.getUTCDate()));
}

/**
 * Calculates cycle statistics and predictions from period records.
 *
 * @param {Array} periods - Array of Period documents or objects
 * @param {Object} userPreferences - Optional user onboarding preferences (averageCycleLength, averageBleedingDuration)
 * @returns {Object} Comprehensive cycle analytics & predictions
 */
function calculatePredictions(periods = [], userPreferences = {}) {
  // Filter for confirmed period starts only.
  // CRITICAL RULE: Non-start observations (e.g. August 9 random spot/observation)
  // or unconfirmed entries must NOT be used as cycle start markers.
  const confirmedStarts = periods
    .filter((p) => p.isConfirmed !== false && p.isPeriodStart !== false && !p.isSpotting && p.startDate)
    .map((p) => ({
      ...p,
      startDateObj: normalizeDate(p.startDate),
      endDateObj: p.endDate ? normalizeDate(p.endDate) : null,
      durationDays: p.durationDays || (p.endDate ? differenceInCalendarDays(normalizeDate(p.endDate), normalizeDate(p.startDate)) + 1 : null),
    }))
    .filter((p) => p.startDateObj !== null)
    .sort((a, b) => a.startDateObj.getTime() - b.startDateObj.getTime());

  // Calculate bleeding durations from records that have valid durations
  const knownDurations = confirmedStarts
    .map((p) => p.durationDays)
    .filter((dur) => typeof dur === 'number' && dur > 0 && dur <= 30);

  const averageBleedingDuration =
    knownDurations.length > 0
      ? Math.round((knownDurations.reduce((sum, d) => sum + d, 0) / knownDurations.length) * 10) / 10
      : userPreferences.averageBleedingDuration || 5;

  // Calculate cycle lengths between consecutive confirmed period starts
  const cycleLengths = [];
  for (let i = 0; i < confirmedStarts.length - 1; i++) {
    const prevStart = confirmedStarts[i].startDateObj;
    const nextStart = confirmedStarts[i + 1].startDateObj;
    const diffDays = differenceInCalendarDays(nextStart, prevStart);

    // Only count biologically plausible single-cycle intervals (typically 20 to 50 days)
    // If there was a gap (e.g. missing entry of 60+ days), record as separated interval
    if (diffDays >= 18 && diffDays <= 55) {
      cycleLengths.push({
        from: format(prevStart, 'yyyy-MM-dd'),
        to: format(nextStart, 'yyyy-MM-dd'),
        days: diffDays,
      });
    }
  }

  // Statistical calculations
  const rawLengths = cycleLengths.map((c) => c.days);
  let averageCycleLength = null;
  let medianCycleLength = null;
  let recentAverageCycleLength = null;
  let cycleVariationDays = 0;

  if (rawLengths.length > 0) {
    // Mean
    const sum = rawLengths.reduce((acc, curr) => acc + curr, 0);
    averageCycleLength = Math.round((sum / rawLengths.length) * 10) / 10;

    // Median
    const sortedLengths = [...rawLengths].sort((a, b) => a - b);
    const mid = Math.floor(sortedLengths.length / 2);
    medianCycleLength =
      sortedLengths.length % 2 !== 0
        ? sortedLengths[mid]
        : Math.round(((sortedLengths[mid - 1] + sortedLengths[mid]) / 2) * 10) / 10;

    // Recent 2 or 3 cycles average
    const recent = rawLengths.slice(-3);
    recentAverageCycleLength =
      Math.round((recent.reduce((acc, val) => acc + val, 0) / recent.length) * 10) / 10;

    // Standard deviation / variation
    if (rawLengths.length > 1) {
      const variance =
        rawLengths.reduce((acc, val) => acc + Math.pow(val - averageCycleLength, 2), 0) /
        rawLengths.length;
      cycleVariationDays = Math.round(Math.sqrt(variance) * 10) / 10;
    }
  }

  // Determine the effective cycle length to use for prediction:
  // Prefer recentAverage > average > userPreference > 28
  const fallbackCycle = userPreferences.averageCycleLength || 28;
  const effectiveCycleLength = recentAverageCycleLength || averageCycleLength || fallbackCycle;

  // Determine the latest confirmed period start
  const lastConfirmedPeriod = confirmedStarts.length > 0 ? confirmedStarts[confirmedStarts.length - 1] : null;
  const lastPeriodStart = lastConfirmedPeriod
    ? lastConfirmedPeriod.startDateObj
    : userPreferences.lastPeriodStartDate
    ? normalizeDate(userPreferences.lastPeriodStartDate)
    : null;

  // Prediction status & confidence explanation
  let confidence = 'low';
  let dataAvailability = 'Insufficient historical cycles logged. Using provisional baseline.';

  if (rawLengths.length >= 4) {
    confidence = 'high';
    dataAvailability = `Calculated from ${rawLengths.length} confirmed historical cycles. Highly reliable baseline.`;
  } else if (rawLengths.length >= 2) {
    confidence = 'moderate';
    dataAvailability = `Calculated from ${rawLengths.length} recent consecutive cycles. Accuracy will increase with each logged cycle.`;
  } else if (confirmedStarts.length === 1) {
    confidence = 'provisional';
    dataAvailability = 'Based on 1 logged period and your personal preferences. Need more cycles to establish personal regularity.';
  }

  let nextPeriodPrediction = null;
  let fertileWindow = null;
  let currentCycleDay = null;
  let daysUntilNextPeriod = null;

  const today = normalizeDate(new Date());

  if (lastPeriodStart) {
    // Current cycle day
    if (today && today >= lastPeriodStart) {
      currentCycleDay = differenceInCalendarDays(today, lastPeriodStart) + 1;
    }

    // Prediction calculation
    const predictedStart = addDays(lastPeriodStart, Math.round(effectiveCycleLength));
    const rangeWindow = Math.max(1, Math.min(3, Math.round(cycleVariationDays || 2)));
    const predictedStartRange = {
      earliest: format(addDays(predictedStart, -rangeWindow), 'yyyy-MM-dd'),
      target: format(predictedStart, 'yyyy-MM-dd'),
      latest: format(addDays(predictedStart, rangeWindow), 'yyyy-MM-dd'),
    };

    const predictedEnd = addDays(predictedStart, Math.round(averageBleedingDuration) - 1);
    daysUntilNextPeriod = today ? differenceInCalendarDays(predictedStart, today) : null;

    nextPeriodPrediction = {
      predictedStartDate: format(predictedStart, 'yyyy-MM-dd'),
      predictedEndDate: format(predictedEnd, 'yyyy-MM-dd'),
      predictedStartRange,
      estimatedDaysRemaining: daysUntilNextPeriod,
      effectiveCycleLength,
      confidence,
      dataAvailability,
    };

    // Fertility estimation:
    // Typical luteal phase is approximately 14 days before next period start.
    const estimatedOvulation = addDays(predictedStart, -14);
    const fertileStart = addDays(estimatedOvulation, -5);
    const fertileEnd = addDays(estimatedOvulation, 1);

    fertileWindow = {
      startDate: format(fertileStart, 'yyyy-MM-dd'),
      endDate: format(fertileEnd, 'yyyy-MM-dd'),
      ovulationDate: format(estimatedOvulation, 'yyyy-MM-dd'),
      explanation:
        'Calculated based on standard luteal phase estimation (~14 days before your predicted period). Sperm can survive up to 5 days and an egg for ~24 hours.',
      clinicalDisclaimer:
        'IMPORTANT: Calendar-based estimates cannot confirm ovulation or pinpoint fertile days with absolute medical certainty. Never use predicted non-fertile days as contraception or natural family planning without clinical consultation.',
    };
  }

  return {
    cycleLengths,
    totalCyclesRecorded: rawLengths.length,
    averageCycleLength: averageCycleLength || fallbackCycle,
    medianCycleLength: medianCycleLength || fallbackCycle,
    recentAverageCycleLength: recentAverageCycleLength || fallbackCycle,
    cycleVariationDays,
    averageBleedingDuration,
    lastPeriod: lastConfirmedPeriod
      ? {
          id: lastConfirmedPeriod._id,
          startDate: format(lastConfirmedPeriod.startDateObj, 'yyyy-MM-dd'),
          endDate: lastConfirmedPeriod.endDateObj ? format(lastConfirmedPeriod.endDateObj, 'yyyy-MM-dd') : null,
          durationDays: lastConfirmedPeriod.durationDays || null,
          intensity: lastConfirmedPeriod.intensity,
        }
      : null,
    currentCycleDay,
    nextPeriodPrediction,
    fertileWindow,
    confidence,
    dataAvailability,
  };
}

module.exports = {
  calculatePredictions,
  normalizeDate,
};
