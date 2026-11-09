import React from 'react';
import { Flame, Check } from 'lucide-react';

export interface DailyFlameStreakCardProps {
  currentStreak?: number;
  completedDays?: number[]; // indices 0-6 (0=Sun, 6=Sat)
  caption?: string;
  className?: string;
}

const DAYS = ['Min', 'Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab'];

export const DailyFlameStreakCard: React.FC<DailyFlameStreakCardProps> = ({
  currentStreak = 5,
  completedDays = [0, 1, 2, 3, 4],
  caption = "Hebat! Terus pertahankan asupan gizi buah hati!",
  className = '',
}) => {
  return (
    <div
      className={`w-full bg-white rounded-2xl border border-[#FED7AA] p-3 sm:p-3.5 shadow-sm space-y-2.5 ${className}`}
      style={{ boxShadow: '0 2px 10px rgba(249, 115, 22, 0.08)' }}
    >
      <div className="flex items-center justify-between">
        {/* Left: Flame Streak Badge */}
        <div className="flex items-center gap-2.5">
          <div className="w-10 h-10 rounded-2xl bg-[#FFF7ED] border border-[#FED7AA] flex items-center justify-center text-[#EA580C] shadow-xs">
            <Flame className="w-6 h-6 fill-[#EA580C] text-[#EA580C]" />
          </div>
          <div>
            <div className="flex items-baseline gap-1">
              <span className="text-base font-black font-child text-slate-900 tabular-nums">
                {currentStreak} Hari
              </span>
              <span className="text-xs font-bold text-[#C2410C]">Streak Aktif</span>
            </div>
            <p className="text-xs text-[#475569] font-medium leading-tight">
              {caption}
            </p>
          </div>
        </div>
      </div>

      {/* 7-Day Dot Progress Bar */}
      <div className="pt-1 border-t border-slate-100 flex items-center justify-between px-1">
        {DAYS.map((day, idx) => {
          const isDone = completedDays.includes(idx);
          const isToday = idx === 4; // demo Friday/active day
          return (
            <div key={day} className="flex flex-col items-center gap-1">
              <div
                className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
                  isDone
                    ? 'bg-[#EA580C] text-white shadow-xs'
                    : isToday
                    ? 'bg-white border-2 border-[#EA580C] text-[#C2410C]'
                    : 'bg-slate-100 border border-slate-200 text-slate-700'
                }`}
              >
                {isDone ? <Check className="w-3.5 h-3.5 stroke-[3]" /> : idx + 1}
              </div>
              <span className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                {day}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
};
