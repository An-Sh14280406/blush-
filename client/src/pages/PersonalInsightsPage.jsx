import React, { useState, useEffect } from 'react';
import { useOutletContext, Link } from 'react-router-dom';
import { api } from '../services/api';
import { Header } from '../components/Header';
import { ScrapbookCard } from '../components/ScrapbookCard';
import { BowIcon, StrawberryIcon, HeartSticker } from '../components/ScrapbookDecorations';
import {
  Sparkles,
  ShieldCheck,
  Heart,
  Activity,
  ArrowLeft,
  CheckCircle2,
  Bookmark,
} from 'lucide-react';

export const PersonalInsightsPage = () => {
  const { openLogPeriod } = useOutletContext();
  const [insights, setInsights] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchInsights = async () => {
      setLoading(true);
      try {
        const res = await api.getAnalytics('all');
        if (res.success) {
          setInsights(res.insights || []);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchInsights();
  }, []);

  return (
    <div>
      <Header onLogPeriodClick={openLogPeriod} />

      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <Link
              to="/insights"
              className="p-2 rounded-xl border border-[#171316]/20 hover:bg-[#FFF0F3]"
            >
              <ArrowLeft className="w-5 h-5 text-[#171316]" />
            </Link>
            <div>
              <span className="text-xs font-semibold uppercase tracking-wider text-[#C51F46]">
                Rules-Based Self-Care Reflections
              </span>
              <h3 className="text-3xl font-bold font-editorial text-[#171316]">
                Personal Wellness Insights ♡
              </h3>
            </div>
          </div>
        </div>

        {/* Ethical Guarantee & Transparency Banner */}
        <div className="p-4 rounded-2xl bg-[#FFF9F5] border-2 border-dashed border-[#171316]/30 text-xs text-[#171316] flex items-start gap-3">
          <ShieldCheck className="w-5 h-5 text-[#F04478] shrink-0 mt-0.5" />
          <div className="space-y-1">
            <h4 className="font-bold text-[#C51F46] uppercase tracking-wider">
              Grounded, Safe & Private Reflections
            </h4>
            <p className="text-[#171316]/80 leading-relaxed">
              Every insight below is derived exclusively from your verified, self-reported logs and displays its exact supporting count. blush. never infers consent, attraction, romantic intentions, or hormonal mood stereotypes.
            </p>
          </div>
        </div>

        {/* Insights Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {insights.map((item) => (
            <div
              key={item.id}
              className={`p-6 rounded-3xl border-2 border-[#171316] shadow-scrapbook relative flex flex-col justify-between ${
                item.type === 'positive'
                  ? 'bg-[#FFF0F3]'
                  : item.type === 'gentle'
                  ? 'bg-[#FFF9F5]'
                  : 'bg-white'
              }`}
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-white border border-[#171316]/20">
                    {item.tag || item.category}
                  </span>

                  {item.supportingCount > 0 && (
                    <span className="text-[11px] font-bold text-[#C51F46] px-2.5 py-0.5 rounded-full bg-white/80 border border-[#F04478]/30">
                      {item.supportingCount} supporting check-in{item.supportingCount > 1 ? 's' : ''}
                    </span>
                  )}
                </div>

                <h4 className="text-2xl font-bold font-editorial text-[#171316] mb-2">
                  {item.title}
                </h4>

                <p className="text-xs sm:text-sm text-[#171316]/80 leading-relaxed">
                  {item.message}
                </p>
              </div>

              <div className="mt-4 pt-3 border-t border-[#171316]/10 flex items-center justify-between text-[11px] text-[#171316]/60">
                <span>Category: {item.category}</span>
                <span className="flex items-center gap-1 font-semibold text-[#171316]">
                  <CheckCircle2 className="w-3.5 h-3.5 text-[#F04478]" /> Verified Record
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
