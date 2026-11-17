import React, { useState, useEffect } from 'react';
import { useOutletContext, Link } from 'react-router-dom';
import { api } from '../services/api';
import { Header } from '../components/Header';
import { ScrapbookCard } from '../components/ScrapbookCard';
import { DisclaimerAlert } from '../components/DisclaimerAlert';
import { BowIcon, StrawberryIcon, HeartSticker, ButterflyIcon } from '../components/ScrapbookDecorations';
import {
  CalendarHeart,
  Sparkles,
  Info,
  ShieldAlert,
  ArrowRight,
  Droplet,
  Flower2,
} from 'lucide-react';

export const FertilityCalendarPage = () => {
  const { openLogPeriod, refreshTrigger } = useOutletContext();
  const [predictions, setPredictions] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPreds = async () => {
      setLoading(true);
      try {
        const res = await api.getPeriodPredictions();
        if (res.success) {
          setPredictions(res.data);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchPreds();
  }, [refreshTrigger]);

  const fertile = predictions?.fertileWindow;
  const nextPred = predictions?.nextPeriodPrediction;

  return (
    <div>
      <Header onLogPeriodClick={openLogPeriod} />

      <div className="space-y-8">
        <div>
          <span className="text-xs font-semibold uppercase tracking-wider text-[#C51F46]">
            Cycle Phases & Fertility Estimation
          </span>
          <h3 className="text-3xl sm:text-4xl font-bold font-editorial text-[#171316]">
            Fertility & Ovulation Insights ♡
          </h3>
          <p className="text-xs sm:text-sm text-[#171316]/70">
            Gentle mathematical windows calculated from your personal historical cycle length.
          </p>
        </div>

        {/* Primary Required Clinical Disclaimer */}
        <div className="p-5 rounded-2xl bg-[#FFF9F5] border-2 border-[#C51F46] shadow-scrapbook-pink text-xs sm:text-sm text-[#171316] space-y-2">
          <div className="flex items-center gap-2">
            <ShieldAlert className="w-5 h-5 text-[#C51F46] shrink-0" />
            <h4 className="font-bold text-[#C51F46] uppercase tracking-wider">
              Essential Clinical Transparency
            </h4>
          </div>
          <p className="leading-relaxed text-[#171316]/90">
            {fertile?.clinicalDisclaimer ||
              'Calendar-based estimates cannot confirm ovulation or pinpoint fertile days with absolute medical certainty. Never use predicted non-fertile days as contraception or natural family planning without clinical consultation.'}
          </p>
        </div>

        {/* Estimated Windows Showcase */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Fertile Window Card */}
          <ScrapbookCard variant="pink">
            <div className="flex items-center justify-between mb-4">
              <span className="text-xs font-bold uppercase tracking-wider text-[#C51F46]">
                Estimated Fertile Window
              </span>
              <ButterflyIcon className="w-6 h-6" />
            </div>

            <div className="mb-4">
              <span className="text-4xl sm:text-5xl font-bold font-editorial text-[#171316] block">
                {fertile?.startDate || 'Nov 14'} → {fertile?.endDate || 'Nov 20'}
              </span>
              <span className="text-xs text-[#171316]/70 mt-1 block">
                Estimated ~6-day window of potential fertility
              </span>
            </div>

            <p className="text-xs text-[#171316]/80 leading-relaxed p-3.5 rounded-xl bg-white border border-[#C51F46]/30">
              {fertile?.explanation ||
                'Calculated based on standard luteal phase estimation (~14 days before your predicted period start). Sperm can survive up to 5 days, and an egg lives approximately 24 hours.'}
            </p>
          </ScrapbookCard>

          {/* Ovulation Date Card */}
          <ScrapbookCard variant="ivory">
            <div className="flex items-center justify-between mb-4">
              <span className="text-xs font-bold uppercase tracking-wider text-[#171316]/70">
                Estimated Ovulation Day
              </span>
              <Flower2 className="w-6 h-6 text-[#F04478]" />
            </div>

            <div className="mb-4">
              <span className="text-4xl sm:text-5xl font-bold font-editorial text-[#F04478] block">
                {fertile?.ovulationDate || 'Nov 19, 2026'}
              </span>
              <span className="text-xs text-[#171316]/70 mt-1 block">
                Approximate midpoint of the window
              </span>
            </div>

            <div className="p-3.5 rounded-xl bg-white border border-[#171316]/10 text-xs space-y-1.5">
              <div className="flex justify-between">
                <span className="text-[#171316]/70">Current cycle length used:</span>
                <span className="font-bold">{predictions?.averageCycleLength || 30.5} days</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#171316]/70">Next predicted period:</span>
                <span className="font-bold text-[#C51F46]">{nextPred?.predictedStartDate || 'Dec 3, 2026'}</span>
              </div>
            </div>
          </ScrapbookCard>
        </div>

        {/* 4 Phases of Menstrual Cycle Explanatory Scrapbook */}
        <div>
          <h4 className="text-2xl font-bold font-editorial text-[#171316] mb-4">
            Understanding Your 4 Cycle Phases ♡
          </h4>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-xs">
            {/* Phase 1: Menstrual */}
            <div className="p-4 rounded-2xl bg-white border-2 border-[#171316] shadow-scrapbook">
              <span className="text-[10px] font-bold text-[#C51F46] uppercase tracking-wider block mb-1">
                Phase 1 • Days 1–5
              </span>
              <h5 className="font-bold text-base text-[#171316] mb-2">Menstrual Phase</h5>
              <p className="text-[#171316]/70 leading-relaxed">
                Estrogen and progesterone drop. The uterine lining sheds. Rest, hydration, and gentle warmth are your allies.
              </p>
            </div>

            {/* Phase 2: Follicular */}
            <div className="p-4 rounded-2xl bg-[#FFF0F3] border-2 border-[#F04478] shadow-scrapbook-pink">
              <span className="text-[10px] font-bold text-[#F04478] uppercase tracking-wider block mb-1">
                Phase 2 • Days 6–13
              </span>
              <h5 className="font-bold text-base text-[#171316] mb-2">Follicular Phase</h5>
              <p className="text-[#171316]/70 leading-relaxed">
                FSH stimulates follicles. Estrogen rises, often boosting mental clarity, energy, and sociability.
              </p>
            </div>

            {/* Phase 3: Ovulatory */}
            <div className="p-4 rounded-2xl bg-[#FFF9F5] border-2 border-[#171316] shadow-scrapbook">
              <span className="text-[10px] font-bold text-amber-700 uppercase tracking-wider block mb-1">
                Phase 3 • Day ~14–16
              </span>
              <h5 className="font-bold text-base text-[#171316] mb-2">Ovulatory Phase</h5>
              <p className="text-[#171316]/70 leading-relaxed">
                LH surge triggers the release of an egg. Peak fertility window. Energy and affectionate feelings may peak.
              </p>
            </div>

            {/* Phase 4: Luteal */}
            <div className="p-4 rounded-2xl bg-[#FFF4E9] border-2 border-[#171316] shadow-scrapbook">
              <span className="text-[10px] font-bold text-[#171316]/70 uppercase tracking-wider block mb-1">
                Phase 4 • Days 17–28+
              </span>
              <h5 className="font-bold text-base text-[#171316] mb-2">Luteal Phase</h5>
              <p className="text-[#171316]/70 leading-relaxed">
                Progesterone rises to support potential pregnancy then drops. Cravings, tender mood, and lower battery are natural.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
