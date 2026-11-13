import React, { useState } from 'react';
import {
  ArrowLeft,
  ShieldAlert,
  Wind,
  Moon,
  Heart,
  Brain,
  RefreshCw,
  RotateCcw,
  AlertTriangle,
  CheckCircle2,
  ArrowUpRight,
  Stethoscope,
} from 'lucide-react';

export type AppView =
  | 'home'
  | 'hdetector'
  | 'flight-surgeon'
  | 'ai'
  | 'specialists'
  | 'missions'
  | 'gaming'
  | 'music';

interface FlightSurgeonProps {
  onBack: () => void;
  onNavigate: (view: AppView) => void;
}

interface Countermeasure {
  action: string;
  toolkitLabel: string;
  toolkitModule: Exclude<AppView, 'home' | 'flight-surgeon'>;
}

interface FlightSurgeonResult {
  status: 'Nominal' | 'Advisory' | 'Critical';
  exceededBaselines: string[];
  physiologicalCause: string;
  summary: string;
  countermeasures: Countermeasure[];
}

export const FlightSurgeon: React.FC<FlightSurgeonProps> = ({ onBack, onNavigate }) => {
  const [co2, setCo2] = useState<number>(2.1);
  const [sleep, setSleep] = useState<number>(7.0);
  const [heartRate, setHeartRate] = useState<number>(72);
  const [stress, setStress] = useState<'Low' | 'Medium' | 'High' | 'Severe'>('Low');
  const [notes, setNotes] = useState<string>('');

  const [boxView, setBoxView] = useState<'input' | 'result'>('input');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<FlightSurgeonResult | null>(null);

  const applyPreset = (preset: 'nominal' | 'co2' | 'fatigue') => {
    if (preset === 'nominal') {
      setCo2(1.9);
      setSleep(7.5);
      setHeartRate(68);
      setStress('Low');
      setNotes('');
    } else if (preset === 'co2') {
      setCo2(3.8);
      setSleep(6.8);
      setHeartRate(88);
      setStress('Medium');
      setNotes('Mild frontal headache near sleep station vent');
    } else {
      setCo2(2.6);
      setSleep(4.5);
      setHeartRate(102);
      setStress('High');
      setNotes('Difficulty falling asleep after orbital sunrises');
    }
  };

  const handleEvaluate = async () => {
    setIsLoading(true);
    setError(null);
    setBoxView('result');

    try {
      const response = await fetch('/api/flight-surgeon', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          co2,
          sleep,
          heartRate,
          stress,
          notes,
        }),
      });

      if (!response.ok) {
        const errData = await response.json().catch(() => ({}));
        throw new Error(errData.error || 'Flight Surgeon service error');
      }

      const data: FlightSurgeonResult = await response.json();
      setResult(data);
    } catch (err: any) {
      setError(err?.message || 'Unable to reach Flight Surgeon AI API.');
    } finally {
      setIsLoading(false);
    }
  };

  const co2Exceeded = co2 > 3.0;
  const sleepExceeded = sleep < 6.5;
  const hrExceeded = heartRate > 85;
  const stressExceeded = stress === 'High' || stress === 'Severe';

  return (
    <div className="min-h-screen w-full bg-[#050711] text-slate-100 flex flex-col justify-between selection:bg-cyan-500 selection:text-black p-4 sm:p-6 relative overflow-hidden">
      {/* Top Bar */}
      <header className="w-full max-w-xl mx-auto flex items-center justify-between gap-4 z-20">
        <button
          onClick={onBack}
          className="px-3 py-1.5 rounded-lg bg-slate-900/90 border border-slate-800 text-slate-300 hover:text-white hover:border-cyan-400/50 transition-all flex items-center gap-1.5 text-xs font-mono cursor-pointer whitespace-nowrap shrink-0"
        >
          <ArrowLeft className="w-3.5 h-3.5 text-cyan-400" />
          <span>Exit</span>
        </button>

        <span className="text-xs font-mono tracking-widest text-cyan-400 uppercase font-semibold whitespace-nowrap">
          Flight Surgeon
        </span>

        {/* Quick Presets */}
        <div className="flex items-center gap-1 text-[11px] font-mono shrink-0">
          <button
            type="button"
            onClick={() => applyPreset('nominal')}
            className="px-2 py-1 rounded bg-slate-900 border border-slate-800 text-emerald-400 hover:border-emerald-500/50 cursor-pointer whitespace-nowrap"
          >
            Nominal
          </button>
          <button
            type="button"
            onClick={() => applyPreset('co2')}
            className="px-2 py-1 rounded bg-slate-900 border border-slate-800 text-amber-400 hover:border-amber-500/50 cursor-pointer whitespace-nowrap"
          >
            High CO2
          </button>
          <button
            type="button"
            onClick={() => applyPreset('fatigue')}
            className="px-2 py-1 rounded bg-slate-900 border border-slate-800 text-rose-400 hover:border-rose-500/50 cursor-pointer whitespace-nowrap"
          >
            Fatigue
          </button>
        </div>
      </header>

      {/* Main Stage: Centered Precision Console */}
      <main className="flex-1 flex items-center justify-center py-3 z-10">
        <div className="w-full max-w-[520px] min-h-[540px] rounded-3xl bg-slate-950/95 border border-cyan-500/35 p-5 sm:p-6 shadow-[0_0_45px_rgba(6,182,212,0.16)] flex flex-col justify-between relative">
          {/* Card Header */}
          <div className="flex items-center justify-between pb-3 border-b border-slate-800/80">
            <div>
              <h2 className="text-sm sm:text-base font-bold text-white flex items-center gap-2">
                <Stethoscope className="w-4 h-4 text-cyan-400" />
                <span>NASA-STD-3001 Flight Surgeon</span>
              </h2>
              <p className="text-[11px] text-slate-400 font-mono">
                {boxView === 'input'
                  ? 'Baseline check · CO2 ≤ 3.0 mmHg · Sleep ≥ 6.5h'
                  : 'Physiological Cause & Toolkit Countermeasures'}
              </p>
            </div>

            {boxView === 'result' && (
              <button
                type="button"
                onClick={() => setBoxView('input')}
                className="px-2.5 py-1 rounded-lg bg-slate-900 border border-cyan-500/40 text-[11px] font-mono text-cyan-300 hover:bg-slate-800 transition-colors flex items-center gap-1 cursor-pointer whitespace-nowrap shrink-0"
              >
                <RotateCcw className="w-3 h-3" />
                <span>Edit Vitals</span>
              </button>
            )}
          </div>

          {/* VIEW 1: Input Mode */}
          {boxView === 'input' && (
            <div className="flex-1 flex flex-col justify-between py-3 gap-3">
              <div className="grid grid-cols-2 gap-2.5">
                {/* Tile 1: Cabin CO2 */}
                <div
                  className={`p-3 rounded-2xl bg-slate-900/85 border flex flex-col justify-between transition-colors ${
                    co2Exceeded ? 'border-amber-500/60' : 'border-slate-800'
                  }`}
                >
                  <div className="flex items-center justify-between text-[11px] font-mono">
                    <span className="flex items-center gap-1.5 text-cyan-400 font-semibold">
                      <Wind className="w-3.5 h-3.5" />
                      <span>CABIN CO2</span>
                    </span>
                    <span className={co2Exceeded ? 'text-amber-400 font-bold' : 'text-slate-500'}>
                      mmHg
                    </span>
                  </div>

                  <div className="text-center my-1.5">
                    <span
                      className={`text-2xl font-mono font-bold tabular-nums ${
                        co2Exceeded ? 'text-amber-300' : 'text-white'
                      }`}
                    >
                      {co2.toFixed(1)}
                    </span>
                    <span className="block text-[10px] font-mono text-slate-500">
                      {co2Exceeded ? '▲ Exceeds 3.0 limit' : '● Nominal ≤ 3.0'}
                    </span>
                  </div>

                  <div className="flex items-center gap-1.5">
                    <button
                      type="button"
                      onClick={() => setCo2((v) => Math.max(0.5, +(v - 0.2).toFixed(1)))}
                      className="w-7 h-7 rounded-lg bg-slate-800 hover:bg-slate-700 text-white font-mono text-xs flex items-center justify-center cursor-pointer"
                    >
                      -
                    </button>
                    <input
                      type="range"
                      min="0.5"
                      max="6.0"
                      step="0.1"
                      value={co2}
                      onChange={(e) => setCo2(Number(e.target.value))}
                      className="flex-1 accent-cyan-400 h-1.5 bg-slate-800 rounded-lg cursor-pointer"
                    />
                    <button
                      type="button"
                      onClick={() => setCo2((v) => Math.min(6.0, +(v + 0.2).toFixed(1)))}
                      className="w-7 h-7 rounded-lg bg-slate-800 hover:bg-slate-700 text-white font-mono text-xs flex items-center justify-center cursor-pointer"
                    >
                      +
                    </button>
                  </div>
                </div>

                {/* Tile 2: Sleep */}
                <div
                  className={`p-3 rounded-2xl bg-slate-900/85 border flex flex-col justify-between transition-colors ${
                    sleepExceeded ? 'border-amber-500/60' : 'border-slate-800'
                  }`}
                >
                  <div className="flex items-center justify-between text-[11px] font-mono">
                    <span className="flex items-center gap-1.5 text-indigo-400 font-semibold">
                      <Moon className="w-3.5 h-3.5" />
                      <span>SLEEP</span>
                    </span>
                    <span className={sleepExceeded ? 'text-amber-400 font-bold' : 'text-slate-500'}>
                      HOURS
                    </span>
                  </div>

                  <div className="text-center my-1.5">
                    <span
                      className={`text-2xl font-mono font-bold tabular-nums ${
                        sleepExceeded ? 'text-amber-300' : 'text-white'
                      }`}
                    >
                      {sleep.toFixed(1)}
                    </span>
                    <span className="block text-[10px] font-mono text-slate-500">
                      {sleepExceeded ? '▲ Under 6.5h baseline' : '● Nominal ≥ 6.5h'}
                    </span>
                  </div>

                  <div className="flex items-center gap-1.5">
                    <button
                      type="button"
                      onClick={() => setSleep((s) => Math.max(3.0, +(s - 0.5).toFixed(1)))}
                      className="w-7 h-7 rounded-lg bg-slate-800 hover:bg-slate-700 text-white font-mono text-xs flex items-center justify-center cursor-pointer"
                    >
                      -
                    </button>
                    <input
                      type="range"
                      min="3.0"
                      max="10.0"
                      step="0.5"
                      value={sleep}
                      onChange={(e) => setSleep(Number(e.target.value))}
                      className="flex-1 accent-indigo-400 h-1.5 bg-slate-800 rounded-lg cursor-pointer"
                    />
                    <button
                      type="button"
                      onClick={() => setSleep((s) => Math.min(10.0, +(s + 0.5).toFixed(1)))}
                      className="w-7 h-7 rounded-lg bg-slate-800 hover:bg-slate-700 text-white font-mono text-xs flex items-center justify-center cursor-pointer"
                    >
                      +
                    </button>
                  </div>
                </div>

                {/* Tile 3: Heart Rate */}
                <div
                  className={`p-3 rounded-2xl bg-slate-900/85 border flex flex-col justify-between transition-colors ${
                    hrExceeded ? 'border-amber-500/60' : 'border-slate-800'
                  }`}
                >
                  <div className="flex items-center justify-between text-[11px] font-mono">
                    <span className="flex items-center gap-1.5 text-rose-400 font-semibold">
                      <Heart className="w-3.5 h-3.5" />
                      <span>HEART RATE</span>
                    </span>
                    <span className={hrExceeded ? 'text-amber-400 font-bold' : 'text-slate-500'}>
                      BPM
                    </span>
                  </div>

                  <div className="text-center my-1.5">
                    <span
                      className={`text-2xl font-mono font-bold tabular-nums ${
                        hrExceeded ? 'text-amber-300' : 'text-white'
                      }`}
                    >
                      {heartRate}
                    </span>
                    <span className="block text-[10px] font-mono text-slate-500">
                      {hrExceeded ? '▲ Elevated > 85' : '● Nominal 60–85'}
                    </span>
                  </div>

                  <div className="flex items-center gap-1.5">
                    <button
                      type="button"
                      onClick={() => setHeartRate((h) => Math.max(45, h - 2))}
                      className="w-7 h-7 rounded-lg bg-slate-800 hover:bg-slate-700 text-white font-mono text-xs flex items-center justify-center cursor-pointer"
                    >
                      -
                    </button>
                    <input
                      type="range"
                      min="45"
                      max="135"
                      value={heartRate}
                      onChange={(e) => setHeartRate(Number(e.target.value))}
                      className="flex-1 accent-rose-400 h-1.5 bg-slate-800 rounded-lg cursor-pointer"
                    />
                    <button
                      type="button"
                      onClick={() => setHeartRate((h) => Math.min(135, h + 2))}
                      className="w-7 h-7 rounded-lg bg-slate-800 hover:bg-slate-700 text-white font-mono text-xs flex items-center justify-center cursor-pointer"
                    >
                      +
                    </button>
                  </div>
                </div>

                {/* Tile 4: Stress */}
                <div
                  className={`p-3 rounded-2xl bg-slate-900/85 border flex flex-col justify-between transition-colors ${
                    stressExceeded ? 'border-amber-500/60' : 'border-slate-800'
                  }`}
                >
                  <div className="flex items-center justify-between text-[11px] font-mono">
                    <span className="flex items-center gap-1.5 text-purple-400 font-semibold">
                      <Brain className="w-3.5 h-3.5" />
                      <span>STRESS</span>
                    </span>
                    <span className="text-cyan-300 font-bold">{stress}</span>
                  </div>

                  <div className="grid grid-cols-4 gap-1 p-1 bg-slate-950 rounded-xl my-auto">
                    {(['Low', 'Medium', 'High', 'Severe'] as const).map((lvl) => (
                      <button
                        key={lvl}
                        type="button"
                        onClick={() => setStress(lvl)}
                        className={`py-1.5 text-[10px] font-mono rounded-lg transition-colors text-center cursor-pointer ${
                          stress === lvl
                            ? 'bg-cyan-500 text-slate-950 font-bold'
                            : 'text-slate-400 hover:text-white'
                        }`}
                      >
                        {lvl[0]}
                      </button>
                    ))}
                  </div>

                  <span className="text-[10px] text-center font-mono text-slate-500">
                    Low · Med · High · Severe
                  </span>
                </div>
              </div>

              {/* Optional Symptom / Context Input */}
              <div>
                <label className="block text-[10px] font-mono text-slate-400 mb-1">
                  Optional Symptom or Cabin Note
                </label>
                <input
                  type="text"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="e.g. Frontal headache after sleep shift, puffy face..."
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900/90 border border-slate-800 focus:border-cyan-400 text-xs text-slate-100 placeholder:text-slate-600 outline-none transition-colors"
                />
              </div>

              {/* Primary CTA */}
              <button
                type="button"
                onClick={handleEvaluate}
                disabled={isLoading}
                className="w-full py-3 rounded-xl bg-gradient-to-r from-cyan-400 to-blue-500 hover:from-cyan-300 hover:to-blue-400 text-slate-950 font-mono font-bold text-xs sm:text-sm transition-all shadow-[0_0_24px_rgba(6,182,212,0.35)] flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 active:scale-[0.98]"
              >
                <ShieldAlert className="w-4 h-4" />
                <span>Evaluate NASA Baselines</span>
              </button>
            </div>
          )}

          {/* VIEW 2: Result Mode */}
          {boxView === 'result' && (
            <div className="flex-1 flex flex-col justify-between py-3 gap-3 overflow-hidden">
              {isLoading ? (
                <div className="flex-1 flex flex-col items-center justify-center text-center gap-3 py-10">
                  <RefreshCw className="w-8 h-8 text-cyan-400 animate-spin" />
                  <div className="space-y-1">
                    <p className="text-sm font-semibold text-white">
                      Consulting Flight Surgeon AI...
                    </p>
                    <p className="text-[11px] font-mono text-cyan-300">
                      Checking NASA-STD-3001 &amp; HRP baselines
                    </p>
                  </div>
                </div>
              ) : error ? (
                <div className="flex-1 flex flex-col items-center justify-center text-center p-4 text-rose-300 font-mono text-xs gap-3">
                  <AlertTriangle className="w-6 h-6 text-rose-400" />
                  <p>{error}</p>
                  <button
                    type="button"
                    onClick={() => setBoxView('input')}
                    className="px-4 py-2 rounded-lg bg-slate-800 text-white text-xs cursor-pointer"
                  >
                    Back to Vitals
                  </button>
                </div>
              ) : result ? (
                <div className="flex-1 flex flex-col justify-between gap-3 overflow-y-auto pr-1">
                  {/* Status Header */}
                  <div className="flex items-center justify-between px-3.5 py-2.5 rounded-xl bg-slate-900/90 border border-slate-800">
                    <span className="text-xs font-mono text-slate-400">NASA Baseline Status</span>
                    <span
                      className={`text-xs font-mono font-bold flex items-center gap-1.5 ${
                        result.status === 'Critical'
                          ? 'text-rose-400'
                          : result.status === 'Advisory'
                            ? 'text-amber-400'
                            : 'text-emerald-400'
                      }`}
                    >
                      {result.status === 'Critical' ? (
                        <AlertTriangle className="w-3.5 h-3.5" />
                      ) : result.status === 'Advisory' ? (
                        <ShieldAlert className="w-3.5 h-3.5" />
                      ) : (
                        <CheckCircle2 className="w-3.5 h-3.5" />
                      )}
                      <span>
                        {result.status === 'Critical'
                          ? '✖ Critical'
                          : result.status === 'Advisory'
                            ? '▲ Advisory'
                            : '● Nominal'}
                      </span>
                    </span>
                  </div>

                  {/* Exceeded Baselines */}
                  {result.exceededBaselines.length > 0 && (
                    <div className="px-3.5 py-2.5 rounded-xl bg-amber-950/25 border border-amber-500/30 space-y-1">
                      <p className="text-[10px] font-mono uppercase tracking-wider text-amber-300 font-semibold">
                        Exceeded Baselines
                      </p>
                      <ul className="space-y-1 text-xs font-mono text-amber-100">
                        {result.exceededBaselines.map((item, idx) => (
                          <li key={idx}>· {item}</li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {/* Physiological Spaceflight Cause */}
                  <div className="px-3.5 py-3 rounded-xl bg-slate-900/80 border border-slate-800 space-y-1.5">
                    <p className="text-[10px] font-mono uppercase tracking-wider text-cyan-400 font-semibold">
                      Physiological Spaceflight Cause
                    </p>
                    <p className="text-xs text-slate-200 leading-relaxed">
                      {result.physiologicalCause}
                    </p>
                    {result.summary && (
                      <p className="text-[11px] text-slate-400 pt-1 border-t border-slate-800/80">
                        {result.summary}
                      </p>
                    )}
                  </div>

                  {/* Actionable Toolkit Countermeasures */}
                  <div className="space-y-2">
                    <p className="text-[10px] font-mono uppercase tracking-wider text-slate-400 font-semibold">
                      Recommended Toolkit Countermeasures
                    </p>
                    <div className="space-y-2">
                      {result.countermeasures.map((cm, idx) => (
                        <div
                          key={idx}
                          className="p-3 rounded-xl bg-slate-900/90 border border-slate-800 flex items-center justify-between gap-3"
                        >
                          <p className="text-xs text-slate-200 leading-snug flex-1">{cm.action}</p>
                          <button
                            type="button"
                            onClick={() => onNavigate(cm.toolkitModule)}
                            className="px-3 py-1.5 rounded-lg bg-cyan-500/15 hover:bg-cyan-500/25 border border-cyan-400/40 text-cyan-300 text-[11px] font-mono font-semibold flex items-center gap-1 cursor-pointer whitespace-nowrap shrink-0 transition-colors"
                          >
                            <span>{cm.toolkitLabel}</span>
                            <ArrowUpRight className="w-3 h-3" />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              ) : null}

              {!isLoading && !error && (
                <button
                  type="button"
                  onClick={() => setBoxView('input')}
                  className="w-full py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-cyan-500/40 text-cyan-300 font-mono text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Re-evaluate Vitals</span>
                </button>
              )}
            </div>
          )}

          {/* Footer line */}
          <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between text-[10px] font-mono text-slate-500">
            <span>NASA-STD-3001 · HRP Guidelines</span>
            <span>D&apos; Physco-Bit</span>
          </div>
        </div>
      </main>

      <div className="h-2 pointer-events-none" aria-hidden="true" />
    </div>
  );
};
