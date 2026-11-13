import React from 'react';
import { User, Activity, Shield, Heart, Sparkles } from 'lucide-react';
import { AstronautProfile } from '../types';
import { soundFX } from '../utils/audio';

interface CrewSelectorProps {
  currentAstronaut: AstronautProfile;
  crewList: AstronautProfile[];
  onSelectAstronaut: (astronaut: AstronautProfile) => void;
}

export const CrewSelector: React.FC<CrewSelectorProps> = ({
  currentAstronaut,
  crewList,
  onSelectAstronaut,
}) => {
  return (
    <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 space-y-3">
      <div className="flex items-center justify-between text-xs font-mono text-slate-400">
        <span className="uppercase tracking-wider">Artemis Orbital Expedition Crew</span>
        <span>4 Active Bio-Monitors</span>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {crewList.map((member) => {
          const isSelected = member.id === currentAstronaut.id;
          return (
            <button
              key={member.id}
              onClick={() => {
                soundFX.playBeep(820, 0.04);
                onSelectAstronaut(member);
              }}
              className={`p-3 rounded-lg border text-left transition-all cursor-pointer flex flex-col justify-between ${
                isSelected
                  ? 'bg-cyan-950/60 border-cyan-400/80 shadow-[0_0_12px_rgba(6,182,212,0.25)]'
                  : 'bg-slate-950/40 border-slate-800 hover:border-slate-700'
              }`}
            >
              <div>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-[10px] font-mono text-cyan-400 font-bold">
                    {member.callsign}
                  </span>
                  <span
                    className={`w-1.5 h-1.5 rounded-full ${
                      member.status === 'nominal'
                        ? 'bg-emerald-400'
                        : member.status === 'elevated'
                        ? 'bg-amber-400'
                        : 'bg-rose-400'
                    }`}
                  />
                </div>
                <div className="text-xs font-bold text-white truncate">{member.name}</div>
                <div className="text-[11px] text-slate-400 truncate">{member.role}</div>
              </div>

              <div className="mt-2 pt-2 border-t border-slate-800/80 flex items-center justify-between text-[10px] font-mono text-slate-400">
                <span>{member.vitals.heartRate} BPM</span>
                <span className="text-cyan-300 font-semibold">{member.vitals.spO2}% SpO2</span>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};
