import React, { useState, useEffect, useRef } from 'react';
import { BalloonSvg } from '../illustrations/BalloonSvg';
import { soundFX } from '../../services/audioSynth';
import { Zap, RotateCcw, ArrowRight } from 'lucide-react';

interface QuestReactionTimeProps {
  onComplete: (trials: number[], avgLatency: number, variance: number) => void;
  onNext: () => void;
}

export const QuestReactionTime: React.FC<QuestReactionTimeProps> = ({
  onComplete,
  onNext,
}) => {
  const TOTAL_TRIALS = 5;
  const [trialIndex, setTrialIndex] = useState(0);
  const [trials, setTrials] = useState<number[]>([]);
  const [gameState, setGameState] = useState<'idle' | 'waiting' | 'stimulus' | 'feedback' | 'finished'>('idle');
  const [lastLatency, setLastLatency] = useState<number | null>(null);
  const [tooEarly, setToEarly] = useState(false);

  const startTimeRef = useRef<number>(0);
  const timerRef = useRef<number | null>(null);

  // Clean timer on unmount
  useEffect(() => {
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, []);

  const startTrial = () => {
    setToEarly(false);
    setGameState('waiting');

    // Random interval between 1500ms and 4000ms as required
    const randomDelay = Math.floor(Math.random() * (4000 - 1500 + 1)) + 1500;

    timerRef.current = window.setTimeout(() => {
      startTimeRef.current = performance.now();
      setGameState('stimulus');
    }, randomDelay);
  };

  const handleTouchScreen = () => {
    if (gameState === 'waiting') {
      // Tapped too early before balloon appeared!
      if (timerRef.current) clearTimeout(timerRef.current);
      setToEarly(true);
      soundFX.playWarning();
      setGameState('idle');
      return;
    }

    if (gameState === 'stimulus') {
      const latency = Math.round(performance.now() - startTimeRef.current);
      soundFX.playPop();

      const newTrials = [...trials, latency];
      setTrials(newTrials);
      setLastLatency(latency);
      setGameState('feedback');

      const nextTrialNum = trialIndex + 1;
      setTrialIndex(nextTrialNum);

      if (nextTrialNum >= TOTAL_TRIALS) {
        // Calculate average and variance
        const sum = newTrials.reduce((a, b) => a + b, 0);
        const avg = Math.round(sum / TOTAL_TRIALS);
        const variance = Math.round(
          newTrials.reduce((acc, val) => acc + Math.pow(val - avg, 2), 0) / TOTAL_TRIALS
        );

        setTimeout(() => {
          setGameState('finished');
          soundFX.playSuccess();
          onComplete(newTrials, avg, variance);
        }, 1200);
      } else {
        // Next trial after brief pause
        setTimeout(() => {
          startTrial();
        }, 1400);
      }
    }
  };

  const handleStartGame = () => {
    soundFX.playClick();
    setTrials([]);
    setTrialIndex(0);
    setLastLatency(null);
    startTrial();
  };

  const currentAvg = trials.length > 0 ? Math.round(trials.reduce((a, b) => a + b, 0) / trials.length) : null;

  return (
    <div className="flex flex-col h-full select-none font-child">
      {/* Game Stage Area (Kenney 3D Arcade Arena) */}
      <div
        onClick={handleTouchScreen}
        className={`relative flex-1 rounded-[2.5rem] overflow-hidden flex flex-col items-center justify-center p-6 border-8 transition-all duration-200 cursor-pointer min-h-[460px] shadow-2xl ${
          gameState === 'stimulus'
            ? 'bg-emerald-100/90 border-emerald-500 shadow-emerald-500/40 scale-[1.01]'
            : gameState === 'waiting'
            ? 'bg-sky-100/85 border-sky-400'
            : gameState === 'feedback'
            ? 'bg-amber-100/90 border-amber-400'
            : 'bg-white/95 border-amber-800/80 shadow-amber-950/20'
        }`}
      >
        {/* Trial Status Header Pill (Top) */}
        <div className="absolute top-4 left-6 right-6 flex items-center justify-between pointer-events-none">
          <div className="bg-amber-900/90 text-yellow-300 px-4 py-1.5 rounded-full text-xs font-black shadow-md flex items-center gap-1.5 border border-amber-700">
            <Zap className="w-4 h-4 text-yellow-300" />
            <span>TANTANGAN 1: BALON KILAT</span>
          </div>

          <div className="flex items-center gap-1.5">
            {Array.from({ length: TOTAL_TRIALS }).map((_, i) => (
              <div
                key={i}
                className={`w-7 h-7 rounded-xl flex items-center justify-center text-xs font-black transition-all border-b-2 ${
                  i < trialIndex
                    ? 'bg-emerald-500 text-white border-emerald-700 shadow-sm scale-105'
                    : i === trialIndex && gameState !== 'finished'
                    ? 'bg-amber-400 text-amber-950 border-amber-600 ring-2 ring-yellow-200 animate-bounce'
                    : 'bg-slate-200 text-slate-400 border-slate-300'
                }`}
              >
                {i + 1}
              </div>
            ))}
          </div>
        </div>

        {/* State: Idle / Start Screen */}
        {gameState === 'idle' && (
          <div className="text-center max-w-md space-y-6 animate-in fade-in zoom-in-95 pt-6">
            <div className="relative inline-block animate-float">
              <BalloonSvg size={150} color="#10B981" />
            </div>

            {tooEarly && (
              <div className="bg-rose-100 border-4 border-rose-400 text-rose-800 px-4 py-2.5 rounded-2xl text-sm font-black shadow-md animate-shake">
                ⚠️ Tunggu balonnya muncul dulu ya, jangan disentuh terlalu awal!
              </div>
            )}

            {/* Wooden Signboard Notice */}
            <div className="bg-amber-50 border-4 border-amber-800/80 rounded-3xl p-4 shadow-md text-amber-950 relative">
              <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-amber-800 text-yellow-300 text-[10px] font-black px-3 py-0.5 rounded-full">
                PETUNJUK BERMAIN
              </span>
              <h3 className="text-xl font-black mb-1">Ayo Sentuh Balon Hijau!</h3>
              <p className="text-xs sm:text-sm font-semibold text-amber-900 leading-relaxed">
                Balon akan terbang tiba-tiba. Begitu muncul di layar, langsung sentuh secepat kilat!
              </p>
            </div>

            {/* Chunky 3D Arcade Button */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                handleStartGame();
              }}
              className="relative px-10 py-5 bg-emerald-500 hover:bg-emerald-400 text-white font-black text-xl rounded-3xl border-b-8 border-emerald-700 active:border-b-0 active:translate-y-2 shadow-xl shadow-emerald-900/30 transition-all uppercase tracking-wider overflow-hidden"
            >
              <span className="absolute top-1 left-4 right-4 h-2 bg-white/40 rounded-full pointer-events-none" />
              Mulai Tangkap Balon! 🎈
            </button>
          </div>
        )}

        {/* State: Waiting for Stimulus */}
        {gameState === 'waiting' && (
          <div className="text-center space-y-4 pointer-events-none">
            <div className="w-24 h-24 rounded-3xl bg-sky-200 border-4 border-sky-400 flex items-center justify-center mx-auto text-sky-800 shadow-inner animate-pulse">
              <span className="text-4xl font-black">👀</span>
            </div>
            <h3 className="text-3xl font-black text-sky-950">Bersiap...</h3>
            <p className="text-sky-800 text-base font-bold">Fokus matamu ke layar, tunggu balonnya muncul!</p>
          </div>
        )}

        {/* State: Stimulus Active! (Touch now!) */}
        {gameState === 'stimulus' && (
          <div className="text-center animate-bounce-gentle">
            <BalloonSvg size={220} color="#10B981" />
            <div className="mt-4 px-8 py-3 bg-emerald-600 text-white rounded-3xl font-black text-2xl shadow-2xl border-b-4 border-emerald-800 animate-pulse inline-block">
              KETUK SEKARANG! 🎈
            </div>
          </div>
        )}

        {/* State: Feedback after tap */}
        {gameState === 'feedback' && (
          <div className="text-center space-y-3 animate-in zoom-in-90">
            <div className="w-28 h-28 rounded-3xl bg-amber-300 border-4 border-amber-600 flex flex-col items-center justify-center mx-auto text-amber-950 shadow-xl">
              <span className="text-3xl font-black">{lastLatency}</span>
              <span className="text-xs font-black uppercase text-amber-800">milidetik</span>
            </div>
            <h3 className="text-2xl font-black text-amber-950">Pecah! Hebat Sekali!</h3>
            <p className="text-amber-900 text-sm font-bold">
              Refleks kilatmu tercatat! Menyiapkan balon berikutnya...
            </p>
          </div>
        )}

        {/* State: Finished All 5 Trials */}
        {gameState === 'finished' && (
          <div className="text-center max-w-md space-y-6 animate-in zoom-in-95 pt-4">
            <div className="w-24 h-24 rounded-3xl bg-emerald-400 border-4 border-emerald-700 flex items-center justify-center mx-auto text-white shadow-xl">
              <span className="text-4xl font-black">⭐</span>
            </div>

            <div className="bg-amber-50 border-4 border-amber-800/80 rounded-3xl p-4 shadow-md text-amber-950">
              <h3 className="text-2xl font-black mb-1">Tantangan Balon Selesai!</h3>
              <p className="text-sm font-bold text-amber-900">
                Rata-rata kecepatan refleks kamu: <span className="text-emerald-700 text-lg font-black">{currentAvg} ms</span>
              </p>
              <div className="flex justify-center gap-1.5 mt-3">
                {trials.map((t, idx) => (
                  <span key={idx} className="px-2 py-1 rounded-xl bg-white border border-amber-300 text-amber-900 text-xs font-black shadow-xs">
                    #{idx + 1}: {t}ms
                  </span>
                ))}
              </div>
            </div>

            <div className="flex items-center justify-center gap-4 pt-1">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleStartGame();
                }}
                className="px-5 py-3.5 rounded-2xl bg-amber-200 border-b-4 border-amber-400 text-amber-900 font-black hover:bg-amber-100 flex items-center gap-2 text-xs shadow-md active:border-b-0 active:translate-y-1"
              >
                <RotateCcw className="w-4 h-4" /> Ulangi
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onNext();
                }}
                className="px-8 py-4 rounded-3xl bg-teal-500 hover:bg-teal-400 border-b-6 border-teal-700 active:border-b-0 active:translate-y-1.5 text-white font-black text-base shadow-xl flex items-center gap-2 transition-all"
              >
                Lanjut ke Kebun Buah <ArrowRight className="w-5 h-5" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
