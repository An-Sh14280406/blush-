import React, { useState, useEffect } from 'react';
import { useOutletContext, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { api } from '../services/api';
import { Header } from '../components/Header';
import { ScrapbookCard } from '../components/ScrapbookCard';
import { DisclaimerAlert } from '../components/DisclaimerAlert';
import {
  BowIcon,
  StrawberryIcon,
  HeartSticker,
  ButterflyIcon,
} from '../components/ScrapbookDecorations';
import {
  CalendarDays,
  Sparkles,
  Activity,
  ArrowRight,
  TrendingUp,
  Clock,
  Heart,
  Droplet,
  Info,
  CheckCircle,
} from 'lucide-react';
import { format } from 'date-fns';

export const DashboardPage = () => {
  const { openLogPeriod, refreshTrigger } = useOutletContext();
  const { user } = useAuth();

  const [loading, setLoading] = useState(true);
  const [predictions, setPredictions] = useState(null);
  const [recentPeriods, setRecentPeriods] = useState([]);
  const [recentMoods, setRecentMoods] = useState([]);
  const [todayMood, setTodayMood] = useState(null);
  const [quickMoodInput, setQuickMoodInput] = useState('');
  const [quickEnergyInput, setQuickEnergyInput] = useState('normal');
  const [checkinSuccess, setCheckinSuccess] = useState(false);

  const todayStr = format(new Date(), 'yyyy-MM-dd');

  const fetchData = async () => {
    setLoading(true);
    try {
      const [predRes, periodsRes, moodsRes] = await Promise.all([
        api.getPeriodPredictions(),
        api.getPeriods(),
        api.getMoods(),
      ]);

      if (predRes.success) setPredictions(predRes.data);
      if (periodsRes.success) setRecentPeriods((periodsRes.data || []).slice(0, 4));
      if (moodsRes.success) {
        setRecentMoods((moodsRes.data || []).slice(0, 4));
        const todayEntry = (moodsRes.data || []).find((m) => m.date === todayStr);
        if (todayEntry) setTodayMood(todayEntry);
      }
    } catch (err) {
      console.error('Failed to load dashboard data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [refreshTrigger]);

  const handleQuickMoodSave = async (selectedMood) => {
    try {
      const currentMoods = todayMood ? [...todayMood.moods] : [];
      if (!currentMoods.includes(selectedMood)) {
        currentMoods.push(selectedMood);
      }
      const res = await api.saveMood({
        date: todayStr,
        moods: currentMoods,
        intensity: 4,
        notes: quickMoodInput,
      });
      if (res.success) {
        setTodayMood(res.data);
        setCheckinSuccess(true);
        setTimeout(() => setCheckinSuccess(false), 3000);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const nextPred = predictions?.nextPeriodPrediction;
  const fertile = predictions?.fertileWindow;

  return (
    <div>
      <Header onLogPeriodClick={openLogPeriod} />

      {/* Main Grid Layout */}
      <div className="space-y-8">
        {/* ROW 1: Next Period Countdown & Cycle Overview */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Next Period Feature Card (Editorial focus) */}
          <div className="lg:col-span-7">
            <div className="relative rounded-3xl p-6 sm:p-8 bg-[#F04478] text-white border-2 border-[#171316] shadow-scrapbook overflow-hidden">
              <div className="absolute top-4 right-6 pointer-events-none opacity-90">
                <BowIcon className="w-12 h-12" color="#FFFFFF" />
              </div>

              <div className="flex items-center gap-2 mb-3">
                <span className="px-3 py-1 rounded-full bg-white/20 text-white text-[11px] font-bold tracking-wider uppercase border border-white/30 backdrop-blur-xs">
                  Estimated Cycle Window
                </span>
                <span className="text-xs text-white/80 font-medium">
                  • {predictions?.confidence || 'Provisional'} accuracy
                </span>
              </div>

              <h3 className="text-3xl sm:text-5xl font-bold font-editorial tracking-tight leading-tight mb-2">
                {nextPred?.estimatedDaysRemaining !== null && nextPred?.estimatedDaysRemaining !== undefined
                  ? nextPred.estimatedDaysRemaining > 0
                    ? `~${nextPred.estimatedDaysRemaining} days remaining`
                    : nextPred.estimatedDaysRemaining === 0
                    ? 'Expected today'
                    : `Due ~${Math.abs(nextPred.estimatedDaysRemaining)} days ago`
                  : 'Predicting your next cycle'}
              </h3>

              <p className="text-xs sm:text-sm text-white/90 max-w-md mb-6 leading-relaxed">
                Expected between{' '}
                <span className="font-bold underline">
                  {nextPred?.predictedStartRange?.earliest || 'Dec 2'}
                </span>{' '}
                and{' '}
                <span className="font-bold underline">
                  {nextPred?.predictedStartRange?.latest || 'Dec 4, 2026'}
                </span>
                .
              </p>

              {/* Data transparency note */}
              <div className="p-3.5 rounded-2xl bg-white/10 border border-white/20 text-xs text-white/90 flex items-start gap-2.5 backdrop-blur-xs">
                <Info className="w-4 h-4 shrink-0 mt-0.5" />
                <p className="leading-snug">
                  {nextPred?.dataAvailability ||
                    'Calculated based on your verified menstruation start dates and historical duration.'}
                </p>
              </div>
            </div>
          </div>

          {/* Cycle Overview & Day Tracker */}
          <div className="lg:col-span-5">
            <ScrapbookCard variant="ivory" className="h-full flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-4">
                  <span className="text-xs font-bold uppercase tracking-wider text-[#C51F46]">
                    Cycle Status
                  </span>
                  <HeartSticker className="w-5 h-5 text-[#F04478]" />
                </div>

                <div className="flex items-baseline gap-2 mb-1">
                  <span className="text-5xl font-bold font-editorial text-[#171316]">
                    Day {predictions?.currentCycleDay || '16'}
                  </span>
                  <span className="text-xs font-semibold text-[#171316]/60">
                    of current cycle
                  </span>
                </div>
                <p className="text-xs text-[#171316]/70 mb-6">
                  Last period began on{' '}
                  <span className="font-semibold text-[#171316]">
                    {predictions?.lastPeriod?.startDate || 'November 2, 2026'}
                  </span>
                </p>

                {/* Key Statistics Grid */}
                <div className="grid grid-cols-2 gap-3 pt-4 border-t border-[#171316]/10 text-xs">
                  <div className="p-3 rounded-xl bg-white border border-[#171316]/20">
                    <span className="text-[#171316]/60 block text-[10px] uppercase font-bold">
                      Average Cycle
                    </span>
                    <span className="text-lg font-bold text-[#171316]">
                      {predictions?.averageCycleLength || 30.5} days
                    </span>
                  </div>

                  <div className="p-3 rounded-xl bg-white border border-[#171316]/20">
                    <span className="text-[#171316]/60 block text-[10px] uppercase font-bold">
                      Period Duration
                    </span>
                    <span className="text-lg font-bold text-[#171316]">
                      ~{predictions?.averageBleedingDuration || 5} days
                    </span>
                  </div>
                </div>
              </div>

              <div className="mt-4 pt-3 text-right">
                <Link
                  to="/insights"
                  className="inline-flex items-center gap-1.5 text-xs font-bold text-[#C51F46] hover:underline"
                >
                  <span>Detailed Cycle Breakdown</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </ScrapbookCard>
          </div>
        </div>

        {/* ROW 2: Fertile Window & Daily Check-in */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Estimated Fertile Window Card */}
          <div className="lg:col-span-5">
            <ScrapbookCard variant="pink" className="h-full">
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-bold uppercase tracking-wider text-[#C51F46]">
                  Fertility Estimation
                </span>
                <ButterflyIcon className="w-6 h-6" />
              </div>

              <h4 className="text-2xl font-bold font-editorial text-[#171316] mb-1">
                Estimated Fertile Window
              </h4>
              <p className="text-xs text-[#171316]/70 mb-4">
                Target range: <span className="font-bold text-[#C51F46]">{fertile?.startDate || 'Nov 14'} – {fertile?.endDate || 'Nov 20'}</span>
              </p>

              <div className="p-3.5 rounded-xl bg-white border border-[#C51F46]/30 text-xs text-[#171316] space-y-2 mb-4">
                <div className="flex items-center justify-between">
                  <span className="text-[#171316]/70">Estimated Ovulation Date:</span>
                  <span className="font-bold text-[#C51F46]">{fertile?.ovulationDate || 'Nov 19, 2026'}</span>
                </div>
                <p className="text-[11px] text-[#171316]/80 leading-relaxed border-t border-[#171316]/10 pt-2">
                  {fertile?.explanation || 'Calculated using standard luteal phase estimation (~14 days before next predicted period).'}
                </p>
              </div>

              <DisclaimerAlert
                text="Calendar estimates cannot confirm ovulation. Never use predicted non-fertile days for contraception."
                className="text-[11px]"
              />
            </ScrapbookCard>
          </div>

          {/* Daily Quick Check-in Card */}
          <div className="lg:col-span-7">
            <ScrapbookCard variant="default">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-[#F04478]" />
                  <span className="text-xs font-bold uppercase tracking-wider text-[#C51F46]">
                    Daily Scrapbook Check-In
                  </span>
                </div>
                {checkinSuccess && (
                  <span className="text-xs font-bold text-green-700 flex items-center gap-1 animate-pulse">
                    <CheckCircle className="w-3.5 h-3.5" /> Saved!
                  </span>
                )}
              </div>

              <h4 className="text-2xl font-bold font-editorial text-[#171316] mb-2">
                How is your body & mind feeling today?
              </h4>
              <p className="text-xs text-[#171316]/70 mb-4">
                Tap your feelings to record them in your personal journal ♡
              </p>

              {/* Mood Quick Selector */}
              <div className="flex flex-wrap gap-2 mb-5">
                {[
                  'Happy',
                  'Calm',
                  'Affectionate',
                  'Playful',
                  'Relaxed',
                  'Confident',
                  'Low energy',
                  'Emotionally sensitive',
                  'Stressed',
                ].map((mood) => {
                  const isLogged = todayMood?.moods?.includes(mood);
                  return (
                    <button
                      key={mood}
                      onClick={() => handleQuickMoodSave(mood)}
                      className={`px-3 py-1.5 rounded-xl border text-xs font-medium transition-all ${
                        isLogged
                          ? 'bg-[#F04478] text-white border-[#171316] shadow-scrapbook-sm font-bold'
                          : 'bg-[#FFF9F5] text-[#171316] border-[#171316]/20 hover:border-[#171316]'
                      }`}
                    >
                      {mood} {isLogged ? '✓' : ''}
                    </button>
                  );
                })}
              </div>

              {/* Quick Actions Row */}
              <div className="pt-4 border-t border-[#171316]/10 flex flex-wrap items-center justify-between gap-3">
                <div className="flex items-center gap-2 text-xs">
                  <Link
                    to="/moods"
                    className="px-3 py-1.5 rounded-lg bg-[#F9C3D0]/60 text-[#C51F46] font-bold hover:bg-[#F9C3D0]"
                  >
                    Open Mood Journal
                  </Link>
                  <Link
                    to="/symptoms"
                    className="px-3 py-1.5 rounded-lg bg-[#FFF0F3] text-[#171316] font-medium border border-[#171316]/20 hover:border-[#171316]"
                  >
                    Log Symptoms
                  </Link>
                </div>

                <Link
                  to="/calendar"
                  className="inline-flex items-center gap-1 text-xs font-bold text-[#171316] hover:text-[#C51F46]"
                >
                  <span>Full Calendar</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </ScrapbookCard>
          </div>
        </div>

        {/* ROW 3: Recent Activity Feed */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-2xl font-bold font-editorial text-[#171316]">
              Recent Activity & Records
            </h3>
            <Link to="/history" className="text-xs font-bold text-[#C51F46] hover:underline">
              View All History →
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Recent Periods */}
            <div className="p-5 rounded-2xl bg-white border-2 border-[#171316] shadow-scrapbook">
              <h4 className="text-sm font-bold text-[#171316] uppercase tracking-wider mb-3 flex items-center gap-2">
                <Droplet className="w-4 h-4 text-[#F04478]" />
                <span>Recorded Menstrual Flows</span>
              </h4>

              {recentPeriods.length === 0 ? (
                <p className="text-xs text-[#171316]/60 italic py-4">No periods logged yet.</p>
              ) : (
                <div className="space-y-2.5">
                  {recentPeriods.map((p) => (
                    <div
                      key={p._id}
                      className="p-3 rounded-xl bg-[#FFF9F5] border border-[#171316]/10 flex items-center justify-between text-xs"
                    >
                      <div>
                        <span className="font-bold text-[#171316] block">
                          {format(new Date(p.startDate), 'MMMM d, yyyy')}
                          {p.endDate ? ` – ${format(new Date(p.endDate), 'MMM d')}` : ''}
                        </span>
                        <span className="text-[11px] text-[#171316]/60">
                          {p.durationDays ? `${p.durationDays} days • ` : ''}
                          Flow: {p.intensity} {p.isSpotting ? '(Spotting)' : ''}
                        </span>
                      </div>
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#F9C3D0] text-[#C51F46]">
                        {p.isConfirmed ? 'Confirmed' : 'Provisional'}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Recent Mood Journal Entries */}
            <div className="p-5 rounded-2xl bg-white border-2 border-[#171316] shadow-scrapbook">
              <h4 className="text-sm font-bold text-[#171316] uppercase tracking-wider mb-3 flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-[#F04478]" />
                <span>Recent Mood Notes</span>
              </h4>

              {recentMoods.length === 0 ? (
                <p className="text-xs text-[#171316]/60 italic py-4">No mood journal entries yet.</p>
              ) : (
                <div className="space-y-2.5">
                  {recentMoods.map((m) => (
                    <div
                      key={m._id}
                      className="p-3 rounded-xl bg-[#FFF0F3] border border-[#F04478]/20 text-xs"
                    >
                      <div className="flex items-center justify-between mb-1">
                        <span className="font-bold text-[#C51F46]">{m.date}</span>
                        <span className="text-[10px] text-[#171316]/60">Intensity {m.intensity}/5</span>
                      </div>
                      <div className="flex flex-wrap gap-1 mb-1">
                        {(m.moods || []).map((name) => (
                          <span
                            key={name}
                            className="px-2 py-0.5 rounded-md bg-white text-[10px] font-semibold border border-[#171316]/10"
                          >
                            {name}
                          </span>
                        ))}
                      </div>
                      {m.notes && (
                        <p className="text-[11px] text-[#171316]/80 italic mt-1">"{m.notes}"</p>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
