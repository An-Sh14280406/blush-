import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { api } from '../services/api';
import { BowIcon, StrawberryIcon, HeartSticker } from '../components/ScrapbookDecorations';
import { ArrowRight, ArrowLeft, Check, Sparkles, AlertCircle } from 'lucide-react';

export const OnboardingPage = () => {
  const { user, refreshUser } = useAuth();
  const navigate = useNavigate();

  const [step, setStep] = useState(1);
  const [preferredName, setPreferredName] = useState(user?.name || 'Ananya');
  const [lastPeriodStartDate, setLastPeriodStartDate] = useState('');
  const [lastPeriodEndDate, setLastPeriodEndDate] = useState('');
  const [averageCycleLength, setAverageCycleLength] = useState('');
  const [averageBleedingDuration, setAverageBleedingDuration] = useState('5');
  const [cycleRegularity, setCycleRegularity] = useState('regular');
  const [notifications, setNotifications] = useState({
    upcomingPeriod: true,
    dailyMood: true,
    symptomReminder: true,
    fertileWindow: false,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const totalSteps = 4;

  const handleNext = () => {
    setError('');
    setStep((prev) => Math.min(prev + 1, totalSteps));
  };

  const handlePrev = () => {
    setError('');
    setStep((prev) => Math.max(prev - 1, 1));
  };

  const handleSubmit = async () => {
    setLoading(true);
    setError('');

    try {
      await api.completeOnboarding({
        preferredName,
        lastPeriodStartDate: lastPeriodStartDate || null,
        lastPeriodEndDate: lastPeriodEndDate || null,
        averageCycleLength: averageCycleLength ? Number(averageCycleLength) : 28,
        averageBleedingDuration: Number(averageBleedingDuration) || 5,
        cycleRegularity,
        notifications,
      });
      await refreshUser();
      navigate('/dashboard');
    } catch (err) {
      setError(err.message || 'Failed to complete onboarding');
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#FFF4E9] bg-dot-pattern flex items-center justify-center p-6 selection:bg-[#F27F9D] selection:text-white">
      <div className="w-full max-w-lg">
        {/* Step Indicator */}
        <div className="flex items-center justify-between mb-8 px-2">
          <div className="flex items-center gap-2">
            <StrawberryIcon className="w-8 h-8" />
            <span className="text-3xl font-bold font-logo text-[#C51F46]">blush.</span>
          </div>
          <div className="flex items-center gap-2">
            {[1, 2, 3, 4].map((s) => (
              <div
                key={s}
                className={`w-8 h-2 rounded-full transition-all ${
                  s === step
                    ? 'bg-[#F04478] w-12'
                    : s < step
                    ? 'bg-[#C51F46]'
                    : 'bg-[#F9C3D0]'
                }`}
              />
            ))}
          </div>
        </div>

        {/* Card */}
        <div className="bg-white border-2 border-[#171316] rounded-3xl p-8 shadow-scrapbook relative">
          <div className="absolute -top-3 right-8">
            <BowIcon className="w-8 h-8" />
          </div>

          {error && (
            <div className="p-3 mb-4 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* Step 1: Preferred Name & Welcome */}
          {step === 1 && (
            <div className="space-y-5 animate-in fade-in duration-200">
              <div>
                <span className="text-xs font-semibold uppercase tracking-wider text-[#C51F46]">
                  Step 1 of 4 • Welcome
                </span>
                <h2 className="text-3xl font-bold font-editorial text-[#171316] mt-1">
                  What should we call you?
                </h2>
                <p className="text-xs sm:text-sm text-[#171316]/70 mt-1">
                  This sanctuary is tailored just for you.
                </p>
              </div>

              <div>
                <label className="block font-bold text-xs sm:text-sm text-[#171316] mb-2">
                  Your Preferred Name
                </label>
                <input
                  type="text"
                  value={preferredName}
                  onChange={(e) => setPreferredName(e.target.value)}
                  placeholder="Ananya"
                  className="w-full px-4 py-3 rounded-xl border-2 border-[#171316] bg-[#FFF9F5] focus:outline-none focus:ring-2 focus:ring-[#F04478] font-medium"
                />
              </div>

              <div className="p-4 rounded-2xl bg-[#FFF0F3] border border-[#F04478]/30 flex items-center gap-3">
                <HeartSticker className="w-6 h-6 text-[#F04478] shrink-0" />
                <p className="text-xs text-[#171316]/80 italic">
                  "Your cycle. Your feelings. Your little moments."
                </p>
              </div>
            </div>
          )}

          {/* Step 2: Recent Period Information */}
          {step === 2 && (
            <div className="space-y-5 animate-in fade-in duration-200">
              <div>
                <span className="text-xs font-semibold uppercase tracking-wider text-[#C51F46]">
                  Step 2 of 4 • Cycle Baseline
                </span>
                <h2 className="text-3xl font-bold font-editorial text-[#171316] mt-1">
                  When was your last period?
                </h2>
                <p className="text-xs sm:text-sm text-[#171316]/70 mt-1">
                  If you aren't sure, you can estimate or skip this for now.
                </p>
              </div>

              <div>
                <label className="block font-bold text-xs sm:text-sm text-[#171316] mb-1.5">
                  Last Period Start Date
                </label>
                <input
                  type="date"
                  value={lastPeriodStartDate}
                  onChange={(e) => setLastPeriodStartDate(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border-2 border-[#171316] bg-[#FFF9F5] focus:outline-none focus:ring-2 focus:ring-[#F04478]"
                />
              </div>

              <div>
                <label className="block font-bold text-xs sm:text-sm text-[#171316] mb-1.5">
                  Last Period End Date <span className="font-normal text-[#171316]/60">(optional)</span>
                </label>
                <input
                  type="date"
                  value={lastPeriodEndDate}
                  min={lastPeriodStartDate}
                  onChange={(e) => setLastPeriodEndDate(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border-2 border-[#171316] bg-[#FFF9F5] focus:outline-none focus:ring-2 focus:ring-[#F04478]"
                />
              </div>
            </div>
          )}

          {/* Step 3: Cycle Length & Regularity */}
          {step === 3 && (
            <div className="space-y-5 animate-in fade-in duration-200">
              <div>
                <span className="text-xs font-semibold uppercase tracking-wider text-[#C51F46]">
                  Step 3 of 4 • Rhythm & Regularity
                </span>
                <h2 className="text-3xl font-bold font-editorial text-[#171316] mt-1">
                  Tell us about your rhythm.
                </h2>
                <p className="text-xs sm:text-sm text-[#171316]/70 mt-1">
                  Everyone's body is unique. We never force a standard 28-day template.
                </p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold text-xs text-[#171316] mb-1.5">
                    Cycle Length (days)
                  </label>
                  <input
                    type="number"
                    min="20"
                    max="50"
                    placeholder="e.g. 30"
                    value={averageCycleLength}
                    onChange={(e) => setAverageCycleLength(e.target.value)}
                    className="w-full px-3 py-2.5 rounded-xl border-2 border-[#171316] bg-[#FFF9F5] focus:outline-none focus:ring-2 focus:ring-[#F04478]"
                  />
                  <span className="text-[10px] text-[#171316]/60 mt-1 block">Leave empty if unsure</span>
                </div>

                <div>
                  <label className="block font-bold text-xs text-[#171316] mb-1.5">
                    Bleeding Duration (days)
                  </label>
                  <input
                    type="number"
                    min="2"
                    max="10"
                    value={averageBleedingDuration}
                    onChange={(e) => setAverageBleedingDuration(e.target.value)}
                    className="w-full px-3 py-2.5 rounded-xl border-2 border-[#171316] bg-[#FFF9F5] focus:outline-none focus:ring-2 focus:ring-[#F04478]"
                  />
                  <span className="text-[10px] text-[#171316]/60 mt-1 block">Usually 4–6 days</span>
                </div>
              </div>

              <div>
                <label className="block font-bold text-xs sm:text-sm text-[#171316] mb-2">
                  Cycle Regularity
                </label>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  {[
                    { id: 'regular', label: 'Regular (predictable)' },
                    { id: 'somewhat_regular', label: 'Somewhat Regular' },
                    { id: 'irregular', label: 'Irregular (varies)' },
                    { id: 'not_sure', label: 'Not Sure Yet' },
                  ].map((item) => (
                    <button
                      type="button"
                      key={item.id}
                      onClick={() => setCycleRegularity(item.id)}
                      className={`p-3 rounded-xl border-2 text-left transition-all ${
                        cycleRegularity === item.id
                          ? 'bg-[#F04478] text-white border-[#171316] shadow-scrapbook-sm font-bold'
                          : 'bg-white text-[#171316] border-[#171316]/20 hover:border-[#171316]'
                      }`}
                    >
                      {item.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Step 4: Notification Reminders */}
          {step === 4 && (
            <div className="space-y-5 animate-in fade-in duration-200">
              <div>
                <span className="text-xs font-semibold uppercase tracking-wider text-[#C51F46]">
                  Step 4 of 4 • Gentle Reminders
                </span>
                <h2 className="text-3xl font-bold font-editorial text-[#171316] mt-1">
                  How would you like to be notified?
                </h2>
                <p className="text-xs sm:text-sm text-[#171316]/70 mt-1">
                  All notifications use gentle, discreet language that protects your privacy.
                </p>
              </div>

              <div className="space-y-3">
                {[
                  {
                    key: 'upcomingPeriod',
                    title: 'Upcoming Period Notice',
                    desc: 'A gentle reminder a couple of days before your estimated period window.',
                  },
                  {
                    key: 'dailyMood',
                    title: 'Daily Mood Check-In',
                    desc: 'Prompt to record how your body and feelings are doing today.',
                  },
                  {
                    key: 'symptomReminder',
                    title: 'Symptom & Physical Notes',
                    desc: 'Helpful reminder to note cramps, headaches or energy shifts.',
                  },
                ].map((notif) => (
                  <label
                    key={notif.key}
                    className="flex items-start gap-3 p-3.5 rounded-xl border-2 border-[#171316] bg-[#FFF9F5] cursor-pointer hover:bg-[#FFF0F3] transition-colors"
                  >
                    <input
                      type="checkbox"
                      checked={notifications[notif.key]}
                      onChange={(e) =>
                        setNotifications((prev) => ({ ...prev, [notif.key]: e.target.checked }))
                      }
                      className="w-5 h-5 accent-[#F04478] rounded cursor-pointer mt-0.5 shrink-0"
                    />
                    <div>
                      <span className="font-bold text-xs sm:text-sm text-[#171316] block">
                        {notif.title}
                      </span>
                      <span className="text-[11px] text-[#171316]/70 block leading-tight">
                        {notif.desc}
                      </span>
                    </div>
                  </label>
                ))}
              </div>
            </div>
          )}

          {/* Navigation Controls */}
          <div className="flex items-center justify-between pt-6 mt-6 border-t border-[#171316]/10">
            {step > 1 ? (
              <button
                type="button"
                onClick={handlePrev}
                className="px-4 py-2.5 rounded-xl border border-[#171316]/30 font-semibold text-xs sm:text-sm hover:bg-black/5 flex items-center gap-2"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Back</span>
              </button>
            ) : (
              <div />
            )}

            {step < totalSteps ? (
              <button
                type="button"
                onClick={handleNext}
                className="px-6 py-2.5 rounded-xl bg-[#F04478] text-white font-bold text-xs sm:text-sm border-2 border-[#171316] shadow-scrapbook-sm hover:-translate-y-0.5 transition-all flex items-center gap-2"
              >
                <span>Continue</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            ) : (
              <button
                type="button"
                onClick={handleSubmit}
                disabled={loading}
                className="px-6 py-2.5 rounded-xl bg-[#C51F46] text-white font-bold text-xs sm:text-sm border-2 border-[#171316] shadow-scrapbook-pink hover:-translate-y-0.5 transition-all flex items-center gap-2"
              >
                <Sparkles className="w-4 h-4" />
                <span>{loading ? 'Setting up...' : 'Enter blush. ♡'}</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
