import React, { useState, useEffect } from 'react';
import {
  ArrowLeft,
  Trophy,
  Sparkles,
  RotateCcw,
  CheckCircle2,
  Dumbbell,
  Droplets,
  Moon,
  HeartHandshake,
  Send,
  Flame,
  Award,
} from 'lucide-react';

interface MissionsProps {
  onBack: () => void;
}

interface EvaluationResult {
  marks: number;
  badge: string;
  category: string;
  encouragement: string;
}

// Gentle cosmic audio chime when marks are earned
function playCosmicChime() {
  try {
    const AudioContextClass =
      window.AudioContext ||
      (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    if (!AudioContextClass) return;
    const ctx = new AudioContextClass();
    const now = ctx.currentTime;
    const freqs = [523.25, 659.25, 783.99, 1046.5]; // C5, E5, G5, C6
    freqs.forEach((freq, idx) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, now + idx * 0.08);
      gain.gain.setValueAtTime(0.0001, now + idx * 0.08);
      gain.gain.exponentialRampToValueAtTime(0.12, now + idx * 0.08 + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + idx * 0.08 + 0.28);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(now + idx * 0.08);
      osc.stop(now + idx * 0.08 + 0.3);
    });
  } catch {
    // Audio context not allowed or failed
  }
}

export const Missions: React.FC<MissionsProps> = ({ onBack }) => {
  const [totalMarks, setTotalMarks] = useState<number>(() => {
    try {
      const saved = localStorage.getItem('astro_total_marks');
      return saved ? parseInt(saved, 10) : 50;
    } catch {
      return 50;
    }
  });

  const [deedInput, setDeedInput] = useState<string>('I exercised for 30 minutes on the treadmill');
  const [boxView, setBoxView] = useState<'input' | 'result'>('input');
  const [isEvaluating, setIsEvaluating] = useState<boolean>(false);
  const [lastResult, setLastResult] = useState<EvaluationResult | null>(null);

  // Save marks to local storage
  useEffect(() => {
    try {
      localStorage.setItem('astro_total_marks', totalMarks.toString());
    } catch {
      // Ignore storage errors
    }
  }, [totalMarks]);

  // Quick 1-tap presets matching astronaut daily health deeds
  const presets = [
    { label: '30m Exercise', text: 'I exercised for 30 minutes on the treadmill', icon: Dumbbell },
    { label: 'Drink 750ml', text: 'Drank 750ml electrolyte hydration water pouch', icon: Droplets },
    { label: '8h Deep Sleep', text: 'Completed 8 hours of restorative sleep in berth', icon: Moon },
    { label: 'Helped Crew', text: 'Assisted crewmate with airlock inspection and shared dinner', icon: HeartHandshake },
  ];

  // Evaluate deed and reward marks
  const handleSubmitDeed = async (customDeed?: string) => {
    const textToSubmit = (customDeed || deedInput).trim();
    if (!textToSubmit) return;

    setIsEvaluating(true);
    setBoxView('result');

    try {
      const response = await fetch('/api/missions/evaluate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ deed: textToSubmit, currentTotalMarks: totalMarks }),
      });

      let resData: EvaluationResult;
      if (response.ok) {
        resData = await response.json();
      } else {
        // Fallback calculation
        resData = {
          marks: 50,
          badge: 'Aerospace Fitness Champion',
          category: 'Physical Exercise',
          encouragement:
            'Fantastic initiative! 30 minutes of cardiovascular exertion counters microgravity fluid shifts and preserves your bone and muscle integrity. Keep up the high standard, astronaut!',
        };
      }

      setLastResult(resData);
      setTotalMarks((prev) => prev + resData.marks);
      playCosmicChime();
    } catch (err) {
      const fallbackResult: EvaluationResult = {
        marks: 50,
        badge: 'Mission Vitality Hero',
        category: 'Health Deed',
        encouragement:
          'Outstanding work! Every healthy deed in space keeps your heart resilient and prevents muscle atrophy. Highly commended by Flight Surgeon command!',
      };
      setLastResult(fallbackResult);
      setTotalMarks((prev) => prev + fallbackResult.marks);
      playCosmicChime();
    } finally {
      setIsEvaluating(false);
    }
  };

  const handleApplyPreset = (text: string) => {
    setDeedInput(text);
  };

  return (
    <div className="min-h-screen w-full bg-[#050711] text-slate-100 flex flex-col justify-between selection:bg-amber-500 selection:text-black p-4 sm:p-6 relative overflow-hidden">
      {/* Top Bar - Clean aesthetic mirroring Health Detector */}
      <header className="w-full max-w-xl mx-auto flex items-center justify-between z-20">
        <button
          onClick={onBack}
          className="px-3 py-1.5 rounded-lg bg-slate-900/80 border border-slate-800 text-slate-300 hover:text-white hover:border-amber-400/50 transition-all flex items-center gap-1.5 text-xs font-mono cursor-pointer"
        >
          <ArrowLeft className="w-3.5 h-3.5 text-amber-400" />
          <span>Exit</span>
        </button>

        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-amber-400 shadow-[0_0_8px_#f59e0b] animate-pulse" />
          <span className="text-xs font-mono tracking-widest text-amber-400 uppercase font-semibold">
            Health Missions
          </span>
        </div>

        {/* Total Score Badge */}
        <div className="flex items-center gap-1.5 px-2.5 py-1 rounded bg-slate-900/90 border border-amber-500/40 text-amber-300 text-xs font-mono">
          <Trophy className="w-3.5 h-3.5 text-amber-400" />
          <span className="font-bold">{totalMarks} Marks</span>
        </div>
      </header>

      {/* Main Stage: Square Box matching Health Detector */}
      <main className="flex-1 flex items-center justify-center py-2 z-10">
        <div className="w-full max-w-[480px] aspect-square rounded-[2.5rem] bg-gradient-to-b from-slate-900/95 via-slate-950/95 to-[#060914] border-2 border-amber-400/40 p-5 sm:p-6 shadow-[0_0_60px_rgba(245,158,11,0.22)] flex flex-col justify-between relative backdrop-blur-2xl transition-all duration-500">
          {/* Subtle Outer Neon Aura Halo */}
          <div className="absolute -inset-1 rounded-[2.75rem] bg-gradient-to-tr from-amber-500/20 via-orange-500/15 to-transparent blur-xl pointer-events-none -z-10" />

          {/* Box Header */}
          <div className="flex items-center justify-between pb-3 border-b border-slate-800/80">
            <div>
              <h2 className="text-sm sm:text-base font-bold font-display tracking-wide text-white flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-amber-400" />
                <span>Astronaut Health Mission</span>
              </h2>
              <p className="text-[10px] text-slate-400 font-mono">
                {boxView === 'input'
                  ? 'Key in your exercise or health deed to earn marks'
                  : 'Flight Surgeon Evaluation & Marks Awarded'}
              </p>
            </div>

            {boxView === 'result' && (
              <button
                onClick={() => {
                  setBoxView('input');
                  setDeedInput('');
                }}
                className="px-2.5 py-1 rounded-lg bg-amber-950/60 border border-amber-500/40 text-[11px] font-mono text-amber-300 hover:bg-amber-900/60 transition-colors flex items-center gap-1 cursor-pointer"
              >
                <RotateCcw className="w-3 h-3" />
                <span>Log Deed</span>
              </button>
            )}
          </div>

          {/* Box Body: Input Mode or Result Mode */}
          {boxView === 'input' ? (
            <div className="flex-1 flex flex-col justify-between py-2 sm:py-3 gap-3">
              {/* Quick 1-tap presets */}
              <div>
                <p className="text-[10px] font-mono text-slate-400 uppercase tracking-wider mb-1.5">
                  Quick Presets:
                </p>
                <div className="grid grid-cols-2 gap-1.5">
                  {presets.map((preset, idx) => {
                    const Icon = preset.icon;
                    return (
                      <button
                        key={idx}
                        onClick={() => handleApplyPreset(preset.text)}
                        className="p-2 rounded-xl bg-slate-900/80 border border-slate-800 hover:border-amber-500/50 hover:bg-amber-500/10 text-left transition-all flex items-center gap-2 group cursor-pointer"
                      >
                        <div className="p-1 rounded-lg bg-amber-500/10 text-amber-400 group-hover:bg-amber-500/20">
                          <Icon className="w-3.5 h-3.5" />
                        </div>
                        <span className="text-[11px] font-mono text-slate-300 group-hover:text-amber-200 truncate">
                          {preset.label}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Text Input */}
              <div className="flex-1 flex flex-col justify-center">
                <label className="text-[10px] font-mono text-slate-400 uppercase tracking-wider mb-1">
                  Describe what you did:
                </label>
                <div className="relative">
                  <textarea
                    value={deedInput}
                    onChange={(e) => setDeedInput(e.target.value)}
                    placeholder="e.g. I did exercise for 30 minutes on the treadmill..."
                    rows={3}
                    className="w-full rounded-xl bg-slate-950/90 border border-slate-800 focus:border-amber-400 focus:ring-1 focus:ring-amber-400 p-3 text-xs sm:text-sm text-slate-200 placeholder-slate-600 font-mono resize-none outline-none transition-all"
                  />
                </div>
              </div>

              {/* Submit Button */}
              <button
                onClick={() => handleSubmitDeed()}
                disabled={!deedInput.trim() || isEvaluating}
                className="w-full py-3 rounded-xl bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600 hover:from-amber-400 hover:to-orange-400 text-slate-950 font-bold text-xs sm:text-sm font-mono transition-all shadow-[0_0_24px_rgba(245,158,11,0.35)] hover:shadow-[0_0_32px_rgba(245,158,11,0.55)] flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed active:scale-[0.98]"
              >
                <Trophy className="w-4 h-4 fill-current" />
                <span>Claim Marks & Feedback</span>
              </button>
            </div>
          ) : (
            <div className="flex-1 flex flex-col justify-between py-2 sm:py-3 gap-2 text-center">
              {isEvaluating ? (
                <div className="flex-1 flex flex-col items-center justify-center gap-3">
                  <div className="w-12 h-12 rounded-full border-4 border-amber-400/20 border-t-amber-400 animate-spin" />
                  <p className="text-xs font-mono text-amber-300">Evaluating health deed & awarding marks...</p>
                </div>
              ) : (
                <>
                  {/* Celebratory Marks Announcement */}
                  <div className="pt-1 flex flex-col items-center">
                    <div className="w-14 h-14 rounded-2xl bg-amber-500/20 border border-amber-400/40 flex items-center justify-center mb-2 shadow-[0_0_20px_rgba(245,158,11,0.3)]">
                      <Trophy className="w-8 h-8 text-amber-400 animate-bounce" />
                    </div>

                    <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-mono font-bold">
                      <Flame className="w-3.5 h-3.5 fill-current" />
                      <span>+{lastResult?.marks || 50} MARKS EARNED!</span>
                    </div>

                    <h3 className="text-sm font-bold text-white mt-1.5 font-display">
                      {lastResult?.badge || 'Spaceflight Health Hero'}
                    </h3>
                  </div>

                  {/* Flight Surgeon Encouragement Box */}
                  <div className="p-3.5 rounded-xl bg-slate-950/80 border border-amber-500/30 text-left">
                    <div className="flex items-center gap-1.5 mb-1 text-[11px] font-mono text-amber-400 font-semibold">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                      <span>Flight Surgeon Encouragement</span>
                    </div>
                    <p className="text-xs text-slate-300 leading-relaxed font-sans">
                      "{lastResult?.encouragement}"
                    </p>
                  </div>

                  {/* Total Marks Banner */}
                  <div className="flex items-center justify-between px-3 py-2 rounded-lg bg-slate-900/90 border border-slate-800 text-[11px] font-mono">
                    <span className="text-slate-400">Total Accumulated Marks:</span>
                    <span className="text-amber-400 font-bold text-xs">{totalMarks} Marks</span>
                  </div>

                  {/* Action Button */}
                  <button
                    onClick={() => {
                      setBoxView('input');
                      setDeedInput('');
                    }}
                    className="w-full py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-slate-950 font-bold text-xs font-mono transition-all shadow-[0_0_20px_rgba(245,158,11,0.3)] cursor-pointer active:scale-[0.98]"
                  >
                    Log Another Deed
                  </button>
                </>
              )}
            </div>
          )}

          {/* Box Footer subtle cue */}
          <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between text-[10px] font-mono text-slate-500">
            <span>D' Physco-Bit Vitality Protocol</span>
            <span className="text-amber-400/80">Active</span>
          </div>
        </div>
      </main>

      {/* Clean Bottom Spacer */}
      <div className="h-2 pointer-events-none" aria-hidden="true" />
    </div>
  );
};
