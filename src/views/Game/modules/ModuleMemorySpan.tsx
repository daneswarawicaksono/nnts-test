import React, { useState, useEffect } from 'react';
import { GameHeader } from '../components/GameHeader';
import { soundSynth } from '../../../services/audio/synth';

export interface ModuleMemorySpanProps {
  onComplete: (spanScore: number) => void;
  onExit: () => void;
}

interface AnimalItem {
  id: string;
  name: string;
  emoji: string;
}

const ANIMALS: AnimalItem[] = [
  { id: 'kelinci', name: 'Kelinci', emoji: '🐰' },
  { id: 'kucing', name: 'Kucing', emoji: '🐱' },
  { id: 'burung', name: 'Burung', emoji: '🐦' },
  { id: 'katak', name: 'Katak', emoji: '🐸' },
];

export const ModuleMemorySpan: React.FC<ModuleMemorySpanProps> = ({
  onComplete,
  onExit,
}) => {
  const [level, setLevel] = useState<number>(1); // Level 1 (span 2), Level 2 (span 3), Level 3 (span 4)
  const [phase, setPhase] = useState<'showing' | 'recalling' | 'feedback'>('showing');
  const [activeHighlight, setActiveHighlight] = useState<string | null>(null);
  const [userTaps, setUserTaps] = useState<string[]>([]);
  const [maxSpanAchieved, setMaxSpanAchieved] = useState<number>(2);

  // Generate sequence for current level: level 1 = 2 items, level 2 = 3 items, level 3 = 4 items
  const [sequence, setSequence] = useState<string[]>(['kelinci', 'kucing']);

  useEffect(() => {
    // Generate new sequence when level changes
    const length = level + 1; // 2, 3, 4
    const newSeq: string[] = [];
    for (let i = 0; i < length; i++) {
      const randomAnimal = ANIMALS[Math.floor(Math.random() * ANIMALS.length)].id;
      newSeq.push(randomAnimal);
    }
    setSequence(newSeq);
    setUserTaps([]);
    setPhase('showing');

    // Play presentation animation
    let step = 0;
    const interval = setInterval(() => {
      if (step < newSeq.length) {
        setActiveHighlight(newSeq[step]);
        soundSynth.playPop();
        step++;
      } else {
        clearInterval(interval);
        setActiveHighlight(null);
        setPhase('recalling');
        soundSynth.playChime();
      }
    }, 700);

    return () => clearInterval(interval);
  }, [level]);

  // Handle child tapping an animal during recall phase
  const handleAnimalTap = (animalId: string) => {
    if (phase !== 'recalling') return;

    soundSynth.playPop();
    const newTaps = [...userTaps, animalId];
    setUserTaps(newTaps);

    // Expected sequence is REVERSED!
    const expectedReversed = [...sequence].reverse();
    const currentIndex = newTaps.length - 1;

    if (newTaps[currentIndex] !== expectedReversed[currentIndex]) {
      // Wrong tap
      setPhase('feedback');
      setTimeout(() => {
        onComplete(maxSpanAchieved);
      }, 900);
      return;
    }

    // Check if finished sequence for this level
    if (newTaps.length === expectedReversed.length) {
      // Success!
      soundSynth.playChime();
      const currentSpan = sequence.length;
      setMaxSpanAchieved(currentSpan);

      if (level < 3) {
        setPhase('feedback');
        setTimeout(() => {
          setLevel((lvl) => lvl + 1);
        }, 800);
      } else {
        // Completed all 3 levels
        setPhase('feedback');
        setTimeout(() => {
          onComplete(currentSpan);
        }, 800);
      }
    }
  };

  return (
    <div className="w-full h-full flex flex-col justify-between items-center bg-gradient-to-b from-[#ECFDF5] via-[#F0FDF4] to-[#FFFBEB] select-none relative overflow-hidden font-sans">
      {/* Header */}
      <GameHeader
        moduleTitle="Modul 3: Jejak Hewan Terbalik"
        currentRound={level - 1}
        totalRounds={3}
        onExit={onExit}
      />

      {/* Main Game Stage */}
      <main className="flex-1 w-full max-w-xs mx-auto flex flex-col items-center justify-center my-auto z-10 px-4 text-center">
        {phase === 'showing' && (
          <div className="mb-6 animate-in fade-in duration-fast">
            <span className="text-xs font-bold text-teal-800 bg-teal-100/80 px-3 py-1 rounded-full">
              Perhatikan urutannya! 👀
            </span>
          </div>
        )}

        {phase === 'recalling' && (
          <div className="mb-6 animate-in fade-in duration-fast">
            <span className="text-xs font-extrabold text-amber-800 bg-amber-100/90 px-3 py-1 rounded-full animate-bounce-gentle">
              Sentuh urutan terbalik! 🔄
            </span>
          </div>
        )}

        {/* 2x2 Animal Touch Cards */}
        <div className="grid grid-cols-2 gap-3.5 w-full">
          {ANIMALS.map((animal) => {
            const isHighlighted = activeHighlight === animal.id;
            return (
              <button
                key={animal.id}
                type="button"
                disabled={phase !== 'recalling'}
                onClick={() => handleAnimalTap(animal.id)}
                className={`h-28 rounded-2xl border-2 flex flex-col items-center justify-center transition-all duration-fast select-none ${
                  isHighlighted
                    ? 'bg-amber-100 border-amber-500 scale-105 shadow-md ring-4 ring-amber-200'
                    : 'bg-white border-slate-200 shadow-card hover:border-slate-300 active:scale-95 disabled:hover:scale-100'
                }`}
              >
                <span className="text-4xl drop-shadow-xs">{animal.emoji}</span>
                <span className="text-xs font-bold text-slate-800 mt-1">{animal.name}</span>
              </button>
            );
          })}
        </div>

        {/* Indicator of cards tapped in current sequence */}
        <div className="flex gap-2 mt-5">
          {sequence.map((_, idx) => (
            <div
              key={idx}
              className={`w-3 h-3 rounded-full border transition-all ${
                idx < userTaps.length
                  ? 'bg-nutri-teal-700 border-nutri-teal-700'
                  : 'bg-white border-slate-300'
              }`}
            />
          ))}
        </div>
      </main>

      {/* Footer */}
      <footer className="w-full text-center pb-5 z-10 shrink-0">
        <p className="text-[11px] text-slate-400 font-medium">
          Tantangan Tingkat {level} dari 3
        </p>
      </footer>
    </div>
  );
};
