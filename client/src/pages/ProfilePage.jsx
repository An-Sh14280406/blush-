import React, { useState } from 'react';
import { useOutletContext } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { api } from '../services/api';
import { Header } from '../components/Header';
import { ScrapbookCard } from '../components/ScrapbookCard';
import { BowIcon, StrawberryIcon, HeartSticker, ButterflyIcon } from '../components/ScrapbookDecorations';
import { User, Save, CheckCircle, AlertCircle, Heart, Sparkles } from 'lucide-react';

const AVATARS = ['🎀', '🌸', '🍓', '🦋', '💖', '🧁', '🍒', '🌙', '🌷', '✨'];

export const ProfilePage = () => {
  const { openLogPeriod } = useOutletContext();
  const { user, refreshUser } = useAuth();

  const [name, setName] = useState(user?.name || 'Ananya');
  const [avatar, setAvatar] = useState(user?.avatar || '🎀');
  const [cycleLength, setCycleLength] = useState(user?.preferences?.averageCycleLength || 30.5);
  const [bleedingDuration, setBleedingDuration] = useState(user?.preferences?.averageBleedingDuration || 5);
  const [regularity, setCycleRegularity] = useState(user?.preferences?.cycleRegularity || 'regular');
  const [notifications, setNotifications] = useState(
    user?.preferences?.notifications || {
      upcomingPeriod: true,
      dailyMood: true,
      symptomReminder: true,
      fertileWindow: false,
    }
  );

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const handleSave = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      await api.updateProfile({
        name,
        avatar,
        preferences: {
          averageCycleLength: Number(cycleLength),
          averageBleedingDuration: Number(bleedingDuration),
          cycleRegularity: regularity,
          notifications,
        },
      });
      await refreshUser();
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch (err) {
      setError(err.message || 'Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <Header onLogPeriodClick={openLogPeriod} />

      <div className="max-w-4xl mx-auto space-y-6">
        <div>
          <span className="text-xs font-semibold uppercase tracking-wider text-[#C51F46]">
            Personal Identity & Settings
          </span>
          <h3 className="text-3xl sm:text-4xl font-bold font-editorial text-[#171316]">
            Ananya's Profile ♡
          </h3>
          <p className="text-xs sm:text-sm text-[#171316]/70">
            Personalize your sanctuary, avatar and cycle preferences.
          </p>
        </div>

        {success && (
          <div className="p-3.5 rounded-xl bg-[#FFF0F3] border-2 border-[#F04478] text-[#C51F46] text-xs font-bold flex items-center gap-2 shadow-sm animate-in fade-in">
            <CheckCircle className="w-4 h-4 text-[#F04478]" />
            <span>Profile updated successfully! ♡</span>
          </div>
        )}

        {error && (
          <div className="p-3.5 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSave} className="space-y-6">
          {/* Identity & Avatar Card */}
          <ScrapbookCard variant="default">
            <div className="flex flex-col sm:flex-row items-center gap-6">
              {/* Avatar Showcase */}
              <div className="relative">
                <div className="w-24 h-24 rounded-full bg-[#FFF0F3] border-4 border-[#171316] shadow-scrapbook flex items-center justify-center text-5xl">
                  {avatar}
                </div>
                <div className="absolute -bottom-2 -right-1">
                  <BowIcon className="w-7 h-7" />
                </div>
              </div>

              {/* Name & Email info */}
              <div className="flex-1 space-y-3 w-full">
                <div>
                  <label className="block font-bold text-xs sm:text-sm text-[#171316] mb-1">
                    Your Preferred Name
                  </label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                    className="w-full px-4 py-2.5 rounded-xl border-2 border-[#171316] bg-[#FFF9F5] focus:outline-none focus:ring-2 focus:ring-[#F04478] font-bold"
                  />
                </div>

                <div>
                  <label className="block font-bold text-xs text-[#171316]/70 mb-1">
                    Registered Email (Private)
                  </label>
                  <input
                    type="email"
                    value={user?.email || 'ananya@blush.love'}
                    disabled
                    className="w-full px-4 py-2 rounded-xl border border-[#171316]/20 bg-gray-100 text-[#171316]/60 text-xs cursor-not-allowed"
                  />
                </div>
              </div>
            </div>

            {/* Avatar Selector */}
            <div className="mt-6 pt-6 border-t border-[#171316]/10">
              <label className="block font-bold text-xs sm:text-sm text-[#171316] mb-2">
                Choose Your Scrapbook Avatar Icon
              </label>
              <div className="flex flex-wrap gap-2.5">
                {AVATARS.map((av) => (
                  <button
                    type="button"
                    key={av}
                    onClick={() => setAvatar(av)}
                    className={`w-11 h-11 rounded-2xl border-2 text-2xl flex items-center justify-center transition-all ${
                      avatar === av
                        ? 'bg-[#F04478] border-[#171316] shadow-scrapbook-sm scale-110'
                        : 'bg-white border-[#171316]/20 hover:border-[#171316]'
                    }`}
                  >
                    {av}
                  </button>
                ))}
              </div>
            </div>
          </ScrapbookCard>

          {/* Cycle Baseline Settings Card */}
          <ScrapbookCard variant="ivory">
            <h4 className="font-bold text-base text-[#171316] mb-1">
              Personal Cycle Baseline Preferences
            </h4>
            <p className="text-xs text-[#171316]/70 mb-5">
              These initial guidelines assist blush. until sufficient confirmed cycles are logged.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block font-bold text-xs text-[#171316] mb-1">
                  Expected Cycle Length (days)
                </label>
                <input
                  type="number"
                  step="0.5"
                  min="20"
                  max="50"
                  value={cycleLength}
                  onChange={(e) => setCycleLength(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border-2 border-[#171316] bg-white font-bold text-xs sm:text-sm"
                />
              </div>

              <div>
                <label className="block font-bold text-xs text-[#171316] mb-1">
                  Average Bleeding Duration (days)
                </label>
                <input
                  type="number"
                  min="2"
                  max="12"
                  value={bleedingDuration}
                  onChange={(e) => setBleedingDuration(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border-2 border-[#171316] bg-white font-bold text-xs sm:text-sm"
                />
              </div>
            </div>

            <div>
              <label className="block font-bold text-xs text-[#171316] mb-1.5">
                Cycle Regularity
              </label>
              <select
                value={regularity}
                onChange={(e) => setCycleRegularity(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border-2 border-[#171316] bg-white text-xs sm:text-sm font-semibold"
              >
                <option value="regular">Regular (predictable timing)</option>
                <option value="somewhat_regular">Somewhat Regular (varies by a couple of days)</option>
                <option value="irregular">Irregular (varies significantly)</option>
                <option value="not_sure">Not Sure Yet</option>
              </select>
            </div>
          </ScrapbookCard>

          {/* Save Button */}
          <div className="flex justify-end pt-2">
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-3 rounded-xl bg-[#F04478] text-white font-bold text-xs sm:text-sm border-2 border-[#171316] shadow-scrapbook hover:-translate-y-0.5 transition-all flex items-center gap-2"
            >
              <Save className="w-4 h-4" />
              <span>{loading ? 'Saving Changes...' : 'Save Profile ♡'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
