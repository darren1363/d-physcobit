export interface AstronautProfile {
  id: string;
  name: string;
  callsign: string;
  role: string;
  avatar: string;
  missionDay: number;
  missionName: string;
  status: 'nominal' | 'elevated' | 'warning';
  vitals: {
    heartRate: number; // bpm
    bloodPressure: string; // mmHg
    spO2: number; // %
    hrv: number; // ms
    respiratoryRate: number; // breaths/min
    coreTemp: number; // Celsius
    intracranialPressure: number; // mmHg
    fluidShiftVolume: number; // Liters displaced cephalad
    boneDensityTrend: number; // % loss mitigated
    dailyAredCompleted: boolean;
    radiationAccumulated: number; // mSv
    radiationFlux: number; // uSv/h
    circadianPhase: 'work' | 'exercise' | 'pre-sleep' | 'sleep';
    melatoninLevel: string;
    cognitiveScore: number; // out of 100
    psychologicalStrain: number; // 0-100
  };
}

export type SuitDiagnosticZone = 'helmet' | 'chest' | 'core' | 'limbs' | 'boots';

export interface SuitZoneInfo {
  id: SuitDiagnosticZone;
  name: string;
  label: string;
  coords: { x: number; y: number }; // Percentage on astronaut figure
  metricLabel: string;
  metricValue: string;
  status: 'nominal' | 'optimal' | 'warning';
  description: string;
  physiologicalImpact: string;
}

export interface TelemetryEvent {
  id: string;
  timestamp: string;
  code: string;
  level: 'info' | 'caution' | 'alert';
  message: string;
}
