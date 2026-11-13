import React from 'react';

interface StethoscopeIconProps {
  className?: string;
}

export const StethoscopeIcon: React.FC<StethoscopeIconProps> = ({ className = 'w-4 h-4' }) => {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      {/* Binaural headset arch */}
      <path d="M4.5 4h2v3.5a5.5 5.5 0 0 0 11 0V4h2" />
      {/* Ear tips */}
      <path d="M3.5 4h3" />
      <path d="M17.5 4h3" />
      {/* Flexible stem and acoustic tube */}
      <path d="M12 13v3a4 4 0 0 0 4 4h1" />
      {/* Chest piece / Diaphragm */}
      <circle cx="19" cy="20" r="2.75" strokeWidth="2" fill="currentColor" fillOpacity="0.2" />
      <circle cx="19" cy="20" r="1" fill="currentColor" />
    </svg>
  );
};
