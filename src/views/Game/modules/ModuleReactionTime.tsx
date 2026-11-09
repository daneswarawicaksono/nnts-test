import React, { useState, useEffect, useRef } from 'react';
import { GameHeader } from '../components/GameHeader';
import { soundSynth } from '../../../services/audio/synth';

export interface ModuleReactionTimeProps {
  onComplete: (trials: number[]) => void;
  onExit: () => void;
}

type Phase = 'waiting' | 'ready' | 'feedback' | 'too-early';

const BALLOON_COLORS = [
  'from-rose-500 to-rose-600',
  'from-sky-500 to-blue-600',
  'from-amber-400 to-orange-500',
  'from-emerald-500 to-teal-600',
  'from-teal-400 to-emerald-600',
];

export const ModuleReactionTime: React.FC<ModuleReactionTimeProps> = ({
  onComplete,
  onExit,
}) => {
  const TOTAL_ROUNDS = 5;
  const [currentRound, setCurrentRound] = useState(0);
  const [phase, setPhase] = useState<Phase>('waiting');
  const [trials, setTrials] = useState<number[]>([]);
  const [lastLatency, setLastLatency] = useState<number | null>(null);

  const startTimeRef = useRef<number>(0);
  const timeoutRef = useRef<number | null>(null);

  // Start waiting phase for current round
  useEffect(() => {
    if (currentRound >= TOTAL_ROUNDS) {
      onComplete(trials);
      return;
    }

    setPhase('waiting');
    // Random delay between 1200ms and 2500ms
    const randomDelay = Math.floor(Math.random() * 1300) + 1200;

    timeoutRef.current = window.setTimeout(() => {
      setPhase('ready');
      startTimeRef.current = performance.now();
      soundSynth.playPop();
    }, randomDelay);

    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, [currentRound, trials, onComplete]);

  // Handle tap on the screen / target
  const handleTap = () => {
    if (phase === 'waiting') {
      // Tapped too early
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      setPhase('too-early');
      soundSynth.playPop();
      setTimeout(() => {
        // Restart current round
        setPhase('waiting');
        const retryDelay = Math.floor(Math.random() * 1200) + 1200;
        timeoutRef.current = window.setTimeout(() => {
          setPhase('ready');
          startTimeRef.current = performance.now();
          soundSynth.playPop();
        }, retryDelay);
      }, 1000);
      return;
    }

    if (phase === 'ready') {
      const latency = Math.round(performance.now() - startTimeRef.current);
      soundSynth.playChime();
      setLastLatency(latency);
      setPhase('feedback');
      setTrials((prev) => [...prev, latency]);

      // Move to next round
      setTimeout(() => {
        setCurrentRound((r) => r + 1);
      }, 700);
    }
  };

  const balloonColor = BALLOON_COLORS[currentRound % BALLOON_COLORS.length];

  return (
    <div
      onClick={handleTap}
      className="w-full h-full flex flex-col justify-between items-center bg-gradient-to-b from-[#F0FDF4] via-[#F7FEE7]/40 to-[#FFFBEB] select-none relative overflow-hidden font-sans cursor-pointer"
    >
      {/* Header */}
      <GameHeader
        moduleTitle="Modul 1: Balon Kilat"
        currentRound={currentRound}
        totalRounds={TOTAL_ROUNDS}
        onExit={onExit}
      />

      {/* Main Target Area */}
      <main className="flex-1 w-full flex flex-col items-center justify-center my-auto z-10 px-6 text-center">
        {phase === 'waiting' && (
          <div className="flex flex-col items-center space-y-4 animate-in fade-in duration-fast">
            <div className="w-28 h-28 rounded-full border-4 border-dashed border-teal-300 flex items-center justify-center animate-spin [animation-duration:8s]">
              <div className="w-16 h-16 rounded-full bg-teal-100/60 animate-pulse" />
            </div>
            <div>
              <p className="text-base font-bold text-slate-800">Tunggu balon muncul...</p>
              <p className="text-xs text-slate-400 mt-0.5">Siapkan jarimu di layar</p>
            </div>
          </div>
        )}

        {phase === 'ready' && (
          <div className="flex flex-col items-center space-y-4 animate-in zoom-in-75 duration-fast">
            {/* Pop-up Balloon with large tap target */}
            <div
              className={`w-32 h-36 rounded-full bg-gradient-to-b ${balloonColor} shadow-xl flex items-center justify-center text-4xl transform hover:scale-105 active:scale-95 transition-transform duration-fast relative`}
            >
              <span className="text-5xl drop-shadow-md">🎈</span>
              <div className="absolute -bottom-2 w-1.5 h-3 bg-amber-700/80 rounded-b-sm" />
            </div>
            <div className="text-lg font-black text-nutri-teal-800 uppercase tracking-wide animate-bounce-gentle">
              Sentuh Sekarang!
            </div>
          </div>
        )}

        {phase === 'too-early' && (
          <div className="flex flex-col items-center space-y-2 animate-in zoom-in-95 duration-fast">
            <span className="text-4xl">⏳</span>
            <p className="text-sm font-bold text-amber-700">Tunggu balonnya keluar dulu yaa!</p>
          </div>
        )}

        {phase === 'feedback' && (
          <div className="flex flex-col items-center space-y-2 animate-in zoom-in-90 duration-fast">
            <span className="text-4xl">✨</span>
            <p className="text-lg font-extrabold text-emerald-700">Bagus Sekali!</p>
            <p className="text-xs font-bold text-slate-500 tabular-nums">{lastLatency} ms</p>
          </div>
        )}
      </main>

      {/* Footer Instructions */}
      <footer className="w-full text-center pb-5 z-10 shrink-0">
        <p className="text-[11px] text-slate-400 font-medium">
          Ronde {Math.min(currentRound + 1, TOTAL_ROUNDS)} dari {TOTAL_ROUNDS} Putaran
        </p>
      </footer>
    </div>
  );
};
