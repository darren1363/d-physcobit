import React from 'react';
import { Volume2, VolumeX, Activity, RefreshCw } from 'lucide-react';
import { soundFX } from '../utils/audio';

interface TopNavProps {
  activeSection: string;
  onNavigate: (section: string) => void;
  isAudioEnabled: boolean;
  onToggleAudio: () => void;
  onSyncVitals: () => void;
  isSyncing: boolean;
}

export const TopNav: React.FC<TopNavProps> = ({
  activeSection,
  onNavigate,
  isAudioEnabled,
  onToggleAudio,
  onSyncVitals,
  isSyncing,
}) => {
  const navItems = [
    { id: 'biometrics', label: 'Biometrics' },
    { id: 'zerog', label: 'Zero-G Lab' },
    { id: 'cognitive', label: 'Cognitive Health' },
    { id: 'countermeasures', label: 'Countermeasures' },
    { id: 'radiation', label: 'Radiation Shield' },
  ];

  return (
    <header className="sticky top-0 z-50 w-full backdrop-blur-md bg-[#060813]/85 border-b border-slate-800/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Zone 1: Brand title, one line, single text element */}
        <button
          onClick={() => {
            soundFX.playBeep(700, 0.05);
            onNavigate('hero');
          }}
          className="text-xl font-bold tracking-tight text-white flex items-center gap-2 group cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-500 rounded-sm"
          style={{ fontFamily: 'var(--font-display)' }}
        >
          <span className="w-2.5 h-2.5 rounded-full bg-cyan-400 group-hover:bg-cyan-300 shadow-[0_0_10px_#22d3ee] transition-colors" />
          <span>D' Physco-Bit</span>
        </button>

        {/* Zone 2: 4-6 nav links, 1-2 word labels, single-line text with subtle underlines */}
        <nav className="hidden md:flex items-center gap-7 text-sm font-medium text-slate-300">
          {navItems.map((item) => {
            const isActive = activeSection === item.id;
            return (
              <button
                key={item.id}
                onClick={() => {
                  soundFX.playBeep(800, 0.04);
                  onNavigate(item.id);
                }}
                className={`transition-colors whitespace-nowrap cursor-pointer py-1 relative ${
                  isActive
                    ? 'text-cyan-400 font-semibold'
                    : 'text-slate-300 hover:text-white'
                }`}
              >
                {item.label}
                {isActive && (
                  <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-cyan-400 rounded-full" />
                )}
              </button>
            );
          })}
        </nav>

        {/* Zone 3: 1-2 primary actions */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => {
              onToggleAudio();
            }}
            title={isAudioEnabled ? 'Mute telemetry audio chimes' : 'Enable telemetry audio chimes'}
            aria-label={isAudioEnabled ? 'Mute telemetry audio' : 'Enable telemetry audio'}
            className={`p-2 rounded-lg border transition-all cursor-pointer flex items-center gap-1.5 text-xs font-mono whitespace-nowrap ${
              isAudioEnabled
                ? 'bg-cyan-950/60 border-cyan-500/50 text-cyan-300 shadow-[0_0_12px_rgba(6,182,212,0.25)]'
                : 'bg-slate-900/60 border-slate-800 text-slate-400 hover:text-slate-200 hover:border-slate-700'
            }`}
          >
            {isAudioEnabled ? (
              <>
                <Volume2 className="w-4 h-4 text-cyan-400 animate-pulse" />
                <span className="hidden sm:inline">AUDIO ON</span>
              </>
            ) : (
              <>
                <VolumeX className="w-4 h-4" />
                <span className="hidden sm:inline">AUDIO OFF</span>
              </>
            )}
          </button>

          <button
            onClick={() => {
              soundFX.playBeep(920, 0.06);
              onSyncVitals();
            }}
            disabled={isSyncing}
            className="px-4 py-2 text-xs font-semibold text-slate-950 bg-cyan-400 hover:bg-cyan-300 active:bg-cyan-500 rounded-lg transition-all shadow-[0_0_16px_rgba(34,211,238,0.35)] flex items-center gap-2 whitespace-nowrap cursor-pointer disabled:opacity-50"
            style={{ fontFamily: 'var(--font-mono)' }}
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isSyncing ? 'animate-spin' : ''}`} />
            <span>{isSyncing ? 'SYNCING...' : 'SYNC VITALS'}</span>
          </button>
        </div>
      </div>
    </header>
  );
};
