import React, { useState, useMemo } from 'react';
import {
  ArrowLeft,
  Heart,
  Moon,
  Dumbbell,
  Brain,
  Sparkles,
  Activity,
  RefreshCw,
  AlertTriangle,
  RotateCcw,
  Wind,
  Radiation,
  Gauge,
  CheckCircle2,
} from 'lucide-react';
import nasaBaselines from '../data/nasaBaselines.json';

interface HDetectorProps {
  onBack: () => void;
}

interface BaselineComparisonRow {
  id: string;
  label: string;
  currentDisplay: string;
  baselineDisplay: string;
  variancePct: number;
  varianceDisplay: string;
  inRange: boolean;
}

function calcRangeVariancePct(value: number, min: number, max: number): { pct: number; inRange: boolean } {
  if (value < min) {
    const pct = -((min - value) / min) * 100;
    return { pct, inRange: false };
  }
  if (value > max) {
    const pct = ((value - max) / max) * 100;
    return { pct, inRange: false };
  }
  const midpoint = (min + max) / 2;
  const pct = ((value - midpoint) / midpoint) * 100;
  return { pct, inRange: true };
}

function calcUpperLimitVariancePct(value: number, limit: number): { pct: number; inRange: boolean } {
  const pct = ((value - limit) / limit) * 100;
  return { pct, inRange: value <= limit };
}

export const HDetector: React.FC<HDetectorProps> = ({ onBack }) => {
  // Core Physiological & Environmental Inputs
  const [heartRate, setHeartRate] = useState<number>(70);
  const [sleep, setSleep] = useState<number>(7.5);
  const [exercise, setExercise] = useState<number>(60);
  const [stressIndex, setStressIndex] = useState<number>(28);
  const [systolicBp, setSystolicBp] = useState<number>(115);
  const [diastolicBp, setDiastolicBp] = useState<number>(74);
  const [cabinCo2, setCabinCo2] = useState<number>(2.1);
  const [radiation, setRadiation] = useState<number>(0.32);

  // Active view inside the box: 'input' or 'result'
  const [boxView, setBoxView] = useState<'input' | 'result'>('input');

  // AI response state
  const [aiAnalysis, setAiAnalysis] = useState<string | null>(null);
  const [isLoadingAi, setIsLoadingAi] = useState<boolean>(false);
  const [aiError, setAiError] = useState<string | null>(null);

  // Map 0-100 Stress/Cortisol index to categorical stress level for AI diagnosis
  const stressCategory: 'Low' | 'Medium' | 'High' | 'Severe' =
    stressIndex > 85 ? 'Severe' : stressIndex > 70 ? 'High' : stressIndex > 40 ? 'Medium' : 'Low';

  // Compare current vitals against official NASA-STD-3001 & NASA HRP baselines
  const baselineComparisons = useMemo<BaselineComparisonRow[]>(() => {
    const b = nasaBaselines.baselines;

    const hrVar = calcRangeVariancePct(heartRate, b.restingHeartRate.min, b.restingHeartRate.max);

    const sysVar = calcRangeVariancePct(
      systolicBp,
      b.bloodPressure.systolicMin,
      b.bloodPressure.systolicMax
    );
    const diaVar = calcRangeVariancePct(
      diastolicBp,
      b.bloodPressure.diastolicMin,
      b.bloodPressure.diastolicMax
    );
    const bpInRange = sysVar.inRange && diaVar.inRange;
    const bpDominantPct = Math.abs(sysVar.pct) >= Math.abs(diaVar.pct) ? sysVar.pct : diaVar.pct;

    const co2Var = calcUpperLimitVariancePct(cabinCo2, b.cabinCo2.max);
    const radVar = calcUpperLimitVariancePct(radiation, b.radiationExposure.max);
    const sleepVar = calcRangeVariancePct(sleep, b.sleepDuration.min, b.sleepDuration.max);
    const stressVar = calcUpperLimitVariancePct(stressIndex, b.stressCortisolIndex.alertThreshold);

    const formatPct = (pct: number, inRange: boolean, mode: 'range' | 'limit') => {
      const sign = pct > 0 ? '+' : '';
      if (inRange) {
        return mode === 'range'
          ? `${sign}${pct.toFixed(1)}% vs mid`
          : `${pct.toFixed(1)}% under limit`;
      }
      return `${sign}${pct.toFixed(1)}% variance`;
    };

    return [
      {
        id: 'hr',
        label: b.restingHeartRate.label,
        currentDisplay: `${heartRate} bpm`,
        baselineDisplay: `${b.restingHeartRate.min}–${b.restingHeartRate.max} bpm`,
        variancePct: hrVar.pct,
        varianceDisplay: formatPct(hrVar.pct, hrVar.inRange, 'range'),
        inRange: hrVar.inRange,
      },
      {
        id: 'bp',
        label: b.bloodPressure.label,
        currentDisplay: `${systolicBp}/${diastolicBp} mmHg`,
        baselineDisplay: `${b.bloodPressure.systolicMin}/${b.bloodPressure.diastolicMin}–${b.bloodPressure.systolicMax}/${b.bloodPressure.diastolicMax}`,
        variancePct: bpDominantPct,
        varianceDisplay: formatPct(bpDominantPct, bpInRange, 'range'),
        inRange: bpInRange,
      },
      {
        id: 'co2',
        label: b.cabinCo2.label,
        currentDisplay: `${cabinCo2.toFixed(1)} mmHg`,
        baselineDisplay: `< ${b.cabinCo2.max.toFixed(1)} mmHg (4,000 ppm)`,
        variancePct: co2Var.pct,
        varianceDisplay: formatPct(co2Var.pct, co2Var.inRange, 'limit'),
        inRange: co2Var.inRange,
      },
      {
        id: 'rad',
        label: b.radiationExposure.label,
        currentDisplay: `${radiation.toFixed(2)} mSv/d`,
        baselineDisplay: `< ${b.radiationExposure.max.toFixed(1)} mSv/day LEO`,
        variancePct: radVar.pct,
        varianceDisplay: formatPct(radVar.pct, radVar.inRange, 'limit'),
        inRange: radVar.inRange,
      },
      {
        id: 'sleep',
        label: b.sleepDuration.label,
        currentDisplay: `${sleep.toFixed(1)} hrs`,
        baselineDisplay: `${b.sleepDuration.min}–${b.sleepDuration.max} hrs/cycle`,
        variancePct: sleepVar.pct,
        varianceDisplay: formatPct(sleepVar.pct, sleepVar.inRange, 'range'),
        inRange: sleepVar.inRange,
      },
      {
        id: 'stress',
        label: b.stressCortisolIndex.label,
        currentDisplay: `${stressIndex} / 100`,
        baselineDisplay: `0–100 (alert > ${b.stressCortisolIndex.alertThreshold})`,
        variancePct: stressVar.pct,
        varianceDisplay: formatPct(stressVar.pct, stressVar.inRange, 'limit'),
        inRange: stressVar.inRange,
      },
    ];
  }, [heartRate, systolicBp, diastolicBp, cabinCo2, radiation, sleep, stressIndex]);

  const alertCount = baselineComparisons.filter((row) => !row.inRange).length;

  // Quick Presets matching the 3 conditions
  const applyPreset = (type: 'great' | 'problem' | 'danger') => {
    if (type === 'great') {
      setHeartRate(68);
      setSleep(7.5);
      setExercise(60);
      setStressIndex(24);
      setSystolicBp(116);
      setDiastolicBp(74);
      setCabinCo2(1.9);
      setRadiation(0.32);
    } else if (type === 'problem') {
      setHeartRate(89);
      setSleep(5.5);
      setExercise(25);
      setStressIndex(74);
      setSystolicBp(134);
      setDiastolicBp(86);
      setCabinCo2(3.4);
      setRadiation(0.46);
    } else {
      setHeartRate(114);
      setSleep(3.5);
      setExercise(10);
      setStressIndex(92);
      setSystolicBp(146);
      setDiastolicBp(94);
      setCabinCo2(4.4);
      setRadiation(0.72);
    }
  };

  // Submit to Flight Surgeon AI for natural language analysis
  const handleAnalyze = async () => {
    setIsLoadingAi(true);
    setAiError(null);
    setBoxView('result');

    try {
      const response = await fetch('/api/analyze-health', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          heartRate,
          sleep,
          exercise,
          stress: stressCategory,
        }),
      });

      if (!response.ok) {
        const err = await response.json();
        throw new Error(err.error || 'Diagnostic service error');
      }

      const data = await response.json();
      setAiAnalysis(data.analysis);
    } catch (err: any) {
      console.error('Diagnosis error:', err);
      setAiError(err.message || 'Could not connect to Health Detector.');
    } finally {
      setIsLoadingAi(false);
    }
  };

  return (
    <div className="min-h-screen w-full bg-[#050711] text-slate-100 flex flex-col justify-between selection:bg-cyan-500 selection:text-black p-4 sm:p-6 relative overflow-hidden">
      {/* Top Bar */}
      <header className="w-full max-w-2xl mx-auto flex items-center justify-between gap-2 z-20">
        <button
          onClick={onBack}
          className="px-3 py-1.5 rounded-lg bg-slate-900/80 border border-slate-800 text-slate-300 hover:text-white hover:border-cyan-400/50 transition-all flex items-center gap-1.5 text-xs font-mono cursor-pointer whitespace-nowrap shrink-0"
        >
          <ArrowLeft className="w-3.5 h-3.5 text-cyan-400" />
          <span>Exit</span>
        </button>

        <div className="flex items-center gap-2">
          <span className="text-xs font-mono tracking-widest text-cyan-400 uppercase font-semibold whitespace-nowrap">
            Health Detector
          </span>
        </div>

        {/* Quick Test Presets */}
        <div className="flex items-center gap-1 text-[11px] font-mono shrink-0">
          <button
            onClick={() => applyPreset('great')}
            className="px-2 py-1 rounded bg-slate-900 border border-slate-800 text-emerald-400 hover:border-emerald-500/50 cursor-pointer whitespace-nowrap"
            title="Nominal NASA Baselines"
          >
            Great
          </button>
          <button
            onClick={() => applyPreset('problem')}
            className="px-2 py-1 rounded bg-slate-900 border border-slate-800 text-amber-400 hover:border-amber-500/50 cursor-pointer whitespace-nowrap"
            title="Exceeds Some Baselines"
          >
            Problem
          </button>
          <button
            onClick={() => applyPreset('danger')}
            className="px-2 py-1 rounded bg-slate-900 border border-slate-800 text-rose-400 hover:border-rose-500/50 cursor-pointer whitespace-nowrap"
            title="Critical Threshold Alert"
          >
            Danger
          </button>
        </div>
      </header>

      {/* Main Stage */}
      <main className="flex-1 flex items-center justify-center py-3 z-10">
        <div className="w-full max-w-[540px] rounded-[2rem] bg-gradient-to-b from-slate-900/95 via-slate-950/95 to-[#060914] border-2 border-cyan-400/40 p-5 sm:p-6 shadow-[0_0_50px_rgba(6,182,212,0.2)] flex flex-col justify-between relative backdrop-blur-2xl">
          {/* Box Header */}
          <div className="flex items-start justify-between gap-3 pb-3 border-b border-slate-800/80">
            <div>
              <h2 className="text-sm sm:text-base font-bold font-display tracking-wide text-white flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-cyan-400" />
                <span>Astronaut Health Scanner</span>
              </h2>
              <div className="mt-1 flex flex-wrap items-center gap-2 text-[10px] font-mono">
                <span className="px-2 py-0.5 rounded bg-cyan-950/70 border border-cyan-500/35 text-cyan-300">
                  Baseline Source: {nasaBaselines.source}
                </span>
                <span className={alertCount > 0 ? 'text-amber-400 font-semibold' : 'text-emerald-400'}>
                  {alertCount > 0 ? `▲ ${alertCount} Out of Baseline` : '● All Baselines Nominal'}
                </span>
              </div>
            </div>

            {boxView === 'result' && (
              <button
                onClick={() => setBoxView('input')}
                className="px-2.5 py-1 rounded-lg bg-cyan-950/60 border border-cyan-500/40 text-[11px] font-mono text-cyan-300 hover:bg-cyan-900/60 transition-colors flex items-center gap-1 cursor-pointer whitespace-nowrap shrink-0"
              >
                <RotateCcw className="w-3 h-3" />
                <span>Change Vitals</span>
              </button>
            )}
          </div>

          {/* VIEW 1: Input Mode */}
          {boxView === 'input' && (
            <div className="flex-1 flex flex-col justify-between py-3 space-y-3">
              {/* Primary 2x2 Interactive Vitals Grid */}
              <div className="grid grid-cols-2 gap-2.5">
                {/* Tile 1: Resting Heart Rate */}
                <div className="p-3 rounded-2xl bg-slate-900/80 border border-slate-800/80 flex flex-col justify-between hover:border-cyan-500/40 transition-colors">
                  <div className="flex items-center justify-between text-xs font-mono text-slate-400">
                    <span className="flex items-center gap-1.5 text-rose-400">
                      <Heart
                        className="w-3.5 h-3.5 fill-current animate-pulse"
                        style={{ animationDuration: `${Math.max(0.4, 60 / heartRate)}s` }}
                      />
                      <span className="text-[11px] font-bold">HEARTBEAT</span>
                    </span>
                    <span className="text-[10px] text-slate-500">50–85 BPM</span>
                  </div>

                  <div className="text-center my-1">
                    <span className="text-2xl font-mono font-black text-white tabular-nums">
                      {heartRate}
                    </span>
                  </div>

                  <div className="flex items-center gap-1.5">
                    <button
                      type="button"
                      onClick={() => setHeartRate((h) => Math.max(40, h - 2))}
                      className="w-7 h-7 rounded-lg bg-slate-800 hover:bg-slate-700 text-white font-mono text-xs flex items-center justify-center cursor-pointer"
                    >
                      -
                    </button>
                    <input
                      type="range"
                      min="40"
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

                {/* Tile 2: Sleep Hours */}
                <div className="p-3 rounded-2xl bg-slate-900/80 border border-slate-800/80 flex flex-col justify-between hover:border-cyan-500/40 transition-colors">
                  <div className="flex items-center justify-between text-xs font-mono text-slate-400">
                    <span className="flex items-center gap-1.5 text-indigo-400">
                      <Moon className="w-3.5 h-3.5 fill-current" />
                      <span className="text-[11px] font-bold">SLEEP</span>
                    </span>
                    <span className="text-[10px] text-slate-500">6.5–8.5 HRS</span>
                  </div>

                  <div className="text-center my-1">
                    <span className="text-2xl font-mono font-black text-white tabular-nums">
                      {sleep.toFixed(1)}
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

                {/* Tile 3: Exercise */}
                <div className="p-3 rounded-2xl bg-slate-900/80 border border-slate-800/80 flex flex-col justify-between hover:border-cyan-500/40 transition-colors">
                  <div className="flex items-center justify-between text-xs font-mono text-slate-400">
                    <span className="flex items-center gap-1.5 text-amber-400">
                      <Dumbbell className="w-3.5 h-3.5" />
                      <span className="text-[11px] font-bold">EXERCISE</span>
                    </span>
                    <span className="text-[10px] text-slate-500">MINUTES</span>
                  </div>

                  <div className="text-center my-1">
                    <span className="text-2xl font-mono font-black text-white tabular-nums">
                      {exercise}
                    </span>
                  </div>

                  <div className="flex items-center gap-1.5">
                    <button
                      type="button"
                      onClick={() => setExercise((ex) => Math.max(0, ex - 10))}
                      className="w-7 h-7 rounded-lg bg-slate-800 hover:bg-slate-700 text-white font-mono text-xs flex items-center justify-center cursor-pointer"
                    >
                      -
                    </button>
                    <input
                      type="range"
                      min="0"
                      max="120"
                      step="5"
                      value={exercise}
                      onChange={(e) => setExercise(Number(e.target.value))}
                      className="flex-1 accent-amber-400 h-1.5 bg-slate-800 rounded-lg cursor-pointer"
                    />
                    <button
                      type="button"
                      onClick={() => setExercise((ex) => Math.min(120, ex + 10))}
                      className="w-7 h-7 rounded-lg bg-slate-800 hover:bg-slate-700 text-white font-mono text-xs flex items-center justify-center cursor-pointer"
                    >
                      +
                    </button>
                  </div>
                </div>

                {/* Tile 4: Stress / Cortisol Index (0-100) */}
                <div className="p-3 rounded-2xl bg-slate-900/80 border border-slate-800/80 flex flex-col justify-between hover:border-cyan-500/40 transition-colors">
                  <div className="flex items-center justify-between text-xs font-mono text-slate-400">
                    <span className="flex items-center gap-1.5 text-purple-400">
                      <Brain className="w-3.5 h-3.5" />
                      <span className="text-[11px] font-bold">STRESS IDX</span>
                    </span>
                    <span className={`text-[10px] font-bold ${stressIndex > 70 ? 'text-rose-400' : 'text-cyan-300'}`}>
                      {stressCategory.toUpperCase()}
                    </span>
                  </div>

                  <div className="text-center my-1">
                    <span className="text-2xl font-mono font-black text-white tabular-nums">
                      {stressIndex}
                    </span>
                  </div>

                  <div className="flex items-center gap-1.5">
                    <button
                      type="button"
                      onClick={() => setStressIndex((v) => Math.max(0, v - 5))}
                      className="w-7 h-7 rounded-lg bg-slate-800 hover:bg-slate-700 text-white font-mono text-xs flex items-center justify-center cursor-pointer"
                    >
                      -
                    </button>
                    <input
                      type="range"
                      min="0"
                      max="100"
                      value={stressIndex}
                      onChange={(e) => setStressIndex(Number(e.target.value))}
                      className="flex-1 accent-purple-400 h-1.5 bg-slate-800 rounded-lg cursor-pointer"
                    />
                    <button
                      type="button"
                      onClick={() => setStressIndex((v) => Math.min(100, v + 5))}
                      className="w-7 h-7 rounded-lg bg-slate-800 hover:bg-slate-700 text-white font-mono text-xs flex items-center justify-center cursor-pointer"
                    >
                      +
                    </button>
                  </div>
                </div>
              </div>

              {/* Compact NASA-STD-3001 Telemetry Strip: Blood Pressure, Cabin CO2, Radiation */}
              <div className="grid grid-cols-3 gap-2">
                <div className="p-2.5 rounded-xl bg-slate-900/75 border border-slate-800/80 flex flex-col gap-1">
                  <span className="text-[10px] font-mono text-slate-400 flex items-center gap-1">
                    <Gauge className="w-3 h-3 text-cyan-400" />
                    <span>BP (mmHg)</span>
                  </span>
                  <div className="flex items-center gap-1 text-xs font-mono">
                    <input
                      type="number"
                      min={70}
                      max={180}
                      value={systolicBp}
                      onChange={(e) => setSystolicBp(Number(e.target.value) || 90)}
                      aria-label="Systolic Blood Pressure"
                      className="w-12 bg-slate-950 border border-slate-800 rounded px-1 py-0.5 text-center text-white tabular-nums"
                    />
                    <span className="text-slate-500">/</span>
                    <input
                      type="number"
                      min={40}
                      max={120}
                      value={diastolicBp}
                      onChange={(e) => setDiastolicBp(Number(e.target.value) || 60)}
                      aria-label="Diastolic Blood Pressure"
                      className="w-12 bg-slate-950 border border-slate-800 rounded px-1 py-0.5 text-center text-white tabular-nums"
                    />
                  </div>
                </div>

                <div className="p-2.5 rounded-xl bg-slate-900/75 border border-slate-800/80 flex flex-col gap-1">
                  <span className="text-[10px] font-mono text-slate-400 flex items-center gap-1">
                    <Wind className="w-3 h-3 text-teal-400" />
                    <span>CO2 (mmHg)</span>
                  </span>
                  <input
                    type="number"
                    min={0.5}
                    max={6.0}
                    step={0.1}
                    value={cabinCo2}
                    onChange={(e) => setCabinCo2(Number(e.target.value) || 1.0)}
                    aria-label="Cabin CO2 mmHg"
                    className="w-full bg-slate-950 border border-slate-800 rounded px-2 py-0.5 text-xs font-mono text-white tabular-nums"
                  />
                </div>

                <div className="p-2.5 rounded-xl bg-slate-900/75 border border-slate-800/80 flex flex-col gap-1">
                  <span className="text-[10px] font-mono text-slate-400 flex items-center gap-1">
                    <Radiation className="w-3 h-3 text-amber-400" />
                    <span>RAD (mSv/d)</span>
                  </span>
                  <input
                    type="number"
                    min={0.05}
                    max={2.0}
                    step={0.02}
                    value={radiation}
                    onChange={(e) => setRadiation(Number(e.target.value) || 0.2)}
                    aria-label="Radiation exposure mSv/day"
                    className="w-full bg-slate-950 border border-slate-800 rounded px-2 py-0.5 text-xs font-mono text-white tabular-nums"
                  />
                </div>
              </div>

              {/* Live NASA-STD-3001 & HRP Baseline Variance Preview */}
              <div className="rounded-xl bg-slate-950/90 border border-slate-800/80 p-2.5 space-y-1.5">
                <div className="flex items-center justify-between text-[10px] font-mono text-slate-400 px-1">
                  <span>NASA-STD-3001 &amp; HRP BASELINE COMPARISON</span>
                  <span>VARIANCE</span>
                </div>
                <div className="divide-y divide-slate-800/60">
                  {baselineComparisons.map((row) => (
                    <div
                      key={row.id}
                      className="py-1 px-1 flex items-center justify-between gap-2 text-[11px] font-mono"
                    >
                      <span className="text-slate-300 truncate">{row.label}</span>
                      <div className="flex items-center gap-2 shrink-0 tabular-nums">
                        <span className="text-white font-semibold">{row.currentDisplay}</span>
                        <span
                          className={`text-[10px] px-1.5 py-0.5 rounded ${
                            row.inRange
                              ? 'text-emerald-400 bg-emerald-950/50'
                              : 'text-amber-300 bg-amber-950/60 font-bold'
                          }`}
                        >
                          {row.inRange ? '●' : '▲'} {row.varianceDisplay}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Big Glowing Analyze Button */}
              <button
                type="button"
                onClick={handleAnalyze}
                disabled={isLoadingAi}
                className="w-full py-3 rounded-2xl bg-gradient-to-r from-cyan-400 via-cyan-500 to-blue-500 hover:from-cyan-300 hover:to-blue-400 active:scale-[0.98] text-slate-950 font-mono font-black text-sm tracking-wide transition-all shadow-[0_0_24px_rgba(34,211,238,0.45)] flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
              >
                <Activity className="w-4 h-4 fill-current" />
                <span>ANALYZE HEALTH CONDITION</span>
              </button>
            </div>
          )}

          {/* VIEW 2: AI Result Mode + Full NASA Variance Table */}
          {boxView === 'result' && (
            <div className="flex-1 flex flex-col justify-between py-2 space-y-2.5 overflow-hidden">
              {isLoadingAi ? (
                <div className="flex-1 flex flex-col items-center justify-center text-center space-y-3 py-10">
                  <RefreshCw className="w-8 h-8 text-cyan-400 animate-spin" />
                  <div className="space-y-1">
                    <span className="text-sm font-bold font-display text-white">
                      Analyzing Vitals vs NASA Baselines...
                    </span>
                    <p className="text-[11px] font-mono text-cyan-300">
                      Checking physiological &amp; environmental thresholds
                    </p>
                  </div>
                </div>
              ) : aiError ? (
                <div className="flex-1 flex flex-col items-center justify-center text-center p-4 text-rose-300 font-mono text-xs space-y-2">
                  <AlertTriangle className="w-6 h-6 text-rose-400" />
                  <p>{aiError}</p>
                  <button
                    onClick={() => setBoxView('input')}
                    className="mt-2 px-3 py-1.5 rounded-lg bg-slate-800 text-white text-xs cursor-pointer"
                  >
                    Back to Inputs
                  </button>
                </div>
              ) : (
                <div className="flex-1 flex flex-col justify-between overflow-y-auto space-y-2.5 pr-1">
                  {/* NASA-STD-3001 Variance Breakdown */}
                  <div className="rounded-2xl bg-slate-950/90 border border-slate-800 p-3 space-y-1.5">
                    <div className="flex items-center justify-between text-[10px] font-mono text-cyan-400 font-bold pb-1 border-b border-slate-800/80">
                      <span>NASA BASELINE VARIANCE REPORT</span>
                      <span>{alertCount === 0 ? '● NOMINAL' : `▲ ${alertCount} ALERT`}</span>
                    </div>
                    <div className="space-y-1">
                      {baselineComparisons.map((row) => (
                        <div
                          key={row.id}
                          className="flex items-center justify-between gap-2 text-[11px] font-mono py-0.5"
                        >
                          <div className="min-w-0">
                            <span className="text-slate-200 block truncate">{row.label}</span>
                            <span className="text-[9px] text-slate-500">
                              NASA: {row.baselineDisplay}
                            </span>
                          </div>
                          <div className="text-right shrink-0 tabular-nums">
                            <span className="text-white font-semibold block">{row.currentDisplay}</span>
                            <span
                              className={`text-[10px] inline-flex items-center gap-1 ${
                                row.inRange ? 'text-emerald-400' : 'text-amber-400 font-bold'
                              }`}
                            >
                              {row.inRange ? (
                                <CheckCircle2 className="w-2.5 h-2.5" />
                              ) : (
                                <AlertTriangle className="w-2.5 h-2.5" />
                              )}
                              <span>{row.varianceDisplay}</span>
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Natural Language Health Readout */}
                  <div className="overflow-y-auto space-y-2 text-slate-200 text-xs sm:text-[13px] leading-relaxed bg-slate-950/90 p-3.5 rounded-2xl border border-cyan-500/30 shadow-inner">
                    <div className="flex items-center justify-between pb-1.5 border-b border-slate-800/80 text-cyan-400 font-bold text-[10px] font-mono">
                      <span>HEALTH ASSESSMENT</span>
                      <span>D&apos; PHYSCO-BIT</span>
                    </div>

                    <div className="whitespace-pre-line text-slate-200 font-sans leading-relaxed">
                      {aiAnalysis}
                    </div>
                  </div>

                  {/* Re-Scan Button */}
                  <button
                    type="button"
                    onClick={() => setBoxView('input')}
                    className="w-full py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-cyan-500/40 text-cyan-300 font-mono text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    <span>Adjust &amp; Re-check Vitals</span>
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </main>

      {/* Clean Bottom Bar */}
      <footer className="text-center z-10">
        <span className="text-[10px] font-mono text-slate-500">
          D&apos; Physco-Bit · Baseline Source: NASA-STD-3001 &amp; NASA HRP
        </span>
      </footer>
    </div>
  );
};
