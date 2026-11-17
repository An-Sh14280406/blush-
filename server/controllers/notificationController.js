const Notification = require('../models/Notification');
const User = require('../models/User');

// @route   GET /api/notifications
exports.getNotifications = async (req, res, next) => {
  try {
    const notifications = await Notification.find({ userId: req.user._id }).sort({ createdAt: -1 }).limit(50);
    const unreadCount = await Notification.countDocuments({ userId: req.user._id, isRead: false });
    res.json({ success: true, count: notifications.length, unreadCount, data: notifications });
  } catch (err) {
    next(err);
  }
};

// @route   PUT /api/notifications/:id/read
exports.markAsRead = async (req, res, next) => {
  try {
    const notif = await Notification.findOneAndUpdate(
      { _id: req.params.id, userId: req.user._id },
      { isRead: true },
      { new: true }
    );
    if (!notif) {
      return res.status(404).json({ success: false, message: 'Notification not found' });
    }
    res.json({ success: true, data: notif });
  } catch (err) {
    next(err);
  }
};

// @route   PUT /api/notifications/read-all
exports.markAllAsRead = async (req, res, next) => {
  try {
    await Notification.updateMany({ userId: req.user._id, isRead: false }, { isRead: true });
    res.json({ success: true, message: 'All notifications marked as read' });
  } catch (err) {
    next(err);
  }
};

// @route   POST /api/notifications/reminder
exports.createReminder = async (req, res, next) => {
  try {
    const { title, message, type, scheduledFor } = req.body;
    if (!title || !message) {
      return res.status(400).json({ success: false, message: 'Title and message are required' });
    }

    const notif = await Notification.create({
      userId: req.user._id,
      title,
      message,
      type: type || 'custom',
      scheduledFor: scheduledFor ? new Date(scheduledFor) : new Date(),
    });

    res.status(201).json({ success: true, data: notif });
  } catch (err) {
    next(err);
  }
};

// @route   DELETE /api/notifications/:id
exports.deleteNotification = async (req, res, next) => {
  try {
    const notif = await Notification.findOneAndDelete({ _id: req.params.id, userId: req.user._id });
    if (!notif) {
      return res.status(404).json({ success: false, message: 'Notification not found' });
    }
    res.json({ success: true, message: 'Notification removed' });
  } catch (err) {
    next(err);
  }
};
