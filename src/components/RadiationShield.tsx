import React, { useState } from 'react';
import {
  Shield,
  ShieldAlert,
  Flame,
  Zap,
  Activity,
  AlertOctagon,
  Radio,
  Clock,
  Compass,
  CheckCircle,
} from 'lucide-react';
import { soundFX } from '../utils/audio';

export const RadiationShield: React.FC = () => {
  const [shelterActive, setShelterActive] = useState<boolean>(false);
  const [solarAlertActive, setSolarAlertActive] = useState<boolean>(false);

  const toggleSolarAlert = () => {
    const nextState = !solarAlertActive;
    setSolarAlertActive(nextState);
    if (nextState) {
      soundFX.playWarning();
    } else {
      soundFX.playSuccess();
    }
  };

  const toggleShelter = () => {
    soundFX.playBeep(850, 0.05);
    setShelterActive((prev) => !prev);
  };

  const currentFlux = solarAlertActive
    ? shelterActive
      ? '18.4'
      : '142.8'
    : '1.4';

  return (
    <section id="radiation" className="relative z-10 py-12 border-b border-slate-800/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 pb-4 border-b border-slate-800">
          <div>
            <div className="text-xs font-mono uppercase tracking-wider text-cyan-400 mb-1">
              Cosmic Dosimetry & Solar Particle Event (SPE) Shielding
            </div>
            <h2
              className="text-2xl sm:text-3xl font-bold tracking-tight text-white"
              style={{ fontFamily: 'var(--font-display)' }}
            >
              Galactic Cosmic Ray (GCR) Dosimeter & Storm Shelter
            </h2>
          </div>

          <div className="mt-4 md:mt-0 flex items-center gap-2">
            <button
              onClick={toggleSolarAlert}
              className={`px-3 py-1.5 rounded-lg text-xs font-mono font-semibold transition-all flex items-center gap-1.5 cursor-pointer ${
                solarAlertActive
                  ? 'bg-rose-950 text-rose-300 border border-rose-500 animate-pulse'
                  : 'bg-slate-900 border border-slate-800 text-slate-300 hover:text-white'
              }`}
            >
              <Flame className="w-3.5 h-3.5 text-amber-400" />
              <span>{solarAlertActive ? 'ALERT ACTIVE: CLASS-X FLARE' : 'Simulate Solar Flare'}</span>
            </button>
          </div>
        </div>

        {/* Radiation Dashboard Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Main Dosimeter Console */}
          <div className="lg:col-span-7 p-6 rounded-xl bg-slate-900/80 border border-slate-800 space-y-6">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <span className="text-xs font-mono uppercase tracking-wider text-slate-300 flex items-center gap-2">
                <Radio className="w-4 h-4 text-cyan-400" />
                <span>Deep-Space Silicon Photodiode Dosimeter Array</span>
              </span>
              <span
                className={`text-xs font-mono font-bold ${
                  solarAlertActive
                    ? shelterActive
                      ? 'text-amber-400'
                      : 'text-rose-400 animate-pulse'
                    : 'text-emerald-400'
                }`}
              >
                {solarAlertActive
                  ? shelterActive
                    ? '▲ SHELTER MITIGATED'
                    : '✖ CRITICAL SPE FLUX'
                  : '● NOMINAL BACKGROUND'}
              </span>
            </div>

            {/* Dosimeter Big Metric */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="p-4 rounded-xl bg-slate-950/70 border border-slate-800 space-y-1">
                <span className="text-[11px] font-mono uppercase text-slate-400">INSTANTANEOUS FLUX RATE</span>
                <div className="flex items-baseline">
                  <span
                    className={`text-4xl font-mono font-bold tabular-nums ${
                      solarAlertActive
                        ? shelterActive
                          ? 'text-amber-300'
                          : 'text-rose-400'
                        : 'text-cyan-400'
                    }`}
                  >
                    {currentFlux}
                  </span>
                  <span className="text-xs font-mono text-slate-400 ml-2">μSv / hour</span>
                </div>
                <span className="text-[10px] font-mono text-slate-500 block pt-1">
                  {solarAlertActive
                    ? shelterActive
                      ? 'Water-wall hydrogen attenuating 87% of proton flux'
                      : 'High-energy coronal mass ejection protons penetrating unshielded hull'
                    : 'Standard interplanetary GCR baseline'}
                </span>
              </div>

              <div className="p-4 rounded-xl bg-slate-950/70 border border-slate-800 space-y-1">
                <span className="text-[11px] font-mono uppercase text-slate-400">MISSION ACCUMULATED DOSE</span>
                <div className="flex items-baseline">
                  <span className="text-4xl font-mono font-bold text-white tabular-nums">
                    37.2
                  </span>
                  <span className="text-xs font-mono text-slate-400 ml-2">mSv</span>
                </div>
                <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden mt-2">
                  <div className="bg-cyan-400 h-full w-[6.2%]" />
                </div>
                <span className="text-[10px] font-mono text-slate-500 block pt-1">
                  6.2% of NASA 600 mSv Lifetime Career Limit
                </span>
              </div>
            </div>

            {/* Radiation Spectrum Breakdown */}
            <div className="space-y-2">
              <span className="text-xs font-mono uppercase tracking-wider text-slate-400 block">
                Particle Energy Spectrum Discrimination:
              </span>
              <div className="grid grid-cols-3 gap-2 text-xs font-mono">
                <div className="p-3 rounded-lg bg-slate-950 border border-slate-800">
                  <span className="text-slate-500 block text-[10px]">SOLAR PROTONS (SPE)</span>
                  <span className={`font-bold ${solarAlertActive ? 'text-rose-400' : 'text-slate-300'}`}>
                    {solarAlertActive ? '94.2 MeV' : '1.2 MeV'}
                  </span>
                </div>
                <div className="p-3 rounded-lg bg-slate-950 border border-slate-800">
                  <span className="text-slate-500 block text-[10px]">HZE NUCLEI (IRON 56)</span>
                  <span className="font-bold text-slate-300">0.08 /cm²·s</span>
                </div>
                <div className="p-3 rounded-lg bg-slate-950 border border-slate-800">
                  <span className="text-slate-500 block text-[10px]">SECONDARY NEUTRONS</span>
                  <span className="font-bold text-slate-300">0.31 mSv/mo</span>
                </div>
              </div>
            </div>
          </div>

          {/* Storm Shelter Defense Module */}
          <div className="lg:col-span-5 p-6 rounded-xl bg-slate-900/80 border border-slate-800 flex flex-col justify-between space-y-6">
            <div className="space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                <span className="text-xs font-mono uppercase tracking-wider text-cyan-400 flex items-center gap-2">
                  <Shield className="w-4 h-4 text-cyan-400" />
                  <span>Polyethylene & Water-Wall Storm Bay</span>
                </span>
                <span
                  className={`text-xs font-mono font-semibold ${
                    shelterActive ? 'text-emerald-400' : 'text-slate-400'
                  }`}
                >
                  {shelterActive ? 'SEALED & ACTIVE' : 'OPEN PASSAGE'}
                </span>
              </div>

              <p className="text-xs text-slate-300 leading-relaxed">
                Hydrogen-rich shielding materials (polyethylene composite blocks and potable water reservoirs)
                provide optimal deceleration for cosmic rays and secondary scatter neutrons without emitting hazardous Bremsstrahlung X-rays.
              </p>

              <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800 text-xs font-mono space-y-2">
                <div className="flex justify-between text-slate-300">
                  <span>Water Wall Mass:</span>
                  <strong className="text-white">4,200 kg (Around Crew Bunks)</strong>
                </div>
                <div className="flex justify-between text-slate-300">
                  <span>Hydrogen Attenuation Factor:</span>
                  <strong className="text-cyan-400">8.4x over Aluminum hull</strong>
                </div>
                <div className="flex justify-between text-slate-300">
                  <span>Antioxidant Nutritional Defense:</span>
                  <strong className="text-emerald-400">Astaxanthin & Sulforaphane active</strong>
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-slate-800">
              <button
                onClick={toggleShelter}
                className={`w-full py-2.5 rounded-lg text-xs font-mono font-bold transition-all flex items-center justify-center gap-2 cursor-pointer ${
                  shelterActive
                    ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 hover:bg-emerald-500/30'
                    : 'bg-cyan-500 text-slate-950 hover:bg-cyan-400'
                }`}
              >
                <ShieldAlert className="w-4 h-4" />
                <span>{shelterActive ? 'DISEMBARK STORM SHELTER' : 'DEPLOY STORM SHELTER PROTOCOL'}</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
