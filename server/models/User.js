const mongoose = require('mongoose');
const { createBridge } = require('./modelBridge');

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Name is required'],
      trim: true,
      default: 'Ananya',
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      required: [true, 'Password is required'],
      minlength: 6,
    },
    avatar: {
      type: String,
      default: '🎀',
    },
    onboardingCompleted: {
      type: Boolean,
      default: false,
    },
    preferences: {
      averageCycleLength: {
        type: Number,
        default: 28,
      },
      averageBleedingDuration: {
        type: Number,
        default: 5,
      },
      cycleRegularity: {
        type: String,
        enum: ['regular', 'somewhat_regular', 'irregular', 'not_sure'],
        default: 'regular',
      },
      lastPeriodStartDate: {
        type: Date,
      },
      lastPeriodEndDate: {
        type: Date,
      },
      notifications: {
        upcomingPeriod: { type: Boolean, default: true },
        dailyMood: { type: Boolean, default: true },
        symptomReminder: { type: Boolean, default: true },
        fertileWindow: { type: Boolean, default: false },
      },
    },
  },
  {
    timestamps: true,
  }
);

const UserMongoose = mongoose.models.User || mongoose.model('User', userSchema);
module.exports = createBridge('users', UserMongoose);
