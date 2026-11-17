import React, { useState, useEffect } from 'react';
import { Bell, Sparkles } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { api } from '../services/api';
import { HeartSticker } from './ScrapbookDecorations';
import { format } from 'date-fns';

export const Header = ({ onLogPeriodClick }) => {
  const { user } = useAuth();
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    const fetchUnread = async () => {
      try {
        const res = await api.getNotifications();
        if (res.success) {
          setUnreadCount(res.unreadCount || 0);
        }
      } catch (e) {
        // quiet error
      }
    };
    fetchUnread();
  }, []);

  const todayStr = format(new Date(), 'EEEE, MMMM d, yyyy');

  return (
    <header className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-[#171316]/10 mb-8">
      <div>
        <div className="flex items-center gap-2 mb-1">
          <HeartSticker className="w-5 h-5 text-[#F04478]" />
          <span className="text-xs font-semibold tracking-wider uppercase text-[#C51F46]">
            {todayStr}
          </span>
        </div>
        <h2 className="text-3xl sm:text-4xl font-bold font-editorial text-[#171316] tracking-tight">
          Hey, {user?.name || 'Ananya'}! ♡
        </h2>
        <p className="text-xs sm:text-sm text-[#171316]/70 mt-0.5">
          Your little wellness corner. Let's check in with yourself today.
        </p>
      </div>

      <div className="flex items-center gap-3 self-start sm:self-center">
        {onLogPeriodClick && (
          <button
            onClick={onLogPeriodClick}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#F04478] text-white font-semibold text-xs sm:text-sm border-2 border-[#171316] shadow-scrapbook-sm hover:-translate-y-0.5 transition-all"
          >
            <Sparkles className="w-4 h-4" />
            <span>+ Log Period</span>
          </button>
        )}

        <Link
          to="/notifications"
          className="relative p-2.5 rounded-xl bg-white border-2 border-[#171316] shadow-scrapbook-sm hover:bg-[#FFF0F3] transition-colors"
          title="Notifications"
        >
          <Bell className="w-4 h-4 text-[#171316]" />
          {unreadCount > 0 && (
            <span className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full bg-[#C51F46] text-white text-[10px] font-bold flex items-center justify-center border-2 border-white">
              {unreadCount}
            </span>
          )}
        </Link>
      </div>
    </header>
  );
};
