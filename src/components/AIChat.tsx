import React, { useState, useRef, useEffect } from 'react';
import { ArrowLeft, Send, Bot, User, Sparkles, RefreshCw, MessageSquare } from 'lucide-react';

interface AIChatProps {
  onBack: () => void;
}

interface ChatMessage {
  id: string;
  sender: 'user' | 'ai';
  text: string;
  timestamp: string;
}

interface PromptCategory {
  id: 'feelings' | 'fitness' | 'symptoms';
  label: string;
  icon: string;
  prompts: string[];
}

const promptCategories: PromptCategory[] = [
  {
    id: 'feelings',
    label: 'Feelings & Mood',
    icon: '💭',
    prompts: [
      "I'm feeling homesick and miss my family",
      "Feeling anxious & nervous about tomorrow's spacewalk",
      "Overwhelmed by today's timeline and burnt out",
      "Got cabin fever and feeling irritable",
      "In awe looking at Earth, feeling overwhelmed and small",
    ],
  },
  {
    id: 'fitness',
    label: 'Exercise & Fitness',
    icon: '🏋️',
    prompts: [
      "How much exercise do I need each day in orbit?",
      "Can I skip my workout today? I feel tired",
      "Why are my legs getting so skinny (bird legs)?",
      "How do we prevent bone loss and muscle atrophy?",
      "The treadmill bungee harness hurts my shoulders and feet",
    ],
  },
  {
    id: 'symptoms',
    label: 'Health & Symptoms',
    icon: '🩺',
    prompts: [
      "Head pressure & puffy face from fluid shift",
      "Dizzy and space motion sickness",
      "Trouble sleeping with the ventilation noise",
      "Fingernails hurting from spacesuit gloves",
      "Cosmic flashes when closing my eyes",
    ],
  },
];

export const AIChat: React.FC<AIChatProps> = ({ onBack }) => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'init-1',
      sender: 'ai',
      text: "Hi astronaut! 👋 I am your D' Physco-Bit AI companion.\n\nExpress how you are feeling, ask any question about your daily exercise & fitness, or describe physical health symptoms. I am here to support you!",
      timestamp: 'NOW',
    },
  ]);
  const [activeCategory, setActiveCategory] = useState<'feelings' | 'fitness' | 'symptoms'>('feelings');
  const [inputText, setInputText] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  const handleSendMessage = async (textToSend?: string) => {
    const text = (textToSend || inputText).trim();
    if (!text || isLoading) return;

    const userMsg: ChatMessage = {
      id: `user-${Date.now()}`,
      sender: 'user',
      text,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputText('');
    setIsLoading(true);

    try {
      const response = await fetch('/api/ai-chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ problem: text }),
      });

      if (!response.ok) {
        throw new Error(`Server returned ${response.status}`);
      }

      const data = await response.json();
      const aiReply = data.reply || "I am here to help you. Take a deep breath and let flight medical know if symptoms persist.";

      const aiMsg: ChatMessage = {
        id: `ai-${Date.now()}`,
        sender: 'ai',
        text: aiReply,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };

      setMessages((prev) => [...prev, aiMsg]);
    } catch (err: any) {
      console.error('AI chat error:', err);
      const errorMsg: ChatMessage = {
        id: `ai-err-${Date.now()}`,
        sender: 'ai',
        text: "I couldn't reach the medical communications link right now. Please rest, drink some water, and notify your crew if you feel unwell.\n\n✨ Every success comes from a dream.",
        timestamp: 'NOW',
      };
      setMessages((prev) => [...prev, errorMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full bg-[#050711] text-slate-100 flex flex-col justify-between selection:bg-cyan-500 selection:text-black p-4 sm:p-6 relative overflow-hidden">
      {/* Top Header */}
      <header className="w-full max-w-xl mx-auto flex items-center justify-between z-20">
        <button
          onClick={onBack}
          className="px-3 py-1.5 rounded-lg bg-slate-900/80 border border-slate-800 text-slate-300 hover:text-white hover:border-cyan-400/50 transition-all flex items-center gap-1.5 text-xs font-mono cursor-pointer"
        >
          <ArrowLeft className="w-3.5 h-3.5 text-cyan-400" />
          <span>Back</span>
        </button>

        <div className="flex items-center gap-2">
          <Bot className="w-4 h-4 text-cyan-400 animate-pulse" />
          <span className="text-xs font-mono tracking-widest text-cyan-400 uppercase font-semibold">
            AI Problem Solver
          </span>
        </div>

        <div className="flex items-center gap-1 text-[11px] font-mono text-emerald-400 bg-emerald-950/60 px-2 py-0.5 rounded-full border border-emerald-500/30">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
          <span>Online</span>
        </div>
      </header>

      {/* Main Stage: Square / Compact Chat Terminal */}
      <main className="flex-1 flex flex-col items-center justify-center py-2 z-10">
        <div className="w-full max-w-[500px] h-[520px] rounded-[2.5rem] bg-gradient-to-b from-slate-900/95 via-slate-950/95 to-[#060914] border-2 border-cyan-400/40 p-4 sm:p-5 shadow-[0_0_60px_rgba(6,182,212,0.25)] flex flex-col justify-between relative backdrop-blur-2xl">
          {/* Subtle Outer Neon Aura */}
          <div className="absolute -inset-1 rounded-[2.75rem] bg-gradient-to-tr from-cyan-500/20 via-purple-500/15 to-transparent blur-xl pointer-events-none -z-10" />

          {/* Chat Header */}
          <div className="flex items-center justify-between pb-2.5 border-b border-slate-800">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-cyan-500/20 border border-cyan-400/50 flex items-center justify-center text-cyan-300">
                <Sparkles className="w-4 h-4" />
              </div>
              <div>
                <h2 className="text-xs sm:text-sm font-bold font-display text-white">
                  Space Health, Mood & Fitness Companion
                </h2>
                <p className="text-[10px] font-mono text-cyan-300">
                  Feelings, daily exercise & physical symptoms
                </p>
              </div>
            </div>

            <MessageSquare className="w-4 h-4 text-slate-500" />
          </div>

          {/* Category Selector Tabs */}
          <div className="pt-2 pb-1 flex items-center justify-between gap-1">
            <div className="flex gap-1 overflow-x-auto no-scrollbar w-full">
              {promptCategories.map((cat) => (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => setActiveCategory(cat.id)}
                  className={`px-2.5 py-1 rounded-lg text-[10px] font-mono transition-all flex items-center gap-1.5 cursor-pointer shrink-0 ${
                    activeCategory === cat.id
                      ? 'bg-cyan-500/25 text-cyan-300 border border-cyan-400/60 shadow-[0_0_10px_rgba(6,182,212,0.25)] font-semibold'
                      : 'bg-slate-900/70 text-slate-400 border border-slate-800/80 hover:text-slate-200 hover:border-slate-700'
                  }`}
                >
                  <span>{cat.icon}</span>
                  <span>{cat.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Quick Problem Tap Pills for Active Category */}
          <div className="py-1.5 overflow-x-auto flex gap-1.5 no-scrollbar">
            {promptCategories.find((c) => c.id === activeCategory)?.prompts.map((prob, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => handleSendMessage(prob)}
                disabled={isLoading}
                className="px-2.5 py-1 rounded-full bg-slate-900/90 hover:bg-slate-800 border border-slate-800 hover:border-cyan-500/50 text-[10px] font-mono text-slate-300 hover:text-cyan-300 whitespace-nowrap transition-colors cursor-pointer shrink-0 shadow-sm"
              >
                {prob}
              </button>
            ))}
          </div>

          {/* Message Stream */}
          <div className="flex-1 overflow-y-auto pr-1 space-y-3 my-1">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex gap-2.5 ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                {msg.sender === 'ai' && (
                  <div className="w-7 h-7 rounded-full bg-cyan-950 border border-cyan-400/60 flex items-center justify-center text-cyan-300 shrink-0 mt-0.5">
                    <Bot className="w-4 h-4" />
                  </div>
                )}

                <div
                  className={`max-w-[82%] p-3 rounded-2xl text-xs leading-relaxed font-sans ${
                    msg.sender === 'user'
                      ? 'bg-gradient-to-r from-cyan-600 to-blue-600 text-white rounded-tr-sm shadow-md'
                      : 'bg-slate-950/90 border border-slate-800/80 text-slate-200 rounded-tl-sm shadow-inner'
                  }`}
                >
                  <p className="whitespace-pre-line">{msg.text}</p>
                  <span className="block text-[9px] font-mono text-slate-400 text-right mt-1 opacity-70">
                    {msg.timestamp}
                  </span>
                </div>

                {msg.sender === 'user' && (
                  <div className="w-7 h-7 rounded-full bg-blue-950 border border-blue-400/60 flex items-center justify-center text-blue-300 shrink-0 mt-0.5">
                    <User className="w-4 h-4" />
                  </div>
                )}
              </div>
            ))}

            {isLoading && (
              <div className="flex gap-2.5 items-center text-slate-400 text-xs font-mono">
                <div className="w-7 h-7 rounded-full bg-cyan-950 border border-cyan-400/60 flex items-center justify-center text-cyan-300 shrink-0">
                  <RefreshCw className="w-4 h-4 animate-spin text-cyan-400" />
                </div>
                <div className="p-3 rounded-2xl bg-slate-950 border border-slate-800 text-[11px] text-cyan-300 flex items-center gap-2">
                  <span>AI is formulating guidance...</span>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Simple Input Bar */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSendMessage();
            }}
            className="pt-2 border-t border-slate-800 flex gap-2"
          >
            <input
              type="text"
              placeholder="Type how you feel, an exercise question, or a symptom..."
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              disabled={isLoading}
              className="flex-1 px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs sm:text-sm font-sans text-white placeholder:text-slate-600 focus:outline-none focus:border-cyan-400 transition-colors"
            />
            <button
              type="submit"
              disabled={isLoading || !inputText.trim()}
              className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-cyan-400 to-blue-500 hover:from-cyan-300 hover:to-blue-400 text-slate-950 font-mono font-bold text-xs flex items-center gap-1.5 transition-all shadow-[0_0_15px_rgba(34,211,238,0.4)] disabled:opacity-40 cursor-pointer shrink-0 active:scale-95"
            >
              <Send className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Send</span>
            </button>
          </form>
        </div>
      </main>

      {/* Footer */}
      <footer className="text-center z-10">
        <span className="text-[10px] font-mono text-slate-500">
          D' Physco-Bit · AI Space Health Assistant
        </span>
      </footer>
    </div>
  );
};
