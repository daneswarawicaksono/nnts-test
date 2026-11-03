import React from 'react';

export interface ProgressBarProps {
  value: number; // 0 to 100
  showLabel?: boolean;
  variant?: 'teal' | 'orange' | 'emerald';
  className?: string;
}

export const ProgressBar: React.FC<ProgressBarProps> = ({
  value,
  showLabel = false,
  variant = 'teal',
  className = '',
}) => {
  const clampedValue = Math.min(100, Math.max(0, value));

  const variantFills = {
    teal: 'bg-gradient-to-r from-nutri-teal-500 to-nutri-teal-700',
    orange: 'bg-gradient-to-r from-nutri-orange-400 to-nutri-orange-600',
    emerald: 'bg-gradient-to-r from-emerald-400 to-emerald-600',
  };

  return (
    <div className={`w-full flex items-center gap-2.5 ${className}`}>
      <div className="flex-1 h-2 rounded-pill bg-slate-200/80 overflow-hidden relative">
        <div
          className={`h-full rounded-pill transition-all duration-normal ease-spring-smooth ${variantFills[variant]}`}
          style={{ width: `${clampedValue}%` }}
        />
      </div>

      {showLabel && (
        <span className="text-[11px] font-bold text-slate-600 shrink-0 tabular-nums">
          {Math.round(clampedValue)}%
        </span>
      )}
    </div>
  );
};
