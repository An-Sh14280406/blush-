const mongoose = require('mongoose');
const { createBridge } = require('./modelBridge');

const symptomItemSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    intensity: {
      type: String,
      enum: ['mild', 'moderate', 'severe'],
      default: 'moderate',
    },
  },
  { _id: false }
);

const symptomLogSchema = new mongoose.Schema(
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
    symptoms: [symptomItemSchema],
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

symptomLogSchema.index({ userId: 1, date: 1 }, { unique: true });

const SymptomLogMongoose = mongoose.models.SymptomLog || mongoose.model('SymptomLog', symptomLogSchema);
module.exports = createBridge('symptomlogs', SymptomLogMongoose);
