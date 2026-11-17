import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  CalendarDays,
  Sparkles,
  Activity,
  LineChart,
  User,
} from 'lucide-react';

const mobileNavItems = [
  { name: 'Home', path: '/dashboard', icon: LayoutDashboard },
  { name: 'Calendar', path: '/calendar', icon: CalendarDays },
  { name: 'Moods', path: '/moods', icon: Sparkles },
  { name: 'Symptoms', path: '/symptoms', icon: Activity },
  { name: 'Insights', path: '/insights', icon: LineChart },
  { name: 'Profile', path: '/profile', icon: User },
];

export const BottomNav = () => {
  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-[#FFF4E9]/95 backdrop-blur-md border-t-2 border-[#171316] px-3 py-2 z-50 flex items-center justify-around shadow-lg">
      {mobileNavItems.map((item) => {
        const Icon = item.icon;
        return (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) =>
              `flex flex-col items-center gap-1 py-1 px-2.5 rounded-xl text-[10px] font-medium transition-all ${
                isActive
                  ? 'text-[#C51F46] font-bold bg-[#F9C3D0]/60 scale-105'
                  : 'text-[#171316]/70 hover:text-[#C51F46]'
              }`
            }
          >
            <Icon className="w-5 h-5" />
            <span>{item.name}</span>
          </NavLink>
        );
      })}
    </nav>
  );
};
