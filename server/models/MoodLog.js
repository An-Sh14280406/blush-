const mongoose = require('mongoose');
const { createBridge } = require('./modelBridge');

const moodLogSchema = new mongoose.Schema(
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
    moods: [
      {
        type: String,
        trim: true,
      },
    ],
    intensity: {
      type: Number,
      min: 1,
      max: 5,
      default: 3,
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

moodLogSchema.index({ userId: 1, date: 1 }, { unique: true });

const MoodLogMongoose = mongoose.models.MoodLog || mongoose.model('MoodLog', moodLogSchema);
module.exports = createBridge('moodlogs', MoodLogMongoose);
