import React, { useState, useEffect } from 'react';
import {
  Activity,
  Heart,
  Brain,
  ShieldAlert,
  Zap,
  Radio,
  Eye,
  Crosshair,
  Flame,
  CheckCircle2,
  ChevronRight,
  Sparkles,
} from 'lucide-react';
import { AstronautProfile, SuitZoneInfo, SuitDiagnosticZone } from '../types';
import { soundFX } from '../utils/audio';

interface HeroSectionProps {
  astronaut: AstronautProfile;
  missionMode: 'leo' | 'transit' | 'eva';
  onModeChange: (mode: 'leo' | 'transit' | 'eva') => void;
  onSelectZone: (zone: SuitDiagnosticZone) => void;
  selectedZone: SuitDiagnosticZone;
  onSimulateEvent: (event: 'flare' | 'fluid-shift' | 'nominal') => void;
  isSimulating: boolean;
}

const suitZones: SuitZoneInfo[] = [
  {
    id: 'helmet',
    name: 'Neuro-Ocular Visor & Helmet',
    label: 'NEURAL & ICP',
    coords: { x: 50, y: 22 },
    metricLabel: 'Intracranial Pressure (SANS)',
    metricValue: '14.2 mmHg',
    status: 'nominal',
    description:
      'Continuous optical coherence tomography and non-invasive intracranial pressure monitoring to prevent Spaceflight-Associated Neuro-ocular Syndrome.',
    physiologicalImpact:
      'In microgravity, fluid ceases to pool in legs and shifts toward the head, raising optic disc edema risk.',
  },
  {
    id: 'chest',
    name: 'Cardiovascular Bio-Core Hub',
    label: 'ECG & CARDIAC',
    coords: { x: 54, y: 55 },
    metricLabel: 'Myocardial Load & HRV',
    metricValue: '72 bpm · HRV 82ms',
    status: 'optimal',
    description:
      'Multi-lead telemetric electrocardiogram monitoring cardiac stroke volume, left ventricular mass adaptation, and autonomic nervous tone.',
    physiologicalImpact:
      'Reduced hydrostatic pressure decreases cardiac workload, necessitating high-intensity resistance to prevent heart muscle atrophy.',
  },
  {
    id: 'core',
    name: 'Cephalic Fluid Redistribution Core',
    label: 'FLUID SHIFT',
    coords: { x: 48, y: 68 },
    metricLabel: 'Upper Body Fluid Shift',
    metricValue: '+1.8 L cephalad',
    status: 'nominal',
    description:
      'Monitors the classic "Puffy Face / Bird Legs" cephalic fluid shift. Coordinates with Lower Body Negative Pressure (LBNP) suits.',
    physiologicalImpact:
      'Absence of gravity displaces venous blood and interstitial fluid upward, altering baroreceptor sensitivity.',
  },
  {
    id: 'limbs',
    name: 'Musculoskeletal Biomechanical Armature',
    label: 'BONE & MUSCLE',
    coords: { x: 32, y: 60 },
    metricLabel: 'Bone Mineral Preservation',
    metricValue: '98.8 %',
    status: 'optimal',
    description:
      'Piezoelectric resistance sensors track muscle activation across quadriceps, spine, and calves during 2.5 hours of mandatory daily workouts.',
    physiologicalImpact:
      'Untreated microgravity induces ~1.0-1.5% bone mineral density loss per month, primarily in weight-bearing trabecular bone.',
  },
  {
    id: 'boots',
    name: 'Zero-G Footstrike & Thermal Anchors',
    label: 'GRAVITY ANCHOR',
    coords: { x: 51, y: 88 },
    metricLabel: 'Tether & Ground Reaction Force',
    metricValue: '1,420 N peak',
    status: 'nominal',
    description:
      'Vibration-isolated magnetic soles with thermal heat-pipe circulation to dissipate core body heat during extravehicular activity.',
    physiologicalImpact:
      'Without ground impact, foot arch mechanoreceptors undergo sensory reweighting, degrading postural reflexes upon planetary return.',
  },
];

export const HeroSection: React.FC<HeroSectionProps> = ({
  astronaut,
  missionMode,
  onModeChange,
  onSelectZone,
  selectedZone,
  onSimulateEvent,
  isSimulating,
}) => {
  const [metSeconds, setMetSeconds] = useState(148 * 86400 + 6 * 3600 + 42 * 60 + 19);
  const [imageError, setImageError] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => {
      setMetSeconds((prev) => prev + 1);
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const formatMET = (totalSec: number) => {
    const d = Math.floor(totalSec / 86400);
    const h = Math.floor((totalSec % 86400) / 3600);
    const m = Math.floor((totalSec % 3600) / 60);
    const s = totalSec % 60;
    return `T+${d.toString().padStart(3, '0')}d ${h.toString().padStart(2, '0')}h ${m.toString().padStart(2, '0')}m ${s.toString().padStart(2, '0')}s`;
  };

  const activeZoneData = suitZones.find((z) => z.id === selectedZone) || suitZones[0];

  return (
    <section className="relative z-10 pt-6 pb-12 overflow-hidden border-b border-slate-800/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Mission Status Top Bar */}
        <div className="flex flex-wrap items-center justify-between gap-4 py-2 px-4 mb-8 bg-slate-900/60 backdrop-blur-md rounded-lg border border-slate-800 text-xs font-mono">
          <div className="flex items-center gap-3">
            <span className="flex items-center gap-1.5 text-cyan-400 font-semibold">
              <Radio className="w-3.5 h-3.5 animate-pulse text-cyan-400" />
              <span>ORBITAL TELEMETRY</span>
            </span>
            <span className="text-slate-600">/</span>
            <span className="text-slate-300">MISSION: ARTEMIS DEEP LAB 04</span>
            <span className="text-slate-600">/</span>
            <span className="text-emerald-400 font-medium">● VITALS NOMINAL</span>
          </div>

          <div className="flex items-center gap-4 text-slate-300">
            <div>
              <span className="text-slate-500 mr-1.5">MET:</span>
              <span className="text-cyan-300 font-bold tabular-nums">{formatMET(metSeconds)}</span>
            </div>
            <div className="hidden sm:block text-slate-600">·</div>
            <div className="hidden sm:block">
              <span className="text-slate-500 mr-1.5">CREW:</span>
              <span className="text-white">4 ORBITERS</span>
            </div>
          </div>
        </div>

        {/* Hero Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          {/* Left Column: Context, Mission Mode & Physiological Focus */}
          <div className="lg:col-span-6 space-y-6">
            <div className="space-y-3">
              <div className="text-xs uppercase font-mono tracking-widest text-cyan-400 flex items-center gap-2">
                <span>Space Astronaut Physiological & Psychological Suite</span>
              </div>

              <h1
                className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white leading-[1.08]"
                style={{ fontFamily: 'var(--font-display)', textWrap: 'balance' }}
              >
                Zero-G Health & Psych Telemetry
              </h1>

              <p className="text-base sm:text-lg text-slate-300 leading-relaxed max-w-xl">
                Real-time biotelemetry monitoring space adaptation: bone mineral density preservation,
                cephalad fluid shifts, neuro-ocular SANS protection, and crew psychological resilience across interplanetary missions.
              </p>
            </div>

            {/* Mission Operational Profiles Selector */}
            <div className="space-y-2">
              <span className="text-xs font-mono uppercase tracking-wider text-slate-400">
                Orbital Mission Profile Selector
              </span>
              <div className="grid grid-cols-3 gap-2 p-1 bg-slate-900/80 rounded-lg border border-slate-800">
                <button
                  onClick={() => {
                    soundFX.playBeep(640, 0.05);
                    onModeChange('leo');
                  }}
                  className={`py-2 px-3 rounded-md text-xs font-medium font-mono transition-all text-center cursor-pointer ${
                    missionMode === 'leo'
                      ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 shadow-sm'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/40'
                  }`}
                >
                  Low Earth Orbit (ISS)
                </button>
                <button
                  onClick={() => {
                    soundFX.playBeep(720, 0.05);
                    onModeChange('transit');
                  }}
                  className={`py-2 px-3 rounded-md text-xs font-medium font-mono transition-all text-center cursor-pointer ${
                    missionMode === 'transit'
                      ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 shadow-sm'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/40'
                  }`}
                >
                  Lunar / Mars Transit
                </button>
                <button
                  onClick={() => {
                    soundFX.playBeep(800, 0.05);
                    onModeChange('eva');
                  }}
                  className={`py-2 px-3 rounded-md text-xs font-medium font-mono transition-all text-center cursor-pointer ${
                    missionMode === 'eva'
                      ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 shadow-sm'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/40'
                  }`}
                >
                  EVA Spacewalk (Suit)
                </button>
              </div>
            </div>

            {/* Interactive Simulation Triggers */}
            <div className="p-4 rounded-lg bg-slate-900/50 border border-slate-800 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono uppercase tracking-wider text-slate-300 flex items-center gap-1.5">
                  <ShieldAlert className="w-3.5 h-3.5 text-amber-400" />
                  <span>Space Medicine Diagnostic Drills</span>
                </span>
                <span className="text-[11px] font-mono text-slate-400">
                  Interactive Stress Simulation
                </span>
              </div>

              <div className="flex flex-wrap gap-2">
                <button
                  onClick={() => {
                    soundFX.playWarning();
                    onSimulateEvent('flare');
                  }}
                  className="px-3 py-1.5 bg-amber-950/40 hover:bg-amber-900/50 border border-amber-600/40 text-amber-300 rounded text-xs font-mono transition-colors flex items-center gap-1.5 cursor-pointer"
                >
                  <Flame className="w-3.5 h-3.5 text-amber-400" />
                  <span>Simulate Solar Radiation Event</span>
                </button>

                <button
                  onClick={() => {
                    soundFX.playPulse();
                    onSimulateEvent('fluid-shift');
                  }}
                  className="px-3 py-1.5 bg-blue-950/40 hover:bg-blue-900/50 border border-blue-600/40 text-blue-300 rounded text-xs font-mono transition-colors flex items-center gap-1.5 cursor-pointer"
                >
                  <Activity className="w-3.5 h-3.5 text-blue-400" />
                  <span>Test Fluid Shift Reversal (LBNP)</span>
                </button>

                <button
                  onClick={() => {
                    soundFX.playSuccess();
                    onSimulateEvent('nominal');
                  }}
                  className="px-3 py-1.5 bg-emerald-950/40 hover:bg-emerald-900/50 border border-emerald-600/40 text-emerald-300 rounded text-xs font-mono transition-colors flex items-center gap-1.5 cursor-pointer"
                >
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Reset Nominal Vitals</span>
                </button>
              </div>
            </div>

            {/* Mission Key Health Indicators (Non-pill, clean unboxed metadata) */}
            <div className="pt-2 flex flex-wrap items-center gap-y-2 gap-x-4 text-xs font-mono text-slate-400">
              <span className="text-slate-200">
                SpO2: <strong className="text-cyan-400 font-semibold">{astronaut.vitals.spO2}%</strong>
              </span>
              <span aria-hidden="true" className="text-slate-600">·</span>
              <span className="text-slate-200">
                Core Temp: <strong className="text-cyan-400 font-semibold">{astronaut.vitals.coreTemp}°C</strong>
              </span>
              <span aria-hidden="true" className="text-slate-600">·</span>
              <span className="text-slate-200">
                Radiation: <strong className="text-amber-400 font-semibold">{astronaut.vitals.radiationFlux} μSv/h</strong>
              </span>
              <span aria-hidden="true" className="text-slate-600">·</span>
              <span className="text-slate-200">
                Cognitive Readiness: <strong className="text-emerald-400 font-semibold">{astronaut.vitals.cognitiveScore}/100</strong>
              </span>
            </div>
          </div>

          {/* Right Column: Character Avatar Stage with Interactive Suit Diagnostics */}
          <div className="lg:col-span-6 relative">
            <div className="relative mx-auto max-w-md lg:max-w-none rounded-2xl bg-gradient-to-b from-slate-900/90 to-slate-950/90 border border-slate-800 p-6 shadow-2xl backdrop-blur-md">
              {/* Corner Telemetry Markers */}
              <div className="absolute top-3 left-3 text-[10px] font-mono text-cyan-400 flex items-center gap-1.5">
                <Crosshair className="w-3 h-3 text-cyan-400" />
                <span>PHYSIOLOGICAL_SCANNER // ACTIVE</span>
              </div>
              <div className="absolute top-3 right-3 text-[10px] font-mono text-slate-400">
                FIG. A1 - CREW WEARABLE HUB
              </div>

              {/* Character Illustration and Interactive Hotspots */}
              <div className="relative mt-5 mb-4 aspect-square max-w-[360px] mx-auto flex items-center justify-center">
                {/* Glowing Aura Ring */}
                <div className="absolute inset-4 rounded-full bg-cyan-500/10 blur-2xl animate-pulse-subtle pointer-events-none" />

                {/* Astronaut Image with Fallback */}
                {!imageError ? (
                  <img
                    src="/avatar.png"
                    alt="D' Physco-Bit astronaut character in white spacesuit with cyan boots in zero-gravity space"
                    className="relative z-10 w-full h-full object-contain filter drop-shadow-[0_10px_25px_rgba(6,182,212,0.3)] animate-float"
                    referrerPolicy="no-referrer"
                    onError={() => setImageError(true)}
                  />
                ) : (
                  /* Styled SVG fallback if image fails */
                  <div className="relative z-10 w-full h-full flex flex-col items-center justify-center rounded-2xl bg-slate-900 border border-cyan-500/30 p-6 text-center">
                    <Brain className="w-20 h-20 text-cyan-400 mb-3 animate-pulse" />
                    <span className="text-lg font-bold text-white font-display">D' Physco-Bit</span>
                    <span className="text-xs text-slate-400 mt-1 font-mono">Astronaut Health System</span>
                  </div>
                )}

                {/* Interactive Diagnostic Hotspots over the character */}
                {suitZones.map((zone) => {
                  const isSelected = selectedZone === zone.id;
                  return (
                    <button
                      key={zone.id}
                      onClick={() => {
                        soundFX.playBeep(900, 0.05);
                        onSelectZone(zone.id);
                      }}
                      title={`Inspect ${zone.name}`}
                      style={{
                        top: `${zone.coords.y}%`,
                        left: `${zone.coords.x}%`,
                      }}
                      className={`absolute z-20 -translate-x-1/2 -translate-y-1/2 group cursor-pointer p-1.5 focus:outline-none`}
                    >
                      <div className="relative flex items-center justify-center">
                        {/* Outer pulse wave */}
                        <span
                          className={`absolute w-7 h-7 rounded-full transition-all ${
                            isSelected
                              ? 'bg-cyan-400/40 animate-ping'
                              : 'bg-cyan-500/20 group-hover:scale-150'
                          }`}
                        />
                        {/* Core radar dot */}
                        <span
                          className={`relative w-4 h-4 rounded-full border-2 flex items-center justify-center transition-all ${
                            isSelected
                              ? 'bg-cyan-400 border-white shadow-[0_0_12px_#22d3ee] scale-110'
                              : 'bg-slate-900/90 border-cyan-400 text-cyan-300 group-hover:border-white'
                          }`}
                        >
                          <span
                            className={`w-1.5 h-1.5 rounded-full ${
                              isSelected ? 'bg-slate-950' : 'bg-cyan-400'
                            }`}
                          />
                        </span>

                        {/* Hover Tag */}
                        <span className="absolute left-full ml-2 whitespace-nowrap text-[10px] font-mono uppercase bg-slate-950/90 border border-slate-800 text-cyan-300 px-1.5 py-0.5 rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none shadow-lg">
                          {zone.label}
                        </span>
                      </div>
                    </button>
                  );
                })}
              </div>

              {/* Active Hotspot Inspector Card */}
              <div className="mt-4 p-4 rounded-xl bg-slate-950/80 border border-cyan-500/30 backdrop-blur-sm space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
                    <span className="text-xs font-bold text-white font-mono tracking-wide">
                      {activeZoneData.name}
                    </span>
                  </div>
                  <span className="text-xs font-mono font-semibold text-cyan-300 bg-cyan-950/60 px-2 py-0.5 rounded border border-cyan-500/30">
                    {activeZoneData.metricValue}
                  </span>
                </div>

                <p className="text-xs text-slate-300 leading-relaxed">
                  {activeZoneData.description}
                </p>

                <div className="pt-2 border-t border-slate-800/80 text-[11px] text-slate-400 flex items-start gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-cyan-400 shrink-0 mt-0.5" />
                  <span>
                    <strong className="text-slate-300">Spaceflight Insight:</strong>{' '}
                    {activeZoneData.physiologicalImpact}
                  </span>
                </div>
              </div>

              {/* Hotspot Navigation Tabs */}
              <div className="mt-3 flex items-center justify-between gap-1 overflow-x-auto pb-1 text-[11px] font-mono">
                {suitZones.map((zone) => (
                  <button
                    key={zone.id}
                    onClick={() => {
                      soundFX.playBeep(750, 0.04);
                      onSelectZone(zone.id);
                    }}
                    className={`px-2 py-1 rounded transition-colors whitespace-nowrap cursor-pointer ${
                      selectedZone === zone.id
                        ? 'bg-cyan-500/20 text-cyan-300 font-semibold'
                        : 'text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    {zone.label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
