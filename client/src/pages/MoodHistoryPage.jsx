import React, { useState, useEffect } from 'react';
import { useOutletContext, Link } from 'react-router-dom';
import { api } from '../services/api';
import { Header } from '../components/Header';
import { ScrapbookCard } from '../components/ScrapbookCard';
import { BowIcon, StrawberryIcon, HeartSticker } from '../components/ScrapbookDecorations';
import { Sparkles, Trash2, ArrowLeft, Plus, Calendar } from 'lucide-react';
import { format } from 'date-fns';

export const MoodHistoryPage = () => {
  const { openLogPeriod } = useOutletContext();
  const [moods, setMoods] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchMoods = async () => {
    setLoading(true);
    try {
      const res = await api.getMoods();
      if (res.success) {
        setMoods(res.data || []);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMoods();
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this mood journal entry?')) return;
    try {
      await api.deleteMood(id);
      fetchMoods();
    } catch (err) {
      alert(err.message || 'Failed to delete');
    }
  };

  return (
    <div>
      <Header onLogPeriodClick={openLogPeriod} />

      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <Link
              to="/moods"
              className="p-2 rounded-xl border border-[#171316]/20 hover:bg-[#FFF0F3]"
            >
              <ArrowLeft className="w-5 h-5 text-[#171316]" />
            </Link>
            <div>
              <span className="text-xs font-semibold uppercase tracking-wider text-[#C51F46]">
                Archive & Reflections
              </span>
              <h3 className="text-3xl font-bold font-editorial text-[#171316]">
                Mood Journal Archive ♡
              </h3>
            </div>
          </div>

          <Link
            to="/moods"
            className="self-start sm:self-center px-4 py-2.5 rounded-xl bg-[#F04478] text-white font-bold text-xs sm:text-sm border-2 border-[#171316] shadow-scrapbook-sm hover:-translate-y-0.5 transition-all flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            <span>New Mood Entry</span>
          </Link>
        </div>

        {moods.length === 0 ? (
          <ScrapbookCard variant="ivory" className="text-center py-12">
            <Sparkles className="w-10 h-10 text-[#F04478] mx-auto mb-2 opacity-60" />
            <h4 className="text-xl font-bold font-editorial text-[#171316] mb-1">
              Your mood journal is empty
            </h4>
            <p className="text-xs text-[#171316]/70 mb-4">
              Start capturing how you feel to discover your emotional rhythms.
            </p>
            <Link
              to="/moods"
              className="px-4 py-2 rounded-xl bg-[#F04478] text-white font-bold text-xs border-2 border-[#171316] shadow-scrapbook-sm"
            >
              + Log Today's Mood
            </Link>
          </ScrapbookCard>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {moods.map((m) => (
              <div
                key={m._id}
                className="p-5 rounded-2xl bg-white border-2 border-[#171316] shadow-scrapbook relative flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-bold text-sm text-[#C51F46] flex items-center gap-1.5">
                      <Calendar className="w-3.5 h-3.5" />
                      {m.date}
                    </span>
                    <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-[#FFF0F3] text-[#F04478] border border-[#F04478]/30">
                      Intensity {m.intensity}/5
                    </span>
                  </div>

                  <div className="flex flex-wrap gap-1.5 mb-3">
                    {(m.moods || []).map((tag) => (
                      <span
                        key={tag}
                        className="px-2.5 py-1 rounded-lg bg-[#FFF9F5] text-[#171316] text-xs font-semibold border border-[#171316]/15"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>

                  {m.notes && (
                    <p className="text-xs text-[#171316]/80 italic p-3 rounded-xl bg-[#FFF9F5] border border-[#171316]/10 mb-2">
                      "{m.notes}"
                    </p>
                  )}
                </div>

                <div className="flex justify-end pt-2 border-t border-[#171316]/10 mt-2">
                  <button
                    onClick={() => handleDelete(m._id)}
                    className="p-1.5 text-red-500 hover:bg-red-50 rounded-lg transition-colors text-xs flex items-center gap-1"
                    title="Delete log"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>Delete</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
