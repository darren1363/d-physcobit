/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { CosmicStarfield } from './components/CosmicStarfield';
import { HDetector } from './components/HDetector';
import { SpaceGame } from './components/SpaceGame';
import { CosmicMusic } from './components/CosmicMusic';
import { AIChat } from './components/AIChat';
import { MedicalSpecialists } from './components/MedicalSpecialists';
import { Missions } from './components/Missions';
import { FlightSurgeon, type AppView } from './components/FlightSurgeon';
import { Sparkles, Activity, Gamepad2, Music, Bot, Trophy, ShieldAlert } from 'lucide-react';
import { StethoscopeIcon } from './components/icons/StethoscopeIcon';

// Preload and decode avatar image into GPU memory cache so it never flickers or delays
if (typeof window !== 'undefined') {
  const avatarPreloader = new Image();
  avatarPreloader.src = './avatar.jpg';
  if ('decode' in avatarPreloader) {
    avatarPreloader.decode().catch(() => {});
  }
}

export default function App() {
  const [currentView, setCurrentView] = useState<AppView>('home');
  const [imageError, setImageError] = useState(false);

  return (
    <>
      {/* Home View: Persistent in DOM to prevent destroying and re-decoding image bitmaps */}
      <div
        className={`relative min-h-screen w-full bg-[#050711] text-slate-100 overflow-hidden flex flex-col justify-between selection:bg-cyan-500 selection:text-black ${
          currentView !== 'home' ? 'hidden' : ''
        }`}
      >
        {/* Interactive Cosmic Deep Space Starfield Background */}
        <CosmicStarfield paused={currentView !== 'home'} />

      {/* Top Bar with Grand Scaled Title & Inspiring Tagline filling the space (no top navigation buttons) */}
      <header className="relative z-20 pt-6 sm:pt-8 md:pt-10 px-4 sm:px-8 w-full max-w-7xl mx-auto flex flex-col items-center justify-center text-center">
        {/* Ambient Cosmic Horizon Glow */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3/4 max-w-4xl h-28 bg-gradient-to-r from-cyan-500/15 via-blue-500/25 to-purple-500/15 blur-3xl pointer-events-none" />

        {/* Large Prominent App Name Container */}
        <div className="relative group w-full flex flex-col items-center select-none">
          <div className="absolute -inset-x-8 -inset-y-4 bg-gradient-to-r from-cyan-500/20 via-blue-400/20 to-purple-500/20 blur-2xl pointer-events-none opacity-75 group-hover:opacity-100 transition-opacity" />

          <h1
            className="relative text-5xl xs:text-6xl sm:text-7xl md:text-8xl lg:text-9xl font-black tracking-wider uppercase transition-all duration-300"
            style={{
              fontFamily: 'var(--font-display)',
              letterSpacing: '0.04em',
            }}
          >
            <span className="bg-gradient-to-r from-white via-cyan-200 to-cyan-400 bg-clip-text text-transparent filter drop-shadow-[0_0_35px_rgba(34,211,238,0.7)] group-hover:drop-shadow-[0_0_55px_rgba(34,211,238,0.9)]">
              D' Physco-Bit
            </span>
          </h1>

          {/* Inspiring Tagline & Subtle Space Telemetry Line */}
          <p
            className="text-base sm:text-xl md:text-2xl text-cyan-100/90 mt-2 sm:mt-3 font-medium tracking-wide italic flex items-center justify-center gap-2.5 drop-shadow-[0_2px_12px_rgba(0,0,0,0.85)]"
            style={{ fontFamily: 'var(--font-sans)' }}
          >
            <Sparkles className="w-4 h-4 sm:w-5 sm:h-5 text-cyan-400 shrink-0 not-italic animate-pulse" />
            <span>Every success comes from a dream</span>
            <Sparkles className="w-4 h-4 sm:w-5 sm:h-5 text-cyan-400 shrink-0 not-italic animate-pulse" />
          </p>

        </div>
      </header>

      {/* Center Stage: Framed Astronaut Character */}
      <main className="relative z-10 flex-1 flex flex-col items-center justify-center px-4 py-4 sm:py-6">
        {/* Clickable Cool Sci-Fi Space Observatory Curved Portal */}
        <div
          onClick={() => setCurrentView('hdetector')}
          className="relative p-3 sm:p-4 rounded-full bg-gradient-to-b from-cyan-500/30 via-slate-900/70 to-purple-600/30 backdrop-blur-2xl shadow-[0_0_50px_rgba(6,182,212,0.3)] border-2 border-cyan-400/50 group transition-all duration-500 hover:shadow-[0_0_75px_rgba(6,182,212,0.55)] hover:border-cyan-300 hover:scale-[1.03] cursor-pointer"
          title="Click to launch H'Detector"
        >
          {/* Outer Smooth Curved Neon Aura Halo */}
          <div className="absolute -inset-1.5 rounded-full bg-gradient-to-tr from-cyan-500/30 via-purple-500/20 to-blue-500/30 blur-lg pointer-events-none opacity-80 group-hover:opacity-100 transition-opacity" />

          {/* Smooth Concentric Curved Orbital Rings */}
          <div className="absolute -inset-3 rounded-full border border-cyan-400/20 pointer-events-none animate-pulse-subtle" />
          <div className="absolute -inset-6 rounded-full border border-purple-500/15 pointer-events-none" />

          {/* Inner Viewport Container */}
          <div className="relative w-[230px] xs:w-[260px] sm:w-[300px] md:w-[340px] lg:w-[370px] aspect-square rounded-full bg-[#070b18]/95 overflow-hidden border border-cyan-500/40 flex items-center justify-center p-4">
            {/* Ambient Radial Color Core */}
            <div className="absolute inset-0 rounded-full bg-radial from-cyan-500/20 via-purple-600/15 to-transparent pointer-events-none" />

            {/* Astronaut Character with Float Animation */}
            {!imageError ? (
              <img
                src="/avatar.png"
                alt="D' Physco-Bit astronaut character"
                loading="eager"
                decoding="sync"
                fetchPriority="high"
                className="relative z-10 w-full h-full object-contain filter drop-shadow-[0_12px_28px_rgba(6,182,212,0.35)] animate-float select-none transition-transform duration-500 group-hover:scale-105 rounded-full"
                referrerPolicy="no-referrer"
                onError={() => setImageError(true)}
              />
            ) : (
              <div className="relative z-10 text-center p-6 text-cyan-300 font-mono text-sm">
                D' Physco-Bit
              </div>
            )}

            {/* Hover Trigger Cue Badge */}
            <div className="absolute bottom-5 left-1/2 -translate-x-1/2 z-20 px-3.5 py-1 rounded-full bg-slate-950/90 border border-cyan-500/60 text-[11px] font-mono text-cyan-300 opacity-80 group-hover:opacity-100 group-hover:scale-105 transition-all shadow-[0_0_15px_rgba(6,182,212,0.3)] flex items-center gap-1.5 whitespace-nowrap">
              <Activity className="w-3 h-3 text-cyan-400 animate-pulse" />
              <span>Click for H'Detector</span>
            </div>
          </div>
        </div>

        {/* Action Dock: All 7 buttons aligned on the same single line */}
        <div className="mt-6 flex flex-nowrap items-center justify-center gap-1.5 sm:gap-2 w-full max-w-5xl px-2 overflow-x-auto no-scrollbar">
          {/* 1. H'Detector CTA */}
          <button
            onClick={() => setCurrentView('hdetector')}
            className="shrink-0 whitespace-nowrap px-3 sm:px-3.5 py-2 sm:py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-400 hover:to-blue-400 text-slate-950 font-bold text-xs font-mono transition-all shadow-[0_0_16px_rgba(6,182,212,0.35)] hover:shadow-[0_0_24px_rgba(6,182,212,0.55)] flex items-center gap-1.5 cursor-pointer active:scale-95"
          >
            <Activity className="w-3.5 h-3.5 fill-current" />
            <span>H'Detector</span>
          </button>

          {/* 2. Flight Surgeon CTA (NASA-STD-3001 & HRP) */}
          <button
            onClick={() => setCurrentView('flight-surgeon')}
            className="shrink-0 whitespace-nowrap px-3 sm:px-3.5 py-2 sm:py-2.5 rounded-xl bg-gradient-to-r from-sky-400 via-cyan-500 to-indigo-500 hover:from-sky-300 hover:to-indigo-400 text-slate-950 font-bold text-xs font-mono transition-all shadow-[0_0_16px_rgba(56,189,248,0.35)] hover:shadow-[0_0_24px_rgba(56,189,248,0.55)] flex items-center gap-1.5 cursor-pointer active:scale-95"
          >
            <ShieldAlert className="w-3.5 h-3.5 text-slate-950" />
            <span>Flight Surgeon</span>
          </button>

          {/* 3. AI Doctors CTA */}
          <button
            onClick={() => setCurrentView('specialists')}
            className="shrink-0 whitespace-nowrap px-3 sm:px-3.5 py-2 sm:py-2.5 rounded-xl bg-gradient-to-r from-teal-500 via-cyan-600 to-blue-600 hover:from-teal-400 hover:to-cyan-500 text-slate-950 font-bold text-xs font-mono transition-all shadow-[0_0_16px_rgba(20,184,166,0.35)] hover:shadow-[0_0_24px_rgba(20,184,166,0.55)] flex items-center gap-1.5 cursor-pointer active:scale-95"
          >
            <StethoscopeIcon className="w-3.5 h-3.5 text-slate-950" />
            <span>AI Doctors</span>
          </button>

          {/* 4. Mission CTA (Health Deeds & Marks) */}
          <button
            onClick={() => setCurrentView('missions')}
            className="shrink-0 whitespace-nowrap px-3 sm:px-3.5 py-2 sm:py-2.5 rounded-xl bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600 hover:from-amber-400 hover:to-orange-400 text-slate-950 font-bold text-xs font-mono transition-all shadow-[0_0_16px_rgba(245,158,11,0.35)] hover:shadow-[0_0_24px_rgba(245,158,11,0.55)] flex items-center gap-1.5 cursor-pointer active:scale-95"
          >
            <Trophy className="w-3.5 h-3.5 text-slate-950" />
            <span>Mission</span>
          </button>

          {/* 5. AI Problem Solver CTA */}
          <button
            onClick={() => setCurrentView('ai')}
            className="shrink-0 whitespace-nowrap px-3 sm:px-3.5 py-2 sm:py-2.5 rounded-xl bg-slate-900/90 hover:bg-slate-800 border-2 border-blue-500/50 hover:border-blue-400 text-blue-300 hover:text-white font-bold text-xs font-mono transition-all shadow-[0_0_12px_rgba(59,130,246,0.2)] hover:shadow-[0_0_20px_rgba(59,130,246,0.4)] flex items-center gap-1.5 cursor-pointer active:scale-95"
          >
            <Bot className="w-3.5 h-3.5 text-blue-400" />
            <span>AI</span>
          </button>

          {/* 6. Gaming CTA */}
          <button
            onClick={() => setCurrentView('gaming')}
            className="shrink-0 whitespace-nowrap px-3 sm:px-3.5 py-2 sm:py-2.5 rounded-xl bg-slate-900/90 hover:bg-slate-800 border-2 border-purple-500/50 hover:border-purple-400 text-purple-300 hover:text-white font-bold text-xs font-mono transition-all shadow-[0_0_12px_rgba(168,85,247,0.2)] hover:shadow-[0_0_20px_rgba(168,85,247,0.4)] flex items-center gap-1.5 cursor-pointer active:scale-95"
          >
            <Gamepad2 className="w-3.5 h-3.5 text-purple-400" />
            <span>Gaming</span>
          </button>

          {/* 7. Music CTA */}
          <button
            onClick={() => setCurrentView('music')}
            className="shrink-0 whitespace-nowrap px-3 sm:px-3.5 py-2 sm:py-2.5 rounded-xl bg-slate-900/90 hover:bg-slate-800 border-2 border-emerald-500/50 hover:border-emerald-400 text-emerald-300 hover:text-white font-bold text-xs font-mono transition-all shadow-[0_0_12px_rgba(16,185,129,0.2)] hover:shadow-[0_0_20px_rgba(16,185,129,0.4)] flex items-center gap-1.5 cursor-pointer active:scale-95"
          >
            <Music className="w-3.5 h-3.5 text-emerald-400" />
            <span>Music</span>
          </button>
        </div>
      </main>

      {/* Clean Bottom Spacer */}
      <div className="h-4 sm:h-6 pointer-events-none" aria-hidden="true" />
    </div>

    {/* Sub-Page Views (mounted on-demand, preserving Home DOM & decoded image texture) */}
    {currentView === 'hdetector' && <HDetector onBack={() => setCurrentView('home')} />}
    {currentView === 'flight-surgeon' && (
      <FlightSurgeon
        onBack={() => setCurrentView('home')}
        onNavigate={(view) => setCurrentView(view)}
      />
    )}
    {currentView === 'specialists' && <MedicalSpecialists onBack={() => setCurrentView('home')} />}
    {currentView === 'missions' && <Missions onBack={() => setCurrentView('home')} />}
    {currentView === 'ai' && <AIChat onBack={() => setCurrentView('home')} />}
    {currentView === 'gaming' && <SpaceGame onBack={() => setCurrentView('home')} />}
    {currentView === 'music' && <CosmicMusic onBack={() => setCurrentView('home')} />}
    </>
  );
}

