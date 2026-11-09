import React from 'react';
import { Award, Zap, Target, Star } from 'lucide-react';
import { TactileButton } from '../components/TactileButton';
import { NutriSprout } from '../../../design-system/mascot/NutriSprout';
import { soundSynth } from '../../../services/audio/synth';

export interface FlawlessSummaryScreenProps {
  onClaim: () => void;
}

export const FlawlessSummaryScreen: React.FC<FlawlessSummaryScreenProps> = ({ onClaim }) => {
  const handleClaim = () => {
    soundSynth.playCelebrate();
    onClaim();
  };

  return (
    <div className="w-full h-full bg-[#FFFFFF] flex flex-col justify-between items-center px-6 pt-10 pb-8 select-none relative overflow-hidden">
      {/* Background festive celebration glow */}
      <div
        className="absolute top-12 left-1/2 -translate-x-1/2 w-64 h-64 rounded-full bg-[#FFC800]/20 blur-3xl pointer-events-none"
        aria-hidden="true"
      />

      {/* TOP HERO CELEBRATION */}
      <div className="w-full max-w-xs flex flex-col items-center text-center my-auto z-10">
        {/* Victorious Mascot with Star Sparkles */}
        <div className="relative mb-5 animate-float-breath">
          <NutriSprout size={130} mood="happy" showShadow={false} />
          {/* Golden Medal Badge */}
          <div className="absolute -bottom-2 -right-2 w-12 h-12 rounded-full bg-[#FF9600] shadow-[0_3px_0_0_#D97706] text-white flex items-center justify-center">
            <Award className="w-7 h-7 stroke-[2.5]" />
          </div>
        </div>

        {/* Display Headline */}
        <h1 className="text-3xl font-black font-child text-[#3C3C3C] tracking-tight mb-1">
          Sempurna!
        </h1>
        <p className="text-xs sm:text-sm font-bold font-child text-slate-500 leading-snug max-w-[260px]">
          0 kesalahan. Daya tangkap bahasa ananda berkembang sangat pesat!
        </p>

        {/* METRICS & REWARD CARDS */}
        <div className="w-full grid grid-cols-2 gap-3 mt-6">
          {/* XP Card */}
          <div className="bg-[#FFFBEB] border-2 border-[#FDE68A] shadow-[0_3px_0_0_#FDE68A] rounded-2xl p-3 flex flex-col items-center text-center">
            <div className="flex items-center gap-1 text-[#FF9600] mb-1">
              <Zap className="w-5 h-5 fill-[#FF9600]" />
              <span className="text-[11px] font-black font-child uppercase tracking-wider">
                POIN XP
              </span>
            </div>
            <span className="text-2xl font-black font-child text-[#D97706] tabular-nums">
              +15
            </span>
          </div>

          {/* Accuracy Card */}
          <div className="bg-[#F0FDF4] border-2 border-[#BBF7D0] shadow-[0_3px_0_0_#BBF7D0] rounded-2xl p-3 flex flex-col items-center text-center">
            <div className="flex items-center gap-1 text-[#10B981] mb-1">
              <Target className="w-5 h-5" />
              <span className="text-[11px] font-black font-child uppercase tracking-wider">
                AKURASI
              </span>
            </div>
            <span className="text-2xl font-black font-child text-[#059669] tabular-nums">
              100%
            </span>
          </div>
        </div>

        {/* Bonus Star Badge */}
        <div className="mt-4 flex items-center gap-2 bg-amber-50 border border-amber-200 px-4 py-2 rounded-full">
          <Star className="w-4 h-4 fill-amber-500 text-amber-500" />
          <span className="text-xs font-black font-child text-amber-800">
            Capaian Bintang Harian Terbuka
          </span>
        </div>
      </div>

      {/* FOOTER CTA: FULL-WIDTH BLUE 3D BUTTON */}
      <footer className="w-full max-w-xs z-20">
        <TactileButton
          variant="blue"
          size="lg"
          fullWidth
          onClick={handleClaim}
        >
          Klaim XP & Selesai
        </TactileButton>
      </footer>
    </div>
  );
};
