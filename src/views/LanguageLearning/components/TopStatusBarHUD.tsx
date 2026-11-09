import React from 'react';
import { Flame, Gem, Heart } from 'lucide-react';

export interface TopStatusBarHUDProps {
  streak?: number;
  gems?: number;
  hearts?: number | 'inf';
  courseName?: string;
  onExit?: () => void;
  className?: string;
}

export const TopStatusBarHUD: React.FC<TopStatusBarHUDProps> = ({
  streak = 5,
  gems = 240,
  hearts = 'inf',
  className = '',
}) => {
  return (
    <header
      className={`w-full h-14 px-4 bg-white/95 backdrop-blur-md border-b-2 border-[#E5E5E5] flex items-center justify-between z-30 select-none ${className}`}
    >
      {/* Course Flag / Learning Level Indicator */}
      <div className="flex items-center gap-2">
        <div className="w-8 h-6 rounded-md overflow-hidden shadow-xs border border-slate-200 flex flex-col">
          <div className="h-1/2 bg-[#DC2626]" />
          <div className="h-1/2 bg-white" />
        </div>
        <span className="text-xs font-black font-child tracking-wider uppercase text-slate-700 hidden xs:inline">
          ID
        </span>
      </div>

      {/* Gamification Economies Group */}
      <div className="flex items-center gap-3.5">
        {/* Streak Flame */}
        <div
          className="flex items-center gap-1.5 cursor-pointer hover:opacity-90 transition-opacity"
          title="Hari Berturut-turut (Streak)"
        >
          <Flame className="w-5 h-5 text-[#FF9600] fill-[#FF9600] drop-shadow-xs" />
          <span className="text-sm font-black font-child text-[#FF9600] tabular-nums">
            {streak}
          </span>
        </div>

        {/* Gems / Currency */}
        <div
          className="flex items-center gap-1.5 cursor-pointer hover:opacity-90 transition-opacity"
          title="Permata Belajar"
        >
          <Gem className="w-5 h-5 text-[#1CB0F6] fill-[#1CB0F6] drop-shadow-xs" />
          <span className="text-sm font-black font-child text-[#1CB0F6] tabular-nums">
            {gems}
          </span>
        </div>

        {/* Hearts / Health Energy */}
        <div
          className="flex items-center gap-1.5 cursor-pointer hover:opacity-90 transition-opacity"
          title="Energi Belajar"
        >
          <Heart className="w-5 h-5 text-[#EF4444] fill-[#EF4444] drop-shadow-xs" />
          <span className="text-sm font-black font-child text-[#EF4444]">
            {hearts === 'inf' ? '∞' : hearts}
          </span>
        </div>
      </div>
    </header>
  );
};
