import React from 'react';
import { Gamepad2, Sparkles } from 'lucide-react';
import { soundSynth } from '../../../services/audio/synth';

interface KerroDailyQuestCardProps {
  onStartGame: () => void;
}

export const KerroDailyQuestCard: React.FC<KerroDailyQuestCardProps> = ({
  onStartGame,
}) => {
  return (
    <div className="bg-white rounded-3xl border border-[#E5E5E5] p-5 shadow-sm space-y-3 relative overflow-hidden">
      {/* Background Accent */}
      <div className="flex items-center gap-4">
        {/* Mascot Kerro with Shadow Ellipse */}
        <div className="relative flex flex-col items-center shrink-0">
          <img
            src="/mascot/kerro_pose5_wave.png"
            alt="Kerro melambai"
            className="w-20 h-20 object-contain drop-shadow-sm select-none"
            onError={(e) => {
              // fallback to smile pose if not loaded
              (e.target as HTMLImageElement).src = '/mascot/kerro_pose1_smile.png';
            }}
          />
          <div className="w-16 h-3 rounded-full bg-slate-200/60 -mt-1 blur-[1px]" />
        </div>

        {/* Speech Bubble */}
        <div className="flex-1 bg-emerald-50/80 border border-emerald-200/80 rounded-2xl p-3 relative text-left">
          {/* Bubble Pointer Tail */}
          <div className="absolute top-1/2 -left-2 -translate-y-1/2 w-0 h-0 border-t-[6px] border-t-transparent border-r-[8px] border-r-emerald-200 border-b-[6px] border-b-transparent" />
          <div className="absolute top-1/2 -left-1.5 -translate-y-1/2 w-0 h-0 border-t-[5px] border-t-transparent border-r-[7px] border-r-emerald-50 border-b-[5px] border-b-transparent" />

          <div className="flex items-center gap-1 text-[10px] font-black text-[#2B8A44] uppercase tracking-wider">
            <Sparkles className="w-3 h-3 text-amber-500 fill-amber-400" />
            <span>Misi Ceria Hari Ini</span>
          </div>
          <p className="text-xs font-bold text-slate-800 mt-1 leading-snug">
            "Yuk, luangkan 2 menit main tebak buah bareng si kecil untuk melatih koordinasi motoriknya!"
          </p>
        </div>
      </div>

      {/* 3D Action Button */}
      <button
        type="button"
        onClick={() => {
          soundSynth.playChime();
          onStartGame();
        }}
        className="w-full py-3 px-4 rounded-2xl btn-3d-green text-sm font-extrabold flex items-center justify-center gap-2 shadow-[0_4px_0_#2B8A44]"
      >
        <Gamepad2 className="w-4 h-4" />
        <span>Ayo Main Sekarang</span>
      </button>
    </div>
  );
};
