import React, { useState, useEffect, useRef } from 'react';
import { GameHeader } from '../components/GameHeader';
import { soundSynth } from '../../../services/audio/synth';

export interface ModuleGoNoGoProps {
  onComplete: (accuracy: number, commissionErrors: number) => void;
  onExit: () => void;
}

interface StimulusItem {
  isGo: boolean;
  name: string;
  emoji: string;
  badge: string;
}

const STIMULI_LIST: StimulusItem[] = [
  { isGo: true, name: 'Apel Segar', emoji: '🍎', badge: 'Petik!' },
  { isGo: true, name: 'Jeruk Manis', emoji: '🍊', badge: 'Petik!' },
  { isGo: false, name: 'Buah Berulat', emoji: '🐛', badge: 'Jangan Petik!' },
  { isGo: true, name: 'Pisang Manis', emoji: '🍌', badge: 'Petik!' },
  { isGo: true, name: 'Stroberi Manis', emoji: '🍓', badge: 'Petik!' },
  { isGo: true, name: 'Semangka Segar', emoji: '🍉', badge: 'Petik!' },
  { isGo: false, name: 'Buah Busuk', emoji: '🥀', badge: 'Jangan Petik!' },
  { isGo: true, name: 'Anggur Segar', emoji: '🍇', badge: 'Petik!' },
];

export const ModuleGoNoGo: React.FC<ModuleGoNoGoProps> = ({
  onComplete,
  onExit,
}) => {
  const TOTAL_ROUNDS = STIMULI_LIST.length;
  const [currentRound, setCurrentRound] = useState(0);
  const [hasTappedThisRound, setHasTappedThisRound] = useState(false);
  const [feedback, setFeedback] = useState<'correct' | 'wrong' | null>(null);

  // Metrics
  const correctCountRef = useRef(0);
  const commissionErrorsRef = useRef(0);
  const roundTimerRef = useRef<number | null>(null);

  const currentStimulus = STIMULI_LIST[currentRound % STIMULI_LIST.length];

  // Advance each stimulus every 1400ms
  useEffect(() => {
    if (currentRound >= TOTAL_ROUNDS) {
      const accuracy = Math.round((correctCountRef.current / TOTAL_ROUNDS) * 100);
      onComplete(accuracy, commissionErrorsRef.current);
      return;
    }

    setHasTappedThisRound(false);
    setFeedback(null);

    // Timeout to evaluate when round expires without a tap
    roundTimerRef.current = window.setTimeout(() => {
      if (!currentStimulus.isGo) {
        // Child correctly withheld on No-Go!
        correctCountRef.current += 1;
        setFeedback('correct');
      }
      // Advance round
      setTimeout(() => {
        setCurrentRound((r) => r + 1);
      }, 250);
    }, 1300);

    return () => {
      if (roundTimerRef.current) clearTimeout(roundTimerRef.current);
    };
  }, [currentRound, currentStimulus, onComplete, TOTAL_ROUNDS]);

  // Handle tap
  const handleTap = () => {
    if (hasTappedThisRound) return;
    setHasTappedThisRound(true);
    if (roundTimerRef.current) clearTimeout(roundTimerRef.current);

    if (currentStimulus.isGo) {
      // Correct tap on fresh fruit!
      correctCountRef.current += 1;
      setFeedback('correct');
      soundSynth.playPop();
    } else {
      // False alarm on spoiled fruit (Commission error)
      commissionErrorsRef.current += 1;
      setFeedback('wrong');
      soundSynth.playPop();
    }

    // Advance to next round quickly
    setTimeout(() => {
      setCurrentRound((r) => r + 1);
    }, 450);
  };

  return (
    <div
      onClick={handleTap}
      className="w-full h-full flex flex-col justify-between items-center bg-gradient-to-b from-[#FFFBEB] via-[#F0FDF4]/60 to-[#ECFDF5] select-none relative overflow-hidden font-sans cursor-pointer"
    >
      {/* Header */}
      <GameHeader
        moduleTitle="Modul 2: Pesta Buah Segar"
        currentRound={currentRound}
        totalRounds={TOTAL_ROUNDS}
        onExit={onExit}
      />

      {/* Main Stimulus Center */}
      <main className="flex-1 w-full flex flex-col items-center justify-center my-auto z-10 px-6 text-center">
        <div className="flex flex-col items-center space-y-4 animate-in zoom-in-90 duration-fast">
          {/* Card Target */}
          <div
            className={`w-36 h-36 rounded-2xl flex flex-col items-center justify-center shadow-card border-2 transition-transform duration-fast active:scale-95 ${
              feedback === 'correct'
                ? 'bg-emerald-100 border-emerald-500'
                : feedback === 'wrong'
                ? 'bg-rose-100 border-rose-500'
                : currentStimulus.isGo
                ? 'bg-white border-amber-200 shadow-lg'
                : 'bg-slate-100 border-slate-300'
            }`}
          >
            <span className="text-6xl drop-shadow-sm select-none">{currentStimulus.emoji}</span>
          </div>

          <div>
            <span
              className={`text-xs font-bold px-3 py-1 rounded-full ${
                currentStimulus.isGo
                  ? 'bg-amber-100 text-amber-800'
                  : 'bg-rose-100 text-rose-800'
              }`}
            >
              {currentStimulus.name}
            </span>
            <p className="text-sm font-extrabold text-slate-800 mt-2">
              {currentStimulus.isGo ? 'Petik Cepat! 👆' : 'Tahan Jarimu! ✋'}
            </p>
          </div>
        </div>
      </main>

      {/* Footer Instructions */}
      <footer className="w-full text-center pb-5 z-10 shrink-0">
        <p className="text-[11px] text-slate-400 font-medium">
          Putaran {Math.min(currentRound + 1, TOTAL_ROUNDS)} dari {TOTAL_ROUNDS}
        </p>
      </footer>
    </div>
  );
};
