import React, { useEffect, useRef, useState } from 'react';
import {
  Heart,
  Activity,
  Shield,
  Moon,
  Zap,
  Droplets,
  Bone,
  Eye,
  ArrowUpRight,
  TrendingDown,
  Info,
  Clock,
  Compass,
} from 'lucide-react';
import { AstronautProfile } from '../types';
import { soundFX } from '../utils/audio';

interface LiveTelemetryDeckProps {
  astronaut: AstronautProfile;
}

export const LiveTelemetryDeck: React.FC<LiveTelemetryDeckProps> = ({ astronaut }) => {
  const ecgCanvasRef = useRef<HTMLCanvasElement>(null);
  const [activeTab, setActiveTab] = useState<'cardio' | 'zerog' | 'radiation' | 'circadian'>('cardio');

  // Animated live ECG wave generator
  useEffect(() => {
    const canvas = ecgCanvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;
    let width = (canvas.width = canvas.parentElement?.clientWidth || 400);
    let height = (canvas.height = 100);

    const handleResize = () => {
      if (!canvas || !canvas.parentElement) return;
      width = canvas.width = canvas.parentElement.clientWidth;
      height = canvas.height = 100;
    };
    window.addEventListener('resize', handleResize);

    const points: number[] = new Array(Math.floor(width)).fill(height / 2);
    let phase = 0;

    const render = () => {
      phase += 0.05;

      // Calculate next ECG point (P-Q-R-S-T wave pattern)
      const cycle = phase % (Math.PI * 2);
      let value = height / 2;

      // P wave
      if (cycle > 0.5 && cycle < 0.9) {
        value -= Math.sin((cycle - 0.5) / 0.4 * Math.PI) * 7;
      }
      // Q dip
      else if (cycle >= 1.0 && cycle < 1.1) {
        value += 5;
      }
      // R spike
      else if (cycle >= 1.1 && cycle < 1.3) {
        value -= Math.sin((cycle - 1.1) / 0.2 * Math.PI) * 38;
      }
      // S dip
      else if (cycle >= 1.3 && cycle < 1.45) {
        value += 12;
      }
      // T wave
      else if (cycle >= 1.8 && cycle < 2.4) {
        value -= Math.sin((cycle - 1.8) / 0.6 * Math.PI) * 12;
      }

      // Add mild noise
      value += (Math.random() - 0.5) * 1.5;

      points.shift();
      points.push(value);

      ctx.clearRect(0, 0, width, height);

      // Grid lines
      ctx.strokeStyle = 'rgba(30, 41, 59, 0.4)';
      ctx.lineWidth = 1;
      for (let y = 10; y < height; y += 20) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(width, y);
        ctx.stroke();
      }

      // Draw ECG trace
      ctx.beginPath();
      ctx.strokeStyle = '#22d3ee';
      ctx.lineWidth = 2;
      ctx.shadowColor = '#06b6d4';
      ctx.shadowBlur = 8;

      for (let i = 0; i < points.length; i++) {
        if (i === 0) {
          ctx.moveTo(i, points[i]);
        } else {
          ctx.lineTo(i, points[i]);
        }
      }
      ctx.stroke();
      ctx.shadowBlur = 0;

      // Glowing lead head
      const lastX = points.length - 1;
      const lastY = points[lastX];
      ctx.fillStyle = '#ffffff';
      ctx.beginPath();
      ctx.arc(lastX, lastY, 3, 0, Math.PI * 2);
      ctx.fill();

      animId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animId);
    };
  }, []);

  return (
    <section id="biometrics" className="relative z-10 py-12 border-b border-slate-800/80 bg-[#070b16]/70">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 pb-4 border-b border-slate-800">
          <div>
            <div className="text-xs font-mono uppercase tracking-wider text-cyan-400 mb-1">
              Physiological Telemetry Channels
            </div>
            <h2
              className="text-2xl sm:text-3xl font-bold tracking-tight text-white"
              style={{ fontFamily: 'var(--font-display)' }}
            >
              Real-Time Crew Vitals & Zero-G Adaptation
            </h2>
          </div>

          {/* Interactive Category Tabs */}
          <div className="flex items-center gap-1 p-1 bg-slate-900 rounded-lg border border-slate-800 mt-4 md:mt-0">
            <button
              onClick={() => {
                soundFX.playBeep(600, 0.04);
                setActiveTab('cardio');
              }}
              className={`px-3 py-1.5 text-xs font-medium font-mono rounded-md transition-all cursor-pointer ${
                activeTab === 'cardio'
                  ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Cardiovascular
            </button>
            <button
              onClick={() => {
                soundFX.playBeep(680, 0.04);
                setActiveTab('zerog');
              }}
              className={`px-3 py-1.5 text-xs font-medium font-mono rounded-md transition-all cursor-pointer ${
                activeTab === 'zerog'
                  ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Zero-G Shifts
            </button>
            <button
              onClick={() => {
                soundFX.playBeep(760, 0.04);
                setActiveTab('radiation');
              }}
              className={`px-3 py-1.5 text-xs font-medium font-mono rounded-md transition-all cursor-pointer ${
                activeTab === 'radiation'
                  ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Cosmic Radiation
            </button>
            <button
              onClick={() => {
                soundFX.playBeep(840, 0.04);
                setActiveTab('circadian');
              }}
              className={`px-3 py-1.5 text-xs font-medium font-mono rounded-md transition-all cursor-pointer ${
                activeTab === 'circadian'
                  ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Circadian Cycle
            </button>
          </div>
        </div>

        {/* Primary 4-Metric Grid adhering to Scientific Metric Specification */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {/* Card 1: Heart Rate & HRV */}
          <div className="p-5 rounded-xl bg-slate-900/70 border border-slate-800 space-y-3">
            <div className="flex items-center justify-between text-xs font-mono uppercase tracking-wider text-slate-400">
              <span className="flex items-center gap-1.5">
                <Heart className="w-3.5 h-3.5 text-rose-400" />
                <span>Myocardial Frequency</span>
              </span>
              <span className="flex items-center gap-1 text-emerald-400 text-[11px]">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                <span>● NOMINAL</span>
              </span>
            </div>

            <div className="flex items-baseline">
              <span className="text-3xl font-mono font-bold text-white tabular-nums">
                {astronaut.vitals.heartRate}
              </span>
              <span className="text-xs font-mono uppercase text-slate-400 ml-1.5">BPM</span>
            </div>

            <div className="flex items-center justify-between text-xs font-mono text-slate-400 pt-2 border-t border-slate-800/80">
              <span>HRV Tone: <strong className="text-cyan-400 font-semibold">{astronaut.vitals.hrv} ms</strong></span>
              <span className="text-slate-500">BP: {astronaut.vitals.bloodPressure}</span>
            </div>
          </div>

          {/* Card 2: Intracranial Pressure (SANS) */}
          <div className="p-5 rounded-xl bg-slate-900/70 border border-slate-800 space-y-3">
            <div className="flex items-center justify-between text-xs font-mono uppercase tracking-wider text-slate-400">
              <span className="flex items-center gap-1.5">
                <Eye className="w-3.5 h-3.5 text-cyan-400" />
                <span>Intracranial ICP</span>
              </span>
              <span className="flex items-center gap-1 text-emerald-400 text-[11px]">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                <span>● SANS SAFE</span>
              </span>
            </div>

            <div className="flex items-baseline">
              <span className="text-3xl font-mono font-bold text-white tabular-nums">
                {astronaut.vitals.intracranialPressure.toFixed(1)}
              </span>
              <span className="text-xs font-mono uppercase text-slate-400 ml-1.5">mmHg</span>
            </div>

            <div className="flex items-center justify-between text-xs font-mono text-slate-400 pt-2 border-t border-slate-800/80">
              <span>Optic Sheath: <strong className="text-cyan-400 font-semibold">5.2 mm</strong></span>
              <span className="text-slate-500">Baseline: 12-16</span>
            </div>
          </div>

          {/* Card 3: Bone Density Preservation */}
          <div className="p-5 rounded-xl bg-slate-900/70 border border-slate-800 space-y-3">
            <div className="flex items-center justify-between text-xs font-mono uppercase tracking-wider text-slate-400">
              <span className="flex items-center gap-1.5">
                <Bone className="w-3.5 h-3.5 text-amber-400" />
                <span>Bone Mineral Index</span>
              </span>
              <span className="flex items-center gap-1 text-emerald-400 text-[11px]">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                <span>● PROTECTED</span>
              </span>
            </div>

            <div className="flex items-baseline">
              <span className="text-3xl font-mono font-bold text-white tabular-nums">
                {astronaut.vitals.boneDensityTrend.toFixed(1)}
              </span>
              <span className="text-xs font-mono uppercase text-slate-400 ml-1.5">% / MO</span>
            </div>

            <div className="flex items-center justify-between text-xs font-mono text-slate-400 pt-2 border-t border-slate-800/80">
              <span>ARED Load: <strong className="text-amber-300 font-semibold">2.5 hrs Done</strong></span>
              <span className="text-emerald-400">Mitigated: 89%</span>
            </div>
          </div>

          {/* Card 4: Cosmic Radiation Exposure */}
          <div className="p-5 rounded-xl bg-slate-900/70 border border-slate-800 space-y-3">
            <div className="flex items-center justify-between text-xs font-mono uppercase tracking-wider text-slate-400">
              <span className="flex items-center gap-1.5">
                <Shield className="w-3.5 h-3.5 text-indigo-400" />
                <span>Cumulative Dosimeter</span>
              </span>
              <span className="flex items-center gap-1 text-cyan-400 text-[11px]">
                <span className="w-1.5 h-1.5 rounded-full bg-cyan-400" />
                <span>● 1.4 μSv/h</span>
              </span>
            </div>

            <div className="flex items-baseline">
              <span className="text-3xl font-mono font-bold text-white tabular-nums">
                {astronaut.vitals.radiationAccumulated.toFixed(1)}
              </span>
              <span className="text-xs font-mono uppercase text-slate-400 ml-1.5">mSv</span>
            </div>

            <div className="flex items-center justify-between text-xs font-mono text-slate-400 pt-2 border-t border-slate-800/80">
              <span>Career Ceiling: <strong className="text-slate-300 font-semibold">600 mSv</strong></span>
              <span className="text-cyan-400">Margin: 93.8%</span>
            </div>
          </div>
        </div>

        {/* Dynamic Detail Panel based on activeTab */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Main Waveform / Data Visualization Viewport (lg:col-span-8) */}
          <div className="lg:col-span-8 p-6 rounded-xl bg-slate-900/80 border border-slate-800 space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Activity className="w-4 h-4 text-cyan-400" />
                <span className="text-xs font-mono uppercase tracking-wider text-slate-200">
                  Continuous Lead-II Electrocardiogram & Telemetry Stream
                </span>
              </div>
              <span className="text-[11px] font-mono text-cyan-400 bg-cyan-950/60 px-2 py-0.5 rounded border border-cyan-800/50">
                128 Hz STREAMING
              </span>
            </div>

            {/* Live Canvas ECG Waveform */}
            <div className="w-full bg-[#050811] rounded-lg border border-slate-800/90 p-2 overflow-hidden">
              <canvas ref={ecgCanvasRef} className="w-full h-[100px] block" />
            </div>

            {/* Explanation Strip */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 pt-2 text-xs font-mono">
              <div className="p-3 rounded-lg bg-slate-950/60 border border-slate-800/60">
                <span className="text-slate-400 block text-[11px] mb-1">VENTRICULAR STROKE VOL</span>
                <span className="text-white font-bold">68 mL</span>
                <span className="text-[10px] text-slate-500 block mt-0.5">Adaptation: -8% vs 1G</span>
              </div>
              <div className="p-3 rounded-lg bg-slate-950/60 border border-slate-800/60">
                <span className="text-slate-400 block text-[11px] mb-1">AUTONOMIC TONE (LF/HF)</span>
                <span className="text-white font-bold">1.42</span>
                <span className="text-[10px] text-emerald-400 block mt-0.5">Sympathetic: Balanced</span>
              </div>
              <div className="p-3 rounded-lg bg-slate-950/60 border border-slate-800/60">
                <span className="text-slate-400 block text-[11px] mb-1">PERIPHERAL RESISTANCE</span>
                <span className="text-white font-bold">1,180 dyn·s/cm⁵</span>
                <span className="text-[10px] text-cyan-400 block mt-0.5">Vasoconstriction: Nominal</span>
              </div>
            </div>
          </div>

          {/* Deep Space Physiological Explanation Card (lg:col-span-4) */}
          <div className="lg:col-span-4 p-6 rounded-xl bg-slate-900/80 border border-slate-800 flex flex-col justify-between space-y-4">
            <div className="space-y-3">
              <div className="flex items-center gap-2 text-xs font-mono text-cyan-400 uppercase tracking-wider">
                <Info className="w-3.5 h-3.5 text-cyan-400" />
                <span>Zero-Gravity Clinical Insight</span>
              </div>

              <h3 className="text-lg font-bold text-white" style={{ fontFamily: 'var(--font-display)' }}>
                Cephalic Fluid Redistribution
              </h3>

              <p className="text-xs text-slate-300 leading-relaxed">
                Within minutes of entering weightlessness, approximately 1.5 to 2.0 liters of venous blood
                and interstitial fluid migrate from the lower limbs toward the thoracic cavity and head.
              </p>

              <div className="p-3 rounded-lg bg-slate-950/60 border border-slate-800 text-[11px] space-y-1.5">
                <div className="flex justify-between text-slate-300">
                  <span>Fluid Volume Shifted:</span>
                  <span className="font-mono text-cyan-300 font-semibold">+1.8 Liters</span>
                </div>
                <div className="flex justify-between text-slate-300">
                  <span>Vestibular Illusion Risk:</span>
                  <span className="font-mono text-emerald-400">Low (Day 148 Adapted)</span>
                </div>
                <div className="flex justify-between text-slate-300">
                  <span>Calf Girth Reduction:</span>
                  <span className="font-mono text-amber-300">-12% ("Bird Legs" index)</span>
                </div>
              </div>
            </div>

            <div className="pt-3 border-t border-slate-800">
              <div className="text-[11px] font-mono text-slate-400 flex items-center justify-between">
                <span>Active Countermeasure:</span>
                <span className="text-cyan-400 font-semibold">Russian Chibis LBNP Suit</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
