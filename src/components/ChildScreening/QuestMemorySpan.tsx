import React, { useState, useEffect, useRef } from 'react';
import { SymbolGlyph } from '../illustrations/AnimalGlyphs';
import type { AnimalSymbolKey } from '../illustrations/AnimalGlyphs';
import { soundFX } from '../../services/audioSynth';
import { Brain, ArrowRight, RotateCcw, Check, RefreshCw } from 'lucide-react';

interface QuestMemorySpanProps {
  onComplete: (spanScore: number, sequenceLength: number) => void;
  onNext: () => void;
}

const ALL_SYMBOLS: AnimalSymbolKey[] = ['cat', 'rabbit', 'turtle', 'star', 'car'];

export const QuestMemorySpan: React.FC<QuestMemorySpanProps> = ({
  onComplete,
  onNext,
}) => {
  const [targetSequence] = useState<AnimalSymbolKey[]>(['cat', 'star', 'rabbit', 'turtle']);
  const [activeHighlightIdx, setActiveHighlightIdx] = useState<number | null>(null);
  const [gameState, setGameState] = useState<'idle' | 'memorizing' | 'recalling' | 'evaluating' | 'finished'>('idle');
  const [userSequence, setUserSequence] = useState<AnimalSymbolKey[]>([]);
  const [evaluatedScore, setEvaluatedScore] = useState<number>(3);
  const [isSuccess, setIsSuccess] = useState<boolean>(false);

  const displayTimerRef = useRef<number | null>(null);

  useEffect(() => {
    return () => {
      if (displayTimerRef.current) clearTimeout(displayTimerRef.current);
    };
  }, []);

  const startMemorizing = () => {
    soundFX.playClick();
    setGameState('memorizing');
    setUserSequence([]);
    setActiveHighlightIdx(null);

    let step = 0;
    const playStep = () => {
      if (step < targetSequence.length) {
        setActiveHighlightIdx(step);
        soundFX.playClick();
        step++;
        displayTimerRef.current = window.setTimeout(playStep, 1100);
      } else {
        setActiveHighlightIdx(null);
        setGameState('recalling');
        soundFX.playSuccess();
      }
    };

    displayTimerRef.current = window.setTimeout(playStep, 600);
  };

  const handleSelectSymbol = (sym: AnimalSymbolKey) => {
    if (gameState !== 'recalling') return;

    soundFX.playPop();
    const updated = [...userSequence, sym];
    setUserSequence(updated);

    if (updated.length === targetSequence.length) {
      setGameState('evaluating');

      const expectedReverse = [...targetSequence].reverse();
      let matchCount = 0;
      for (let i = 0; i < updated.length; i++) {
        if (updated[i] === expectedReverse[i]) {
          matchCount++;
        }
      }

      const calculatedSpan = Math.max(1, Math.min(5, matchCount + 1));
      const passed = matchCount >= 2;

      setEvaluatedScore(calculatedSpan);
      setIsSuccess(passed);

      setTimeout(() => {
        setGameState('finished');
        if (passed) soundFX.playFanfare();
        else soundFX.playSuccess();
        onComplete(calculatedSpan, targetSequence.length);
      }, 1000);
    }
  };

  const handleClearLast = () => {
    if (userSequence.length > 0) {
      soundFX.playClick();
      setUserSequence(userSequence.slice(0, -1));
    }
  };

  const expectedReverse = [...targetSequence].reverse();

  return (
    <div className="flex flex-col h-full select-none font-child">
      {/* Game Stage Area (Kenney 3D Arcade Arena) */}
      <div className="relative flex-1 rounded-[2.5rem] overflow-hidden flex flex-col items-center justify-center p-6 border-8 border-amber-800/80 bg-white/95 shadow-2xl shadow-amber-950/20 min-h-[460px]">
        {/* Top Header Pill */}
        <div className="absolute top-4 left-6 right-6 flex items-center justify-between pointer-events-none">
          <div className="bg-purple-900/90 text-purple-200 px-4 py-1.5 rounded-full text-xs font-black shadow-md flex items-center gap-1.5 border border-purple-700">
            <Brain className="w-4 h-4 text-purple-300" />
            <span>TANTANGAN 3: SAHABAT HEWAN TERBALIK</span>
          </div>

          <div className="px-3 py-1 rounded-xl bg-purple-100 text-purple-900 text-xs font-black border border-purple-300">
            {targetSequence.length} Simbol Ingatan
          </div>
        </div>

        {/* State: Idle / Instructions */}
        {gameState === 'idle' && (
          <div className="text-center max-w-lg space-y-6 animate-in fade-in zoom-in-95 pt-6">
            <div className="flex justify-center gap-3">
              {targetSequence.map((sym, idx) => (
                <div key={idx} className="p-2.5 bg-purple-100 rounded-2xl border-4 border-purple-300 shadow-md">
                  <SymbolGlyph symbol={sym} size={64} />
                </div>
              ))}
            </div>

            <div className="bg-amber-50 border-4 border-amber-800/80 rounded-3xl p-4 shadow-md text-amber-950">
              <h3 className="text-xl font-black mb-1">Ayo Ingat Barisan Hewan!</h3>
              <p className="text-xs sm:text-sm font-semibold text-amber-900 leading-relaxed">
                Hewan-hewan akan bersinar satu demi satu. Ingat baik-baik, lalu sentuh kembali dalam urutan <strong>TERBALIK</strong> (dari yang terakhir menyala)!
              </p>
            </div>

            <button
              onClick={startMemorizing}
              className="relative px-10 py-5 bg-purple-600 hover:bg-purple-500 text-white font-black text-xl rounded-3xl border-b-8 border-purple-800 active:border-b-0 active:translate-y-2 shadow-xl shadow-purple-900/30 transition-all uppercase tracking-wider overflow-hidden"
            >
              <span className="absolute top-1 left-4 right-4 h-2 bg-white/40 rounded-full pointer-events-none" />
              Mulai Ingat Hewan! 🦊
            </button>
          </div>
        )}

        {/* State: Memorizing */}
        {gameState === 'memorizing' && (
          <div className="text-center space-y-6 animate-in zoom-in-95">
            <div className="px-6 py-2 bg-purple-100 border-2 border-purple-300 text-purple-900 rounded-full text-xs font-black inline-block animate-pulse shadow-sm">
              👀 Perhatikan baik-baik urutan hewannya...
            </div>

            <div className="flex justify-center gap-4">
              {targetSequence.map((sym, idx) => {
                const isHighlight = activeHighlightIdx === idx;
                return (
                  <div
                    key={idx}
                    className={`p-3 rounded-3xl transition-all duration-300 ${
                      isHighlight
                        ? 'bg-amber-200 border-4 border-amber-500 ring-4 ring-yellow-300 scale-125 shadow-2xl'
                        : 'bg-purple-50 border-2 border-purple-200 opacity-40'
                    }`}
                  >
                    <SymbolGlyph symbol={sym} size={80} />
                    <span className="block text-center mt-2 text-xs font-black text-amber-950">
                      #{idx + 1}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* State: Recalling */}
        {gameState === 'recalling' && (
          <div className="text-center w-full max-w-xl space-y-6 animate-in fade-in pt-4">
            <div className="space-y-1">
              <span className="px-5 py-1.5 bg-amber-300 border-2 border-amber-600 text-amber-950 rounded-full text-xs font-black inline-block shadow-sm">
                🔄 SEKARANG SENTUH SECARA TERBALIK!
              </span>
              <p className="text-xs text-amber-900 font-bold">Mulai dari simbol yang TERAKHIR menyala tadi</p>
            </div>

            {/* Answer Slots */}
            <div className="flex justify-center gap-3 min-h-[90px] items-center bg-amber-50 border-4 border-dashed border-amber-300 rounded-3xl p-3 shadow-inner">
              {Array.from({ length: targetSequence.length }).map((_, i) => {
                const filledSym = userSequence[i];
                return (
                  <div
                    key={i}
                    className={`w-16 h-16 rounded-2xl flex items-center justify-center transition-all ${
                      filledSym
                        ? 'bg-white border-4 border-purple-400 shadow-md scale-105'
                        : 'bg-white/60 border-2 border-amber-200 text-amber-400'
                    }`}
                  >
                    {filledSym ? (
                      <SymbolGlyph symbol={filledSym} size={48} />
                    ) : (
                      <span className="font-black text-xs">#{i + 1}</span>
                    )}
                  </div>
                );
              })}
            </div>

            {/* Tap Choices Pool */}
            <div className="space-y-2">
              <span className="text-[11px] font-black text-amber-900/60 uppercase tracking-wider block">Pilihan Simbol:</span>
              <div className="flex justify-center gap-3">
                {ALL_SYMBOLS.map((sym) => {
                  return (
                    <button
                      key={sym}
                      onClick={() => handleSelectSymbol(sym)}
                      className="p-1.5 rounded-2xl bg-white border-b-4 border-amber-300 hover:scale-110 active:scale-95 active:border-b-0 active:translate-y-1 shadow-md transition-all"
                    >
                      <SymbolGlyph symbol={sym} size={64} />
                    </button>
                  );
                })}
              </div>
            </div>

            {userSequence.length > 0 && (
              <button
                onClick={handleClearLast}
                className="text-xs font-black text-amber-800 hover:text-rose-600 flex items-center gap-1.5 mx-auto bg-white/80 px-3 py-1 rounded-full border border-amber-200"
              >
                <RefreshCw className="w-3.5 h-3.5" /> Hapus simbol terakhir
              </button>
            )}
          </div>
        )}

        {/* State: Finished Game */}
        {gameState === 'finished' && (
          <div className="text-center max-w-md space-y-6 animate-in zoom-in-95 pt-4">
            <div className={`w-24 h-24 rounded-3xl border-4 flex items-center justify-center mx-auto shadow-xl ${
              isSuccess ? 'bg-purple-500 border-purple-800 text-white' : 'bg-amber-400 border-amber-600 text-amber-950'
            }`}>
              <Check className="w-12 h-12 stroke-[3]" />
            </div>

            <div className="bg-amber-50 border-4 border-amber-800/80 rounded-3xl p-4 shadow-md text-amber-950">
              <h3 className="text-2xl font-black mb-1">Tantangan Memori Selesai!</h3>
              <p className="text-sm font-bold text-amber-900">
                Skor Rentang Memori Hipokampus: <span className="text-purple-700 text-xl font-black">{evaluatedScore} / 5</span>
              </p>
            </div>

            <div className="bg-white p-3.5 rounded-2xl border-2 border-amber-200 text-left text-xs space-y-2 shadow-xs">
              <div>
                <span className="text-slate-400 font-bold block mb-1">Urutan Terbalik Yang Tepat:</span>
                <div className="flex gap-1.5">
                  {expectedReverse.map((sym, i) => (
                    <span key={i} className="px-2 py-0.5 rounded-lg bg-purple-100 text-purple-900 font-black capitalize">
                      {sym}
                    </span>
                  ))}
                </div>
              </div>
              <div>
                <span className="text-slate-400 font-bold block mb-1">Jawaban Si Kecil:</span>
                <div className="flex gap-1.5">
                  {userSequence.map((sym, i) => (
                    <span
                      key={i}
                      className={`px-2 py-0.5 rounded-lg font-black capitalize ${
                        sym === expectedReverse[i] ? 'bg-emerald-100 text-emerald-900' : 'bg-rose-100 text-rose-900'
                      }`}
                    >
                      {sym}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            <div className="flex items-center justify-center gap-4 pt-1">
              <button
                onClick={startMemorizing}
                className="px-5 py-3.5 rounded-2xl bg-amber-200 border-b-4 border-amber-400 text-amber-900 font-black hover:bg-amber-100 flex items-center gap-2 text-xs shadow-md active:border-b-0 active:translate-y-1"
              >
                <RotateCcw className="w-4 h-4" /> Coba Lagi
              </button>
              <button
                onClick={onNext}
                className="px-8 py-4 rounded-3xl bg-teal-500 hover:bg-teal-400 border-b-6 border-teal-700 active:border-b-0 active:translate-y-1.5 text-white font-black text-base shadow-xl flex items-center gap-2 transition-all"
              >
                Buka Peti Harta Bintang! <ArrowRight className="w-5 h-5" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
