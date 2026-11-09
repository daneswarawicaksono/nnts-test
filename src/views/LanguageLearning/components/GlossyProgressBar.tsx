import React from 'react';

export interface GlossyProgressBarProps {
  progress: number; // 0 to 100
  className?: string;
}

export const GlossyProgressBar: React.FC<GlossyProgressBarProps> = ({
  progress,
  className = '',
}) => {
  const clamped = Math.max(0, Math.min(100, progress));

  return (
    <div
      role="progressbar"
      aria-valuenow={clamped}
      aria-valuemin={0}
      aria-valuemax={100}
      className={`w-full h-3.5 bg-[#E5E5E5] rounded-full overflow-hidden relative shadow-inner p-0.5 ${className}`}
    >
      <div
        className="h-full bg-[#58CC02] rounded-full relative transition-all duration-300 ease-out flex items-center justify-end"
        style={{ width: `${clamped}%` }}
      >
        {/* Glossy Upper Reflection Highlight */}
        <div className="absolute top-0.5 left-1 right-1 h-1 bg-white/40 rounded-full pointer-events-none" />
      </div>
    </div>
  );
};
