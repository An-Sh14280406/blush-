import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  BowIcon,
  ButterflyIcon,
  StrawberryIcon,
  HeartSticker,
} from '../components/ScrapbookDecorations';
import {
  Sparkles,
  CalendarHeart,
  Activity,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
} from 'lucide-react';

export const LandingPage = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-[#FFF4E9] bg-dot-pattern selection:bg-[#F27F9D] selection:text-white pb-16">
      {/* Top romantic navigation */}
      <nav className="max-w-7xl mx-auto px-6 py-6 flex items-center justify-between border-b-2 border-[#171316]">
        <div className="flex items-center gap-3">
          <div className="relative">
            <StrawberryIcon className="w-10 h-10" />
            <div className="absolute -top-1 -right-1">
              <BowIcon className="w-5 h-5" />
            </div>
          </div>
          <div>
            <span className="text-4xl font-bold font-logo text-[#C51F46] tracking-wide leading-none block">
              blush.
            </span>
            <span className="text-[10px] font-semibold tracking-widest text-[#171316]/70 uppercase">
              A little world for Ananya ♡
            </span>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {user ? (
            <Link
              to="/dashboard"
              className="px-5 py-2.5 rounded-xl bg-[#F04478] text-white font-bold text-sm border-2 border-[#171316] shadow-scrapbook-sm hover:-translate-y-0.5 transition-all flex items-center gap-2"
            >
              <span>Go to Dashboard</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          ) : (
            <>
              <Link
                to="/login"
                className="px-4 py-2 font-semibold text-xs sm:text-sm text-[#171316] hover:text-[#C51F46] transition-colors"
              >
                Sign In
              </Link>
              <Link
                to="/register"
                className="px-5 py-2.5 rounded-xl bg-[#F04478] text-white font-bold text-xs sm:text-sm border-2 border-[#171316] shadow-scrapbook-sm hover:-translate-y-0.5 transition-all flex items-center gap-2"
              >
                <Sparkles className="w-4 h-4" />
                <span>Create Fresh Account ♡</span>
              </Link>
            </>
          )}
        </div>
      </nav>

      {/* Editorial Magazine Hero Section */}
      <section className="max-w-6xl mx-auto px-6 pt-12 sm:pt-20 pb-16">
        <div className="relative text-center max-w-4xl mx-auto">
          {/* Floating cute stickers */}
          <div className="hidden lg:block absolute -top-8 -left-12 rotate-[-12deg] animate-float">
            <div className="p-3 bg-white border-2 border-[#171316] shadow-scrapbook rounded-2xl flex items-center gap-2">
              <ButterflyIcon className="w-6 h-6" />
              <span className="text-xs font-bold text-[#C51F46]">Ananya's Sanctuary</span>
            </div>
          </div>

          <div className="hidden lg:block absolute top-12 -right-8 rotate-[8deg] animate-float">
            <div className="p-3 bg-[#F9C3D0] border-2 border-[#C51F46] shadow-scrapbook-pink rounded-2xl flex items-center gap-2">
              <BowIcon className="w-6 h-6" />
              <span className="text-xs font-bold text-[#171316]">Cycle & Feelings</span>
            </div>
          </div>

          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#FFF0F3] border-2 border-[#F04478] text-[#C51F46] text-xs font-bold uppercase tracking-wider mb-6 shadow-sm">
            <HeartSticker className="w-4 h-4 text-[#F04478]" />
            <span>Your cycle. Your feelings. Your little moments.</span>
          </div>

          <h1 className="text-5xl sm:text-7xl lg:text-8xl font-bold font-editorial text-[#171316] leading-[1.05] tracking-tight mb-8">
            The intimate wellness journal made for{' '}
            <span className="italic text-[#F04478] font-serif underline decoration-wavy decoration-[#C5D83C]/80">
              Ananya.
            </span>
          </h1>

          <p className="text-lg sm:text-xl text-[#171316]/80 max-w-2xl mx-auto font-normal leading-relaxed mb-10">
            A romantic digital scrapbook where you can track your menstrual cycle, capture your everyday feelings, discover gentle physical patterns, and celebrate your rhythm.
          </p>

          {/* Action CTAs */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              to="/register"
              className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-[#F04478] text-white font-bold text-base sm:text-lg border-2 border-[#171316] shadow-scrapbook hover:-translate-y-1 transition-all flex items-center justify-center gap-3"
            >
              <Sparkles className="w-5 h-5" />
              <span>Create Fresh Account ♡</span>
            </Link>

            <Link
              to="/login"
              className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-white text-[#171316] font-bold text-base sm:text-lg border-2 border-[#171316] shadow-scrapbook hover:-translate-y-1 transition-all flex items-center justify-center gap-2"
            >
              <span>Sign In to Your Space</span>
              <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
        </div>

        {/* Hero Scrapbook Feature Card Showcase */}
        <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-6 rounded-2xl bg-white border-2 border-[#171316] shadow-scrapbook relative">
            <div className="w-12 h-12 rounded-xl bg-[#FFF0F3] border-2 border-[#171316] flex items-center justify-center mb-4">
              <CalendarHeart className="w-6 h-6 text-[#F04478]" />
            </div>
            <h3 className="text-2xl font-bold font-editorial text-[#171316] mb-2">
              Precise Cycle Science
            </h3>
            <p className="text-xs sm:text-sm text-[#171316]/70 leading-relaxed">
              Transparent prediction engine based on your confirmed historical starts. No arbitrary 28-day assumptions.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-[#FFF0F3] border-2 border-[#C51F46] shadow-scrapbook-pink relative">
            <div className="w-12 h-12 rounded-xl bg-white border-2 border-[#C51F46] flex items-center justify-center mb-4">
              <Sparkles className="w-6 h-6 text-[#C51F46]" />
            </div>
            <h3 className="text-2xl font-bold font-editorial text-[#171316] mb-2">
              Emotive Mood Journal
            </h3>
            <p className="text-xs sm:text-sm text-[#171316]/70 leading-relaxed">
              Log playful, affectionate, calm, or tender days with personal diary notes and emotional intensity meters.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-white border-2 border-[#171316] shadow-scrapbook relative">
            <div className="w-12 h-12 rounded-xl bg-[#FFF4E9] border-2 border-[#171316] flex items-center justify-center mb-4">
              <Activity className="w-6 h-6 text-[#171316]" />
            </div>
            <h3 className="text-2xl font-bold font-editorial text-[#171316] mb-2">
              Personalized Insights
            </h3>
            <p className="text-xs sm:text-sm text-[#171316]/70 leading-relaxed">
              Rules-based self-care patterns based on actual recorded counts, crafted with ethical boundaries and care.
            </p>
          </div>
        </div>

        {/* Clinical Transparency Banner */}
        <div className="mt-12 p-6 rounded-2xl bg-[#FFF9F5] border-2 border-dashed border-[#F04478]/50 flex flex-col sm:flex-row items-center gap-4 text-xs sm:text-sm text-[#171316]">
          <ShieldCheck className="w-8 h-8 text-[#F04478] shrink-0" />
          <div className="space-y-1">
            <h4 className="font-bold text-[#C51F46] uppercase tracking-wider">
              Health Privacy & Clinical Clarity
            </h4>
            <p className="text-[#171316]/80 leading-relaxed">
              Your health logs are completely private and encrypted. blush. clearly labels fertility predictions as mathematical estimates and never claims calendar methods confirm ovulation or guarantee contraception.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
};
