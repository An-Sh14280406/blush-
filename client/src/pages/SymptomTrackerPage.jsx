import React, { useState, useEffect } from 'react';
import { useOutletContext } from 'react-router-dom';
import { api } from '../services/api';
import { Header } from '../components/Header';
import { ScrapbookCard } from '../components/ScrapbookCard';
import { BowIcon, StrawberryIcon, HeartSticker } from '../components/ScrapbookDecorations';
import {
  Activity,
  Save,
  CheckCircle,
  AlertCircle,
  Moon,
  BatteryCharging,
  Cookie,
  Droplet,
} from 'lucide-react';
import { format } from 'date-fns';

const SYMPTOMS_LIST = [
  'Cramps',
  'Headache',
  'Back pain',
  'Bloating',
  'Breast tenderness',
  'Acne',
  'Fatigue',
  'Nausea',
  'Food cravings',
  'Sleep changes',
  'Appetite changes',
  'Concentration difficulties',
];

const CRAVINGS_LIST = ['Sweet', 'Salty', 'Spicy', 'Chocolate', 'Other'];

export const SymptomTrackerPage = () => {
  const { openLogPeriod } = useOutletContext();
  const [selectedDate, setSelectedDate] = useState(format(new Date(), 'yyyy-MM-dd'));
  const [activeSymptoms, setActiveSymptoms] = useState({}); // { Cramps: 'moderate', ... }
  const [notes, setNotes] = useState('');

  // Wellness fields
  const [energy, setEnergy] = useState('normal');
  const [sleepHours, setSleepHours] = useState(7.5);
  const [sleepQuality, setSleepQuality] = useState('good');
  const [cravings, setCravings] = useState([]);

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  // Load existing log for date
  useEffect(() => {
    const fetchDayLogs = async () => {
      try {
        const [symRes, wellRes] = await Promise.all([
          api.getSymptoms({ startDate: selectedDate, endDate: selectedDate }),
          api.getWellness({ startDate: selectedDate, endDate: selectedDate }),
        ]);

        if (symRes.success && symRes.data.length > 0) {
          const symMap = {};
          (symRes.data[0].symptoms || []).forEach((s) => {
            const name = typeof s === 'string' ? s : s.name;
            const intensity = typeof s === 'string' ? 'moderate' : s.intensity || 'moderate';
            symMap[name] = intensity;
          });
          setActiveSymptoms(symMap);
          setNotes(symRes.data[0].notes || '');
        } else {
          setActiveSymptoms({});
          setNotes('');
        }

        if (wellRes.success && wellRes.data.length > 0) {
          const w = wellRes.data[0];
          setEnergy(w.energy || 'normal');
          setSleepHours(w.sleepHours !== undefined ? w.sleepHours : 7.5);
          setSleepQuality(w.sleepQuality || 'good');
          setCravings(w.cravings || []);
        } else {
          setEnergy('normal');
          setSleepHours(7.5);
          setSleepQuality('good');
          setCravings([]);
        }
      } catch (err) {
        console.error(err);
      }
    };
    fetchDayLogs();
  }, [selectedDate]);

  const toggleSymptom = (sym) => {
    setActiveSymptoms((prev) => {
      const next = { ...prev };
      if (next[sym]) {
        delete next[sym];
      } else {
        next[sym] = 'moderate';
      }
      return next;
    });
  };

  const changeIntensity = (sym, intensity) => {
    setActiveSymptoms((prev) => ({
      ...prev,
      [sym]: intensity,
    }));
  };

  const toggleCraving = (c) => {
    setCravings((prev) =>
      prev.includes(c) ? prev.filter((item) => item !== c) : [...prev, c]
    );
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const formattedSymptoms = Object.entries(activeSymptoms).map(([name, intensity]) => ({
        name,
        intensity,
      }));

      await Promise.all([
        api.saveSymptom({
          date: selectedDate,
          symptoms: formattedSymptoms,
          notes,
        }),
        api.saveWellness({
          date: selectedDate,
          energy,
          sleepHours: Number(sleepHours),
          sleepQuality,
          cravings,
        }),
      ]);

      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch (err) {
      setError(err.message || 'Failed to save entries');
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
            Body & Wellness Journal
          </span>
          <h3 className="text-3xl sm:text-4xl font-bold font-editorial text-[#171316]">
            Symptom & Wellness Tracker ♡
          </h3>
          <p className="text-xs sm:text-sm text-[#171316]/70">
            Listen to your body's whispers. Track physical shifts, energy, and sleep patterns.
          </p>
        </div>

        {error && (
          <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {success && (
          <div className="p-3 rounded-xl bg-[#FFF0F3] border-2 border-[#F04478] text-[#C51F46] text-xs font-bold flex items-center gap-2 shadow-sm animate-in fade-in">
            <CheckCircle className="w-4 h-4 text-[#F04478]" />
            <span>Wellness notes saved in your records! ♡</span>
          </div>
        )}

        <form onSubmit={handleSave} className="space-y-6">
          {/* Date Picker */}
          <ScrapbookCard variant="default">
            <div className="flex items-center justify-between gap-4">
              <div>
                <label className="block font-bold text-xs sm:text-sm text-[#171316]">
                  Check-in Date
                </label>
                <span className="text-[11px] text-[#171316]/60">Select date for observations</span>
              </div>
              <input
                type="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                className="px-4 py-2 rounded-xl border-2 border-[#171316] bg-[#FFF9F5] font-bold text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-[#F04478]"
              />
            </div>
          </ScrapbookCard>

          {/* Physical Symptoms */}
          <ScrapbookCard variant="pink">
            <div className="flex items-center gap-2 mb-3">
              <Activity className="w-4 h-4 text-[#C51F46]" />
              <h4 className="font-bold text-sm sm:text-base text-[#171316]">
                Physical Symptoms
              </h4>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
              {SYMPTOMS_LIST.map((sym) => {
                const isSelected = !!activeSymptoms[sym];
                const intensity = activeSymptoms[sym] || 'moderate';

                return (
                  <div
                    key={sym}
                    className={`p-3 rounded-xl border-2 transition-all ${
                      isSelected
                        ? 'bg-white border-[#C51F46] shadow-sm'
                        : 'bg-[#FFF9F5] border-[#171316]/10 hover:border-[#171316]/30'
                    }`}
                  >
                    <div className="flex items-center justify-between gap-2 mb-2">
                      <button
                        type="button"
                        onClick={() => toggleSymptom(sym)}
                        className="text-left font-bold text-xs text-[#171316] hover:text-[#C51F46] flex-1"
                      >
                        {sym}
                      </button>
                      <input
                        type="checkbox"
                        checked={isSelected}
                        onChange={() => toggleSymptom(sym)}
                        className="w-4 h-4 accent-[#F04478] rounded cursor-pointer"
                      />
                    </div>

                    {isSelected && (
                      <div className="flex items-center gap-1 pt-2 border-t border-[#171316]/10">
                        {['mild', 'moderate', 'severe'].map((lvl) => (
                          <button
                            type="button"
                            key={lvl}
                            onClick={() => changeIntensity(sym, lvl)}
                            className={`flex-1 py-1 rounded text-[10px] font-bold uppercase tracking-wider transition-colors ${
                              intensity === lvl
                                ? lvl === 'severe'
                                  ? 'bg-[#C51F46] text-white'
                                  : 'bg-[#F04478] text-white'
                                : 'bg-[#FFF0F3] text-[#171316]/60 hover:bg-[#F9C3D0]'
                            }`}
                          >
                            {lvl}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </ScrapbookCard>

          {/* Energy & Sleep */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Energy */}
            <ScrapbookCard variant="ivory">
              <div className="flex items-center gap-2 mb-3">
                <BatteryCharging className="w-4 h-4 text-[#171316]" />
                <h4 className="font-bold text-sm text-[#171316]">Energy Battery</h4>
              </div>

              <div className="grid grid-cols-5 gap-1.5 text-center">
                {[
                  { key: 'very_low', label: 'Very Low', icon: '🪫' },
                  { key: 'low', label: 'Low', icon: '🔋' },
                  { key: 'normal', label: 'Normal', icon: '⚡' },
                  { key: 'high', label: 'High', icon: '✨' },
                  { key: 'very_high', label: 'Vibrant', icon: '💖' },
                ].map((item) => (
                  <button
                    type="button"
                    key={item.key}
                    onClick={() => setEnergy(item.key)}
                    className={`p-2 rounded-xl border-2 text-[10px] font-bold transition-all ${
                      energy === item.key
                        ? 'bg-[#F04478] text-white border-[#171316] shadow-scrapbook-sm'
                        : 'bg-white text-[#171316] border-[#171316]/15 hover:border-[#171316]'
                    }`}
                  >
                    <span className="text-base block mb-0.5">{item.icon}</span>
                    <span>{item.label}</span>
                  </button>
                ))}
              </div>
            </ScrapbookCard>

            {/* Sleep */}
            <ScrapbookCard variant="ivory">
              <div className="flex items-center gap-2 mb-3">
                <Moon className="w-4 h-4 text-[#171316]" />
                <h4 className="font-bold text-sm text-[#171316]">Sleep Rest</h4>
              </div>

              <div className="space-y-3 text-xs">
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-[#171316]">Sleep Duration:</span>
                  <div className="flex items-center gap-2">
                    <input
                      type="number"
                      step="0.5"
                      min="0"
                      max="20"
                      value={sleepHours}
                      onChange={(e) => setSleepHours(e.target.value)}
                      className="w-16 px-2 py-1 rounded-lg border-2 border-[#171316] text-center font-bold"
                    />
                    <span className="text-[#171316]/70">hours</span>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <span className="font-semibold text-[#171316]">Quality:</span>
                  <div className="flex items-center gap-1">
                    {['poor', 'fair', 'good', 'excellent'].map((q) => (
                      <button
                        type="button"
                        key={q}
                        onClick={() => setSleepQuality(q)}
                        className={`px-2 py-1 rounded-md text-[10px] font-bold capitalize transition-all ${
                          sleepQuality === q
                            ? 'bg-[#171316] text-white'
                            : 'bg-white border border-[#171316]/20'
                        }`}
                      >
                        {q}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </ScrapbookCard>
          </div>

          {/* Cravings & Notes */}
          <ScrapbookCard variant="default">
            <div className="flex items-center gap-2 mb-3">
              <Cookie className="w-4 h-4 text-[#F04478]" />
              <h4 className="font-bold text-sm text-[#171316]">Specific Cravings</h4>
            </div>

            <div className="flex flex-wrap gap-2 mb-6">
              {CRAVINGS_LIST.map((c) => {
                const isSelected = cravings.includes(c);
                return (
                  <button
                    type="button"
                    key={c}
                    onClick={() => toggleCraving(c)}
                    className={`px-3 py-1.5 rounded-xl border text-xs font-semibold transition-all ${
                      isSelected
                        ? 'bg-[#F04478] text-white border-[#171316] shadow-scrapbook-sm'
                        : 'bg-[#FFF9F5] text-[#171316] border-[#171316]/20'
                    }`}
                  >
                    {c} {isSelected ? '✓' : ''}
                  </button>
                );
              })}
            </div>

            <div>
              <label className="block font-bold text-xs sm:text-sm text-[#171316] mb-1.5">
                Physical Notes & Comfort Measures
              </label>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Hot water bag, gentle yoga, warm tea, favorite chocolate..."
                rows={2}
                className="w-full px-4 py-2.5 rounded-xl border-2 border-[#171316] bg-[#FFF9F5] text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-[#F04478]"
              />
            </div>

            <div className="pt-4 border-t border-[#171316]/10 flex justify-end mt-4">
              <button
                type="submit"
                disabled={loading}
                className="px-6 py-2.5 rounded-xl bg-[#F04478] text-white font-bold text-xs sm:text-sm border-2 border-[#171316] shadow-scrapbook hover:-translate-y-0.5 transition-all flex items-center gap-2"
              >
                <Save className="w-4 h-4" />
                <span>{loading ? 'Saving...' : 'Save Wellness Check-In ♡'}</span>
              </button>
            </div>
          </ScrapbookCard>
        </form>
      </div>
    </div>
  );
};
