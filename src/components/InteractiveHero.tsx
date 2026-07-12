import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Music, Play, Pause, Volume2, VolumeX, ChevronRight, Disc, Sparkles } from 'lucide-react';

interface Track {
  id: number;
  title: string;
  artist: string;
  url: string; // empty string for synthetic synth
  color: string;
}

const TRACKS: Track[] = [
  {
    id: 1,
    title: "林间晨雨 Forest Rain",
    artist: "疗愈自然白噪音",
    url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3",
    color: "#C6A6FE"
  },
  {
    id: 2,
    title: "深海潮汐 Ocean Tides",
    artist: "冥想催眠环境音",
    url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-8.mp3",
    color: "#6EE7B7"
  }
];

export const InteractiveHero = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTrackIdx, setCurrentTrackIdx] = useState(0);
  const [isMuted, setIsMuted] = useState(false);
  const [volume, setVolume] = useState(0.6);
  const [isHovered, setIsHovered] = useState(false);
  const [isSynthPlaying, setIsSynthPlaying] = useState(false);

  const audioRef = useRef<HTMLAudioElement | null>(null);
  const currentTrack = TRACKS[currentTrackIdx];

  // --- Web Audio Synthesizer implementation for offline/organic ambient sound ---
  const audioCtxRef = useRef<AudioContext | null>(null);
  const synthNodesRef = useRef<any[]>([]);
  const synthIntervalRef = useRef<any>(null);

  // Initialize Audio Element
  useEffect(() => {
    audioRef.current = new Audio(currentTrack.url);
    audioRef.current.loop = true;
    audioRef.current.volume = volume;
    audioRef.current.muted = isMuted;

    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
      stopSynth();
    };
  }, []);

  // Update track source
  useEffect(() => {
    if (!audioRef.current) return;
    const wasPlaying = isPlaying;
    
    // Stop any active sound first
    audioRef.current.pause();
    stopSynth();

    if (currentTrack.url !== "") {
      audioRef.current.src = currentTrack.url;
      audioRef.current.load();
      if (wasPlaying) {
        audioRef.current.play().catch(e => console.log("Audio play prevented:", e));
      }
    } else {
      // It is generative synth
      if (wasPlaying) {
        startSynth();
      }
    }
  }, [currentTrackIdx]);

  // Handle Play / Pause trigger
  const togglePlay = () => {
    if (!audioRef.current) return;

    if (isPlaying) {
      audioRef.current.pause();
      stopSynth();
      setIsPlaying(false);
    } else {
      setIsPlaying(true);
      if (currentTrack.url !== "") {
        audioRef.current.play().catch(() => {
          // Fallback to synth if loading fails or blocked by browser autoplays
          console.log("Audio element failed or blocked, falling back to Web Audio Synth");
          startSynth();
        });
      } else {
        startSynth();
      }
    }
  };

  // Sync volume & mute status
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume;
      audioRef.current.muted = isMuted;
    }
    // Update synth main gain if playing
    if (audioCtxRef.current && synthNodesRef.current.length > 0) {
      const gainNode = synthNodesRef.current.find(n => n.name === 'mainGain');
      if (gainNode) {
        gainNode.node.gain.setValueAtTime(isMuted ? 0 : volume * 0.15, audioCtxRef.current.currentTime);
      }
    }
  }, [volume, isMuted]);

  // --- Polyphonic Ambient Synthesizer using Web Audio API ---
  const startSynth = () => {
    try {
      if (isSynthPlaying) return;
      
      const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioContextClass) return;

      const ctx = new AudioContextClass();
      audioCtxRef.current = ctx;

      // Master Gain
      const mainGain = ctx.createGain();
      mainGain.gain.setValueAtTime(isMuted ? 0 : volume * 0.12, ctx.currentTime);
      
      // Warm lowpass filter
      const filter = ctx.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(600, ctx.currentTime);
      filter.Q.setValueAtTime(1.5, ctx.currentTime);

      // Stereo delay / echo
      const delay = ctx.createDelay();
      delay.delayTime.setValueAtTime(0.4, ctx.currentTime);
      const feedback = ctx.createGain();
      feedback.gain.setValueAtTime(0.4, ctx.currentTime);

      // Connect nodes
      filter.connect(mainGain);
      mainGain.connect(ctx.destination);

      // Connect delay loop
      mainGain.connect(delay);
      delay.connect(feedback);
      feedback.connect(mainGain);

      synthNodesRef.current = [
        { name: 'mainGain', node: mainGain },
        { name: 'filter', node: filter },
        { name: 'delay', node: delay }
      ];

      setIsSynthPlaying(true);

      // Soothing chord progression: Am9 -> Fmaj9 -> Cmaj9 -> G6 (Warm Pads)
      const progressions = [
        [57, 60, 64, 67, 71], // Am9 (A, C, E, G, B)
        [53, 57, 60, 64, 69], // Fmaj9 (F, A, C, E, G)
        [48, 52, 55, 59, 64], // Cmaj9 (C, E, G, B, D)
        [55, 59, 62, 67, 71]  // G6/9 (G, B, D, E, A)
      ];

      let chordIdx = 0;

      const playChord = () => {
        if (!audioCtxRef.current || audioCtxRef.current.state === 'suspended') return;
        const now = audioCtxRef.current.currentTime;
        const chord = progressions[chordIdx];

        // Modulation of filter frequency
        filter.frequency.setValueAtTime(filter.frequency.value, now);
        filter.frequency.exponentialRampToValueAtTime(400 + Math.random() * 400, now + 5.5);

        // Spawn smooth oscillators for each note in the chord
        chord.forEach((midiNote, index) => {
          const osc = ctx.createOscillator();
          const noteGain = ctx.createGain();

          // Warm triangular/sine blend
          osc.type = index % 2 === 0 ? 'triangle' : 'sine';
          // Convert MIDI to Frequency
          const freq = Math.pow(2, (midiNote - 69) / 12) * 440;
          osc.frequency.setValueAtTime(freq, now);

          // Fine detuning for lush analog chorus effect
          osc.detune.setValueAtTime((Math.random() - 0.5) * 15, now);

          // Soothing, slow fade-in/fade-out envelope
          noteGain.gain.setValueAtTime(0, now);
          noteGain.gain.linearRampToValueAtTime(0.04, now + 1.5 + Math.random() * 1.0);
          noteGain.gain.setValueAtTime(0.04, now + 4.5);
          noteGain.gain.exponentialRampToValueAtTime(0.0001, now + 7.5);

          osc.connect(noteGain);
          noteGain.connect(filter);

          osc.start(now);
          osc.stop(now + 8.0);
        });

        chordIdx = (chordIdx + 1) % progressions.length;
      };

      // Play first chord immediately
      playChord();

      // Schedule chords every 7 seconds
      synthIntervalRef.current = setInterval(playChord, 7000);

    } catch (e) {
      console.error("Synthesizer startup failed:", e);
    }
  };

  const stopSynth = () => {
    if (synthIntervalRef.current) {
      clearInterval(synthIntervalRef.current);
      synthIntervalRef.current = null;
    }
    if (audioCtxRef.current) {
      audioCtxRef.current.close();
      audioCtxRef.current = null;
    }
    synthNodesRef.current = [];
    setIsSynthPlaying(false);
  };

  const nextTrack = () => {
    setCurrentTrackIdx((prev) => (prev + 1) % TRACKS.length);
  };

  return (
    <div 
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="fixed bottom-6 right-6 md:bottom-8 md:right-8 z-[150] flex items-center"
    >
      {/* Expanded Control HUD Panel */}
      <AnimatePresence>
        {isHovered && (
          <motion.div
            initial={{ opacity: 0, x: 20, scale: 0.95 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, x: 20, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="absolute right-[54px] md:right-[62px] bottom-0 mr-2 glass rounded-2xl p-4 w-60 border border-white/10 shadow-2xl flex flex-col gap-3 z-[160]"
          >
            {/* Ambient Background Glow matching Track Color */}
            <div 
              className="absolute inset-0 rounded-2xl opacity-10 pointer-events-none blur-xl transition-all duration-500"
              style={{ backgroundColor: currentTrack.color }}
            />

            <div className="relative z-10">
              <span className="text-[9px] font-mono uppercase tracking-[0.2em] text-white/40 block mb-0.5">Now Playing</span>
              <div className="flex items-center gap-2">
                <span className="text-xs font-black text-white truncate max-w-[140px]">{currentTrack.title}</span>
                {isPlaying && (
                  <span className="flex items-center gap-0.5 h-3">
                    <span className="w-[2px] h-full bg-brand rounded-full animate-bounce" style={{ animationDelay: '0.1s', animationDuration: '0.8s' }} />
                    <span className="w-[2px] h-full bg-brand rounded-full animate-bounce" style={{ animationDelay: '0.3s', animationDuration: '1.2s' }} />
                    <span className="w-[2px] h-full bg-brand rounded-full animate-bounce" style={{ animationDelay: '0.5s', animationDuration: '0.9s' }} />
                  </span>
                )}
              </div>
              <span className="text-[10px] font-mono text-white/50">{currentTrack.artist}</span>
            </div>

            {/* Track Switcher */}
            <div className="flex items-center justify-between border-t border-white/5 pt-2">
              <button 
                onClick={nextTrack}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/15 text-[10px] font-mono font-bold tracking-widest text-white/80 transition-all uppercase"
              >
                切换频道 <ChevronRight className="w-3 h-3 text-brand" />
              </button>

              <div className="flex items-center gap-2">
                <button 
                  onClick={() => setIsMuted(!isMuted)}
                  className="p-1.5 rounded-lg text-white/60 hover:text-white hover:bg-white/5 transition-colors"
                >
                  {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
                </button>
                <input 
                  type="range"
                  min="0"
                  max="1"
                  step="0.05"
                  value={volume}
                  onChange={(e) => {
                    setVolume(parseFloat(e.target.value));
                    setIsMuted(false);
                  }}
                  className="w-16 accent-brand h-1 rounded-full cursor-pointer opacity-70 hover:opacity-100 transition-opacity"
                />
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Retro Record Player Container */}
      <div className="relative group/player cursor-pointer">
        {/* Glowing Interactive Aura around the Record Player */}
        <div 
          className="absolute inset-0 rounded-full blur-2xl opacity-0 group-hover/player:opacity-40 transition-opacity duration-500 scale-125 pointer-events-none"
          style={{ 
            background: `radial-gradient(circle, ${currentTrack.color}77 0%, transparent 70%)` 
          }}
        />

        {/* Rotating Purple Halo Ring (围绕其旋转的紫色光圈) */}
        <motion.div
          animate={isPlaying ? { rotate: 360 } : { rotate: 0 }}
          transition={isPlaying ? { repeat: Infinity, duration: 10, ease: "linear" } : { duration: 0.8 }}
          className="absolute -inset-2 md:-inset-2.5 rounded-full border border-dashed border-[#C6A6FE]/60 pointer-events-none z-10 animate-pulse"
          style={{
            boxShadow: "0 0 15px rgba(198, 166, 254, 0.4), inset 0 0 8px rgba(198, 166, 254, 0.15)",
          }}
        />
        <motion.div
          animate={isPlaying ? { rotate: -360 } : { rotate: 0 }}
          transition={isPlaying ? { repeat: Infinity, duration: 15, ease: "linear" } : { duration: 0.8 }}
          className="absolute -inset-2.5 md:-inset-3 rounded-full bg-gradient-to-tr from-[#C6A6FE]/20 via-transparent to-[#C6A6FE]/15 opacity-60 pointer-events-none blur-[2px] border border-white/5"
        />

        {/* Outer Wooden/Glass Turntable Base */}
        <div 
          onClick={togglePlay}
          className="relative w-[36px] h-[36px] md:w-[44px] md:h-[44px] bg-black/60 rounded-full border border-white/15 shadow-[0_8px_20px_rgba(0,0,0,0.6)] flex items-center justify-center backdrop-blur-md transition-transform duration-300 group-hover/player:scale-105"
        >
          {/* Subtle turntable platter speed markers */}
          <div className="absolute inset-1 rounded-full border border-dashed border-white/5 pointer-events-none" />

          {/* Rotating Vinyl Record (复古唱片) */}
          <motion.div
            animate={isPlaying ? { rotate: 360 } : {}}
            transition={isPlaying ? { repeat: Infinity, duration: 4, ease: "linear" } : { duration: 0.8, ease: "easeOut" }}
            className="absolute w-[28px] h-[28px] md:w-[34px] md:h-[34px] rounded-full bg-[#111112] shadow-inner flex items-center justify-center overflow-hidden border border-[#1c1c1f]"
          >
            {/* Concentric Grooves (SVG style reflections) */}
            <div className="absolute inset-0.5 rounded-full border border-white/5 pointer-events-none opacity-40" />
            <div className="absolute inset-1.5 rounded-full border border-white/5 pointer-events-none opacity-20" />
            <div className="absolute inset-2 rounded-full border border-white/10 pointer-events-none opacity-60" />
            <div className="absolute inset-2.5 rounded-full border border-white/5 pointer-events-none opacity-30" />
            <div className="absolute inset-3 rounded-full border border-white/5 pointer-events-none opacity-10" />

            {/* Vinyl record light specular reflection lines (spinning sheen) */}
            <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/5 to-transparent pointer-events-none" style={{ transform: 'rotate(45deg)' }} />
            <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/5 to-transparent pointer-events-none" style={{ transform: 'rotate(-45deg)' }} />

            {/* Center Colorful Label (Artistic heart of the disc) */}
            <div 
              className="absolute w-2.5 h-2.5 md:w-3 md:h-3 rounded-full flex items-center justify-center transition-all duration-500 shadow-md"
              style={{ 
                background: `linear-gradient(135deg, ${currentTrack.color}dd 0%, #000000 100%)` 
              }}
            >
              {/* Spindle hole */}
              <div className="w-0.5 h-0.5 md:w-1 md:h-1 rounded-full bg-black border border-white/40 shadow-inner z-10" />
            </div>
          </motion.div>

          {/* Interactive Icon Overlay in the center when hovered */}
          <div className="absolute z-30 opacity-0 group-hover/player:opacity-100 flex items-center justify-center bg-black/40 rounded-full w-5 h-5 md:w-7 md:h-7 transition-opacity">
            {isPlaying ? (
              <Pause className="w-2 h-2 text-white" />
            ) : (
              <Play className="w-2 h-2 text-white fill-white translate-x-0.5" />
            )}
          </div>
        </div>

        {/* Animated Metallic Tonearm (放音臂) - Incredibly High Fidelity Details! */}
        <div className="absolute -top-1 -right-1 w-6 h-10 pointer-events-none z-20 scale-[0.45] md:scale-[0.55] origin-top-right">
          <motion.svg 
            width="40" 
            height="70" 
            viewBox="0 0 40 70" 
            fill="none" 
            xmlns="http://www.w3.org/2000/svg"
            animate={{ 
              rotate: isPlaying ? 24 : 0 
            }}
            transition={{ type: "spring", stiffness: 60, damping: 12 }}
            style={{ originX: "28px", originY: "12px" }}
          >
            {/* Pivot Base */}
            <circle cx="28" cy="12" r="6" fill="#2d2d30" stroke="#4c4c50" strokeWidth="1.5" />
            <circle cx="28" cy="12" r="3" fill="#8e8e93" />
            <rect x="25" y="4" width="6" height="4" rx="1" fill="#4c4c50" />

            {/* Curved Arm */}
            <path d="M28 12C28 20 20 28 20 38C20 44 14 48 14 54" stroke="#d1d1d6" strokeWidth="2" strokeLinecap="round" />
            <path d="M28 12C28 20 20 28 20 38C20 44 14 48 14 54" stroke="#ffffff" strokeWidth="0.5" strokeLinecap="round" opacity="0.6" />

            {/* Stylus Head (Cartridge & Needle) */}
            <g transform="translate(14, 54) rotate(-35)">
              <rect x="-3" y="0" width="6" height="10" rx="1.5" fill="#3a3a3c" stroke="#5c5c5e" strokeWidth="1" />
              <rect x="-1" y="10" width="2" height="3" fill="#ffd60a" /> {/* Needle light */}
            </g>
          </motion.svg>
        </div>

      </div>
    </div>
  );
};
