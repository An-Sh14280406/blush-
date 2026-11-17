import React, { useState, useEffect } from 'react';
import { useOutletContext, Link } from 'react-router-dom';
import { api } from '../services/api';
import { Header } from '../components/Header';
import { ScrapbookCard } from '../components/ScrapbookCard';
import { BowIcon, StrawberryIcon, HeartSticker } from '../components/ScrapbookDecorations';
import {
  Sparkles,
  Heart,
  Save,
  CheckCircle,
  AlertCircle,
  History,
  Calendar,
} from 'lucide-react';
import { format } from 'date-fns';

const POSITIVE_MOODS = [
  'Happy',
  'Excited',
  'Calm',
  'Confident',
  'Relaxed',
  'Affectionate',
  'Playful',
  'Flirty',
  'Romantic',
  'Sociable',
];

const OTHER_MOODS = [
  'Sad',
  'Irritated',
  'Anxious',
  'Stressed',
  'Lonely',
  'Overwhelmed',
  'Emotionally sensitive',
  'Low energy',
];

export const MoodTrackerPage = () => {
  const { openLogPeriod } = useOutletContext();
  const [selectedDate, setSelectedDate] = useState(format(new Date(), 'yyyy-MM-dd'));
  const [selectedMoods, setSelectedMoods] = useState([]);
  const [intensity, setIntensity] = useState(3);
  const [notes, setNotes] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  // Load existing mood for date if present
  useEffect(() => {
    const fetchDayMood = async () => {
      try {
        const res = await api.getMoods({ startDate: selectedDate, endDate: selectedDate });
        if (res.success && res.data.length > 0) {
          const entry = res.data[0];
          setSelectedMoods(entry.moods || []);
          setIntensity(entry.intensity || 3);
          setNotes(entry.notes || '');
        } else {
          setSelectedMoods([]);
          setIntensity(3);
          setNotes('');
        }
      } catch (err) {
        console.error(err);
      }
    };
    fetchDayMood();
  }, [selectedDate]);

  const toggleMood = (mood) => {
    setSelectedMoods((prev) =>
      prev.includes(mood) ? prev.filter((m) => m !== mood) : [...prev, mood]
    );
  };

  const handleSave = async (e) => {
    e.preventDefault();
    if (selectedMoods.length === 0) {
      setError('Please pick at least one mood tag that reflects your feeling');
      return;
    }

    setLoading(true);
    setError('');

    try {
      await api.saveMood({
        date: selectedDate,
        moods: selectedMoods,
        intensity: Number(intensity),
        notes,
      });
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch (err) {
      setError(err.message || 'Failed to record mood');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <Header onLogPeriodClick={openLogPeriod} />

      <div className="max-w-4xl mx-auto space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <span className="text-xs font-semibold uppercase tracking-wider text-[#C51F46]">
              Intimate Mood Scrapbook
            </span>
            <h3 className="text-3xl sm:text-4xl font-bold font-editorial text-[#171316]">
              Your Feelings Today ♡
            </h3>
            <p className="text-xs sm:text-sm text-[#171316]/70">
              Check in with your heart and emotions without judgment.
            </p>
          </div>

          <Link
            to="/moods/history"
            className="self-start sm:self-center px-4 py-2 rounded-xl bg-white border-2 border-[#171316] shadow-scrapbook-sm text-xs font-bold hover:bg-[#FFF0F3] transition-all flex items-center gap-2"
          >
            <History className="w-4 h-4 text-[#F04478]" />
            <span>View Mood Journal Archive</span>
          </Link>
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
            <span>Saved in Ananya's mood scrapbook! ♡</span>
          </div>
        )}

        <form onSubmit={handleSave} className="space-y-6">
          {/* Date Picker Card */}
          <ScrapbookCard variant="default">
            <div className="flex items-center justify-between gap-4">
              <div>
                <label className="block font-bold text-xs sm:text-sm text-[#171316]">
                  Journal Entry Date
                </label>
                <span className="text-[11px] text-[#171316]/60">
                  Select today or choose a past date to backfill
                </span>
              </div>
              <input
                type="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                className="px-4 py-2 rounded-xl border-2 border-[#171316] bg-[#FFF9F5] font-bold text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-[#F04478]"
              />
            </div>
          </ScrapbookCard>

          {/* Positive Feelings Tags */}
          <ScrapbookCard variant="pink">
            <div className="flex items-center gap-2 mb-3">
              <Sparkles className="w-4 h-4 text-[#C51F46]" />
              <h4 className="font-bold text-sm sm:text-base text-[#171316]">
                Bright & Uplifting Feelings
              </h4>
            </div>

            <div className="flex flex-wrap gap-2.5">
              {POSITIVE_MOODS.map((mood) => {
                const isSelected = selectedMoods.includes(mood);
                return (
                  <button
                    type="button"
                    key={mood}
                    onClick={() => toggleMood(mood)}
                    className={`px-4 py-2 rounded-xl border-2 text-xs sm:text-sm font-medium transition-all ${
                      isSelected
                        ? 'bg-[#F04478] text-white border-[#171316] shadow-scrapbook-sm font-bold scale-105'
                        : 'bg-white text-[#171316] border-[#171316]/20 hover:border-[#171316]'
                    }`}
                  >
                    {mood} {isSelected ? '♡' : ''}
                  </button>
                );
              })}
            </div>
          </ScrapbookCard>

          {/* Tender & Other Feelings Tags */}
          <ScrapbookCard variant="ivory">
            <div className="flex items-center gap-2 mb-3">
              <Heart className="w-4 h-4 text-[#171316]" />
              <h4 className="font-bold text-sm sm:text-base text-[#171316]">
                Tender, Sensitive & Complex Feelings
              </h4>
            </div>

            <div className="flex flex-wrap gap-2.5">
              {OTHER_MOODS.map((mood) => {
                const isSelected = selectedMoods.includes(mood);
                return (
                  <button
                    type="button"
                    key={mood}
                    onClick={() => toggleMood(mood)}
                    className={`px-4 py-2 rounded-xl border-2 text-xs sm:text-sm font-medium transition-all ${
                      isSelected
                        ? 'bg-[#171316] text-[#FFF4E9] border-[#171316] shadow-scrapbook-sm font-bold scale-105'
                        : 'bg-white text-[#171316] border-[#171316]/20 hover:border-[#171316]'
                    }`}
                  >
                    {mood} {isSelected ? '✓' : ''}
                  </button>
                );
              })}
            </div>
          </ScrapbookCard>

          {/* Intensity Slider & Personal Notes */}
          <ScrapbookCard variant="default">
            {/* Intensity */}
            <div className="mb-6">
              <div className="flex items-center justify-between mb-2">
                <label className="font-bold text-xs sm:text-sm text-[#171316]">
                  Emotional Intensity Level
                </label>
                <span className="text-xs font-bold text-[#C51F46] px-2.5 py-0.5 rounded-full bg-[#FFF0F3] border border-[#F04478]/30">
                  {intensity} / 5 •{' '}
                  {intensity === 1
                    ? 'Very Subtle'
                    : intensity === 2
                    ? 'Gentle'
                    : intensity === 3
                    ? 'Moderate'
                    : intensity === 4
                    ? 'Strong'
                    : 'Intense'}
                </span>
              </div>

              <input
                type="range"
                min="1"
                max="5"
                value={intensity}
                onChange={(e) => setIntensity(Number(e.target.value))}
                className="w-full h-3 bg-[#F9C3D0] rounded-lg appearance-none cursor-pointer accent-[#F04478]"
              />

              <div className="flex justify-between text-[10px] text-[#171316]/60 mt-1 font-semibold">
                <span>1 (Subtle)</span>
                <span>2 (Gentle)</span>
                <span>3 (Moderate)</span>
                <span>4 (Noticeable)</span>
                <span>5 (Very Intense)</span>
              </div>
            </div>

            {/* Notes */}
            <div>
              <label className="block font-bold text-xs sm:text-sm text-[#171316] mb-1.5">
                Dear Diary... (Personal Reflection)
              </label>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="What made you feel this way? Any thoughts, little moments or memories you want to preserve..."
                rows={3}
                className="w-full px-4 py-3 rounded-2xl border-2 border-[#171316] bg-[#FFF9F5] focus:outline-none focus:ring-2 focus:ring-[#F04478] text-xs sm:text-sm"
              />
            </div>

            {/* Submit */}
            <div className="pt-6 border-t border-[#171316]/10 flex justify-end">
              <button
                type="submit"
                disabled={loading}
                className="px-6 py-3 rounded-xl bg-[#F04478] text-white font-bold text-xs sm:text-sm border-2 border-[#171316] shadow-scrapbook hover:-translate-y-0.5 transition-all flex items-center gap-2"
              >
                <Save className="w-4 h-4" />
                <span>{loading ? 'Saving...' : 'Save Mood Entry ♡'}</span>
              </button>
            </div>
          </ScrapbookCard>
        </form>
      </div>
    </div>
  );
};
