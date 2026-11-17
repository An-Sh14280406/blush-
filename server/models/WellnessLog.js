const mongoose = require('mongoose');
const { createBridge } = require('./modelBridge');

const wellnessLogSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    date: {
      type: String,
      required: true,
      index: true,
    },
    energy: {
      type: String,
      enum: ['very_low', 'low', 'normal', 'high', 'very_high'],
      default: 'normal',
    },
    sleepHours: {
      type: Number,
      min: 0,
      max: 24,
      default: 7.5,
    },
    sleepQuality: {
      type: String,
      enum: ['poor', 'fair', 'good', 'excellent'],
      default: 'good',
    },
    cravings: [
      {
        type: String,
        enum: ['Sweet', 'Salty', 'Spicy', 'Chocolate', 'Other'],
      },
    ],
    waterIntakeGlasses: {
      type: Number,
      min: 0,
      max: 30,
      default: 6,
    },
    notes: {
      type: String,
      trim: true,
      maxlength: 1000,
    },
  },
  {
    timestamps: true,
  }
);

wellnessLogSchema.index({ userId: 1, date: 1 }, { unique: true });

const WellnessLogMongoose = mongoose.models.WellnessLog || mongoose.model('WellnessLog', wellnessLogSchema);
module.exports = createBridge('wellnesslogs', WellnessLogMongoose);
