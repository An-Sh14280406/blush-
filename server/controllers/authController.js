const User = require('../models/User');
const Period = require('../models/Period');
const MoodLog = require('../models/MoodLog');
const SymptomLog = require('../models/SymptomLog');
const WellnessLog = require('../models/WellnessLog');
const Notification = require('../models/Notification');
const bcrypt = require('bcryptjs');
const { generateToken } = require('../middleware/authMiddleware');
const { seedDemoDataForUser, DEMO_USER_EMAIL, DEMO_USER_PASSWORD } = require('../services/demoSeedService');

// @route   POST /api/auth/register
exports.register = async (req, res, next) => {
  try {
    const { name, email, password } = req.body;
    if (!name || !email || !password) {
      return res.status(400).json({ success: false, message: 'Please provide name, email and password' });
    }

    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ success: false, message: 'An account with this email already exists' });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      onboardingCompleted: false,
    });

    // Create a welcome notification
    await Notification.create({
      userId: user._id,
      title: `Welcome to blush., ${user.name}! ♡`,
      message: 'Your personal sanctuary for cycle wellness, mood tracking, and gentle reflections is ready.',
      type: 'system',
    });

    res.status(201).json({
      success: true,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        avatar: user.avatar,
        onboardingCompleted: user.onboardingCompleted,
        preferences: user.preferences,
      },
      token: generateToken(user._id),
    });
  } catch (err) {
    next(err);
  }
};

// @route   POST /api/auth/login
exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ success: false, message: 'Please provide email and password' });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ success: false, message: 'Invalid email or password' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ success: false, message: 'Invalid email or password' });
    }

    res.json({
      success: true,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        avatar: user.avatar,
        onboardingCompleted: user.onboardingCompleted,
        preferences: user.preferences,
      },
      token: generateToken(user._id),
    });
  } catch (err) {
    next(err);
  }
};

// @route   GET /api/auth/me
exports.getMe = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id).select('-password');
    res.json({ success: true, user });
  } catch (err) {
    next(err);
  }
};

// @route   PUT /api/auth/profile
exports.updateProfile = async (req, res, next) => {
  try {
    const { name, avatar, preferences } = req.body;
    const user = await User.findById(req.user._id);

    if (name) user.name = name;
    if (avatar) user.avatar = avatar;
    if (preferences) {
      user.preferences = {
        ...user.preferences.toObject(),
        ...preferences,
      };
    }

    await user.save();
    res.json({
      success: true,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        avatar: user.avatar,
        onboardingCompleted: user.onboardingCompleted,
        preferences: user.preferences,
      },
    });
  } catch (err) {
    next(err);
  }
};

// @route   POST /api/auth/onboarding
exports.completeOnboarding = async (req, res, next) => {
  try {
    const {
      preferredName,
      lastPeriodStartDate,
      lastPeriodEndDate,
      averageCycleLength,
      averageBleedingDuration,
      cycleRegularity,
      notifications,
    } = req.body;

    const user = await User.findById(req.user._id);
    if (preferredName) user.name = preferredName;

    user.preferences = {
      ...user.preferences,
      averageCycleLength: Number(averageCycleLength) || user.preferences.averageCycleLength || 28,
      averageBleedingDuration: Number(averageBleedingDuration) || user.preferences.averageBleedingDuration || 5,
      cycleRegularity: cycleRegularity || 'regular',
      lastPeriodStartDate: lastPeriodStartDate ? new Date(lastPeriodStartDate) : null,
      lastPeriodEndDate: lastPeriodEndDate ? new Date(lastPeriodEndDate) : null,
      notifications: notifications || user.preferences.notifications,
    };
    user.onboardingCompleted = true;
    await user.save();

    // If a last period start was provided in onboarding, record it as a period entry if none exists
    if (lastPeriodStartDate) {
      const existing = await Period.findOne({
        userId: user._id,
        startDate: new Date(lastPeriodStartDate),
      });
      if (!existing) {
        await Period.create({
          userId: user._id,
          startDate: new Date(lastPeriodStartDate),
          endDate: lastPeriodEndDate ? new Date(lastPeriodEndDate) : null,
          intensity: 'medium',
          isConfirmed: true,
          isPeriodStart: true,
          notes: 'Initial period logged during onboarding',
        });
      }
    }

    res.json({
      success: true,
      message: 'Onboarding completed successfully! Welcome to your space ♡',
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        avatar: user.avatar,
        onboardingCompleted: user.onboardingCompleted,
        preferences: user.preferences,
      },
    });
  } catch (err) {
    next(err);
  }
};

// @route   POST /api/auth/seed-demo
exports.seedDemoAccount = async (req, res, next) => {
  try {
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
          averageCycleLength: 30.5,
          averageBleedingDuration: 5,
          cycleRegularity: 'regular',
          lastPeriodStartDate: new Date('2026-11-02T00:00:00.000Z'),
          lastPeriodEndDate: new Date('2026-11-06T00:00:00.000Z'),
        },
      });
    }

    // Seed the period records
    await seedDemoDataForUser(user._id);

    // Also populate some realistic sample wellness logs for the demo experience
    await MoodLog.deleteMany({ userId: user._id });
    await MoodLog.insertMany([
      { userId: user._id, date: '2026-11-14', moods: ['Calm', 'Affectionate'], intensity: 4, notes: 'Felt very cozy having hot chai and reading.' },
      { userId: user._id, date: '2026-11-15', moods: ['Playful', 'Happy'], intensity: 5, notes: 'Sunshine walk in the park! Felt very lively.' },
      { userId: user._id, date: '2026-11-16', moods: ['Sociable', 'Excited'], intensity: 4, notes: 'Met with friends, wonderful energy.' },
      { userId: user._id, date: '2026-11-17', moods: ['Happy', 'Relaxed'], intensity: 4, notes: 'Gentle evening reflection at home.' },
    ]);

    await SymptomLog.deleteMany({ userId: user._id });
    await SymptomLog.insertMany([
      { userId: user._id, date: '2026-11-02', symptoms: [{ name: 'Cramps', intensity: 'moderate' }, { name: 'Fatigue', intensity: 'mild' }], notes: 'Day 1 cramps, used hot water bag.' },
      { userId: user._id, date: '2026-11-03', symptoms: [{ name: 'Bloating', intensity: 'mild' }], notes: 'Drinking warm herbal tea.' },
    ]);

    await WellnessLog.deleteMany({ userId: user._id });
    await WellnessLog.insertMany([
      { userId: user._id, date: '2026-11-14', energy: 'normal', sleepHours: 8, sleepQuality: 'good', cravings: ['Chocolate'], notes: 'Slept well.' },
      { userId: user._id, date: '2026-11-15', energy: 'high', sleepHours: 7.5, sleepQuality: 'excellent', cravings: ['Sweet'], notes: 'Energized morning.' },
      { userId: user._id, date: '2026-11-16', energy: 'high', sleepHours: 7, sleepQuality: 'good', cravings: [], notes: 'Active day.' },
      { userId: user._id, date: '2026-11-17', energy: 'normal', sleepHours: 8, sleepQuality: 'good', cravings: ['Chocolate'], notes: 'Peaceful routine.' },
    ]);

    res.json({
      success: true,
      message: 'Demo account for Ananya loaded successfully with exact historical cycle records!',
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        avatar: user.avatar,
        onboardingCompleted: true,
        preferences: user.preferences,
      },
      token: generateToken(user._id),
      credentials: {
        email: DEMO_USER_EMAIL,
        password: DEMO_USER_PASSWORD,
      },
    });
  } catch (err) {
    next(err);
  }
};

// @route   GET /api/auth/export
exports.exportUserData = async (req, res, next) => {
  try {
    const userId = req.user._id;
    const user = await User.findById(userId).select('-password');
    const periods = await Period.find({ userId }).sort({ startDate: 1 });
    const moods = await MoodLog.find({ userId }).sort({ date: 1 });
    const symptoms = await SymptomLog.find({ userId }).sort({ date: 1 });
    const wellness = await WellnessLog.find({ userId }).sort({ date: 1 });

    res.json({
      success: true,
      exportDate: new Date().toISOString(),
      user,
      periods,
      moodLogs: moods,
      symptomLogs: symptoms,
      wellnessLogs: wellness,
    });
  } catch (err) {
    next(err);
  }
};

// @route   DELETE /api/auth/account
exports.deleteAccount = async (req, res, next) => {
  try {
    const userId = req.user._id;
    await Promise.all([
      User.findByIdAndDelete(userId),
      Period.deleteMany({ userId }),
      MoodLog.deleteMany({ userId }),
      SymptomLog.deleteMany({ userId }),
      WellnessLog.deleteMany({ userId }),
      Notification.deleteMany({ userId }),
    ]);

    res.json({ success: true, message: 'All your personal data and account have been permanently erased.' });
  } catch (err) {
    next(err);
  }
};
