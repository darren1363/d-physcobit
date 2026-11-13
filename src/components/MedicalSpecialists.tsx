import React, { useState, useRef, useEffect } from 'react';
import {
  ArrowLeft,
  Eye,
  Brain,
  HeartPulse,
  Bone,
  Dumbbell,
  Wind,
  ShieldAlert,
  Utensils,
  Send,
  User,
  Sparkles,
  Activity,
  RotateCcw,
  Zap,
  ChevronRight,
  MessageSquare,
} from 'lucide-react';
import { StethoscopeIcon } from './icons/StethoscopeIcon';

interface MedicalSpecialistsProps {
  onBack: () => void;
}

export interface MedicalOption {
  id: string;
  title: string;
  bodyPart: string;
  icon: React.ElementType;
  accentColor: string;
  badgeBg: string;
  borderColor: string;
  bgGlow: string;
  summary: string;
  quickQuestions: string[];
  initialGreeting: string;
}

const SPECIALIST_OPTIONS: MedicalOption[] = [
  {
    id: 'eye',
    title: 'Eye & Vision Specialist',
    bodyPart: 'Eyes & Vision',
    icon: Eye,
    accentColor: 'text-cyan-400',
    badgeBg: 'bg-cyan-500/20 text-cyan-300 border-cyan-400/40',
    borderColor: 'border-cyan-500/40 hover:border-cyan-300',
    bgGlow: 'from-cyan-500/20 to-transparent',
    summary: 'Blurry checklist reading, cosmic light streaks, globe flattening (SANS), and dry gritty eyes.',
    quickQuestions: [
      'My vision is blurry when reading flight checklists',
      'I see bright streaks/flashes when my eyes are closed',
      'My eyes feel dry and gritty from cabin airflow',
      'Feeling pressure behind both eyeballs in orbit',
    ],
    initialGreeting:
      'Hello astronaut! The Eye & Vision bay is active.\n\nIn microgravity, cephalad fluid shifts cause posterior globe flattening and hyperopic blur (SANS). What vision changes or eye discomfort are you experiencing?',
  },
  {
    id: 'neuro',
    title: 'Head, Brain & Balance Specialist',
    bodyPart: 'Head, Brain & Inner Ear',
    icon: Brain,
    accentColor: 'text-indigo-400',
    badgeBg: 'bg-indigo-500/20 text-indigo-300 border-indigo-400/40',
    borderColor: 'border-indigo-500/40 hover:border-indigo-300',
    bgGlow: 'from-indigo-500/20 to-transparent',
    summary: 'Space motion sickness (SAS), dizziness, head pressure, disorientation, and orbital vertigo.',
    quickQuestions: [
      'Room spinning and nausea when I turn or pitch my head',
      'Puffy face and deep intracranial pressure headache',
      'Feeling disoriented and losing track of up vs down',
      'Trouble concentrating during high-pace module tasks',
    ],
    initialGreeting:
      'Hello astronaut! The Head & Balance bay is active.\n\nWeightlessness removes gravity cues from your inner-ear otoliths, triggering motion sickness and sinus pressure. Let me know what symptoms you are feeling.',
  },
  {
    id: 'cardio',
    title: 'Heart & Circulation Specialist',
    bodyPart: 'Heart, Chest & Pulse',
    icon: HeartPulse,
    accentColor: 'text-rose-400',
    badgeBg: 'bg-rose-500/20 text-rose-300 border-rose-400/40',
    borderColor: 'border-rose-500/40 hover:border-rose-300',
    bgGlow: 'from-rose-500/20 to-transparent',
    summary: 'Heart palpitations, chest fullness, upward fluid redistribution, and resting pulse spikes.',
    quickQuestions: [
      'Heart feels like it is fluttering or racing while resting',
      'Chest feels full and congested after floating into the module',
      'Sudden lightheadedness when transitioning between activities',
      'Telemetry electrodes showing irregular pulse readings',
    ],
    initialGreeting:
      'Hello astronaut! The Cardiovascular & Circulation bay is active.\n\nIn zero-G, approximately 2 liters of blood shift to your chest and heart, resetting baroreceptors and stroke volume. What chest or heart symptoms do you have?',
  },
  {
    id: 'ortho',
    title: 'Spine & Lower Back Specialist',
    bodyPart: 'Spine, Bones & Back',
    icon: Bone,
    accentColor: 'text-amber-400',
    badgeBg: 'bg-amber-500/20 text-amber-300 border-amber-400/40',
    borderColor: 'border-amber-500/40 hover:border-amber-300',
    bgGlow: 'from-amber-500/20 to-transparent',
    summary: 'Spinal elongation backache (gaining 2-3 inches), lumbar stiffness, and bone density conservation.',
    quickQuestions: [
      'Intense lower back ache and I feel 2 inches taller',
      'Spine feels stiff and sore in the neutral body posture',
      'Knuckle and finger joints ache from pressurized suit gloves',
      'How to maintain bone mineral density during mission?',
    ],
    initialGreeting:
      'Hello astronaut! The Spine & Bone bay is active.\n\nWithout gravitational compression, your intervertebral discs expand by up to 2-3 inches, creating deep back tension. What discomfort is your back or spine experiencing?',
  },
  {
    id: 'musculo',
    title: 'Muscles & Fitness Specialist',
    bodyPart: 'Muscles, Legs & Stamina',
    icon: Dumbbell,
    accentColor: 'text-emerald-400',
    badgeBg: 'bg-emerald-500/20 text-emerald-300 border-emerald-400/40',
    borderColor: 'border-emerald-500/40 hover:border-emerald-300',
    bgGlow: 'from-emerald-500/20 to-transparent',
    summary: 'Calf muscle atrophy ("bird legs"), T2 treadmill harness bruising, and physical fatigue.',
    quickQuestions: [
      'My legs and calves are getting very skinny (bird legs)',
      'T2 treadmill bungee harness is bruising my shoulders',
      'Forearms completely fatigued from handhold pinching',
      'Too exhausted to finish my scheduled daily workout routine',
    ],
    initialGreeting:
      'Hello astronaut! The Muscle & Physical Conditioning bay is active.\n\nIn zero-G, antigravity postural calf muscles quickly shed mass without high-load impact. What muscles or exercise equipment are causing you strain?',
  },
  {
    id: 'pulmo',
    title: 'Lungs & Breathing Specialist',
    bodyPart: 'Lungs & Cabin Air',
    icon: Wind,
    accentColor: 'text-teal-400',
    badgeBg: 'bg-teal-500/20 text-teal-300 border-teal-400/40',
    borderColor: 'border-teal-500/40 hover:border-teal-300',
    bgGlow: 'from-teal-500/20 to-transparent',
    summary: 'Station CO2 air pockets, hypercapnia headache, throat dryness, and module ventilation.',
    quickQuestions: [
      'Short of breath with a forehead headache (CO2 pocket?)',
      'Ticklish dry cough from floating station lint and dust',
      'Throat feels irritated and parched from recycled cabin air',
      'Airflow in my sleep bunk feels stagnant and suffocating',
    ],
    initialGreeting:
      'Hello astronaut! The Respiratory & Atmospheric bay is active.\n\nMicrogravity lacks natural air convection, meaning exhaled carbon dioxide can form pockets around your head. Tell me about your breathing or module airflow concerns.',
  },
  {
    id: 'derma',
    title: 'Skin & Radiation Specialist',
    bodyPart: 'Skin, Surface & Radiation',
    icon: ShieldAlert,
    accentColor: 'text-violet-400',
    badgeBg: 'bg-violet-500/20 text-violet-300 border-violet-400/40',
    borderColor: 'border-violet-500/40 hover:border-violet-300',
    bgGlow: 'from-violet-500/20 to-transparent',
    summary: 'Foot callus peeling ("space shedding"), flight suit rashes, dry skin, and cosmic radiation.',
    quickQuestions: [
      'The skin on the bottom of my feet is peeling and shedding',
      'Itchy dry red patches developing along flight suit seams',
      'Skin on hands is cracking from frequent no-rinse wipes',
      'Personal dosimeter shows higher count after solar activity',
    ],
    initialGreeting:
      'Hello astronaut! The Space Dermatology & Radiation bay is active.\n\nIn weightlessness, thick foot calluses naturally shed, and cabin low humidity dries the epidermis. What skin or radiation questions do you have?',
  },
  {
    id: 'gastro',
    title: 'Stomach & Digestion Specialist',
    bodyPart: 'Stomach & Nutrition',
    icon: Utensils,
    accentColor: 'text-orange-400',
    badgeBg: 'bg-orange-500/20 text-orange-300 border-orange-400/40',
    borderColor: 'border-orange-500/40 hover:border-orange-300',
    bgGlow: 'from-orange-500/20 to-transparent',
    summary: 'Stomach gas bloating (wet burps), loss of taste (congested nose), and hydration.',
    quickQuestions: [
      'Severe stomach bloating and gas after meals (wet burps)',
      'All station food tastes bland and I have zero appetite',
      'Constipation and abdominal cramps over past two days',
      'Urine is dark yellow despite drinking standard rations',
    ],
    initialGreeting:
      'Hello astronaut! The Gastrointestinal & Nutrition bay is active.\n\nWithout gravity, stomach gas bubbles stay mixed with liquid food, causing bloating and muted taste. Tell me about your digestion or dietary discomfort.',
  },
];

interface ChatMessage {
  id: string;
  sender: 'user' | 'specialist';
  text: string;
  timestamp: string;
}

export const MedicalSpecialists: React.FC<MedicalSpecialistsProps> = ({ onBack }) => {
  // If activeOption is null, show simple option selection screen. When clicked, chat begins immediately!
  const [activeOption, setActiveOption] = useState<MedicalOption | null>(null);
  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // Store conversation for each specialist ID
  const [chatMessages, setChatMessages] = useState<Record<string, ChatMessage[]>>(() => {
    const initialMap: Record<string, ChatMessage[]> = {};
    SPECIALIST_OPTIONS.forEach((opt) => {
      initialMap[opt.id] = [
        {
          id: `greet-${opt.id}`,
          sender: 'specialist',
          text: opt.initialGreeting,
          timestamp: 'NOW',
        },
      ];
    });
    return initialMap;
  });

  const chatScrollRef = useRef<HTMLDivElement | null>(null);

  const currentMessages = activeOption ? chatMessages[activeOption.id] || [] : [];

  useEffect(() => {
    if (activeOption) {
      chatScrollRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [currentMessages, isLoading, activeOption]);

  const handleStartChatWithOption = (option: MedicalOption) => {
    setActiveOption(option);
  };

  const handleSendMessage = async (textToSend?: string) => {
    if (!activeOption) return;
    const question = (textToSend || inputText).trim();
    if (!question || isLoading) return;

    const userMsg: ChatMessage = {
      id: `usr-${Date.now()}`,
      sender: 'user',
      text: question,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setChatMessages((prev) => ({
      ...prev,
      [activeOption.id]: [...(prev[activeOption.id] || []), userMsg],
    }));
    setInputText('');
    setIsLoading(true);

    try {
      const response = await fetch('/api/ai-specialist/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          specialistId: activeOption.id,
          question,
          bodyPart: activeOption.bodyPart,
        }),
      });

      if (!response.ok) {
        throw new Error(`Server returned ${response.status}`);
      }

      const data = await response.json();
      const replyText =
        data.reply ||
        `Astronaut, symptom received for ${activeOption.bodyPart}. Please log this in your daily medical record and notify the Capcom flight surgeon if acute discomfort persists.`;

      const specialistMsg: ChatMessage = {
        id: `spec-${Date.now()}`,
        sender: 'specialist',
        text: replyText,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };

      setChatMessages((prev) => ({
        ...prev,
        [activeOption.id]: [...(prev[activeOption.id] || []), specialistMsg],
      }));
    } catch (err) {
      console.error('Failed to query specialist API:', err);
      const fallbackMsg: ChatMessage = {
        id: `spec-err-${Date.now()}`,
        sender: 'specialist',
        text: `Orbital link delay encountered. Stay rested in neutral body posture, keep hydrated with electrolyte water, and report any severe discomfort to mission control.`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setChatMessages((prev) => ({
        ...prev,
        [activeOption.id]: [...(prev[activeOption.id] || []), fallbackMsg],
      }));
    } finally {
      setIsLoading(false);
    }
  };

  const handleResetChat = () => {
    if (!activeOption) return;
    setChatMessages((prev) => ({
      ...prev,
      [activeOption.id]: [
        {
          id: `greet-${activeOption.id}-${Date.now()}`,
          sender: 'specialist',
          text: activeOption.initialGreeting,
          timestamp: 'NOW',
        },
      ],
    }));
  };

  return (
    <div className="relative min-h-screen w-full bg-[#050713] text-slate-100 flex flex-col justify-between selection:bg-cyan-500 selection:text-black">
      {/* Background Ambience */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
        <div className="absolute top-1/4 -left-48 w-96 h-96 bg-cyan-600/10 rounded-full blur-[140px]" />
        <div className="absolute bottom-1/4 -right-48 w-96 h-96 bg-purple-600/10 rounded-full blur-[140px]" />
        <div className="absolute inset-0 bg-[radial-gradient(#1e293b_1px,transparent_1px)] [background-size:24px_24px] opacity-25" />
      </div>

      {/* Top Header */}
      <header className="relative z-10 pt-5 px-4 sm:px-8 max-w-6xl mx-auto w-full flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 border-b border-cyan-500/20 pb-4">
        <div className="flex items-center gap-3">
          <button
            onClick={onBack}
            className="p-2.5 rounded-xl bg-slate-900/90 hover:bg-slate-800 border border-cyan-400/40 hover:border-cyan-300 text-cyan-300 hover:text-white transition-all shadow-[0_0_15px_rgba(6,182,212,0.25)] flex items-center gap-2 font-mono text-xs cursor-pointer group"
          >
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" />
            <span>Flight Deck</span>
          </button>

          <div>
            <div className="flex items-center gap-2">
              <span className="px-2 py-0.5 rounded-md bg-teal-500/20 text-teal-300 border border-teal-400/40 text-[10px] font-mono uppercase tracking-wider flex items-center gap-1.5">
                <StethoscopeIcon className="w-3.5 h-3.5 text-teal-300" />
                Orbital Medical Bay
              </span>
              <span className="flex items-center gap-1 text-[11px] font-mono text-emerald-400">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                AI Online
              </span>
            </div>
            <h1 className="text-xl sm:text-2xl font-black tracking-tight text-white mt-1">
              AI Medical Specialists
            </h1>
          </div>
        </div>

        {/* Status / Quick Switch to All Options if inside chat */}
        {activeOption ? (
          <button
            onClick={() => setActiveOption(null)}
            className="px-3 py-1.5 rounded-xl bg-slate-900/90 hover:bg-cyan-950/60 border border-cyan-500/40 hover:border-cyan-300 text-cyan-300 text-xs font-mono transition-all flex items-center gap-1.5 cursor-pointer self-start sm:self-auto"
          >
            <span>← Choose Other Specialist</span>
          </button>
        ) : (
          <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-900/80 border border-slate-700/60 text-xs text-slate-300 font-mono">
            <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
            <span>Click any option to begin chat immediately</span>
          </div>
        )}
      </header>

      {/* Main View: EITHER Simple Options Grid OR Active Immediate Chat */}
      <main className="relative z-10 flex-1 max-w-6xl mx-auto w-full px-4 sm:px-8 py-6">
        {!activeOption ? (
          /* =========================================================================
             1. SIMPLIFIED SELECTION STAGE (Clean Options Grid with No Names)
             ========================================================================= */
          <div className="space-y-6">
            {/* Header prompt banner */}
            <div className="text-center max-w-2xl mx-auto space-y-2">
              <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-400/30 text-cyan-300 text-xs font-mono">
                <Activity className="w-3.5 h-3.5 text-cyan-400" />
                Which body part or symptom feels uncomfortable?
              </span>
              <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
                Select an Option to Begin Consultation
              </h2>
              <p className="text-xs sm:text-sm text-slate-400">
                Click any specialist option below and the clinical AI chat will start right away.
              </p>
            </div>

            {/* Clean Grid of Specialist Options */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5 pt-2">
              {SPECIALIST_OPTIONS.map((opt) => {
                const IconComp = opt.icon;
                return (
                  <button
                    key={opt.id}
                    onClick={() => handleStartChatWithOption(opt)}
                    className={`p-4 rounded-2xl bg-slate-900/85 hover:bg-slate-850 border ${opt.borderColor} transition-all duration-200 cursor-pointer text-left flex flex-col justify-between group relative overflow-hidden shadow-[0_4px_20px_rgba(0,0,0,0.4)] hover:shadow-[0_0_25px_rgba(6,182,212,0.25)] hover:-translate-y-1`}
                  >
                    {/* Subtle hover gradient bloom */}
                    <div
                      className={`absolute -right-8 -bottom-8 w-28 h-28 rounded-full bg-gradient-to-br ${opt.bgGlow} blur-xl pointer-events-none opacity-40 group-hover:opacity-80 transition-opacity`}
                    />

                    <div>
                      {/* Top icon and tag */}
                      <div className="flex items-center justify-between gap-2 mb-3">
                        <div
                          className={`p-2.5 rounded-xl bg-slate-800/80 border border-slate-700/80 group-hover:scale-110 transition-transform ${opt.accentColor}`}
                        >
                          <IconComp className="w-5 h-5" />
                        </div>
                        <span className={`text-[10px] font-mono px-2 py-0.5 rounded-full border ${opt.badgeBg}`}>
                          {opt.bodyPart}
                        </span>
                      </div>

                      {/* Specialist Title */}
                      <h3 className="text-base font-bold text-white group-hover:text-cyan-300 transition-colors">
                        {opt.title}
                      </h3>

                      {/* Common Symptoms summary */}
                      <p className="text-xs text-slate-400 mt-1.5 leading-relaxed line-clamp-2">
                        {opt.summary}
                      </p>
                    </div>

                    {/* Action CTA */}
                    <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs font-mono font-bold text-cyan-400 group-hover:text-cyan-300">
                      <span>Begin Chat</span>
                      <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        ) : (
          /* =========================================================================
             2. ACTIVE CONSULTATION CHAT (Begins as soon as clicked, no names)
             ========================================================================= */
          <div className="flex flex-col rounded-2xl bg-slate-900/90 border border-cyan-500/30 backdrop-blur-xl shadow-[0_0_35px_rgba(6,182,212,0.15)] overflow-hidden max-w-4xl mx-auto">
            {/* Quick Switcher bar along the top */}
            <div className="px-3 py-2 bg-slate-950/70 border-b border-slate-800/80 flex items-center gap-1.5 overflow-x-auto text-[11px] font-mono scrollbar-none">
              <span className="text-slate-400 text-[10px] uppercase font-bold shrink-0 mr-1 flex items-center gap-1">
                <StethoscopeIcon className="w-3 h-3 text-cyan-400" />
                Specialists:
              </span>
              {SPECIALIST_OPTIONS.map((opt) => {
                const isCurrent = opt.id === activeOption.id;
                return (
                  <button
                    key={opt.id}
                    onClick={() => setActiveOption(opt)}
                    className={`px-2.5 py-1 rounded-lg whitespace-nowrap transition-all cursor-pointer flex items-center gap-1.5 ${
                      isCurrent
                        ? 'bg-cyan-500/25 text-cyan-300 border border-cyan-400/50 font-bold shadow-[0_0_10px_rgba(6,182,212,0.25)]'
                        : 'bg-slate-900/60 text-slate-400 hover:text-slate-200 hover:bg-slate-850 border border-slate-800'
                    }`}
                  >
                    <span>{opt.bodyPart}</span>
                  </button>
                );
              })}
            </div>

            {/* Active Specialist Header */}
            <div className="p-4 bg-gradient-to-r from-slate-900 via-slate-850 to-slate-900 border-b border-cyan-500/20 flex items-center justify-between flex-wrap gap-3">
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-xl bg-cyan-500/20 border border-cyan-400/50 text-cyan-300">
                  {React.createElement(activeOption.icon, { className: 'w-6 h-6' })}
                </div>

                <div>
                  <div className="flex items-center gap-2">
                    <h2 className="text-base sm:text-lg font-bold text-white">
                      {activeOption.title}
                    </h2>
                    <span className="px-2 py-0.5 rounded-full bg-cyan-500/10 text-cyan-300 border border-cyan-400/30 text-[10px] font-mono">
                      {activeOption.bodyPart}
                    </span>
                  </div>
                  <p className="text-xs text-slate-400 font-mono">
                    Orbital Telemetry & Countermeasure Consultation
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={handleResetChat}
                  className="px-2.5 py-1 rounded-lg bg-slate-800/80 hover:bg-slate-750 border border-slate-700 text-slate-300 hover:text-white text-xs font-mono flex items-center gap-1.5 transition-colors cursor-pointer"
                  title="Clear conversation"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Reset</span>
                </button>
                <div className="px-2.5 py-1 rounded-lg bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-[10px] font-mono flex items-center gap-1.5">
                  <Zap className="w-3 h-3" />
                  <span>API Linked</span>
                </div>
              </div>
            </div>

            {/* Quick Symptom Chips: 1-Click Questions */}
            <div className="p-3 bg-slate-950/60 border-b border-slate-800/60">
              <div className="text-[10px] font-mono text-cyan-300/90 mb-1.5 flex items-center gap-1">
                <Sparkles className="w-3 h-3 text-cyan-400" />
                <span>Common {activeOption.bodyPart} symptoms (click to ask):</span>
              </div>
              <div className="flex flex-wrap gap-1.5">
                {activeOption.quickQuestions.map((q, idx) => (
                  <button
                    key={idx}
                    disabled={isLoading}
                    onClick={() => handleSendMessage(q)}
                    className="px-2.5 py-1 rounded-lg bg-slate-900/90 hover:bg-cyan-950/60 border border-cyan-500/30 hover:border-cyan-400 text-slate-300 hover:text-cyan-200 text-xs text-left transition-all cursor-pointer disabled:opacity-50"
                  >
                    "{q}"
                  </button>
                ))}
              </div>
            </div>

            {/* Interactive Chat Stream */}
            <div className="p-4 sm:p-5 overflow-y-auto space-y-3.5 min-h-[340px] max-h-[420px]">
              {currentMessages.map((msg) => {
                const isSpecialist = msg.sender === 'specialist';
                return (
                  <div
                    key={msg.id}
                    className={`flex gap-2.5 ${isSpecialist ? 'justify-start' : 'justify-end'}`}
                  >
                    {isSpecialist && (
                      <div className="w-8 h-8 rounded-lg bg-cyan-500/20 border border-cyan-400/40 text-cyan-300 flex items-center justify-center shrink-0 mt-0.5">
                        {React.createElement(activeOption.icon, { className: 'w-4 h-4' })}
                      </div>
                    )}

                    <div
                      className={`max-w-[85%] rounded-2xl p-3.5 text-xs sm:text-sm leading-relaxed ${
                        isSpecialist
                          ? 'bg-slate-950/90 border border-cyan-500/30 text-slate-100 shadow-[0_0_15px_rgba(6,182,212,0.1)]'
                          : 'bg-gradient-to-r from-blue-600 to-cyan-600 text-white font-medium shadow-[0_0_15px_rgba(37,99,235,0.25)]'
                      }`}
                    >
                      {isSpecialist && (
                        <div className="flex items-center justify-between gap-2 border-b border-cyan-500/20 pb-1.5 mb-2 font-mono text-[10px] text-cyan-300">
                          <span className="font-bold">{activeOption.title}</span>
                          <span className="text-slate-400">{msg.timestamp}</span>
                        </div>
                      )}

                      <div className="whitespace-pre-line">{msg.text}</div>

                      {!isSpecialist && (
                        <div className="text-right text-[9px] font-mono text-cyan-100/70 mt-1">
                          {msg.timestamp}
                        </div>
                      )}
                    </div>

                    {!isSpecialist && (
                      <div className="w-8 h-8 rounded-lg bg-blue-600 text-white flex items-center justify-center shrink-0 mt-0.5">
                        <User className="w-4 h-4" />
                      </div>
                    )}
                  </div>
                );
              })}

              {isLoading && (
                <div className="flex gap-2.5 justify-start">
                  <div className="w-8 h-8 rounded-lg bg-cyan-500/20 border border-cyan-400/40 text-cyan-300 flex items-center justify-center shrink-0 animate-pulse">
                    {React.createElement(activeOption.icon, { className: 'w-4 h-4' })}
                  </div>
                  <div className="p-3.5 rounded-2xl bg-slate-950/90 border border-cyan-500/30 text-xs font-mono text-cyan-300 flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
                    <span>{activeOption.title} is formulating clinical countermeasures...</span>
                  </div>
                </div>
              )}

              <div ref={chatScrollRef} />
            </div>

            {/* Chat Input Console */}
            <div className="p-3.5 bg-slate-950/95 border-t border-cyan-500/20">
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  handleSendMessage();
                }}
                className="flex items-center gap-2"
              >
                <input
                  type="text"
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  placeholder={`Describe your ${activeOption.bodyPart.toLowerCase()} symptoms or ask a question...`}
                  disabled={isLoading}
                  className="flex-1 px-3.5 py-2.5 rounded-xl bg-slate-900/90 border border-slate-700/80 focus:border-cyan-400 text-xs sm:text-sm text-slate-100 placeholder-slate-500 focus:outline-none transition-colors"
                />
                <button
                  type="submit"
                  disabled={!inputText.trim() || isLoading}
                  className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-teal-500 via-cyan-500 to-blue-500 hover:from-teal-400 hover:to-cyan-400 text-slate-950 font-bold text-xs font-mono transition-all shadow-[0_0_15px_rgba(6,182,212,0.35)] disabled:opacity-40 disabled:cursor-not-allowed flex items-center gap-1.5 cursor-pointer shrink-0"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Consult</span>
                </button>
              </form>

              <div className="flex items-center justify-between text-[10px] font-mono text-slate-500 mt-2 px-1">
                <span>Model: Gemini 3.8 Flash • Space Clinical Telemetry</span>
                <span>Emergency? Contact Capcom Flight Surgeon immediately</span>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Clean Bottom Note */}
      <footer className="relative z-10 py-3 text-center text-xs font-mono text-slate-500 border-t border-slate-900">
        ✨ Every success comes from a dream • D' Physco-Bit AI Medical Bay
      </footer>
    </div>
  );
};
