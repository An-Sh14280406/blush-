import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  CalendarDays,
  History,
  HeartHandshake,
  Sparkles,
  Activity,
  LineChart,
  Bell,
  Settings,
  User,
  LogOut,
  CalendarHeart,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { BowIcon, StrawberryIcon } from './ScrapbookDecorations';

const navItems = [
  { name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
  { name: 'Period Calendar', path: '/calendar', icon: CalendarDays },
  { name: 'Period History', path: '/history', icon: History },
  { name: 'Mood Journal', path: '/moods', icon: Sparkles },
  { name: 'Symptom Tracker', path: '/symptoms', icon: Activity },
  { name: 'Fertility & Ovulation', path: '/fertility', icon: CalendarHeart },
  { name: 'Cycle Insights', path: '/insights', icon: LineChart },
  { name: 'Notifications', path: '/notifications', icon: Bell },
  { name: 'My Profile', path: '/profile', icon: User },
  { name: 'Settings', path: '/settings', icon: Settings },
];

export const Sidebar = () => {
  const { user, logout } = useAuth();

  return (
    <aside className="hidden md:flex flex-col w-72 h-screen sticky top-0 bg-[#FFF4E9] border-r-2 border-[#171316] p-6 justify-between select-none overflow-y-auto">
      <div>
        {/* Brand Header */}
        <div className="flex items-center gap-3 mb-8 px-2">
          <div className="relative">
            <StrawberryIcon className="w-9 h-9" />
            <div className="absolute -top-1 -right-1">
              <BowIcon className="w-4 h-4" />
            </div>
          </div>
          <div>
            <h1 className="text-3xl font-bold font-logo text-[#C51F46] tracking-wide leading-none">
              blush.
            </h1>
            <p className="text-[11px] font-semibold text-[#171316]/70 uppercase tracking-widest mt-0.5">
              For Ananya ♡
            </p>
          </div>
        </div>

        {/* Navigation Links */}
        <nav className="space-y-1.5">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.path}
                to={item.path}
                className={({ isActive }) =>
                  `flex items-center gap-3.5 px-4 py-2.5 rounded-xl font-medium text-sm transition-all duration-150 ${
                    isActive
                      ? 'bg-[#F04478] text-white border-2 border-[#171316] shadow-scrapbook-sm font-semibold'
                      : 'text-[#171316] hover:bg-[#F9C3D0]/50 hover:translate-x-1'
                  }`
                }
              >
                <Icon className="w-4 h-4 shrink-0" />
                <span>{item.name}</span>
              </NavLink>
            );
          })}
        </nav>
      </div>

      {/* User Footer Card */}
      <div className="pt-6 border-t-2 border-[#171316]/10 mt-6">
        <div className="flex items-center justify-between p-3 rounded-xl bg-white border-2 border-[#171316] shadow-scrapbook-sm">
          <div className="flex items-center gap-2.5 overflow-hidden">
            <div className="w-9 h-9 rounded-full bg-[#F9C3D0] border border-[#C51F46] flex items-center justify-center text-lg shrink-0">
              {user?.avatar || '🎀'}
            </div>
            <div className="truncate">
              <p className="text-xs font-bold text-[#171316] truncate">
                {user?.name || 'Ananya'}
              </p>
              <p className="text-[10px] text-[#171316]/60 truncate">
                {user?.email || 'ananya@blush.love'}
              </p>
            </div>
          </div>
          <button
            onClick={logout}
            title="Log out"
            className="p-1.5 text-[#171316]/60 hover:text-[#C51F46] hover:bg-[#F9C3D0]/40 rounded-lg transition-colors"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </div>
    </aside>
  );
};
