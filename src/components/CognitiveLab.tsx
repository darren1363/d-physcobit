import React, { useState } from 'react';
import {
  Brain,
  Sparkles,
  Smile,
  AlertTriangle,
  Play,
  RotateCcw,
  CheckCircle,
  Timer,
  Compass,
  Headphones,
  Sun,
  Eye,
  MessageSquare,
} from 'lucide-react';
import { soundFX } from '../utils/audio';

export const CognitiveLab: React.FC = () => {
  // Reaction test state
  const [testState, setTestState] = useState<'idle' | 'ready' | 'target' | 'result'>('idle');
  const [targetDir, setTargetDir] = useState<'UP' | 'DOWN' | 'LEFT' | 'RIGHT'>('UP');
  const [startTime, setStartTime] = useState<number>(0);
  const [reactionTime, setReactionTime] = useState<number | null>(null);
  const [reactionAccuracy, setReactionAccuracy] = useState<boolean>(true);

  // Psychological slider state
  const [isolationDays, setIsolationDays] = useState(148);
  const [sleepQuality, setSleepQuality] = useState(82);
  const [earthCommDelay, setEarthCommDelay] = useState(4.2); // seconds (or minutes in deep space)
  const [exerciseCompliance, setExerciseCompliance] = useState(95);

  const startTest = () => {
    soundFX.playBeep(500, 0.08);
    setTestState('ready');
    const delay = Math.floor(Math.random() * 2000) + 1000;

    const directions: ('UP' | 'DOWN' | 'LEFT' | 'RIGHT')[] = ['UP', 'DOWN', 'LEFT', 'RIGHT'];
    const chosen = directions[Math.floor(Math.random() * directions.length)];

    setTimeout(() => {
      setTargetDir(chosen);
      setStartTime(performance.now());
      setTestState('target');
      soundFX.playBeep(900, 0.05);
    }, delay);
  };

  const handleDirectionPress = (dir: 'UP' | 'DOWN' | 'LEFT' | 'RIGHT') => {
    if (testState !== 'target') return;
    const elapsed = Math.round(performance.now() - startTime);
    const correct = dir === targetDir;
    setReactionTime(elapsed);
    setReactionAccuracy(correct);
    setTestState('result');

    if (correct) {
      soundFX.playSuccess();
    } else {
      soundFX.playWarning();
    }
  };

  // Psychological resilience computation
  const baseResilience = Math.round(
    (sleepQuality * 0.4) +
    (exerciseCompliance * 0.3) +
    Math.max(10, 100 - (isolationDays * 0.15)) * 0.2 +
    Math.max(20, 100 - (earthCommDelay * 8)) * 0.1
  );

  return (
    <section id="cognitive" className="relative z-10 py-12 border-b border-slate-800/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="mb-8">
          <div className="text-xs font-mono uppercase tracking-wider text-cyan-400 mb-1">
            Psychological & Neuro-Cognitive Telemetry
          </div>
          <h2
            className="text-2xl sm:text-3xl font-bold tracking-tight text-white"
            style={{ fontFamily: 'var(--font-display)' }}
          >
            Psychological Strain & Spatial Orientation Lab
          </h2>
          <p className="text-sm text-slate-300 mt-2 max-w-2xl">
            In interplanetary transit, sensory monotony and communication latencies strain crew mental agility.
            Test reaction speed against zero-G vestibular reweighting and evaluate psychological resilience factors.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Left Column: Interactive Spatial Orientation Reflex Test */}
          <div className="lg:col-span-6 p-6 rounded-xl bg-slate-900/80 border border-slate-800 flex flex-col justify-between space-y-6">
            <div>
              <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                <span className="text-xs font-mono uppercase tracking-wider text-cyan-400 flex items-center gap-1.5">
                  <Compass className="w-4 h-4 text-cyan-400" />
                  <span>Vestibular Reflex & Spatial Drift Test</span>
                </span>
                <span className="text-[11px] font-mono text-slate-400">
                  COGNITIVE LATENCY
                </span>
              </div>

              <p className="text-xs text-slate-300 mt-3 leading-relaxed">
                When weightless, the otolith organs no longer register gravity's downward vector.
                Astronauts experience sensory conflicts between visual cues and semicircular canals.
              </p>

              {/* Test Canvas Box */}
              <div className="mt-5 h-48 rounded-lg bg-slate-950 border border-slate-800/90 flex flex-col items-center justify-center relative overflow-hidden">
                {testState === 'idle' && (
                  <div className="text-center space-y-3">
                    <Brain className="w-10 h-10 text-cyan-400 mx-auto opacity-70 animate-pulse" />
                    <p className="text-xs text-slate-400 font-mono">
                      Test your spatial orientation reaction time
                    </p>
                    <button
                      onClick={startTest}
                      className="px-4 py-2 bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold rounded-lg text-xs font-mono transition-colors flex items-center gap-2 mx-auto cursor-pointer"
                    >
                      <Play className="w-3.5 h-3.5 fill-current" />
                      <span>START REFLEX TEST</span>
                    </button>
                  </div>
                )}

                {testState === 'ready' && (
                  <div className="text-center space-y-2">
                    <span className="w-4 h-4 rounded-full bg-amber-400 animate-ping inline-block" />
                    <p className="text-sm font-mono text-amber-300 font-bold uppercase tracking-wider">
                      STANDBY FOR DRIFT VECTOR...
                    </p>
                    <span className="text-[11px] font-mono text-slate-500">
                      Do not click until vector appears
                    </span>
                  </div>
                )}

                {testState === 'target' && (
                  <div className="text-center space-y-2 animate-bounce">
                    <span className="text-3xl font-mono font-extrabold text-cyan-300 bg-cyan-950/80 px-4 py-1.5 rounded-lg border border-cyan-400">
                      STABILIZE: {targetDir}
                    </span>
                    <p className="text-xs font-mono text-cyan-400">
                      Click the matching thruster control below!
                    </p>
                  </div>
                )}

                {testState === 'result' && (
                  <div className="text-center space-y-2">
                    {reactionAccuracy ? (
                      <>
                        <div className="flex items-center justify-center gap-1.5 text-emerald-400 font-mono font-bold text-sm">
                          <CheckCircle className="w-4 h-4" />
                          <span>THRUSTER STABILIZED</span>
                        </div>
                        <div className="text-3xl font-mono font-bold text-white tabular-nums">
                          {reactionTime} <span className="text-xs text-slate-400">ms</span>
                        </div>
                        <span className="text-[11px] font-mono text-emerald-300">
                          {reactionTime && reactionTime < 350
                            ? 'Optimal Combat Readiness (<350ms)'
                            : 'Normal Astronaut Spatial Latency'}
                        </span>
                      </>
                    ) : (
                      <>
                        <div className="flex items-center justify-center gap-1.5 text-rose-400 font-mono font-bold text-sm">
                          <AlertTriangle className="w-4 h-4" />
                          <span>INCORRECT VECTOR INPUT</span>
                        </div>
                        <span className="text-xs font-mono text-slate-400">
                          Sensory Conflict Error · Vestibular Confusion
                        </span>
                      </>
                    )}
                    <button
                      onClick={startTest}
                      className="mt-2 text-xs font-mono text-cyan-400 hover:text-cyan-300 flex items-center gap-1 mx-auto cursor-pointer"
                    >
                      <RotateCcw className="w-3 h-3" />
                      <span>Retest</span>
                    </button>
                  </div>
                )}
              </div>

              {/* Thruster Direction Controls */}
              <div className="mt-4 grid grid-cols-4 gap-2">
                {(['UP', 'DOWN', 'LEFT', 'RIGHT'] as const).map((dir) => (
                  <button
                    key={dir}
                    onClick={() => {
                      soundFX.playBeep(700, 0.03);
                      handleDirectionPress(dir);
                    }}
                    disabled={testState !== 'target'}
                    className={`py-2 px-1 text-xs font-mono font-semibold rounded border transition-all text-center cursor-pointer ${
                      testState === 'target'
                        ? 'bg-cyan-950/70 border-cyan-500/60 text-cyan-300 hover:bg-cyan-500 hover:text-slate-950'
                        : 'bg-slate-950/40 border-slate-800 text-slate-600 cursor-not-allowed'
                    }`}
                  >
                    {dir}
                  </button>
                ))}
              </div>
            </div>

            <div className="text-[11px] font-mono text-slate-400 flex items-center justify-between pt-2 border-t border-slate-800">
              <span>NASA Standard Reaction Threshold:</span>
              <strong className="text-white">&lt; 420 ms</strong>
            </div>
          </div>

          {/* Right Column: Psychological Isolation & Resilience Simulator */}
          <div className="lg:col-span-6 p-6 rounded-xl bg-slate-900/80 border border-slate-800 space-y-6">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <span className="text-xs font-mono uppercase tracking-wider text-cyan-400 flex items-center gap-1.5">
                <Brain className="w-4 h-4 text-cyan-400" />
                <span>Crew Psychological Strain Index</span>
              </span>
              <div className="flex items-center gap-2">
                <span className="text-xs font-mono text-slate-400">RESILIENCE:</span>
                <span className="text-sm font-mono font-bold text-cyan-400 bg-cyan-950 px-2 py-0.5 rounded border border-cyan-800">
                  {baseResilience} / 100
                </span>
              </div>
            </div>

            {/* Sliders for Simulation */}
            <div className="space-y-4">
              {/* Slider 1: Mission Days in Confined Space */}
              <div className="space-y-1">
                <div className="flex justify-between text-xs font-mono">
                  <span className="text-slate-300">Days in Confined Module</span>
                  <span className="text-cyan-400 font-bold tabular-nums">{isolationDays} Days</span>
                </div>
                <input
                  type="range"
                  min="30"
                  max="500"
                  value={isolationDays}
                  onChange={(e) => {
                    soundFX.playBeep(450, 0.02);
                    setIsolationDays(Number(e.target.value));
                  }}
                  className="w-full accent-cyan-400 bg-slate-800 rounded-lg cursor-pointer"
                />
              </div>

              {/* Slider 2: Sleep Architecture Quality */}
              <div className="space-y-1">
                <div className="flex justify-between text-xs font-mono">
                  <span className="text-slate-300">Sleep Quality & Architecture</span>
                  <span className="text-cyan-400 font-bold tabular-nums">{sleepQuality} %</span>
                </div>
                <input
                  type="range"
                  min="30"
                  max="100"
                  value={sleepQuality}
                  onChange={(e) => {
                    soundFX.playBeep(520, 0.02);
                    setSleepQuality(Number(e.target.value));
                  }}
                  className="w-full accent-cyan-400 bg-slate-800 rounded-lg cursor-pointer"
                />
              </div>

              {/* Slider 3: Earth Comms One-Way Latency */}
              <div className="space-y-1">
                <div className="flex justify-between text-xs font-mono">
                  <span className="text-slate-300">Earth Comms One-Way Latency</span>
                  <span className="text-cyan-400 font-bold tabular-nums">{earthCommDelay} min</span>
                </div>
                <input
                  type="range"
                  min="0.5"
                  max="20"
                  step="0.5"
                  value={earthCommDelay}
                  onChange={(e) => {
                    soundFX.playBeep(590, 0.02);
                    setEarthCommDelay(Number(e.target.value));
                  }}
                  className="w-full accent-cyan-400 bg-slate-800 rounded-lg cursor-pointer"
                />
              </div>

              {/* Slider 4: Exercise Countermeasure Compliance */}
              <div className="space-y-1">
                <div className="flex justify-between text-xs font-mono">
                  <span className="text-slate-300">Physical Exercise Compliance</span>
                  <span className="text-cyan-400 font-bold tabular-nums">{exerciseCompliance} %</span>
                </div>
                <input
                  type="range"
                  min="20"
                  max="100"
                  value={exerciseCompliance}
                  onChange={(e) => {
                    soundFX.playBeep(660, 0.02);
                    setExerciseCompliance(Number(e.target.value));
                  }}
                  className="w-full accent-cyan-400 bg-slate-800 rounded-lg cursor-pointer"
                />
              </div>
            </div>

            {/* Prescribed Psychological Countermeasures */}
            <div className="space-y-2 pt-2 border-t border-slate-800">
              <span className="text-xs font-mono uppercase tracking-wider text-slate-400 block">
                Prescribed Psycho-Social Interventions:
              </span>
              <div className="grid grid-cols-2 gap-2 text-xs font-mono">
                <div className="p-2.5 rounded bg-slate-950/70 border border-slate-800 flex items-center gap-2">
                  <Headphones className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                  <span className="text-slate-300 truncate">Binaural Soundscape (Rainforest)</span>
                </div>
                <div className="p-2.5 rounded bg-slate-950/70 border border-slate-800 flex items-center gap-2">
                  <Sun className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                  <span className="text-slate-300 truncate">Circadian LED Shift (460nm)</span>
                </div>
                <div className="p-2.5 rounded bg-slate-950/70 border border-slate-800 flex items-center gap-2">
                  <Eye className="w-3.5 h-3.5 text-indigo-400 shrink-0" />
                  <span className="text-slate-300 truncate">Cupola Earth Observation</span>
                </div>
                <div className="p-2.5 rounded bg-slate-950/70 border border-slate-800 flex items-center gap-2">
                  <MessageSquare className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                  <span className="text-slate-300 truncate">Buffered Family Uplink</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
