import React, { useState, useEffect } from 'react';
import { useOutletContext } from 'react-router-dom';
import { api } from '../services/api';
import { Header } from '../components/Header';
import { ScrapbookCard } from '../components/ScrapbookCard';
import { DisclaimerAlert } from '../components/DisclaimerAlert';
import { BowIcon, StrawberryIcon, HeartSticker } from '../components/ScrapbookDecorations';
import {
  ChevronLeft,
  ChevronRight,
  Plus,
  Droplets,
  Sparkles,
  Activity,
  Heart,
  Calendar as CalendarIcon,
} from 'lucide-react';
import {
  format,
  addMonths,
  subMonths,
  startOfMonth,
  endOfMonth,
  startOfWeek,
  endOfWeek,
  eachDayOfInterval,
  isSameMonth,
  isSameDay,
  isWithinInterval,
  parseISO,
} from 'date-fns';

export const PeriodCalendarPage = () => {
  const { openLogPeriod, refreshTrigger } = useOutletContext();
  const [currentMonth, setCurrentMonth] = useState(new Date('2026-11-01T00:00:00Z'));
  const [selectedDate, setSelectedDate] = useState(new Date('2026-11-17T00:00:00Z'));
  const [periods, setPeriods] = useState([]);
  const [predictions, setPredictions] = useState(null);
  const [moods, setMoods] = useState([]);
  const [symptoms, setSymptoms] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [periodsRes, predRes, moodsRes, symptomsRes] = await Promise.all([
        api.getPeriods(),
        api.getPeriodPredictions(),
        api.getMoods(),
        api.getSymptoms(),
      ]);

      if (periodsRes.success) setPeriods(periodsRes.data || []);
      if (predRes.success) setPredictions(predRes.data);
      if (moodsRes.success) setMoods(moodsRes.data || []);
      if (symptomsRes.success) setSymptoms(symptomsRes.data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [refreshTrigger]);

  const monthStart = startOfMonth(currentMonth);
  const monthEnd = endOfMonth(monthStart);
  const startDate = startOfWeek(monthStart);
  const endDate = endOfWeek(monthEnd);
  const calendarDays = eachDayOfInterval({ start: startDate, end: endDate });

  // Day status helper
  const getDayInfo = (day) => {
    const dayStr = format(day, 'yyyy-MM-dd');

    // Check confirmed period
    let isConfirmedPeriod = false;
    let periodRecord = null;
    periods.forEach((p) => {
      const pStart = format(new Date(p.startDate), 'yyyy-MM-dd');
      const pEnd = p.endDate ? format(new Date(p.endDate), 'yyyy-MM-dd') : pStart;
      if (dayStr >= pStart && dayStr <= pEnd) {
        isConfirmedPeriod = true;
        periodRecord = p;
      }
    });

    // Check predicted period
    let isPredictedPeriod = false;
    const nextPred = predictions?.nextPeriodPrediction;
    if (nextPred && nextPred.predictedStartDate && nextPred.predictedEndDate) {
      if (dayStr >= nextPred.predictedStartDate && dayStr <= nextPred.predictedEndDate) {
        isPredictedPeriod = true;
      }
    }

    // Check fertile window & ovulation
    let isFertile = false;
    let isOvulation = false;
    const fertile = predictions?.fertileWindow;
    if (fertile) {
      if (fertile.startDate && fertile.endDate && dayStr >= fertile.startDate && dayStr <= fertile.endDate) {
        isFertile = true;
      }
      if (fertile.ovulationDate && dayStr === fertile.ovulationDate) {
        isOvulation = true;
      }
    }

    // Check logged mood & symptom
    const dayMood = moods.find((m) => m.date === dayStr);
    const daySymptom = symptoms.find((s) => s.date === dayStr);

    return {
      isConfirmedPeriod,
      isPredictedPeriod,
      isFertile,
      isOvulation,
      periodRecord,
      dayMood,
      daySymptom,
    };
  };

  const selectedDayInfo = getDayInfo(selectedDate);
  const selectedDayStr = format(selectedDate, 'yyyy-MM-dd');

  return (
    <div>
      <Header onLogPeriodClick={openLogPeriod} />

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Calendar View */}
        <div className="lg:col-span-8">
          <ScrapbookCard variant="default">
            {/* Calendar Controls */}
            <div className="flex items-center justify-between mb-6 pb-4 border-b border-[#171316]/10">
              <div className="flex items-center gap-3">
                <CalendarIcon className="w-6 h-6 text-[#F04478]" />
                <h3 className="text-2xl sm:text-3xl font-bold font-editorial text-[#171316]">
                  {format(currentMonth, 'MMMM yyyy')}
                </h3>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => setCurrentMonth(subMonths(currentMonth, 1))}
                  className="p-2 rounded-xl border border-[#171316]/20 hover:bg-[#FFF0F3] transition-colors"
                  title="Previous month"
                >
                  <ChevronLeft className="w-4 h-4 text-[#171316]" />
                </button>
                <button
                  onClick={() => setCurrentMonth(new Date())}
                  className="px-3 py-1.5 rounded-xl border border-[#171316]/20 font-bold text-xs hover:bg-[#FFF0F3]"
                >
                  Today
                </button>
                <button
                  onClick={() => setCurrentMonth(addMonths(currentMonth, 1))}
                  className="p-2 rounded-xl border border-[#171316]/20 hover:bg-[#FFF0F3] transition-colors"
                  title="Next month"
                >
                  <ChevronRight className="w-4 h-4 text-[#171316]" />
                </button>
              </div>
            </div>

            {/* Weekday Labels */}
            <div className="grid grid-cols-7 gap-2 mb-2 text-center text-xs font-bold text-[#171316]/60 uppercase tracking-wider">
              {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((d) => (
                <div key={d} className="py-1">
                  {d}
                </div>
              ))}
            </div>

            {/* Days Grid */}
            <div className="grid grid-cols-7 gap-2">
              {calendarDays.map((day) => {
                const info = getDayInfo(day);
                const isSelected = isSameDay(day, selectedDate);
                const isCurrentMonth = isSameMonth(day, currentMonth);

                let cellBg = 'bg-white hover:bg-[#FFF9F5]';
                let textColor = isCurrentMonth ? 'text-[#171316]' : 'text-[#171316]/30';

                if (info.isConfirmedPeriod) {
                  cellBg = 'bg-[#F04478] text-white hover:bg-[#C51F46] font-bold shadow-sm';
                  textColor = 'text-white';
                } else if (info.isPredictedPeriod) {
                  cellBg = 'bg-[#FFF0F3] border border-dashed border-[#F04478] text-[#C51F46]';
                } else if (info.isOvulation) {
                  cellBg = 'bg-[#DCC8F5] text-[#171316] font-bold border border-[#171316]/30';
                } else if (info.isFertile) {
                  cellBg = 'bg-[#FFF4E9] border border-[#DCC8F5] text-[#171316]';
                }

                return (
                  <button
                    key={day.toISOString()}
                    onClick={() => setSelectedDate(day)}
                    className={`h-14 sm:h-16 p-1.5 rounded-xl border transition-all flex flex-col justify-between items-center relative ${cellBg} ${
                      isSelected ? 'ring-2 ring-[#171316] ring-offset-2 scale-105 z-10' : 'border-[#171316]/10'
                    }`}
                  >
                    <span className={`text-xs font-bold ${textColor}`}>
                      {format(day, 'd')}
                    </span>

                    {/* Indicators */}
                    <div className="flex items-center gap-1">
                      {info.isConfirmedPeriod && (
                        <div className="w-1.5 h-1.5 rounded-full bg-white" />
                      )}
                      {info.isOvulation && (
                        <span className="text-[10px]">🌸</span>
                      )}
                      {info.dayMood && !info.isConfirmedPeriod && (
                        <div className="w-1.5 h-1.5 rounded-full bg-[#FF765F]" />
                      )}
                      {info.daySymptom && !info.isConfirmedPeriod && (
                        <div className="w-1.5 h-1.5 rounded-full bg-[#C5D83C]" />
                      )}
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Legend */}
            <div className="mt-6 pt-4 border-t border-[#171316]/10 flex flex-wrap items-center gap-4 text-xs text-[#171316]/80 font-medium">
              <div className="flex items-center gap-2">
                <span className="w-3.5 h-3.5 rounded-md bg-[#F04478] inline-block border border-[#171316]/20" />
                <span>Confirmed Period</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-3.5 h-3.5 rounded-md bg-[#FFF0F3] border border-dashed border-[#F04478] inline-block" />
                <span>Predicted Period</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-3.5 h-3.5 rounded-md bg-[#FFF4E9] border border-[#DCC8F5] inline-block" />
                <span>Fertile Window</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-3.5 h-3.5 rounded-md bg-[#DCC8F5] inline-block border border-[#171316]/20" />
                <span>Estimated Ovulation</span>
              </div>
            </div>
          </ScrapbookCard>
        </div>

        {/* Selected Date Inspector Sidebar */}
        <div className="lg:col-span-4 space-y-6">
          <ScrapbookCard variant="pink">
            <div className="flex items-center justify-between mb-4">
              <span className="text-xs font-bold uppercase tracking-wider text-[#C51F46]">
                Day Inspector
              </span>
              <BowIcon className="w-5 h-5" />
            </div>

            <h4 className="text-2xl font-bold font-editorial text-[#171316] mb-1">
              {format(selectedDate, 'EEEE')}
            </h4>
            <p className="text-xs text-[#171316]/70 mb-5">
              {format(selectedDate, 'MMMM d, yyyy')}
            </p>

            {/* Status overview */}
            <div className="space-y-3 mb-6 text-xs">
              {selectedDayInfo.isConfirmedPeriod && (
                <div className="p-3 rounded-xl bg-white border border-[#C51F46] text-[#C51F46] font-bold flex items-center justify-between">
                  <span>Period Day</span>
                  <span className="capitalize">{selectedDayInfo.periodRecord?.intensity || 'Flow'}</span>
                </div>
              )}

              {selectedDayInfo.isPredictedPeriod && (
                <div className="p-3 rounded-xl bg-white/80 border border-dashed border-[#F04478] text-[#C51F46]">
                  <span className="font-bold">Predicted Period Window</span>
                  <p className="text-[10px] text-[#171316]/70 mt-0.5">Based on your historical rhythm</p>
                </div>
              )}

              {selectedDayInfo.isOvulation && (
                <div className="p-3 rounded-xl bg-[#DCC8F5] border border-[#171316]/20 font-bold text-[#171316]">
                  🌸 Estimated Ovulation Day
                </div>
              )}

              {selectedDayInfo.isFertile && !selectedDayInfo.isOvulation && (
                <div className="p-3 rounded-xl bg-white border border-[#DCC8F5] text-[#171316]">
                  <span className="font-bold">Estimated Fertile Window</span>
                </div>
              )}

              {selectedDayInfo.dayMood && (
                <div className="p-3 rounded-xl bg-white border border-[#171316]/10">
                  <span className="font-bold text-[#171316] block mb-1">Moods Logged:</span>
                  <div className="flex flex-wrap gap-1">
                    {selectedDayInfo.dayMood.moods.map((m) => (
                      <span key={m} className="px-2 py-0.5 bg-[#FFF0F3] rounded text-[10px] font-semibold text-[#C51F46]">
                        {m}
                      </span>
                    ))}
                  </div>
                  {selectedDayInfo.dayMood.notes && (
                    <p className="text-[11px] text-[#171316]/70 italic mt-1.5">
                      "{selectedDayInfo.dayMood.notes}"
                    </p>
                  )}
                </div>
              )}

              {selectedDayInfo.daySymptom && (
                <div className="p-3 rounded-xl bg-white border border-[#171316]/10">
                  <span className="font-bold text-[#171316] block mb-1">Symptoms:</span>
                  <div className="flex flex-wrap gap-1">
                    {selectedDayInfo.daySymptom.symptoms.map((s) => (
                      <span key={s.name || s} className="px-2 py-0.5 bg-[#FFF4E9] rounded text-[10px] font-semibold">
                        {s.name || s} ({s.intensity || 'moderate'})
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {!selectedDayInfo.isConfirmedPeriod &&
                !selectedDayInfo.isPredictedPeriod &&
                !selectedDayInfo.isFertile &&
                !selectedDayInfo.dayMood &&
                !selectedDayInfo.daySymptom && (
                  <p className="text-xs text-[#171316]/60 italic py-2">
                    No cycle events or journal entries recorded for this date.
                  </p>
                )}
            </div>

            <button
              onClick={openLogPeriod}
              className="w-full py-2.5 rounded-xl bg-[#F04478] text-white font-bold text-xs border-2 border-[#171316] shadow-scrapbook-sm hover:-translate-y-0.5 transition-all flex items-center justify-center gap-2"
            >
              <Plus className="w-4 h-4" />
              <span>Log Period For This Date</span>
            </button>
          </ScrapbookCard>

          <DisclaimerAlert className="text-[11px]" />
        </div>
      </div>
    </div>
  );
};
