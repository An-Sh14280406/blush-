const Period = require('../models/Period');
const User = require('../models/User');
const bcrypt = require('bcryptjs');

const DEMO_USER_EMAIL = 'ananya@blush.love';
const DEMO_USER_PASSWORD = 'blushpassword123';

/**
 * Seeds or resets the exact demo records specified for Ananya.
 */
async function seedDemoDataForUser(userId) {
  // Remove existing periods for this user to allow clean reset
  await Period.deleteMany({ userId });

  const demoPeriods = [
    {
      userId,
      startDate: new Date('2026-03-07T00:00:00.000Z'),
      endDate: new Date('2026-03-11T00:00:00.000Z'),
      durationDays: 5,
      intensity: 'medium',
      isConfirmed: true,
      isPeriodStart: true,
      isSpotting: false,
      isUncertain: false,
      notes: 'March 2026 period: March 7 to March 11',
    },
    {
      userId,
      startDate: new Date('2026-05-10T00:00:00.000Z'),
      endDate: null,
      durationDays: null,
      intensity: 'medium',
      isConfirmed: true,
      isPeriodStart: true,
      isSpotting: false,
      isUncertain: false,
      notes: 'May 2026: May 10 start. End date unknown.',
    },
    {
      userId,
      startDate: new Date('2026-06-10T00:00:00.000Z'),
      endDate: new Date('2026-06-13T00:00:00.000Z'),
      durationDays: 4,
      intensity: 'medium',
      isConfirmed: true,
      isPeriodStart: true,
      isSpotting: false,
      isUncertain: false,
      notes: 'June 2026: June 10 to June 13',
    },
    {
      userId,
      startDate: new Date('2026-08-09T00:00:00.000Z'),
      endDate: null,
      durationDays: 1,
      intensity: 'light',
      isConfirmed: true,
      isPeriodStart: false, // CRITICAL: Random confirmed menstruation observation. Start date unknown. NOT a cycle start.
      isSpotting: false,
      isUncertain: false,
      notes: 'August 9 was a random confirmed menstruation observation. Start date unknown.',
    },
    {
      userId,
      startDate: new Date('2026-09-02T00:00:00.000Z'),
      endDate: new Date('2026-09-06T00:00:00.000Z'),
      durationDays: 5,
      intensity: 'heavy',
      isConfirmed: true,
      isPeriodStart: true,
      isSpotting: false,
      isUncertain: false,
      notes: 'September 2026: September 2 to September 6',
    },
    {
      userId,
      startDate: new Date('2026-10-02T00:00:00.000Z'),
      endDate: null,
      durationDays: null,
      intensity: 'medium',
      isConfirmed: true,
      isPeriodStart: true,
      isSpotting: false,
      isUncertain: false,
      notes: 'October 2026: October 2. October 3 was day 2. End date unknown.',
    },
    {
      userId,
      startDate: new Date('2026-11-02T00:00:00.000Z'),
      endDate: new Date('2026-11-06T00:00:00.000Z'),
      durationDays: 5,
      intensity: 'medium',
      isConfirmed: true,
      isPeriodStart: true,
      isSpotting: false,
      isUncertain: false,
      notes: 'November 2026: November 2 to November 6',
    },
  ];

  await Period.insertMany(demoPeriods);
  return demoPeriods;
}

/**
 * Ensures the default demo account exists for Ananya.
 */
async function ensureDemoAccount() {
  let user = await User.findOne({ email: DEMO_USER_EMAIL });
  if (!user) {
    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(DEMO_USER_PASSWORD, salt);
    user = await User.create({
      name: 'Ananya',
      email: DEMO_USER_EMAIL,
      password: passwordHash,
      onboardingCompleted: true,
      preferences: {
        averageCycleLength: 30,
        averageBleedingDuration: 5,
        cycleRegularity: 'regular',
        lastPeriodStartDate: new Date('2026-11-02T00:00:00.000Z'),
        lastPeriodEndDate: new Date('2026-11-06T00:00:00.000Z'),
        notifications: {
          upcomingPeriod: true,
          dailyMood: true,
          symptomReminder: true,
          fertileWindow: false,
        },
      },
    });
    await seedDemoDataForUser(user._id);
    console.log(`🌸 Demo user created: ${DEMO_USER_EMAIL} / ${DEMO_USER_PASSWORD}`);
  }
  return user;
}

module.exports = {
  seedDemoDataForUser,
  ensureDemoAccount,
  DEMO_USER_EMAIL,
  DEMO_USER_PASSWORD,
};
