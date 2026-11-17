import React, { useState, useEffect } from 'react';
import { useOutletContext } from 'react-router-dom';
import { api } from '../services/api';
import { Header } from '../components/Header';
import { ScrapbookCard } from '../components/ScrapbookCard';
import { AddEditPeriodModal } from '../components/AddEditPeriodModal';
import { BowIcon, StrawberryIcon, HeartSticker } from '../components/ScrapbookDecorations';
import {
  CalendarDays,
  Plus,
  Edit2,
  Trash2,
  Droplet,
  AlertCircle,
  Clock,
  Sparkles,
} from 'lucide-react';
import { format, differenceInCalendarDays } from 'date-fns';

export const PeriodHistoryPage = () => {
  const { openLogPeriod, refreshTrigger } = useOutletContext();
  const [periods, setPeriods] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingPeriod, setEditingPeriod] = useState(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  const fetchPeriods = async () => {
    setLoading(true);
    try {
      const res = await api.getPeriods();
      if (res.success) {
        setPeriods(res.data || []);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPeriods();
  }, [refreshTrigger]);

  const handleEdit = (p) => {
    setEditingPeriod(p);
    setIsEditModalOpen(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this period entry?')) return;
    try {
      await api.deletePeriod(id);
      fetchPeriods();
    } catch (err) {
      alert(err.message || 'Failed to delete');
    }
  };

  // Sort chronological for interval calculation
  const sortedChrono = [...periods].sort(
    (a, b) => new Date(a.startDate).getTime() - new Date(b.startDate).getTime()
  );

  return (
    <div>
      <Header onLogPeriodClick={openLogPeriod} />

      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xs font-semibold uppercase tracking-wider text-[#C51F46]">
                Archive & Logged Records
              </span>
            </div>
            <h3 className="text-3xl font-bold font-editorial text-[#171316]">
              Period History & Cycles ♡
            </h3>
            <p className="text-xs sm:text-sm text-[#171316]/70">
              Every confirmed flow and cycle interval you have recorded.
            </p>
          </div>

          <button
            onClick={openLogPeriod}
            className="self-start sm:self-center px-4 py-2.5 rounded-xl bg-[#F04478] text-white font-bold text-xs sm:text-sm border-2 border-[#171316] shadow-scrapbook-sm hover:-translate-y-0.5 transition-all flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            <span>Add Period Record</span>
          </button>
        </div>

        {/* History List */}
        {periods.length === 0 ? (
          <ScrapbookCard variant="ivory" className="text-center py-12">
            <Droplet className="w-12 h-12 text-[#F04478] mx-auto mb-3 opacity-60" />
            <h4 className="text-xl font-bold font-editorial text-[#171316] mb-1">
              No period records logged yet
            </h4>
            <p className="text-xs text-[#171316]/70 mb-4 max-w-sm mx-auto">
              Start your wellness scrapbook by recording your last period start date.
            </p>
            <button
              onClick={openLogPeriod}
              className="px-5 py-2 rounded-xl bg-[#F04478] text-white font-bold text-xs border-2 border-[#171316] shadow-scrapbook-sm"
            >
              + Log First Period
            </button>
          </ScrapbookCard>
        ) : (
          <div className="space-y-4">
            {periods.map((p, idx) => {
              const startFormatted = format(new Date(p.startDate), 'MMMM d, yyyy');
              const endFormatted = p.endDate ? format(new Date(p.endDate), 'MMMM d, yyyy') : null;

              // Check if there was a previous confirmed start to show interval
              let cycleLengthFromPrevious = null;
              const curIdx = sortedChrono.findIndex((item) => String(item._id) === String(p._id));
              if (curIdx > 0) {
                const prev = sortedChrono[curIdx - 1];
                if (p.isPeriodStart && prev.isPeriodStart) {
                  const days = differenceInCalendarDays(new Date(p.startDate), new Date(prev.startDate));
                  if (days >= 18 && days <= 55) {
                    cycleLengthFromPrevious = days;
                  }
                }
              }

              return (
                <div
                  key={p._id}
                  className="p-5 rounded-2xl bg-white border-2 border-[#171316] shadow-scrapbook transition-all hover:-translate-y-0.5 relative"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="space-y-1.5">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="text-lg sm:text-xl font-bold font-editorial text-[#171316]">
                          {startFormatted}
                          {endFormatted ? ` → ${endFormatted}` : ''}
                        </span>

                        <span
                          className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                            p.intensity === 'heavy'
                              ? 'bg-[#C51F46] text-white'
                              : p.intensity === 'medium'
                              ? 'bg-[#F04478] text-white'
                              : 'bg-[#F9C3D0] text-[#C51F46]'
                          }`}
                        >
                          {p.intensity} Flow
                        </span>

                        {p.isSpotting && (
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-amber-100 text-amber-800 border border-amber-300">
                            Spotting
                          </span>
                        )}

                        {!p.isPeriodStart && (
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-purple-100 text-purple-800 border border-purple-300">
                            Observation Only (Not Cycle Start)
                          </span>
                        )}

                        {p.isUncertain && (
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-gray-100 text-gray-700 border border-gray-300">
                            Uncertain Date
                          </span>
                        )}
                      </div>

                      <div className="flex flex-wrap items-center gap-4 text-xs text-[#171316]/70">
                        {p.durationDays ? (
                          <span className="flex items-center gap-1 font-medium">
                            <Clock className="w-3.5 h-3.5 text-[#F04478]" />
                            Duration: {p.durationDays} days
                          </span>
                        ) : (
                          <span className="italic text-[#171316]/50">End date unknown</span>
                        )}

                        {cycleLengthFromPrevious && (
                          <span className="px-2.5 py-0.5 rounded-md bg-[#FFF0F3] text-[#C51F46] font-bold text-[11px] border border-[#F04478]/30">
                            Cycle length: {cycleLengthFromPrevious} days
                          </span>
                        )}
                      </div>

                      {p.notes && (
                        <p className="text-xs text-[#171316]/80 italic pt-1 border-t border-[#171316]/10 mt-2">
                          "{p.notes}"
                        </p>
                      )}
                    </div>

                    <div className="flex items-center gap-2 self-end sm:self-center">
                      <button
                        onClick={() => handleEdit(p)}
                        className="p-2 rounded-xl border border-[#171316]/20 hover:bg-[#FFF0F3] hover:text-[#C51F46] transition-colors"
                        title="Edit entry"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(p._id)}
                        className="p-2 rounded-xl border border-red-200 text-red-600 hover:bg-red-50 transition-colors"
                        title="Delete entry"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      <AddEditPeriodModal
        isOpen={isEditModalOpen}
        onClose={() => {
          setIsEditModalOpen(false);
          setEditingPeriod(null);
        }}
        onSuccess={fetchPeriods}
        periodToEdit={editingPeriod}
      />
    </div>
  );
};
