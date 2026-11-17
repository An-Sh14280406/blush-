import React from 'react';
import { TapeSnippet } from './ScrapbookDecorations';

export const ScrapbookCard = ({
  children,
  className = '',
  tape = false,
  variant = 'default', // 'default', 'pink', 'ivory', 'dark'
  tag = '',
}) => {
  const variantStyles = {
    default: 'bg-white border-2 border-[#171316] shadow-scrapbook',
    pink: 'bg-[#FFF0F3] border-2 border-[#C51F46] shadow-scrapbook-pink',
    ivory: 'bg-[#FFF9F5] border-2 border-[#171316] shadow-scrapbook',
    dark: 'bg-[#171316] text-[#FFF4E9] border-2 border-[#F04478] shadow-scrapbook-pink',
  };

  return (
    <div className={`relative rounded-2xl p-6 transition-all duration-200 hover:-translate-y-0.5 ${variantStyles[variant]} ${className}`}>
      {tape && (
        <div className="absolute -top-3 left-1/2 -translate-x-1/2 z-10 pointer-events-none">
          <TapeSnippet />
        </div>
      )}

      {tag && (
        <div className="inline-block px-3 py-1 mb-3 text-xs font-semibold uppercase tracking-wider rounded-full bg-[#F9C3D0] text-[#C51F46] border border-[#F04478]/30">
          {tag}
        </div>
      )}

      {children}
    </div>
  );
};
