import React, { useState, useEffect, useRef } from 'react';
import { FreshFruitSvg } from '../illustrations/FreshFruitSvg';
import { SpoiledFruitSvg } from '../illustrations/SpoiledFruitSvg';
import { soundFX } from '../../services/audioSynth';
import { Sparkles, ArrowRight, RotateCcw, ShieldAlert, CheckCircle2 } from 'lucide-react';

interface QuestGoNoGoProps {
  onComplete: (accuracyRate: number, commissionErrors: number, omissionErrors: number) => void;
  onNext: () => void;
}

type StimulusType = 'fresh' | 'spoiled';

const ROUND_SEQUENCE: StimulusType[] = [
  'fresh',
  'fresh',
  'spoiled',
  'fresh',
  'fresh',
  'spoiled',
  'fresh',
  'spoiled',
  'fresh',
  'fresh',
];

export const QuestGoNoGo: React.FC<QuestGoNoGoProps> = ({
  onComplete,
  onNext,
}) => {
  const TOTAL_ROUNDS = ROUND_SEQUENCE.length; // 10
  const [roundIdx, setRoundIdx] = useState(0);
  const [gameState, setGameState] = useState<'idle' | 'showing' | 'blank' | 'finished'>('idle');
  const [currentStimulus, setCurrentStimulus] = useState<StimulusType>('fresh');
  const [tappedThisRound, setTappedThisRound] = useState(false);
  const [feedbackEffect, setFeedbackEffect] = useState<'correct-go' | 'wrong-nogo' | 'missed-go' | 'correct-nogo' | null>(null);

  // Metrics
  const [commissionErrors, setCommissionErrors] = useState(0);
  const [omissionErrors, setOmissionErrors] = useState(0);
  const [correctHits, setCorrectHits] = useState(0);
  const [correctInhibitions, setCorrectInhibitions] = useState(0);

  const roundTimerRef = useRef<number | null>(null);
  const interStimulusTimerRef = useRef<number | null>(null);

  useEffect(() => {
    return () => {
      if (roundTimerRef.current) clearTimeout(roundTimerRef.current);
      if (interStimulusTimerRef.current) clearTimeout(interStimulusTimerRef.current);
    };
  }, []);

  const runRound = (idx: number, commErrors: number, omErrors: number, hits: number, inhibs: number) => {
    if (idx >= TOTAL_ROUNDS) {
      const totalCorrect = hits + inhibs;
      const accuracy = Math.round((totalCorrect / TOTAL_ROUNDS) * 100);

      setGameState('finished');
      soundFX.playSuccess();
      onComplete(accuracy, commErrors, omErrors);
      return;
    }

    setRoundIdx(idx);
    const stim = ROUND_SEQUENCE[idx];
    setCurrentStimulus(stim);
    setTappedThisRound(false);
    setFeedbackEffect(null);
    setGameState('showing');

    // 800ms stimulus display window
    roundTimerRef.current = window.setTimeout(() => {
      let newOmErrors = omErrors;
      let newInhibs = inhibs;

      setTappedThisRound((wasTapped) => {
        if (!wasTapped) {
          if (stim === 'fresh') {
            newOmErrors += 1;
            setOmissionErrors(newOmErrors);
            setFeedbackEffect('missed-go');
          } else {
            newInhibs += 1;
            setCorrectInhibitions(newInhibs);
            setFeedbackEffect('correct-nogo');
          }
        }
        return wasTapped;
      });

      setGameState('blank');

      interStimulusTimerRef.current = window.setTimeout(() => {
        runRound(idx + 1, commErrors, newOmErrors, hits, newInhibs);
      }, 600);
    }, 800);
  };

  const handleFruitTap = () => {
    if (gameState !== 'showing' || tappedThisRound) return;

    setTappedThisRound(true);

    if (currentStimulus === 'fresh') {
      soundFX.playPop();
      setCorrectHits((prev) => prev + 1);
      setFeedbackEffect('correct-go');
    } else {
      soundFX.playWarning();
      setCommissionErrors((prev) => prev + 1);
      setFeedbackEffect('wrong-nogo');
    }
  };

  const handleStartGame = () => {
    soundFX.playClick();
    setCommissionErrors(0);
    setOmissionErrors(0);
    setCorrectHits(0);
    setCorrectInhibitions(0);
    setRoundIdx(0);
    runRound(0, 0, 0, 0, 0);
  };

  const totalScore = correctHits + correctInhibitions;
  const accuracy = Math.round((totalScore / TOTAL_ROUNDS) * 100);

  return (
    <div className="flex flex-col h-full select-none font-child">
      {/* Main Touch Arena (Kenney 3D Arcade Arena) */}
      <div
        onClick={handleFruitTap}
        className={`relative flex-1 rounded-[2.5rem] overflow-hidden flex flex-col items-center justify-center p-6 border-8 transition-all duration-200 cursor-pointer min-h-[460px] shadow-2xl ${
          feedbackEffect === 'correct-go'
            ? 'bg-emerald-100 border-emerald-500 shadow-emerald-500/40'
            : feedbackEffect === 'wrong-nogo'
            ? 'bg-rose-100 border-rose-500 shadow-rose-500/40'
            : gameState === 'showing'
            ? 'bg-amber-100/90 border-amber-500'
            : 'bg-white/95 border-amber-800/80 shadow-amber-950/20'
        }`}
      >
        {/* Top Header Pill */}
        <div className="absolute top-4 left-6 right-6 flex items-center justify-between pointer-events-none">
          <div className="bg-rose-900/90 text-rose-200 px-4 py-1.5 rounded-full text-xs font-black shadow-md flex items-center gap-1.5 border border-rose-700">
            <Sparkles className="w-4 h-4 text-rose-300" />
            <span>TANTANGAN 2: PESTA BUAH SEGAR</span>
          </div>

          <div className="flex items-center gap-1.5">
            {ROUND_SEQUENCE.map((_, i) => (
              <div
                key={i}
                className={`w-6 h-6 rounded-lg flex items-center justify-center text-[10px] font-black transition-all border-b-2 ${
                  i < roundIdx
                    ? 'bg-emerald-500 text-white border-emerald-700 shadow-xs'
                    : i === roundIdx && gameState !== 'finished'
                    ? 'bg-rose-500 text-white border-rose-700 ring-2 ring-rose-200 scale-110'
                    : 'bg-slate-200 text-slate-400 border-slate-300'
                }`}
              >
                {i + 1}
              </div>
            ))}
          </div>
        </div>

        {/* State: Idle / Instructions */}
        {gameState === 'idle' && (
          <div className="text-center max-w-lg space-y-6 animate-in fade-in zoom-in-95 pt-6">
            <div className="flex items-center justify-center gap-6">
              <div className="text-center space-y-2">
                <div className="p-3 bg-emerald-100 rounded-3xl border-4 border-emerald-400 shadow-md inline-block">
                  <FreshFruitSvg size={110} />
                </div>
                <div className="px-3 py-1 bg-emerald-600 text-white rounded-full text-xs font-black shadow-xs">
                  ✓ KETUK CEPAT!
                </div>
                <span className="text-xs text-emerald-900 font-extrabold block">Buah Segar</span>
              </div>

              <div className="text-3xl font-black text-amber-900/30">VS</div>

              <div className="text-center space-y-2">
                <div className="p-3 bg-rose-100 rounded-3xl border-4 border-rose-400 shadow-md inline-block">
                  <SpoiledFruitSvg size={110} />
                </div>
                <div className="px-3 py-1 bg-rose-600 text-white rounded-full text-xs font-black shadow-xs">
                  ✕ JANGAN KETUK!
                </div>
                <span className="text-xs text-rose-900 font-extrabold block">Buah Busuk</span>
              </div>
            </div>

            <div className="bg-amber-50 border-4 border-amber-800/80 rounded-3xl p-4 shadow-md text-amber-950">
              <h3 className="text-xl font-black mb-1">Pilah Buah yang Sehat!</h3>
              <p className="text-xs sm:text-sm font-semibold text-amber-900 leading-relaxed">
                Setiap buah hanya muncul sebentar (800 ms). Tahan jarimu kalau buahnya busuk ya!
              </p>
            </div>

            <button
              onClick={(e) => {
                e.stopPropagation();
                handleStartGame();
              }}
              className="relative px-10 py-5 bg-rose-500 hover:bg-rose-400 text-white font-black text-xl rounded-3xl border-b-8 border-rose-700 active:border-b-0 active:translate-y-2 shadow-xl shadow-rose-900/30 transition-all uppercase tracking-wider overflow-hidden"
            >
              <span className="absolute top-1 left-4 right-4 h-2 bg-white/40 rounded-full pointer-events-none" />
              Mulai Petik Buah! 🍎
            </button>
          </div>
        )}

        {/* State: Showing Stimulus */}
        {gameState === 'showing' && (
          <div className="text-center space-y-4 animate-in zoom-in-95 duration-100">
            <div className="relative inline-block transition-transform hover:scale-105">
              {currentStimulus === 'fresh' ? (
                <FreshFruitSvg size={220} />
              ) : (
                <SpoiledFruitSvg size={220} />
              )}
            </div>

            <div className="text-base font-black">
              {currentStimulus === 'fresh' ? (
                <span className="text-emerald-900 bg-emerald-300 px-6 py-2 rounded-full border-2 border-emerald-600 shadow-md">
                  KETUK SEKARANG! 🍎
                </span>
              ) : (
                <span className="text-amber-950 bg-amber-300 px-6 py-2 rounded-full border-2 border-amber-600 shadow-md">
                  TAHAN JARI... JANGAN SENTUH! ✋
                </span>
              )}
            </div>
          </div>
        )}

        {/* State: Blank interval feedback */}
        {gameState === 'blank' && (
          <div className="text-center space-y-2">
            <div className="w-16 h-16 rounded-2xl bg-amber-100 border-2 border-amber-300 flex items-center justify-center mx-auto text-amber-700">
              <span className="text-xl font-black">...</span>
            </div>
            {feedbackEffect === 'correct-go' && (
              <span className="text-emerald-800 font-black text-lg animate-bounce block">Bagus! Buah segar terkumpul!</span>
            )}
            {feedbackEffect === 'wrong-nogo' && (
              <span className="text-rose-700 font-black text-lg block">Ups, itu buah busuk!</span>
            )}
            {feedbackEffect === 'correct-nogo' && (
              <span className="text-teal-800 font-black text-lg block">Hebat! Kamu pintar menahan diri!</span>
            )}
          </div>
        )}

        {/* State: Finished Game */}
        {gameState === 'finished' && (
          <div className="text-center max-w-md space-y-6 animate-in zoom-in-95 pt-4">
            <div className="w-24 h-24 rounded-3xl bg-rose-400 border-4 border-rose-700 flex items-center justify-center mx-auto text-white shadow-xl">
              <Sparkles className="w-12 h-12" />
            </div>

            <div className="bg-amber-50 border-4 border-amber-800/80 rounded-3xl p-4 shadow-md text-amber-950">
              <h3 className="text-2xl font-black mb-1">Tantangan Buah Selesai!</h3>
              <p className="text-sm font-bold text-amber-900">
                Akurasi fokus anak: <span className="text-rose-600 text-xl font-black">{accuracy}%</span> ({totalScore} dari {TOTAL_ROUNDS} benar)
              </p>
            </div>

            {/* Metrics cards */}
            <div className="grid grid-cols-3 gap-2 text-left">
              <div className="p-3 bg-emerald-100 rounded-2xl border-2 border-emerald-300">
                <span className="text-[10px] text-emerald-900 font-black flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3 text-emerald-700" /> Buah Segar
                </span>
                <span className="text-base font-black text-emerald-950">{correctHits} / 7</span>
              </div>

              <div className="p-3 bg-rose-100 rounded-2xl border-2 border-rose-300">
                <span className="text-[10px] text-rose-900 font-black flex items-center gap-1">
                  <ShieldAlert className="w-3 h-3 text-rose-700" /> Komisi
                </span>
                <span className="text-base font-black text-rose-950">{commissionErrors} kali</span>
              </div>

              <div className="p-3 bg-amber-100 rounded-2xl border-2 border-amber-300">
                <span className="text-[10px] text-amber-900 font-black flex items-center gap-1">
                  Omisi
                </span>
                <span className="text-base font-black text-amber-950">{omissionErrors} kali</span>
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
                Lanjut ke Sahabat Hewan <ArrowRight className="w-5 h-5" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
