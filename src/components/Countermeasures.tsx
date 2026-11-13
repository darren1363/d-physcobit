import React, { useState } from 'react';
import {
  Dumbbell,
  Timer,
  CheckCircle2,
  Flame,
  ArrowRight,
  TrendingUp,
  Activity,
  Layers,
  Sparkles,
} from 'lucide-react';
import { soundFX } from '../utils/audio';

interface ExerciseSession {
  id: string;
  name: string;
  hardware: string;
  durationMinutes: number;
  completedMinutes: number;
  loadTarget: string;
  mitigationFocus: string;
  status: 'completed' | 'in-progress' | 'scheduled';
}

export const Countermeasures: React.FC = () => {
  const [sessions, setSessions] = useState<ExerciseSession[]>([
    {
      id: 'ared',
      name: 'ARED Heavy Resistive Protocol',
      hardware: 'Vacuum Cylinder Resistive System (ARED)',
      durationMinutes: 60,
      completedMinutes: 60,
      loadTarget: '480 lbs (Vacuum-Load Equivalent)',
      mitigationFocus: 'Spine, Femur & Pelvic Trabecular Bone Demineralization',
      status: 'completed',
    },
    {
      id: 'cycle',
      name: 'Cardiovascular Ergometer Sprint',
      hardware: 'T2 Cycle Ergometer w/ Vibration Isolation',
      durationMinutes: 45,
      completedMinutes: 30,
      loadTarget: '220 Watts @ 85 RPM',
      mitigationFocus: 'Myocardial Stroke Volume & Aerobic VO2 Max Preservation',
      status: 'in-progress',
    },
    {
      id: 'lbnp',
      name: 'Cephalic Fluid Shift Reversal (LBNP)',
      hardware: 'Chibis Negative Pressure Vacuum Suit',
      durationMinutes: 35,
      completedMinutes: 0,
      loadTarget: '-35 mmHg Lower Chamber Vacuum',
      mitigationFocus: 'Intracranial Pressure (SANS) Decompression & Orthostatic Conditioning',
      status: 'scheduled',
    },
  ]);

  const [activeSessionId, setActiveSessionId] = useState<string>('cycle');

  const handleToggleComplete = (id: string) => {
    soundFX.playSuccess();
    setSessions((prev) =>
      prev.map((s) => {
        if (s.id === id) {
          const nextStatus = s.status === 'completed' ? 'scheduled' : 'completed';
          return {
            ...s,
            status: nextStatus,
            completedMinutes: nextStatus === 'completed' ? s.durationMinutes : 0,
          };
        }
        return s;
      })
    );
  };

  const totalTargetMinutes = sessions.reduce((acc, s) => acc + s.durationMinutes, 0);
  const totalCompletedMinutes = sessions.reduce((acc, s) => acc + s.completedMinutes, 0);
  const completionPercent = Math.round((totalCompletedMinutes / totalTargetMinutes) * 100);

  return (
    <section id="countermeasures" className="relative z-10 py-12 border-b border-slate-800/80 bg-[#060a14]/60">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 pb-4 border-b border-slate-800">
          <div>
            <div className="text-xs font-mono uppercase tracking-wider text-cyan-400 mb-1">
              Physiological Countermeasures & Workout Telemetry
            </div>
            <h2
              className="text-2xl sm:text-3xl font-bold tracking-tight text-white"
              style={{ fontFamily: 'var(--font-display)' }}
            >
              Daily 2.5-Hour Microgravity Resistance Regimen
            </h2>
          </div>

          <div className="mt-4 md:mt-0 flex items-center gap-3">
            <div className="text-right">
              <span className="text-[11px] font-mono text-slate-400 block">DAILY PROGRESS</span>
              <span className="text-lg font-mono font-bold text-cyan-400">
                {totalCompletedMinutes} / {totalTargetMinutes} <span className="text-xs text-slate-400">MIN</span>
              </span>
            </div>
            <div className="w-16 h-16 rounded-full bg-slate-900 border-2 border-cyan-500/40 flex items-center justify-center text-xs font-mono font-bold text-white shadow-[0_0_12px_rgba(6,182,212,0.2)]">
              {completionPercent}%
            </div>
          </div>
        </div>

        {/* Countermeasure Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {sessions.map((session) => {
            const isCompleted = session.status === 'completed';
            const isInProgress = session.status === 'in-progress';

            return (
              <div
                key={session.id}
                className={`p-6 rounded-xl border transition-all flex flex-col justify-between space-y-4 ${
                  activeSessionId === session.id
                    ? 'bg-slate-900/90 border-cyan-500/50 shadow-lg'
                    : 'bg-slate-900/60 border-slate-800 hover:border-slate-700'
                }`}
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between text-xs font-mono">
                    <span className="text-cyan-400 font-semibold uppercase">{session.hardware}</span>
                    <span
                      className={`text-[11px] font-mono ${
                        isCompleted
                          ? 'text-emerald-400'
                          : isInProgress
                          ? 'text-cyan-400 animate-pulse'
                          : 'text-slate-500'
                      }`}
                    >
                      {isCompleted ? '● COMPLETED' : isInProgress ? '▶ RUNNING' : '○ QUEUED'}
                    </span>
                  </div>

                  <h3 className="text-lg font-bold text-white" style={{ fontFamily: 'var(--font-display)' }}>
                    {session.name}
                  </h3>

                  <p className="text-xs text-slate-300 leading-relaxed">
                    {session.mitigationFocus}
                  </p>

                  <div className="p-3 rounded-lg bg-slate-950/70 border border-slate-800/80 text-xs font-mono space-y-1">
                    <div className="flex justify-between text-slate-400">
                      <span>Target Resistance:</span>
                      <strong className="text-slate-200">{session.loadTarget}</strong>
                    </div>
                    <div className="flex justify-between text-slate-400">
                      <span>Prescribed Time:</span>
                      <strong className="text-cyan-400">{session.durationMinutes} min</strong>
                    </div>
                  </div>
                </div>

                <div className="pt-3 border-t border-slate-800 flex items-center justify-between">
                  <button
                    onClick={() => {
                      soundFX.playBeep(650, 0.04);
                      setActiveSessionId(session.id);
                    }}
                    className="text-xs font-mono text-cyan-400 hover:text-cyan-300 flex items-center gap-1 cursor-pointer"
                  >
                    <span>Inspect Metrics</span>
                    <ArrowRight className="w-3 h-3" />
                  </button>

                  <button
                    onClick={() => handleToggleComplete(session.id)}
                    className={`px-3 py-1.5 rounded text-xs font-mono font-medium transition-all cursor-pointer flex items-center gap-1.5 ${
                      isCompleted
                        ? 'bg-emerald-950/60 text-emerald-300 border border-emerald-500/40 hover:bg-emerald-900/60'
                        : 'bg-slate-800 hover:bg-slate-700 text-slate-200'
                    }`}
                  >
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>{isCompleted ? 'Done' : 'Mark Done'}</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* Scientific Rationale Banner */}
        <div className="mt-8 p-4 rounded-xl bg-slate-900/40 border border-slate-800/80 flex flex-col md:flex-row md:items-center justify-between gap-4 text-xs font-mono text-slate-300">
          <div className="flex items-center gap-3">
            <span className="p-2 rounded bg-cyan-950/60 border border-cyan-800/50 text-cyan-400 shrink-0">
              <Sparkles className="w-4 h-4" />
            </span>
            <span>
              <strong>Clinical Rationale:</strong> Without 2.5 hours of daily axial resistive loading and cardiovascular exertion,
              astronauts lose up to 20% of muscle mass and 1-2% of lumbar bone mineral density every 30 days in microgravity.
            </span>
          </div>

          <div className="shrink-0 text-cyan-400">
            NASA / ESA Joint Health Standard
          </div>
        </div>
      </div>
    </section>
  );
};
