import React, { useState, useEffect, useRef } from 'react';
import {
  ArrowLeft,
  Play,
  Pause,
  SkipForward,
  SkipBack,
  Volume2,
  VolumeX,
  Music,
  Upload,
  Disc,
  Trash2,
  Plus,
  Repeat,
  Radio,
} from 'lucide-react';

interface CosmicMusicProps {
  onBack: () => void;
}

interface UploadedTrack {
  id: string;
  name: string;
  url: string;
  sizeStr: string;
  duration?: number;
}

export const CosmicMusic: React.FC<CosmicMusicProps> = ({ onBack }) => {
  const [tracks, setTracks] = useState<UploadedTrack[]>([]);
  const [currentTrackIndex, setCurrentTrackIndex] = useState<number>(0);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [currentTime, setCurrentTime] = useState<number>(0);
  const [duration, setDuration] = useState<number>(0);
  const [volume, setVolume] = useState<number>(0.8);
  const [isMuted, setIsMuted] = useState<boolean>(false);
  const [isLooping, setIsLooping] = useState<boolean>(false);

  const audioRef = useRef<HTMLAudioElement | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const audioCtxRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const animFrameRef = useRef<number | null>(null);

  const currentTrack = tracks[currentTrackIndex] || null;

  // Handle uploading files
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    const newTracks: UploadedTrack[] = [];
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      const url = URL.createObjectURL(file);
      const sizeMB = (file.size / (1024 * 1024)).toFixed(1);
      // Clean display name (strip extension)
      const name = file.name.replace(/\.[^/.]+$/, '');

      newTracks.push({
        id: `track-${Date.now()}-${i}-${Math.random()}`,
        name,
        url,
        sizeStr: `${sizeMB} MB`,
      });
    }

    setTracks((prev) => {
      const updated = [...prev, ...newTracks];
      if (prev.length === 0 && updated.length > 0) {
        setCurrentTrackIndex(0);
      }
      return updated;
    });

    // Reset file input so user can re-upload same file if desired
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  // Remove a track
  const handleRemoveTrack = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setTracks((prev) => {
      const filtered = prev.filter((t) => t.id !== id);
      if (filtered.length === 0) {
        setIsPlaying(false);
        setCurrentTime(0);
        setDuration(0);
      } else if (currentTrackIndex >= filtered.length) {
        setCurrentTrackIndex(0);
      }
      return filtered;
    });
  };

  // Audio element listeners
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const onLoadedMetadata = () => {
      setDuration(audio.duration || 0);
    };
    const onTimeUpdate = () => {
      setCurrentTime(audio.currentTime || 0);
    };
    const onEnded = () => {
      if (isLooping) {
        audio.currentTime = 0;
        audio.play().catch(() => {});
      } else if (tracks.length > 1) {
        setCurrentTrackIndex((i) => (i + 1) % tracks.length);
      } else {
        setIsPlaying(false);
      }
    };

    audio.addEventListener('loadedmetadata', onLoadedMetadata);
    audio.addEventListener('timeupdate', onTimeUpdate);
    audio.addEventListener('ended', onEnded);

    return () => {
      audio.removeEventListener('loadedmetadata', onLoadedMetadata);
      audio.removeEventListener('timeupdate', onTimeUpdate);
      audio.removeEventListener('ended', onEnded);
    };
  }, [tracks, isLooping]);

  // Handle track index change
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio || !currentTrack) return;

    audio.src = currentTrack.url;
    audio.load();
    if (isPlaying) {
      audio.play().catch(() => setIsPlaying(false));
    }
  }, [currentTrackIndex, tracks]);

  // Handle Play/Pause
  const togglePlay = () => {
    const audio = audioRef.current;
    if (!audio || !currentTrack) return;

    if (isPlaying) {
      audio.pause();
      setIsPlaying(false);
    } else {
      audio.play().then(() => setIsPlaying(true)).catch(() => setIsPlaying(false));
    }
  };

  // Volume
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = isMuted ? 0 : volume;
    }
  }, [volume, isMuted]);

  // Seeking
  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const time = Number(e.target.value);
    setCurrentTime(time);
    if (audioRef.current) {
      audioRef.current.currentTime = time;
    }
  };

  // Format seconds to M:SS
  const formatTime = (secs: number) => {
    if (isNaN(secs) || secs < 0) return '0:00';
    const mins = Math.floor(secs / 60);
    const s = Math.floor(secs % 60);
    return `${mins}:${s < 10 ? '0' : ''}${s}`;
  };

  // Frequency visualizer animation
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const render = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      const barCount = 20;
      const barWidth = canvas.width / barCount - 2;

      for (let i = 0; i < barCount; i++) {
        let height = 6;
        if (isPlaying) {
          // Dynamic rhythm wave
          const wave = Math.sin(Date.now() / 150 + i * 0.7) * 0.5 + 0.5;
          height = Math.max(6, wave * (canvas.height - 8));
        }

        const x = i * (barWidth + 2);
        const y = canvas.height - height;

        // Cyan-to-purple gradient
        const grad = ctx.createLinearGradient(0, canvas.height, 0, 0);
        grad.addColorStop(0, '#06b6d4');
        grad.addColorStop(1, '#a855f7');
        ctx.fillStyle = isPlaying ? grad : '#334155';
        ctx.fillRect(x, y, barWidth, height);
      }

      animFrameRef.current = requestAnimationFrame(render);
    };

    animFrameRef.current = requestAnimationFrame(render);
    return () => {
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
    };
  }, [isPlaying]);

  const nextTrack = () => {
    if (tracks.length === 0) return;
    setCurrentTrackIndex((i) => (i + 1) % tracks.length);
  };

  const prevTrack = () => {
    if (tracks.length === 0) return;
    setCurrentTrackIndex((i) => (i - 1 + tracks.length) % tracks.length);
  };

  return (
    <div className="min-h-screen w-full bg-[#050711] text-slate-100 flex flex-col justify-between selection:bg-cyan-500 selection:text-black p-4 sm:p-6 relative overflow-hidden">
      {/* Hidden audio element */}
      <audio ref={audioRef} />

      {/* Hidden file input */}
      <input
        ref={fileInputRef}
        type="file"
        accept="audio/*"
        multiple
        onChange={handleFileUpload}
        className="hidden"
      />

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
          <Music className="w-4 h-4 text-cyan-400 animate-pulse" />
          <span className="text-xs font-mono tracking-widest text-cyan-400 uppercase font-semibold">
            Astronaut Music Player
          </span>
        </div>

        <button
          onClick={() => fileInputRef.current?.click()}
          className="px-2.5 py-1 rounded-lg bg-cyan-950 border border-cyan-500/50 text-cyan-300 hover:bg-cyan-900 transition-colors flex items-center gap-1 text-[11px] font-mono cursor-pointer"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Upload</span>
        </button>
      </header>

      {/* Main Stage: Square Player Box */}
      <main className="flex-1 flex flex-col items-center justify-center py-2 z-10">
        <div className="w-full max-w-[460px] aspect-square rounded-[2.5rem] bg-gradient-to-b from-slate-900/95 via-slate-950/95 to-[#060914] border-2 border-cyan-400/40 p-5 sm:p-6 shadow-[0_0_60px_rgba(6,182,212,0.25)] flex flex-col justify-between relative backdrop-blur-2xl">
          {/* Subtle Outer Neon Aura */}
          <div className="absolute -inset-1 rounded-[2.75rem] bg-gradient-to-tr from-cyan-500/20 via-purple-500/15 to-transparent blur-xl pointer-events-none -z-10" />

          {/* Player Header */}
          <div className="flex items-center justify-between pb-2 border-b border-slate-800">
            <div className="flex items-center gap-2">
              <span className={`w-2 h-2 rounded-full ${isPlaying ? 'bg-cyan-400 animate-ping' : 'bg-slate-600'}`} />
              <span className="text-[11px] font-mono uppercase tracking-wider text-cyan-400 font-semibold">
                Personal Audio Deck
              </span>
            </div>

            <span className="text-[10px] font-mono text-slate-400">
              {tracks.length > 0 ? `${currentTrackIndex + 1} of ${tracks.length} Songs` : 'No Music Uploaded'}
            </span>
          </div>

          {/* Empty State: Upload Prompt */}
          {tracks.length === 0 ? (
            <div className="flex-1 flex flex-col items-center justify-center text-center p-4 space-y-4">
              <div
                onClick={() => fileInputRef.current?.click()}
                className="w-24 h-24 rounded-full bg-slate-950/80 border-2 border-dashed border-cyan-400/60 hover:border-cyan-300 hover:scale-105 transition-all flex flex-col items-center justify-center cursor-pointer shadow-[0_0_30px_rgba(34,211,238,0.25)] group"
              >
                <Upload className="w-8 h-8 text-cyan-400 group-hover:scale-110 transition-transform" />
                <span className="text-[9px] font-mono text-cyan-300 mt-1 uppercase">Choose File</span>
              </div>

              <div className="space-y-1 max-w-[260px]">
                <h3 className="text-base font-bold font-display text-white">Upload Your Music</h3>
                <p className="text-xs font-mono text-slate-400">
                  Select MP3, WAV, M4A, or audio files from your device to listen during flight.
                </p>
              </div>

              <button
                onClick={() => fileInputRef.current?.click()}
                className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-cyan-400 to-blue-500 hover:from-cyan-300 hover:to-blue-400 text-slate-950 font-mono font-bold text-xs flex items-center gap-2 cursor-pointer shadow-lg active:scale-95 transition-all"
              >
                <Upload className="w-4 h-4" />
                <span>SELECT AUDIO FILES</span>
              </button>
            </div>
          ) : (
            /* Active Player View */
            <div className="flex-1 flex flex-col justify-between my-2 space-y-3">
              {/* Disc & Track Name */}
              <div className="flex items-center gap-4 p-3 rounded-2xl bg-slate-950/70 border border-slate-800/80">
                <div className="relative w-14 h-14 rounded-full bg-slate-900 border border-cyan-400/50 flex items-center justify-center shrink-0 shadow-[0_0_15px_rgba(34,211,238,0.3)]">
                  <Disc className={`w-8 h-8 text-cyan-400 ${isPlaying ? 'animate-spin' : ''}`} style={{ animationDuration: '8s' }} />
                  <div className="absolute w-3 h-3 rounded-full bg-slate-950 border border-cyan-300" />
                </div>

                <div className="flex-1 min-w-0">
                  <h3 className="text-sm font-bold font-display text-white tracking-wide truncate">
                    {currentTrack?.name}
                  </h3>
                  <div className="flex items-center gap-2 text-[10px] font-mono text-slate-400 mt-0.5">
                    <span className="text-cyan-300">{currentTrack?.sizeStr}</span>
                    <span>·</span>
                    <span>Uploaded Audio</span>
                  </div>
                </div>

                {/* Remove current track button */}
                <button
                  onClick={(e) => currentTrack && handleRemoveTrack(currentTrack.id, e)}
                  className="p-1.5 rounded-lg text-slate-500 hover:text-rose-400 hover:bg-slate-900 transition-colors cursor-pointer"
                  title="Remove song"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* Real-time Frequency Waveform Visualizer */}
              <div className="w-full h-10 rounded-xl overflow-hidden bg-slate-950/50 border border-slate-800/60 p-1 flex items-center justify-center">
                <canvas ref={canvasRef} width={380} height={36} className="w-full h-full block" />
              </div>

              {/* Progress Scrubber */}
              <div className="space-y-1">
                <input
                  type="range"
                  min="0"
                  max={duration || 100}
                  value={currentTime}
                  onChange={handleSeek}
                  className="w-full accent-cyan-400 h-1.5 bg-slate-800 rounded-lg cursor-pointer"
                />
                <div className="flex items-center justify-between text-[10px] font-mono text-slate-400">
                  <span>{formatTime(currentTime)}</span>
                  <span>{formatTime(duration)}</span>
                </div>
              </div>

              {/* Controls Bar */}
              <div className="flex items-center justify-between pt-1">
                {/* Loop Button */}
                <button
                  onClick={() => setIsLooping((l) => !l)}
                  className={`p-2 rounded-xl transition-colors cursor-pointer ${
                    isLooping ? 'text-cyan-400 bg-cyan-950/60' : 'text-slate-500 hover:text-slate-300'
                  }`}
                  title={isLooping ? 'Loop Enabled' : 'Loop Disabled'}
                >
                  <Repeat className="w-4 h-4" />
                </button>

                {/* Playback Controls */}
                <div className="flex items-center gap-3">
                  <button
                    onClick={prevTrack}
                    className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
                    title="Previous"
                  >
                    <SkipBack className="w-4 h-4" />
                  </button>

                  <button
                    onClick={togglePlay}
                    className="w-12 h-12 rounded-full bg-gradient-to-r from-cyan-400 to-blue-500 hover:from-cyan-300 hover:to-blue-400 text-slate-950 flex items-center justify-center shadow-[0_0_25px_rgba(34,211,238,0.5)] active:scale-95 transition-all cursor-pointer"
                    title={isPlaying ? 'Pause' : 'Play'}
                  >
                    {isPlaying ? <Pause className="w-5 h-5 fill-current" /> : <Play className="w-5 h-5 fill-current ml-0.5" />}
                  </button>

                  <button
                    onClick={nextTrack}
                    className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
                    title="Next"
                  >
                    <SkipForward className="w-4 h-4" />
                  </button>
                </div>

                {/* Volume Button */}
                <button
                  onClick={() => setIsMuted((m) => !m)}
                  className="p-2 rounded-xl text-slate-400 hover:text-white transition-colors cursor-pointer"
                  title="Toggle Mute"
                >
                  {isMuted || volume === 0 ? <VolumeX className="w-4 h-4 text-rose-400" /> : <Volume2 className="w-4 h-4 text-cyan-400" />}
                </button>
              </div>

              {/* Volume Slider */}
              <div className="flex items-center gap-2 pt-1 border-t border-slate-800/60 text-xs font-mono text-slate-400">
                <span className="text-[10px]">Volume:</span>
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.05"
                  value={isMuted ? 0 : volume}
                  onChange={(e) => {
                    setVolume(Number(e.target.value));
                    if (isMuted) setIsMuted(false);
                  }}
                  className="flex-1 accent-cyan-400 h-1 bg-slate-800 rounded-lg cursor-pointer"
                />
                <span className="text-[10px] w-8 text-right">{isMuted ? '0%' : `${Math.round(volume * 100)}%`}</span>
              </div>
            </div>
          )}
        </div>
      </main>

      {/* Footer */}
      <footer className="text-center z-10">
        <span className="text-[10px] font-mono text-slate-500">
          D' Physco-Bit · Personal Audio Deck
        </span>
      </footer>
    </div>
  );
};
