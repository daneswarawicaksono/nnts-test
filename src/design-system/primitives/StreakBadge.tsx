import React from 'react';
import { Flame } from 'lucide-react';

export interface StreakBadgeProps {
  count: number;
  label?: string;
  className?: string;
}

export const StreakBadge: React.FC<StreakBadgeProps> = ({
  count,
  label = 'Hari Konsisten',
  className = '',
}) => {
  return (
    <div
      className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-pill bg-white border border-slate-200/80 shadow-subtle text-slate-800 ${className}`}
      title={`${count} ${label}`}
    >
      <div className="w-5 h-5 rounded-full bg-orange-100 flex items-center justify-center text-nutri-orange-500">
        <Flame className="w-3.5 h-3.5 fill-nutri-orange-500 text-nutri-orange-500" />
      </div>
      <span className="text-xs font-extrabold tabular-nums">{count}</span>
      {label && <span className="text-[11px] text-slate-500 font-medium hidden sm:inline">{label}</span>}
    </div>
  );
};
