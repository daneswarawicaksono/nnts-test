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
    <header className="relative w-full pt-12 pb-3 px-4 bg-emerald-50/95 backdrop-blur-sm border-b border-emerald-100 flex items-center justify-between z-50">
      {/* 44x44px Accessible Touch Target with Explicit Click Handler */}
      <button
        type="button"
        onClick={(e) => {
          e.stopPropagation();
          soundSynth.playPop();
          onExit();
        }}
        aria-label="Tutup dan kembali ke Peta Petualangan"
        className="w-11 h-11 rounded-full bg-white shadow-sm border border-slate-200 flex items-center justify-center text-slate-700 hover:bg-slate-100 active:scale-95 transition-all cursor-pointer pointer-events-auto z-50 min-h-[44px] min-w-[44px]"
      >
        <X className="w-5 h-5 stroke-[2.5]" />
      </button>

      {/* Centered Title with Clearance from Phone Notch */}
      <div className="flex flex-col items-center justify-center flex-1 mx-2">
        <h2 className="text-sm font-bold text-slate-800 tracking-tight text-center">
          {moduleTitle}
        </h2>
        {/* Step Progress Indicators */}
        <div className="flex items-center gap-1.5 mt-1.5">
          {Array.from({ length: totalRounds }).map((_, i) => (
            <span
              key={i}
              className={`h-2 rounded-full transition-all duration-300 ${
                i === currentRound
                  ? 'w-6 bg-emerald-600'
                  : i < currentRound
                  ? 'w-2 bg-emerald-500'
                  : 'w-2 bg-slate-300'
              }`}
            />
          ))}
        </div>
      </div>

      {/* Sound Toggle (>=44x44px) */}
      {onToggleMute ? (
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onToggleMute();
          }}
          className="w-11 h-11 rounded-full bg-white border border-slate-200 text-slate-700 hover:text-nutri-teal-700 flex items-center justify-center transition-colors shadow-sm min-h-[44px] min-w-[44px] cursor-pointer pointer-events-auto"
          aria-label="Toggle suara"
        >
          {isMuted ? <VolumeX className="w-5 h-5 text-slate-400" /> : <Volume2 className="w-5 h-5 text-nutri-teal-700" />}
        </button>
      ) : (
        <div className="w-11 h-11" aria-hidden="true" />
      )}
    </header>
  );
};
