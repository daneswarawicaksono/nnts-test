import React from 'react';
import { Check, Flame, Share2, Flag } from 'lucide-react';
import { TactileButton } from '../components/TactileButton';
import { NutriSprout } from '../../../design-system/mascot/NutriSprout';
import { soundSynth } from '../../../services/audio/synth';

export interface StreakCelebrationOverlayProps {
  streakCount?: number;
  onContinue: () => void;
}

export const StreakCelebrationOverlay: React.FC<StreakCelebrationOverlayProps> = ({
  streakCount = 5,
  onContinue,
}) => {
  const handleContinue = () => {
    soundSynth.playChime();
    onContinue();
  };

  return (
    <div className="w-full h-full bg-slate-900/60 backdrop-blur-xs flex flex-col justify-between overflow-hidden select-none relative z-50">
      {/* Energetic Warm Ambient Aura Burst */}
      <div
        className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-72 h-72 rounded-full bg-[#FF9600]/25 blur-3xl pointer-events-none"
        aria-hidden="true"
      />

      {/* TOP CELEBRATION HERO */}
      <div className="flex-1 flex flex-col items-center justify-center text-center p-6 my-auto z-10">
        {/* Floating 3D Banner */}
        <div className="inline-flex items-center gap-2 bg-[#FF9600] shadow-[0_4px_0_0_#D97706] text-white px-5 py-2 rounded-2xl mb-6 transform -rotate-1">
          <Flame className="w-6 h-6 fill-white drop-shadow-xs" />
          <span className="text-base font-black font-child tracking-wider uppercase">
            {streakCount} KALI BENAR BERTURUT-TURUT!
          </span>
        </div>

        {/* Excited Mascot Pose */}
        <div className="animate-float-breath">
          <NutriSprout size={120} mood="happy" showShadow={false} />
        </div>
      </div>

      {/* FEEDBACK BOTTOM DRAWER (Soft mint-green tray #D7FFB8) */}
      <div className="w-full bg-[#D7FFB8] border-2 border-[#86EFAC] rounded-t-3xl p-5 shadow-2xl flex flex-col gap-4 z-20">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            {/* Green Check Circle */}
            <div className="w-12 h-12 rounded-full bg-[#58CC02] shadow-[0_3px_0_0_#46A302] flex items-center justify-center text-white shrink-0">
              <Check className="w-7 h-7 stroke-[3.5]" />
            </div>
            <div>
              <h3 className="text-xl font-black font-child text-[#166534] tracking-tight">
                Hebat Sekali!
              </h3>
              <p className="text-xs font-bold font-child text-[#15803D]">
                Kosakata tersusun sempurna
              </p>
            </div>
          </div>

          {/* Quick utility action icons */}
          <div className="flex items-center gap-2">
            <button
              type="button"
              className="w-10 h-10 rounded-xl bg-white/70 hover:bg-white text-emerald-800 flex items-center justify-center transition-all cursor-pointer min-h-[44px] min-w-[44px]"
              title="Bagikan Capaian"
            >
              <Share2 className="w-4 h-4" />
            </button>
            <button
              type="button"
              className="w-10 h-10 rounded-xl bg-white/70 hover:bg-white text-emerald-800 flex items-center justify-center transition-all cursor-pointer min-h-[44px] min-w-[44px]"
              title="Laporkan Masalah"
            >
              <Flag className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Continue Action Button */}
        <TactileButton
          variant="green"
          size="lg"
          fullWidth
          onClick={handleContinue}
        >
          Lanjut
        </TactileButton>
      </div>
    </div>
  );
};
