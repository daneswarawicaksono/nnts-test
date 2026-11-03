import React from 'react';
import { X, Volume2, VolumeX } from 'lucide-react';
import { soundSynth } from '../../../services/audio/synth';

export interface GameHeaderProps {
  moduleTitle: string;
  currentRound: number;
  totalRounds: number;
  onExit: () => void;
  isMuted?: boolean;
  onToggleMute?: () => void;
}

export const GameHeader: React.FC<GameHeaderProps> = ({
  moduleTitle,
  currentRound,
  totalRounds,
  onExit,
  isMuted = false,
  onToggleMute,
}) => {
  return (
    <header className="w-full flex items-center justify-between px-5 pt-4 pb-2 shrink-0 z-20">
      {/* Exit Button */}
      <button
        type="button"
        onClick={() => {
          soundSynth.playPop();
          if (confirm('Keluar dari sesi permainan? Hasil belum tersimpan.')) {
            onExit();
          }
        }}
        className="w-9 h-9 rounded-full bg-white border border-slate-200 text-slate-500 hover:text-slate-900 flex items-center justify-center transition-colors shadow-subtle"
        aria-label="Batal permainan"
      >
        <X className="w-4 h-4" />
      </button>

      {/* Title & Progress Dots */}
      <div className="flex flex-col items-center gap-1">
        <span className="text-xs font-bold text-slate-800 tracking-tight">{moduleTitle}</span>
        <div className="flex items-center gap-1.5">
          {Array.from({ length: totalRounds }).map((_, idx) => {
            const isCompleted = idx < currentRound;
            const isCurrent = idx === currentRound;
            return (
              <span
                key={idx}
                className={`transition-all duration-fast ${
                  isCurrent
                    ? 'w-4 h-2 rounded-full bg-nutri-teal-700 shadow-xs'
                    : isCompleted
                    ? 'w-2 h-2 rounded-full bg-emerald-500'
                    : 'w-2 h-2 rounded-full bg-slate-200'
                }`}
              />
            );
          })}
        </div>
      </div>

      {/* Sound Toggle */}
      {onToggleMute ? (
        <button
          type="button"
          onClick={onToggleMute}
          className="w-9 h-9 rounded-full bg-white border border-slate-200 text-slate-500 hover:text-nutri-teal-700 flex items-center justify-center transition-colors shadow-subtle"
          aria-label="Toggle suara"
        >
          {isMuted ? <VolumeX className="w-4 h-4 text-slate-400" /> : <Volume2 className="w-4 h-4 text-nutri-teal-700" />}
        </button>
      ) : (
        <div className="w-9 h-9" />
      )}
    </header>
  );
};
