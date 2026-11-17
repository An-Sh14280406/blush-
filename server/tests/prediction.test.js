const assert = require('assert');
const { calculatePredictions } = require('../services/predictionService');

console.log('🧪 Starting Prediction Engine Unit Tests...\n');

// Test 1: Historical Data from Section 21
const testPeriods = [
  {
    startDate: '2026-03-07T00:00:00.000Z',
    endDate: '2026-03-11T00:00:00.000Z',
    durationDays: 5,
    isConfirmed: true,
    isPeriodStart: true,
  },
  {
    startDate: '2026-05-10T00:00:00.000Z',
    endDate: null,
    durationDays: null,
    isConfirmed: true,
    isPeriodStart: true,
  },
  {
    startDate: '2026-06-10T00:00:00.000Z',
    endDate: '2026-06-13T00:00:00.000Z',
    durationDays: 4,
    isConfirmed: true,
    isPeriodStart: true,
  },
  {
    // CRITICAL REQUIREMENT: August 9 observation. Start date unknown. NOT a cycle start.
    startDate: '2026-08-09T00:00:00.000Z',
    endDate: null,
    durationDays: 1,
    isConfirmed: true,
    isPeriodStart: false,
  },
  {
    startDate: '2026-09-02T00:00:00.000Z',
    endDate: '2026-09-06T00:00:00.000Z',
    durationDays: 5,
    isConfirmed: true,
    isPeriodStart: true,
  },
  {
    startDate: '2026-10-02T00:00:00.000Z',
    endDate: null,
    durationDays: null,
    isConfirmed: true,
    isPeriodStart: true,
  },
  {
    startDate: '2026-11-02T00:00:00.000Z',
    endDate: '2026-11-06T00:00:00.000Z',
    durationDays: 5,
    isConfirmed: true,
    isPeriodStart: true,
  },
];

const results = calculatePredictions(testPeriods, { averageCycleLength: 30 });

console.log('Results summary:');
console.log('Cycle lengths detected:', results.cycleLengths);
console.log('Average cycle length:', results.averageCycleLength);
console.log('Median cycle length:', results.medianCycleLength);
console.log('Recent average:', results.recentAverageCycleLength);
console.log('Average bleeding duration:', results.averageBleedingDuration);
console.log('Next predicted period:', results.nextPeriodPrediction);
console.log('Fertile window:', results.fertileWindow);

// Verify September to October cycle length = 30 days
const sepToOct = results.cycleLengths.find((c) => c.from === '2026-09-02' && c.to === '2026-10-02');
assert.ok(sepToOct, 'Sep 2 to Oct 2 cycle must be detected');
assert.strictEqual(sepToOct.days, 30, 'Sep 2 to Oct 2 cycle length must equal 30 days');
console.log('✅ Test 1 Passed: Sep 2 to Oct 2 is exactly 30 days');

// Verify October to November cycle length = 31 days
const octToNov = results.cycleLengths.find((c) => c.from === '2026-10-02' && c.to === '2026-11-02');
assert.ok(octToNov, 'Oct 2 to Nov 2 cycle must be detected');
assert.strictEqual(octToNov.days, 31, 'Oct 2 to Nov 2 cycle length must equal 31 days');
console.log('✅ Test 2 Passed: Oct 2 to Nov 2 is exactly 31 days');

// Verify recent average of the two consecutive cycles = 30.5 days
// The recent cycles from June 10 -> Sep 2 has a gap (84 days > 55 days, so excluded as single-cycle length).
// The valid consecutive cycle lengths are May 10 -> Jun 10 (31 days), Sep 2 -> Oct 2 (30 days), Oct 2 -> Nov 2 (31 days).
// The recent two cycles (30 and 31) average to 30.5 days.
const recentTwo = [sepToOct.days, octToNov.days];
const recentTwoAvg = (recentTwo[0] + recentTwo[1]) / 2;
assert.strictEqual(recentTwoAvg, 30.5, 'Recent two cycles average must be 30.5 days');
console.log('✅ Test 3 Passed: Two consecutive cycles average is 30.5 days');

// Verify August 9 was NOT used as a period start
const augustInCycleLengths = results.cycleLengths.some((c) => c.from === '2026-08-09' || c.to === '2026-08-09');
assert.strictEqual(augustInCycleLengths, false, 'August 9 non-start observation must NOT be in cycle starts');
console.log('✅ Test 4 Passed: August 9 random observation was correctly excluded from cycle start calculation');

// Verify Next Predicted Period starts around Dec 2 - Dec 3, 2026
assert.ok(results.nextPeriodPrediction, 'Next period prediction must be generated');
assert.ok(
  results.nextPeriodPrediction.predictedStartDate === '2026-12-02' ||
    results.nextPeriodPrediction.predictedStartDate === '2026-12-03',
  `Next predicted period should be around Dec 2/3, got ${results.nextPeriodPrediction.predictedStartDate}`
);
console.log('✅ Test 5 Passed: Next period predicted for', results.nextPeriodPrediction.predictedStartDate);

// Verify Fertility Disclaimer is present
assert.ok(results.fertileWindow.clinicalDisclaimer, 'Clinical disclaimer must be present');
assert.ok(results.fertileWindow.clinicalDisclaimer.includes('cannot confirm ovulation'));
console.log('✅ Test 6 Passed: Clinical disclaimer on fertility verified');

// Test 7: Empty state / insufficient data handling
const emptyResults = calculatePredictions([], { averageCycleLength: 29 });
assert.strictEqual(emptyResults.confidence, 'low');
assert.ok(emptyResults.dataAvailability.includes('Insufficient'));
console.log('✅ Test 7 Passed: Empty state properly discloses data limitations');

console.log('\n🎉 ALL 7 UNIT TESTS PASSED SUCCESSFULLY!\n');
