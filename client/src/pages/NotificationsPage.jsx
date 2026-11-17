import React, { useState, useEffect } from 'react';
import { useOutletContext } from 'react-router-dom';
import { api } from '../services/api';
import { Header } from '../components/Header';
import { ScrapbookCard } from '../components/ScrapbookCard';
import { BowIcon, StrawberryIcon, HeartSticker } from '../components/ScrapbookDecorations';
import {
  Bell,
  Check,
  CheckCheck,
  Trash2,
  Plus,
  ShieldCheck,
  Calendar,
  Sparkles,
} from 'lucide-react';
import { format } from 'date-fns';

export const NotificationsPage = () => {
  const { openLogPeriod } = useOutletContext();
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  // New reminder form
  const [reminderTitle, setReminderTitle] = useState('');
  const [reminderMessage, setReminderMessage] = useState('');
  const [scheduledFor, setScheduledFor] = useState('');
  const [creating, setCreating] = useState(false);

  const fetchNotifs = async () => {
    setLoading(true);
    try {
      const res = await api.getNotifications();
      if (res.success) {
        setNotifications(res.data || []);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotifs();
  }, []);

  const handleMarkRead = async (id) => {
    try {
      await api.markNotificationRead(id);
      fetchNotifs();
    } catch (err) {
      console.error(err);
    }
  };

  const handleMarkAllRead = async () => {
    try {
      await api.markAllNotificationsRead();
      fetchNotifs();
    } catch (err) {
      console.error(err);
    }
  };

  const handleDelete = async (id) => {
    try {
      await api.deleteNotification(id);
      fetchNotifs();
    } catch (err) {
      console.error(err);
    }
  };

  const handleCreateReminder = async (e) => {
    e.preventDefault();
    if (!reminderTitle || !reminderMessage) return;

    setCreating(true);
    try {
      await api.createReminder({
        title: reminderTitle,
        message: reminderMessage,
        scheduledFor: scheduledFor || new Date(),
        type: 'custom',
      });
      setReminderTitle('');
      setReminderMessage('');
      setScheduledFor('');
      fetchNotifs();
    } catch (err) {
      alert(err.message || 'Failed to create reminder');
    } finally {
      setCreating(false);
    }
  };

  return (
    <div>
      <Header onLogPeriodClick={openLogPeriod} />

      <div className="space-y-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <span className="text-xs font-semibold uppercase tracking-wider text-[#C51F46]">
              Discreet Notifications & Alerts
            </span>
            <h3 className="text-3xl sm:text-4xl font-bold font-editorial text-[#171316]">
              Notifications & Reminders ♡
            </h3>
            <p className="text-xs sm:text-sm text-[#171316]/70">
              Gentle whispers to help you check in with yourself.
            </p>
          </div>

          {notifications.length > 0 && (
            <button
              onClick={handleMarkAllRead}
              className="self-start sm:self-center px-4 py-2 rounded-xl bg-white border-2 border-[#171316] shadow-scrapbook-sm text-xs font-bold hover:bg-[#FFF0F3] transition-all flex items-center gap-1.5"
            >
              <CheckCheck className="w-4 h-4 text-[#C51F46]" />
              <span>Mark All as Read</span>
            </button>
          )}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Notifications Feed */}
          <div className="lg:col-span-7 space-y-4">
            {notifications.length === 0 ? (
              <ScrapbookCard variant="ivory" className="text-center py-12">
                <Bell className="w-10 h-10 text-[#F04478] mx-auto mb-2 opacity-50" />
                <h4 className="text-xl font-bold font-editorial text-[#171316]">
                  All caught up!
                </h4>
                <p className="text-xs text-[#171316]/70">
                  No unread reminders at this moment.
                </p>
              </ScrapbookCard>
            ) : (
              notifications.map((n) => (
                <div
                  key={n._id}
                  className={`p-5 rounded-2xl border-2 border-[#171316] shadow-scrapbook transition-all ${
                    n.isRead ? 'bg-white opacity-85' : 'bg-[#FFF0F3] border-[#F04478]'
                  }`}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-sm text-[#171316]">
                          {n.title}
                        </span>
                        {!n.isRead && (
                          <span className="w-2 h-2 rounded-full bg-[#F04478]" />
                        )}
                      </div>
                      <p className="text-xs text-[#171316]/80 leading-relaxed">
                        {n.message}
                      </p>
                      <span className="text-[10px] text-[#171316]/50 block pt-1">
                        {n.createdAt ? format(new Date(n.createdAt), 'MMM d, h:mm a') : 'Today'}
                      </span>
                    </div>

                    <div className="flex items-center gap-1.5 shrink-0">
                      {!n.isRead && (
                        <button
                          onClick={() => handleMarkRead(n._id)}
                          className="p-1.5 rounded-lg border border-[#171316]/20 hover:bg-white text-xs"
                          title="Mark read"
                        >
                          <Check className="w-3.5 h-3.5 text-green-700" />
                        </button>
                      )}
                      <button
                        onClick={() => handleDelete(n._id)}
                        className="p-1.5 rounded-lg border border-red-200 text-red-500 hover:bg-red-50 text-xs"
                        title="Delete notification"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Schedule Custom Gentle Reminder */}
          <div className="lg:col-span-5">
            <ScrapbookCard variant="pink">
              <div className="flex items-center gap-2 mb-3">
                <Sparkles className="w-4 h-4 text-[#C51F46]" />
                <h4 className="font-bold text-base text-[#171316]">
                  Set a Personal Reminder ♡
                </h4>
              </div>
              <p className="text-xs text-[#171316]/70 mb-4">
                Schedule a gentle self-care reminder for tea, vitamins, hydration or a calming walk.
              </p>

              <form onSubmit={handleCreateReminder} className="space-y-3.5 text-xs sm:text-sm">
                <div>
                  <label className="block font-bold text-[#171316] mb-1">
                    Reminder Title
                  </label>
                  <input
                    type="text"
                    value={reminderTitle}
                    onChange={(e) => setReminderTitle(e.target.value)}
                    placeholder="e.g. Afternoon herbal tea time ☕"
                    required
                    className="w-full px-3.5 py-2.5 rounded-xl border-2 border-[#171316] bg-white focus:outline-none focus:ring-2 focus:ring-[#F04478]"
                  />
                </div>

                <div>
                  <label className="block font-bold text-[#171316] mb-1">
                    Gentle Message
                  </label>
                  <textarea
                    value={reminderMessage}
                    onChange={(e) => setReminderMessage(e.target.value)}
                    placeholder="Take 5 minutes to breathe, stretch, and check in with yourself."
                    rows={2}
                    required
                    className="w-full px-3.5 py-2 rounded-xl border-2 border-[#171316] bg-white focus:outline-none focus:ring-2 focus:ring-[#F04478]"
                  />
                </div>

                <div>
                  <label className="block font-bold text-[#171316] mb-1">
                    Schedule For (Date & Time)
                  </label>
                  <input
                    type="datetime-local"
                    value={scheduledFor}
                    onChange={(e) => setScheduledFor(e.target.value)}
                    className="w-full px-3.5 py-2 rounded-xl border-2 border-[#171316] bg-white focus:outline-none focus:ring-2 focus:ring-[#F04478]"
                  />
                </div>

                <button
                  type="submit"
                  disabled={creating}
                  className="w-full py-2.5 rounded-xl bg-[#F04478] text-white font-bold text-xs border-2 border-[#171316] shadow-scrapbook-sm hover:-translate-y-0.5 transition-all flex items-center justify-center gap-2"
                >
                  <Plus className="w-4 h-4" />
                  <span>{creating ? 'Scheduling...' : 'Add Reminder ♡'}</span>
                </button>
              </form>
            </ScrapbookCard>
          </div>
        </div>
      </div>
    </div>
  );
};
