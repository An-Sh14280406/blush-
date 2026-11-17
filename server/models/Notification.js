const mongoose = require('mongoose');
const { createBridge } = require('./modelBridge');

const notificationSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    title: {
      type: String,
      required: true,
      trim: true,
    },
    message: {
      type: String,
      required: true,
      trim: true,
    },
    type: {
      type: String,
      enum: ['period_reminder', 'mood_checkin', 'symptom_reminder', 'fertile_window', 'system', 'custom'],
      default: 'system',
    },
    isRead: {
      type: Boolean,
      default: false,
    },
    scheduledFor: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

const NotificationMongoose = mongoose.models.Notification || mongoose.model('Notification', notificationSchema);
module.exports = createBridge('notifications', NotificationMongoose);
