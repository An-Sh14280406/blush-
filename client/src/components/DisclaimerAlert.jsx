import React from 'react';
import { AlertCircle, ShieldCheck } from 'lucide-react';

export const DisclaimerAlert = ({
  text = 'Calendar calculations provide cycle estimates only and cannot confirm ovulation or guarantee fertile timing. Never rely on predicted non-fertile days as contraception.',
  title = 'Clinical & Wellness Transparency',
  className = '',
}) => {
  return (
    <div className={`p-4 rounded-xl bg-[#FFF9F5] border-2 border-dashed border-[#F04478]/50 text-xs text-[#171316] shadow-sm ${className}`}>
      <div className="flex items-start gap-2.5">
        <ShieldCheck className="w-5 h-5 text-[#F04478] shrink-0 mt-0.5" />
        <div>
          <span className="font-bold text-[#C51F46] uppercase tracking-wider block mb-0.5">
            {title}
          </span>
          <p className="leading-relaxed text-[#171316]/80">{text}</p>
        </div>
      </div>
    </div>
  );
};
