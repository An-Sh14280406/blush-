const mongoose = require('mongoose');
const { createBridge } = require('./modelBridge');

const periodSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    startDate: {
      type: Date,
      required: true,
      index: true,
    },
    endDate: {
      type: Date,
    },
    durationDays: {
      type: Number,
      min: 1,
      max: 30,
    },
    intensity: {
      type: String,
      enum: ['light', 'medium', 'heavy', 'spotting'],
      default: 'medium',
    },
    isSpotting: {
      type: Boolean,
      default: false,
    },
    isUncertain: {
      type: Boolean,
      default: false,
    },
    isPeriodStart: {
      type: Boolean,
      default: true,
    },
    isConfirmed: {
      type: Boolean,
      default: true,
    },
    symptoms: [
      {
        type: String,
      },
    ],
    notes: {
      type: String,
      trim: true,
      maxlength: 500,
    },
  },
  {
    timestamps: true,
  }
);

periodSchema.pre('save', function (next) {
  if (this.startDate && this.endDate) {
    const diffTime = Math.abs(new Date(this.endDate) - new Date(this.startDate));
    this.durationDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
  }
  next();
});

const PeriodMongoose = mongoose.models.Period || mongoose.model('Period', periodSchema);
module.exports = createBridge('periods', PeriodMongoose);
