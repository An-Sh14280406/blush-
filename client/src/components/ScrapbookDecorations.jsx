import React from 'react';

export const BowIcon = ({ className = 'w-6 h-6', color = '#F04478' }) => (
  <svg className={className} viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path
      d="M24 20C21.5 15 15 12 10 15C5 18 6 26 12 28C17 29.5 22 25 24 22M24 20C26.5 15 33 12 38 15C43 18 42 26 36 28C31 29.5 26 25 24 22M24 20C25.5 20 27 21.5 27 23C27 24.5 25.5 26 24 26C22.5 26 21 24.5 21 23C21 21.5 22.5 20 24 20Z"
      stroke={color}
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      fill="#F9C3D0"
      fillOpacity="0.4"
    />
    <path
      d="M22 25L14 40C13 42 16 43 18 41L23 30M26 25L34 40C35 42 32 43 30 41L25 30"
      stroke={color}
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

export const ButterflyIcon = ({ className = 'w-6 h-6', color = '#F04478' }) => (
  <svg className={className} viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path
      d="M16 11C14 7 8 6 5 9C2 12 4 19 12 18C15 17.5 16 15 16 13M16 11C18 7 24 6 27 9C30 12 28 19 20 18C17 17.5 16 15 16 13M16 14C13 18 8 20 6 23C4 26 8 28 13 25C15 24 16 20 16 18M16 14C19 18 24 20 26 23C28 26 24 28 19 25C17 24 16 20 16 18"
      stroke={color}
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      fill="#F9C3D0"
      fillOpacity="0.4"
    />
    <path d="M16 8V24" stroke={color} strokeWidth="2" strokeLinecap="round" />
  </svg>
);

export const StrawberryIcon = ({ className = 'w-6 h-6' }) => (
  <svg className={className} viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path
      d="M16 28C10 24 5 18 6 12C7 7 12 7 16 10C20 7 25 7 26 12C27 18 22 24 16 28Z"
      fill="#F04478"
      stroke="#C51F46"
      strokeWidth="2"
    />
    <path
      d="M16 10L14 5M16 10L19 5M16 10L11 8M16 10L21 8"
      stroke="#C5D83C"
      strokeWidth="2.5"
      strokeLinecap="round"
    />
    <circle cx="12" cy="14" r="0.75" fill="#FFF4E9" />
    <circle cx="16" cy="16" r="0.75" fill="#FFF4E9" />
    <circle cx="20" cy="14" r="0.75" fill="#FFF4E9" />
    <circle cx="14" cy="20" r="0.75" fill="#FFF4E9" />
    <circle cx="18" cy="20" r="0.75" fill="#FFF4E9" />
  </svg>
);

export const HeartSticker = ({ className = 'w-5 h-5', fill = '#FFF4E9', stroke = '#F04478' }) => (
  <svg className={className} viewBox="0 0 24 24" fill={fill} stroke={stroke} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z" />
  </svg>
);

export const TapeSnippet = ({ className = 'w-16 h-5' }) => (
  <div
    className={`bg-[#F9C3D0]/70 border border-blush-border/60 shadow-sm backdrop-blur-xs transform -rotate-3 ${className}`}
    style={{ clipPath: 'polygon(5% 0%, 95% 0%, 100% 100%, 0% 100%)' }}
  />
);
