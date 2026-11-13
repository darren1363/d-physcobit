import React, { useState, useEffect, useRef } from 'react';
import { ArrowLeft, Play, RotateCcw, Trophy, Sparkles, Volume2, VolumeX, Shield, Heart, Zap } from 'lucide-react';

interface SpaceGameProps {
  onBack: () => void;
}

interface Star {
  x: number;
  y: number;
  size: number;
  speed: number;
  color: string;
}

interface Gem {
  id: number;
  x: number;
  y: number;
  size: number;
  speed: number;
  rot: number;
  rotSpeed: number;
  type: 'star' | 'heart' | 'special';
  hue: number;
}

interface Obstacle {
  id: number;
  x: number;
  y: number;
  size: number;
  speed: number;
  rot: number;
  rotSpeed: number;
  points: number[];
}

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number;
  maxLife: number;
  size: number;
  color: string;
}

interface FloatingText {
  id: number;
  text: string;
  x: number;
  y: number;
  life: number;
  color: string;
}

export const SpaceGame: React.FC<SpaceGameProps> = ({ onBack }) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  const [gameState, setGameState] = useState<'start' | 'playing' | 'gameover'>('start');
  const [score, setScore] = useState<number>(0);
  const [highScore, setHighScore] = useState<number>(() => {
    try {
      return Number(localStorage.getItem('d_physco_game_highscore') || '0');
    } catch {
      return 0;
    }
  });
  const [health, setHealth] = useState<number>(3);
  const [combo, setCombo] = useState<number>(1);
  const [soundOn, setSoundOn] = useState<boolean>(true);

  // Astronaut player position
  const playerRef = useRef({
    x: 200,
    y: 360,
    vx: 0,
    vy: 0,
    targetX: 200,
    targetY: 360,
    radius: 26,
    shieldAngle: 0,
  });

  const keysRef = useRef<{ [key: string]: boolean }>({});
  const isPointerDownRef = useRef<boolean>(false);
  const gemsRef = useRef<Gem[]>([]);
  const obstaclesRef = useRef<Obstacle[]>([]);
  const starsRef = useRef<Star[]>([]);
  const particlesRef = useRef<Particle[]>([]);
  const floatingTextsRef = useRef<FloatingText[]>([]);
  const animationFrameRef = useRef<number | null>(null);
  const avatarImgRef = useRef<HTMLImageElement | null>(null);

  // Load avatar asset
  useEffect(() => {
    const img = new Image();
    img.src = '/avatar.png';
    img.onload = () => {
      avatarImgRef.current = img;
    };
  }, []);

  // Web Audio for game sound effects
  const playSfx = (type: 'collect' | 'heart' | 'hit' | 'gameover') => {
    if (!soundOn || typeof window === 'undefined') return;
    try {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      const ctx = new AudioCtx();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain);
      gain.connect(ctx.destination);

      if (type === 'collect') {
        osc.type = 'sine';
        osc.frequency.setValueAtTime(587.33, ctx.currentTime); // D5
        osc.frequency.exponentialRampToValueAtTime(1174.66, ctx.currentTime + 0.12); // D6
        gain.gain.setValueAtTime(0.08, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.12);
        osc.start();
        osc.stop(ctx.currentTime + 0.12);
      } else if (type === 'heart') {
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(440, ctx.currentTime);
        osc.frequency.linearRampToValueAtTime(880, ctx.currentTime + 0.2);
        gain.gain.setValueAtTime(0.1, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.25);
        osc.start();
        osc.stop(ctx.currentTime + 0.25);
      } else if (type === 'hit') {
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(240, ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(70, ctx.currentTime + 0.22);
        gain.gain.setValueAtTime(0.14, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.22);
        osc.start();
        osc.stop(ctx.currentTime + 0.22);
      } else if (type === 'gameover') {
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(200, ctx.currentTime);
        osc.frequency.linearRampToValueAtTime(50, ctx.currentTime + 0.5);
        gain.gain.setValueAtTime(0.15, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.5);
        osc.start();
        osc.stop(ctx.currentTime + 0.5);
      }
    } catch {
      // Audio fallback
    }
  };

  // Start new game
  const startGame = () => {
    setScore(0);
    setHealth(3);
    setCombo(1);
    setGameState('playing');
    gemsRef.current = [];
    obstaclesRef.current = [];
    particlesRef.current = [];
    floatingTextsRef.current = [];
    playerRef.current = {
      x: 200,
      y: 360,
      vx: 0,
      vy: 0,
      targetX: 200,
      targetY: 360,
      radius: 26,
      shieldAngle: 0,
    };
  };

  // Keyboard controls
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      keysRef.current[e.key] = true;
      if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', ' '].includes(e.key)) {
        e.preventDefault();
      }
    };
    const handleKeyUp = (e: KeyboardEvent) => {
      keysRef.current[e.key] = false;
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, []);

  // Main Canvas Render & Physics Loop
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Initialize parallax multi-layer starfield
    if (starsRef.current.length === 0) {
      const colors = ['#ffffff', '#bae6fd', '#ddd6fe', '#fef08a'];
      for (let i = 0; i < 75; i++) {
        starsRef.current.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          size: Math.random() * 2.2 + 0.8,
          speed: Math.random() * 1.4 + 0.4,
          color: colors[Math.floor(Math.random() * colors.length)],
        });
      }
    }

    let spawnTimer = 0;

    const gameLoop = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // 1. Deep Space Cosmic Nebula Background
      const nebulaGrad = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
      nebulaGrad.addColorStop(0, '#040612');
      nebulaGrad.addColorStop(0.5, '#070b1e');
      nebulaGrad.addColorStop(1, '#050714');
      ctx.fillStyle = nebulaGrad;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Distant Purple Nebula Glow
      const glowGrad = ctx.createRadialGradient(
        canvas.width * 0.7,
        canvas.height * 0.3,
        20,
        canvas.width * 0.7,
        canvas.height * 0.3,
        180
      );
      glowGrad.addColorStop(0, 'rgba(168, 85, 247, 0.14)');
      glowGrad.addColorStop(1, 'transparent');
      ctx.fillStyle = glowGrad;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // 2. Parallax Twinkling Stars
      starsRef.current.forEach((st) => {
        st.y += st.speed;
        if (st.y > canvas.height) {
          st.y = 0;
          st.x = Math.random() * canvas.width;
        }
        ctx.fillStyle = st.color;
        ctx.beginPath();
        ctx.arc(st.x, st.y, st.size, 0, Math.PI * 2);
        ctx.fill();
      });

      if (gameState === 'playing') {
        spawnTimer++;

        const player = playerRef.current;
        player.shieldAngle += 0.04;

        // Player movement controls
        const speed = 5.0;
        if (keysRef.current['ArrowLeft'] || keysRef.current['a'] || keysRef.current['A']) {
          player.vx = -speed;
        } else if (keysRef.current['ArrowRight'] || keysRef.current['d'] || keysRef.current['D']) {
          player.vx = speed;
        } else if (isPointerDownRef.current) {
          player.vx = (player.targetX - player.x) * 0.15;
        } else {
          player.vx *= 0.82;
        }

        if (keysRef.current['ArrowUp'] || keysRef.current['w'] || keysRef.current['W']) {
          player.vy = -speed;
        } else if (keysRef.current['ArrowDown'] || keysRef.current['s'] || keysRef.current['S']) {
          player.vy = speed;
        } else if (isPointerDownRef.current) {
          player.vy = (player.targetY - player.y) * 0.15;
        } else {
          player.vy *= 0.82;
        }

        player.x += player.vx;
        player.y += player.vy;

        // Keep inside boundaries
        player.x = Math.max(player.radius + 6, Math.min(canvas.width - player.radius - 6, player.x));
        player.y = Math.max(player.radius + 6, Math.min(canvas.height - player.radius - 6, player.y));

        // Ion Thruster Particle Trail
        if (spawnTimer % 2 === 0) {
          particlesRef.current.push({
            x: player.x + (Math.random() - 0.5) * 10,
            y: player.y + player.radius - 2,
            vx: (Math.random() - 0.5) * 1.5,
            vy: Math.random() * 2 + 2,
            life: 1,
            maxLife: 24,
            size: Math.random() * 3 + 2,
            color: Math.random() > 0.4 ? '#22d3ee' : '#a855f7',
          });
        }

        // 3. Spawning Stardust Crystals & Space Gems
        if (spawnTimer % 30 === 0) {
          const rand = Math.random();
          const isHeart = rand < 0.12;
          const isSpecial = rand > 0.85;

          gemsRef.current.push({
            id: Date.now() + Math.random(),
            x: Math.random() * (canvas.width - 50) + 25,
            y: -25,
            size: isHeart ? 14 : isSpecial ? 13 : 11,
            speed: Math.random() * 1.6 + 2.2,
            rot: 0,
            rotSpeed: (Math.random() - 0.5) * 0.08,
            type: isHeart ? 'heart' : isSpecial ? 'special' : 'star',
            hue: Math.floor(Math.random() * 60) + 170, // cyan to violet
          });
        }

        // Spawning Craters & Magma Asteroids
        if (spawnTimer % 50 === 0) {
          // Generate irregular polygon points for realistic rock
          const points: number[] = [];
          const vertices = 7;
          for (let p = 0; p < vertices; p++) {
            points.push(0.75 + Math.random() * 0.5);
          }

          obstaclesRef.current.push({
            id: Date.now() + Math.random(),
            x: Math.random() * (canvas.width - 60) + 30,
            y: -35,
            size: Math.random() * 14 + 20,
            speed: Math.random() * 1.8 + 2.6,
            rot: Math.random() * Math.PI * 2,
            rotSpeed: (Math.random() - 0.5) * 0.06,
            points,
          });
        }

        // 4. Update & Draw Gems
        gemsRef.current.forEach((gem, idx) => {
          gem.y += gem.speed;
          gem.rot += gem.rotSpeed;

          // Collision with Player
          const dist = Math.hypot(gem.x - player.x, gem.y - player.y);
          if (dist < player.radius + gem.size) {
            // Particle burst
            for (let p = 0; p < 12; p++) {
              const angle = (p / 12) * Math.PI * 2;
              particlesRef.current.push({
                x: gem.x,
                y: gem.y,
                vx: Math.cos(angle) * (Math.random() * 3 + 1.5),
                vy: Math.sin(angle) * (Math.random() * 3 + 1.5),
                life: 1,
                maxLife: 20,
                size: Math.random() * 3 + 1.5,
                color: gem.type === 'heart' ? '#f43f5e' : gem.type === 'special' ? '#fbbf24' : '#22d3ee',
              });
            }

            if (gem.type === 'heart') {
              playSfx('heart');
              setHealth((h) => Math.min(3, h + 1));
              setScore((s) => s + 50);
              floatingTextsRef.current.push({
                id: Date.now(),
                text: '+HEART!',
                x: gem.x,
                y: gem.y,
                life: 30,
                color: '#f43f5e',
              });
            } else if (gem.type === 'special') {
              playSfx('collect');
              setScore((s) => s + 100);
              setCombo((c) => Math.min(5, c + 1));
              floatingTextsRef.current.push({
                id: Date.now(),
                text: '+100 SUPER!',
                x: gem.x,
                y: gem.y,
                life: 30,
                color: '#fbbf24',
              });
            } else {
              playSfx('collect');
              setScore((s) => {
                const add = 20 * combo;
                const newScore = s + add;
                if (newScore > highScore) {
                  setHighScore(newScore);
                  try {
                    localStorage.setItem('d_physco_game_highscore', String(newScore));
                  } catch {}
                }
                return newScore;
              });
              floatingTextsRef.current.push({
                id: Date.now(),
                text: `+${20 * combo}`,
                x: gem.x,
                y: gem.y,
                life: 25,
                color: '#22d3ee',
              });
            }

            gemsRef.current.splice(idx, 1);
            return;
          }

          // Draw Glowing Gem / Crystal
          ctx.save();
          ctx.translate(gem.x, gem.y);
          ctx.rotate(gem.rot);

          if (gem.type === 'heart') {
            // Glowing Cosmic Heart Orb
            ctx.shadowColor = '#f43f5e';
            ctx.shadowBlur = 14;
            ctx.fillStyle = '#f43f5e';
            ctx.beginPath();
            ctx.arc(0, 0, gem.size, 0, Math.PI * 2);
            ctx.fill();

            // Inner heart core
            ctx.fillStyle = '#ffffff';
            ctx.beginPath();
            ctx.arc(0, 0, gem.size * 0.45, 0, Math.PI * 2);
            ctx.fill();
          } else {
            // Rotating Stardust Crystal Diamond
            ctx.shadowColor = gem.type === 'special' ? '#fbbf24' : '#22d3ee';
            ctx.shadowBlur = 12;

            ctx.fillStyle = gem.type === 'special' ? '#fbbf24' : '#22d3ee';
            ctx.beginPath();
            ctx.moveTo(0, -gem.size);
            ctx.lineTo(gem.size, 0);
            ctx.lineTo(0, gem.size);
            ctx.lineTo(-gem.size, 0);
            ctx.closePath();
            ctx.fill();

            // Inner Diamond Facet
            ctx.fillStyle = '#ffffff';
            ctx.beginPath();
            ctx.moveTo(0, -gem.size * 0.5);
            ctx.lineTo(gem.size * 0.5, 0);
            ctx.lineTo(0, gem.size * 0.5);
            ctx.lineTo(-gem.size * 0.5, 0);
            ctx.closePath();
            ctx.fill();
          }
          ctx.restore();
        });

        // 5. Update & Draw Textured Asteroids
        obstaclesRef.current.forEach((obs, idx) => {
          obs.y += obs.speed;
          obs.rot += obs.rotSpeed;

          // Collision check
          const dist = Math.hypot(obs.x - player.x, obs.y - player.y);
          if (dist < player.radius + obs.size * 0.72) {
            playSfx('hit');
            setCombo(1);

            // Debris burst
            for (let p = 0; p < 16; p++) {
              const angle = Math.random() * Math.PI * 2;
              particlesRef.current.push({
                x: obs.x,
                y: obs.y,
                vx: Math.cos(angle) * (Math.random() * 4 + 1),
                vy: Math.sin(angle) * (Math.random() * 4 + 1),
                life: 1,
                maxLife: 25,
                size: Math.random() * 4 + 2,
                color: Math.random() > 0.5 ? '#f97316' : '#64748b',
              });
            }

            floatingTextsRef.current.push({
              id: Date.now(),
              text: 'IMPACT!',
              x: player.x,
              y: player.y - 20,
              life: 30,
              color: '#f43f5e',
            });

            setHealth((prev) => {
              const next = prev - 1;
              if (next <= 0) {
                playSfx('gameover');
                setGameState('gameover');
              }
              return Math.max(0, next);
            });
            obstaclesRef.current.splice(idx, 1);
            return;
          }

          // Draw Textured Rock Asteroid with Magma Glow
          ctx.save();
          ctx.translate(obs.x, obs.y);
          ctx.rotate(obs.rot);

          ctx.shadowColor = '#f97316';
          ctx.shadowBlur = 8;
          ctx.fillStyle = '#334155';
          ctx.strokeStyle = '#f97316';
          ctx.lineWidth = 1.5;

          ctx.beginPath();
          const vertices = obs.points.length;
          for (let p = 0; p < vertices; p++) {
            const angle = (p / vertices) * Math.PI * 2;
            const r = obs.size * obs.points[p];
            const px = Math.cos(angle) * r;
            const py = Math.sin(angle) * r;
            if (p === 0) ctx.moveTo(px, py);
            else ctx.lineTo(px, py);
          }
          ctx.closePath();
          ctx.fill();
          ctx.stroke();

          // Internal crater detail
          ctx.fillStyle = '#1e293b';
          ctx.beginPath();
          ctx.arc(obs.size * 0.25, -obs.size * 0.2, obs.size * 0.22, 0, Math.PI * 2);
          ctx.fill();

          ctx.restore();
        });

        // 6. Draw Particles
        particlesRef.current.forEach((pt, idx) => {
          pt.x += pt.vx;
          pt.y += pt.vy;
          pt.life++;

          const alpha = 1 - pt.life / pt.maxLife;
          ctx.save();
          ctx.fillStyle = pt.color;
          ctx.globalAlpha = Math.max(0, alpha);
          ctx.shadowColor = pt.color;
          ctx.shadowBlur = 6;
          ctx.beginPath();
          ctx.arc(pt.x, pt.y, pt.size * (1 - pt.life / (pt.maxLife * 1.5)), 0, Math.PI * 2);
          ctx.fill();
          ctx.restore();
        });
        particlesRef.current = particlesRef.current.filter((p) => p.life < p.maxLife);

        // 7. Draw Player Character (Cute Astronaut + Cyber Shield)
        ctx.save();
        ctx.translate(player.x, player.y);

        // Outer Rotating Cybernetic Shield Ring
        ctx.save();
        ctx.rotate(player.shieldAngle);
        ctx.strokeStyle = 'rgba(34, 211, 238, 0.7)';
        ctx.lineWidth = 2;
        ctx.setLineDash([8, 8]);
        ctx.beginPath();
        ctx.arc(0, 0, player.radius + 7, 0, Math.PI * 2);
        ctx.stroke();
        ctx.restore();

        // Ambient Neon Aura
        ctx.shadowColor = '#22d3ee';
        ctx.shadowBlur = 18;
        ctx.fillStyle = 'rgba(34, 211, 238, 0.25)';
        ctx.beginPath();
        ctx.arc(0, 0, player.radius + 2, 0, Math.PI * 2);
        ctx.fill();

        // Draw Avatar Image or High-Tech Astronaut Fallback
        if (avatarImgRef.current) {
          ctx.save();
          ctx.beginPath();
          ctx.arc(0, 0, player.radius, 0, Math.PI * 2);
          ctx.clip();
          ctx.drawImage(
            avatarImgRef.current,
            -player.radius,
            -player.radius,
            player.radius * 2,
            player.radius * 2
          );
          ctx.restore();
        } else {
          // Astronaut Suit Helmet Fallback
          ctx.fillStyle = '#f8fafc';
          ctx.beginPath();
          ctx.arc(0, 0, player.radius, 0, Math.PI * 2);
          ctx.fill();

          ctx.fillStyle = '#0f172a';
          ctx.beginPath();
          ctx.arc(0, -3, player.radius * 0.6, 0, Math.PI * 2);
          ctx.fill();

          ctx.strokeStyle = '#fbbf24';
          ctx.lineWidth = 2;
          ctx.stroke();
        }

        // Metallic Rim
        ctx.strokeStyle = '#22d3ee';
        ctx.lineWidth = 2.5;
        ctx.beginPath();
        ctx.arc(0, 0, player.radius, 0, Math.PI * 2);
        ctx.stroke();

        ctx.restore();

        // 8. Draw Floating Pop-Up Scores (+20, etc.)
        floatingTextsRef.current.forEach((ft, idx) => {
          ft.y -= 1.2;
          ft.life--;

          ctx.save();
          ctx.font = 'bold 12px monospace';
          ctx.fillStyle = ft.color;
          ctx.shadowColor = ft.color;
          ctx.shadowBlur = 8;
          ctx.globalAlpha = ft.life / 30;
          ctx.fillText(ft.text, ft.x - 14, ft.y);
          ctx.restore();
        });
        floatingTextsRef.current = floatingTextsRef.current.filter((f) => f.life > 0);

        // Filter offscreen items
        gemsRef.current = gemsRef.current.filter((g) => g.y < canvas.height + 40);
        obstaclesRef.current = obstaclesRef.current.filter((o) => o.y < canvas.height + 50);
      }

      animationFrameRef.current = requestAnimationFrame(gameLoop);
    };

    animationFrameRef.current = requestAnimationFrame(gameLoop);
    return () => {
      if (animationFrameRef.current) cancelAnimationFrame(animationFrameRef.current);
    };
  }, [gameState, soundOn, highScore, combo]);

  // Touch and pointer dragging support
  const handlePointerDown = (e: React.PointerEvent<HTMLCanvasElement>) => {
    isPointerDownRef.current = true;
    updatePointerTarget(e);
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLCanvasElement>) => {
    if (isPointerDownRef.current) {
      updatePointerTarget(e);
    }
  };

  const handlePointerUp = () => {
    isPointerDownRef.current = false;
  };

  const updatePointerTarget = (e: React.PointerEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;
    playerRef.current.targetX = (e.clientX - rect.left) * scaleX;
    playerRef.current.targetY = (e.clientY - rect.top) * scaleY;
  };

  const handleTouchDir = (dir: 'up' | 'down' | 'left' | 'right', isDown: boolean) => {
    const keyMap = { up: 'ArrowUp', down: 'ArrowDown', left: 'ArrowLeft', right: 'ArrowRight' };
    keysRef.current[keyMap[dir]] = isDown;
  };

  return (
    <div className="min-h-screen w-full bg-[#050711] text-slate-100 flex flex-col justify-between selection:bg-cyan-500 selection:text-black p-4 sm:p-6 relative overflow-hidden">
      {/* Top Header */}
      <header className="w-full max-w-lg mx-auto flex items-center justify-between z-20">
        <button
          onClick={onBack}
          className="px-3 py-1.5 rounded-lg bg-slate-900/80 border border-slate-800 text-slate-300 hover:text-white hover:border-cyan-400/50 transition-all flex items-center gap-1.5 text-xs font-mono cursor-pointer"
        >
          <ArrowLeft className="w-3.5 h-3.5 text-cyan-400" />
          <span>Back</span>
        </button>

        <div className="flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-cyan-400 animate-pulse" />
          <span className="text-xs font-mono tracking-widest text-cyan-400 uppercase font-semibold">
            Cosmic Stardust Drift
          </span>
        </div>

        <button
          onClick={() => setSoundOn((s) => !s)}
          className="p-1.5 rounded-lg bg-slate-900/80 border border-slate-800 text-slate-400 hover:text-white transition-colors cursor-pointer"
          title="Toggle SFX"
        >
          {soundOn ? <Volume2 className="w-4 h-4 text-cyan-400" /> : <VolumeX className="w-4 h-4" />}
        </button>
      </header>

      {/* Game Stage: Fascinating Cybernetic Arcade Box */}
      <main className="flex-1 flex flex-col items-center justify-center py-2 z-10">
        <div className="w-full max-w-[440px] rounded-[2.5rem] bg-gradient-to-b from-slate-900/95 via-slate-950/95 to-[#060914] border-2 border-cyan-400/40 p-4 sm:p-5 shadow-[0_0_60px_rgba(6,182,212,0.25)] flex flex-col items-center justify-between relative backdrop-blur-2xl">
          {/* Subtle Outer Neon Aura */}
          <div className="absolute -inset-1 rounded-[2.75rem] bg-gradient-to-tr from-cyan-500/20 via-purple-500/15 to-transparent blur-xl pointer-events-none -z-10" />

          {/* Top Score & Energy Cells HUD */}
          <div className="w-full flex items-center justify-between pb-3 border-b border-slate-800 text-xs font-mono">
            {/* Energy Shield Cells */}
            <div className="flex items-center gap-1.5">
              {Array.from({ length: 3 }).map((_, i) => (
                <div
                  key={i}
                  className={`w-6 h-3 rounded-full border transition-all ${
                    i < health
                      ? 'bg-gradient-to-r from-rose-500 to-rose-400 border-rose-400 shadow-[0_0_10px_#f43f5e]'
                      : 'bg-slate-900 border-slate-800'
                  }`}
                />
              ))}
            </div>

            {/* Score & Combo */}
            <div className="text-center font-bold text-white text-sm">
              SCORE: <span className="text-cyan-300 font-mono text-base">{score}</span>
              {combo > 1 && (
                <span className="ml-1.5 text-[10px] text-amber-300 bg-amber-950/80 px-1.5 py-0.5 rounded border border-amber-500/50">
                  {combo}x
                </span>
              )}
            </div>

            {/* High Score Trophy */}
            <div className="flex items-center gap-1 text-slate-400 text-[11px]">
              <Trophy className="w-3.5 h-3.5 text-amber-400" />
              <span>{highScore}</span>
            </div>
          </div>

          {/* Interactive Game Canvas Box with Touch Drag */}
          <div className="relative w-full aspect-[4/5] rounded-2xl overflow-hidden my-3 border border-slate-800/80 bg-[#050714] shadow-inner select-none cursor-crosshair">
            <canvas
              ref={canvasRef}
              width={400}
              height={500}
              onPointerDown={handlePointerDown}
              onPointerMove={handlePointerMove}
              onPointerUp={handlePointerUp}
              onPointerCancel={handlePointerUp}
              className="w-full h-full block touch-none"
            />

            {/* Start Screen Overlay */}
            {gameState === 'start' && (
              <div className="absolute inset-0 bg-[#050714]/85 backdrop-blur-md flex flex-col items-center justify-center p-6 text-center space-y-4">
                <div className="relative">
                  <div className="w-16 h-16 rounded-full bg-cyan-500/20 border-2 border-cyan-400 flex items-center justify-center text-cyan-300 shadow-[0_0_25px_rgba(6,182,212,0.45)]">
                    <Sparkles className="w-8 h-8 animate-pulse" />
                  </div>
                  <div className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-purple-500 border border-purple-300 flex items-center justify-center text-[10px]">
                    ✨
                  </div>
                </div>

                <div className="space-y-1">
                  <h3 className="text-lg font-bold font-display text-white">Cosmic Stardust Drift</h3>
                  <p className="text-xs font-mono text-slate-300 max-w-[250px]">
                    Steer your astronaut to collect glowing stardust crystals & energy hearts. Dodge asteroids!
                  </p>
                  <p className="text-[10px] font-mono text-cyan-400 pt-1">
                    Drag mouse / touch or use Arrow keys
                  </p>
                </div>

                <button
                  onClick={startGame}
                  className="px-7 py-3 rounded-2xl bg-gradient-to-r from-cyan-400 via-cyan-500 to-blue-500 hover:from-cyan-300 hover:to-blue-400 text-slate-950 font-mono font-black text-xs flex items-center gap-2 cursor-pointer shadow-[0_0_25px_rgba(34,211,238,0.5)] active:scale-95 transition-all"
                >
                  <Play className="w-4 h-4 fill-current" />
                  <span>START PLAYING</span>
                </button>
              </div>
            )}

            {/* Game Over Screen Overlay */}
            {gameState === 'gameover' && (
              <div className="absolute inset-0 bg-[#050714]/90 backdrop-blur-md flex flex-col items-center justify-center p-6 text-center space-y-4">
                <div className="w-14 h-14 rounded-full bg-rose-500/20 border-2 border-rose-500/60 flex items-center justify-center text-rose-400 shadow-[0_0_20px_rgba(244,63,94,0.4)]">
                  <Shield className="w-7 h-7" />
                </div>

                <div className="space-y-1">
                  <h3 className="text-lg font-bold font-display text-white">Mission Drift Complete</h3>
                  <p className="text-sm font-mono font-bold text-cyan-300">
                    Final Score: {score}
                  </p>
                  {score >= highScore && score > 0 && (
                    <span className="text-[10px] font-mono text-amber-300 bg-amber-950/80 px-2 py-0.5 rounded border border-amber-500/50 inline-block">
                      ★ NEW HIGH SCORE! ★
                    </span>
                  )}
                  <p className="text-[11px] font-mono text-slate-400 pt-1 italic">
                    "Every success comes from a dream."
                  </p>
                </div>

                <button
                  onClick={startGame}
                  className="px-6 py-2.5 rounded-2xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-mono font-bold text-xs flex items-center gap-2 cursor-pointer active:scale-95 transition-all shadow-lg"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>PLAY AGAIN</span>
                </button>
              </div>
            )}
          </div>

          {/* Controls Bar: Touch D-Pad & Drag Cue */}
          <div className="flex items-center justify-between w-full pt-1 px-3 text-xs font-mono text-slate-400">
            <span className="text-[10px] text-slate-500 flex items-center gap-1">
              <Zap className="w-3 h-3 text-cyan-400" />
              <span>Drag screen or use D-Pad:</span>
            </span>

            <div className="flex gap-1.5">
              <button
                onMouseDown={() => handleTouchDir('left', true)}
                onMouseUp={() => handleTouchDir('left', false)}
                onTouchStart={() => handleTouchDir('left', true)}
                onTouchEnd={() => handleTouchDir('left', false)}
                className="w-8 h-8 rounded-lg bg-slate-800 active:bg-cyan-500 active:text-black font-bold flex items-center justify-center select-none"
              >
                ←
              </button>
              <button
                onMouseDown={() => handleTouchDir('up', true)}
                onMouseUp={() => handleTouchDir('up', false)}
                onTouchStart={() => handleTouchDir('up', true)}
                onTouchEnd={() => handleTouchDir('up', false)}
                className="w-8 h-8 rounded-lg bg-slate-800 active:bg-cyan-500 active:text-black font-bold flex items-center justify-center select-none"
              >
                ↑
              </button>
              <button
                onMouseDown={() => handleTouchDir('down', true)}
                onMouseUp={() => handleTouchDir('down', false)}
                onTouchStart={() => handleTouchDir('down', true)}
                onTouchEnd={() => handleTouchDir('down', false)}
                className="w-8 h-8 rounded-lg bg-slate-800 active:bg-cyan-500 active:text-black font-bold flex items-center justify-center select-none"
              >
                ↓
              </button>
              <button
                onMouseDown={() => handleTouchDir('right', true)}
                onMouseUp={() => handleTouchDir('right', false)}
                onTouchStart={() => handleTouchDir('right', true)}
                onTouchEnd={() => handleTouchDir('right', false)}
                className="w-8 h-8 rounded-lg bg-slate-800 active:bg-cyan-500 active:text-black font-bold flex items-center justify-center select-none"
              >
                →
              </button>
            </div>
          </div>
        </div>
      </main>

      <footer className="text-center z-10">
        <span className="text-[10px] font-mono text-slate-500">
          D' Physco-Bit · Stress-Relief Arcade
        </span>
      </footer>
    </div>
  );
};
