import React, { useState, useEffect } from 'react';
import { useOutletContext, Link } from 'react-router-dom';
import { api } from '../services/api';
import { Header } from '../components/Header';
import { ScrapbookCard } from '../components/ScrapbookCard';
import { BowIcon, StrawberryIcon, HeartSticker } from '../components/ScrapbookDecorations';
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
} from 'recharts';
import {
  TrendingUp,
  Activity,
  Sparkles,
  Clock,
  Filter,
  ArrowRight,
  ShieldCheck,
} from 'lucide-react';

const COLORS = ['#F04478', '#F9C3D0', '#C51F46', '#FF765F', '#DCC8F5', '#C5D83C', '#171316'];

export const CycleInsightsPage = () => {
  const { openLogPeriod, refreshTrigger } = useOutletContext();
  const [timeframe, setTimeframe] = useState('all');
  const [analyticsData, setAnalyticsData] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchAnalytics = async (tf = timeframe) => {
    setLoading(true);
    try {
      const res = await api.getAnalytics(tf);
      if (res.success) {
        setAnalyticsData(res);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAnalytics(timeframe);
  }, [timeframe, refreshTrigger]);

  const predictions = analyticsData?.predictions;
  const charts = analyticsData?.charts;

  return (
    <div>
      <Header onLogPeriodClick={openLogPeriod} />

      <div className="space-y-8">
        {/* Top Header & Timeframe Filters */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <span className="text-xs font-semibold uppercase tracking-wider text-[#C51F46]">
              Clinical Analytics & Patterns
            </span>
            <h3 className="text-3xl sm:text-4xl font-bold font-editorial text-[#171316]">
              Cycle & Mood Analytics ♡
            </h3>
            <p className="text-xs sm:text-sm text-[#171316]/70">
              Visualizing your genuine recorded cycles, durations, and emotional frequencies.
            </p>
          </div>

          <div className="flex items-center gap-1.5 p-1 rounded-2xl bg-white border-2 border-[#171316] shadow-scrapbook-sm self-start sm:self-center text-xs">
            {[
              { id: '30d', label: '30 Days' },
              { id: '3m', label: '3 Months' },
              { id: '6m', label: '6 Months' },
              { id: 'all', label: 'All History' },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setTimeframe(tab.id)}
                className={`px-3 py-1.5 rounded-xl font-bold transition-all ${
                  timeframe === tab.id
                    ? 'bg-[#F04478] text-white shadow-xs'
                    : 'text-[#171316]/70 hover:text-[#171316]'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Statistical Summary Metrics Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="p-4 rounded-2xl bg-white border-2 border-[#171316] shadow-scrapbook">
            <span className="text-[10px] font-bold text-[#171316]/60 uppercase tracking-wider block mb-1">
              Average Cycle Length
            </span>
            <span className="text-3xl font-bold font-editorial text-[#C51F46]">
              {predictions?.averageCycleLength || 30.5}
            </span>
            <span className="text-xs font-semibold text-[#171316]/70 ml-1">days</span>
          </div>

          <div className="p-4 rounded-2xl bg-white border-2 border-[#171316] shadow-scrapbook">
            <span className="text-[10px] font-bold text-[#171316]/60 uppercase tracking-wider block mb-1">
              Median Cycle Length
            </span>
            <span className="text-3xl font-bold font-editorial text-[#171316]">
              {predictions?.medianCycleLength || 31}
            </span>
            <span className="text-xs font-semibold text-[#171316]/70 ml-1">days</span>
          </div>

          <div className="p-4 rounded-2xl bg-white border-2 border-[#171316] shadow-scrapbook">
            <span className="text-[10px] font-bold text-[#171316]/60 uppercase tracking-wider block mb-1">
              Bleeding Duration
            </span>
            <span className="text-3xl font-bold font-editorial text-[#F04478]">
              ~{predictions?.averageBleedingDuration || 5}
            </span>
            <span className="text-xs font-semibold text-[#171316]/70 ml-1">days</span>
          </div>

          <div className="p-4 rounded-2xl bg-white border-2 border-[#171316] shadow-scrapbook">
            <span className="text-[10px] font-bold text-[#171316]/60 uppercase tracking-wider block mb-1">
              Cycle Variation
            </span>
            <span className="text-3xl font-bold font-editorial text-[#171316]">
              ±{predictions?.cycleVariationDays || 0.5}
            </span>
            <span className="text-xs font-semibold text-[#171316]/70 ml-1">days</span>
          </div>
        </div>

        {/* CHARTS ROW 1: Cycle Length & Bleeding Duration */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Cycle Length History */}
          <ScrapbookCard variant="default">
            <div className="flex items-center justify-between mb-4">
              <h4 className="font-bold text-base text-[#171316]">
                Consecutive Cycle Lengths (Days)
              </h4>
              <span className="text-[11px] font-semibold text-[#C51F46]">
                Target avg: {predictions?.averageCycleLength}d
              </span>
            </div>

            <div className="h-64 w-full">
              {charts?.cycleLengthData && charts.cycleLengthData.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={charts.cycleLengthData} margin={{ top: 10, right: 10, left: -20, bottom: 20 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#F8B4C4" opacity={0.4} />
                    <XAxis dataKey="cycle" tick={{ fontSize: 11 }} />
                    <YAxis domain={['dataMin - 5', 'dataMax + 5']} tick={{ fontSize: 11 }} />
                    <Tooltip
                      contentStyle={{ backgroundColor: '#FFF4E9', borderRadius: '12px', border: '2px solid #171316' }}
                    />
                    <Bar dataKey="days" fill="#F04478" radius={[8, 8, 0, 0]} name="Cycle Length (Days)" />
                  </BarChart>
                </ResponsiveContainer>
              ) : (
                <div className="h-full flex items-center justify-center text-xs text-[#171316]/50 italic">
                  Need at least two recorded cycles to chart interval progression.
                </div>
              )}
            </div>
          </ScrapbookCard>

          {/* Period Duration Chart */}
          <ScrapbookCard variant="default">
            <div className="flex items-center justify-between mb-4">
              <h4 className="font-bold text-base text-[#171316]">
                Bleeding Duration per Period (Days)
              </h4>
              <span className="text-[11px] font-semibold text-[#171316]/60">
                Logged durations
              </span>
            </div>

            <div className="h-64 w-full">
              {charts?.durationData && charts.durationData.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={charts.durationData} margin={{ top: 10, right: 10, left: -20, bottom: 20 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#F8B4C4" opacity={0.4} />
                    <XAxis dataKey="date" tick={{ fontSize: 11 }} />
                    <YAxis domain={[0, 10]} tick={{ fontSize: 11 }} />
                    <Tooltip
                      contentStyle={{ backgroundColor: '#FFF4E9', borderRadius: '12px', border: '2px solid #171316' }}
                    />
                    <Line
                      type="monotone"
                      dataKey="duration"
                      stroke="#C51F46"
                      strokeWidth={3}
                      dot={{ r: 5, fill: '#F04478', stroke: '#171316' }}
                      name="Bleeding Days"
                    />
                  </LineChart>
                </ResponsiveContainer>
              ) : (
                <div className="h-full flex items-center justify-center text-xs text-[#171316]/50 italic">
                  Log period start and end dates to visualize bleeding duration trends.
                </div>
              )}
            </div>
          </ScrapbookCard>
        </div>

        {/* CHARTS ROW 2: Mood Distribution & Symptom Frequency */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Mood Distribution */}
          <ScrapbookCard variant="pink">
            <div className="flex items-center justify-between mb-4">
              <h4 className="font-bold text-base text-[#171316]">
                Emotional Mood Distribution
              </h4>
              <Sparkles className="w-4 h-4 text-[#C51F46]" />
            </div>

            <div className="h-64 w-full">
              {charts?.moodDistribution && charts.moodDistribution.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={charts.moodDistribution}
                      dataKey="count"
                      nameKey="name"
                      cx="50%"
                      cy="50%"
                      outerRadius={80}
                      label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    >
                      {charts.moodDistribution.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip
                      contentStyle={{ backgroundColor: '#FFF4E9', borderRadius: '12px', border: '2px solid #171316' }}
                    />
                  </PieChart>
                </ResponsiveContainer>
              ) : (
                <div className="h-full flex items-center justify-center text-xs text-[#171316]/50 italic">
                  No mood entries recorded yet in this timeframe.
                </div>
              )}
            </div>
          </ScrapbookCard>

          {/* Symptom Frequency */}
          <ScrapbookCard variant="ivory">
            <div className="flex items-center justify-between mb-4">
              <h4 className="font-bold text-base text-[#171316]">
                Reported Physical Symptoms
              </h4>
              <Activity className="w-4 h-4 text-[#F04478]" />
            </div>

            <div className="h-64 w-full">
              {charts?.symptomFrequency && charts.symptomFrequency.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={charts.symptomFrequency}
                    layout="vertical"
                    margin={{ top: 10, right: 20, left: 20, bottom: 10 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" stroke="#F8B4C4" opacity={0.3} />
                    <XAxis type="number" tick={{ fontSize: 11 }} />
                    <YAxis dataKey="name" type="category" tick={{ fontSize: 11 }} width={90} />
                    <Tooltip
                      contentStyle={{ backgroundColor: '#FFF4E9', borderRadius: '12px', border: '2px solid #171316' }}
                    />
                    <Bar dataKey="count" fill="#FF765F" radius={[0, 6, 6, 0]} name="Reported Times" />
                  </BarChart>
                </ResponsiveContainer>
              ) : (
                <div className="h-full flex items-center justify-center text-xs text-[#171316]/50 italic">
                  No physical symptoms logged yet.
                </div>
              )}
            </div>
          </ScrapbookCard>
        </div>

        {/* CHARTS ROW 3: Sleep & Energy Levels */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Energy Distribution */}
          <ScrapbookCard variant="default">
            <h4 className="font-bold text-base text-[#171316] mb-4">
              Energy Battery Levels
            </h4>
            <div className="h-56 w-full">
              {charts?.energyData ? (
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={charts.energyData} margin={{ top: 10, right: 10, left: -20, bottom: 10 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#F8B4C4" opacity={0.3} />
                    <XAxis dataKey="level" tick={{ fontSize: 10 }} />
                    <YAxis tick={{ fontSize: 11 }} />
                    <Tooltip
                      contentStyle={{ backgroundColor: '#FFF4E9', borderRadius: '12px', border: '2px solid #171316' }}
                    />
                    <Bar dataKey="count" fill="#C5D83C" radius={[6, 6, 0, 0]} name="Days" />
                  </BarChart>
                </ResponsiveContainer>
              ) : null}
            </div>
          </ScrapbookCard>

          {/* Sleep Hours Over Time */}
          <ScrapbookCard variant="default">
            <h4 className="font-bold text-base text-[#171316] mb-4">
              Sleep Duration (Hours)
            </h4>
            <div className="h-56 w-full">
              {charts?.sleepData && charts.sleepData.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={charts.sleepData} margin={{ top: 10, right: 10, left: -20, bottom: 10 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#F8B4C4" opacity={0.3} />
                    <XAxis dataKey="date" tick={{ fontSize: 10 }} />
                    <YAxis domain={[4, 12]} tick={{ fontSize: 11 }} />
                    <Tooltip
                      contentStyle={{ backgroundColor: '#FFF4E9', borderRadius: '12px', border: '2px solid #171316' }}
                    />
                    <Line
                      type="monotone"
                      dataKey="hours"
                      stroke="#171316"
                      strokeWidth={2.5}
                      dot={{ r: 4, fill: '#DCC8F5', stroke: '#171316' }}
                      name="Hours"
                    />
                  </LineChart>
                </ResponsiveContainer>
              ) : (
                <div className="h-full flex items-center justify-center text-xs text-[#171316]/50 italic">
                  Log wellness check-ins to track sleep hours.
                </div>
              )}
            </div>
          </ScrapbookCard>
        </div>

        {/* Link to Personal Insights */}
        <div className="p-6 rounded-2xl bg-[#FFF0F3] border-2 border-[#F04478] shadow-scrapbook-pink flex flex-col sm:flex-row items-center justify-between gap-4">
          <div>
            <h4 className="font-bold text-lg text-[#171316] mb-1">
              Discover Ananya's Personal Mood & Wellness Patterns
            </h4>
            <p className="text-xs text-[#171316]/70">
              Read transparent self-care reflections generated from your actual historical observation counts.
            </p>
          </div>
          <Link
            to="/insights/personal"
            className="px-5 py-2.5 rounded-xl bg-[#F04478] text-white font-bold text-xs sm:text-sm border-2 border-[#171316] shadow-scrapbook-sm hover:-translate-y-0.5 transition-all shrink-0 flex items-center gap-2"
          >
            <span>View Personal Insights</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </div>
  );
};
