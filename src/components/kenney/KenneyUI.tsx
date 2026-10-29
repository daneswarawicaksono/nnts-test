import React from 'react';

interface KenneyButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'green' | 'blue' | 'red' | 'yellow' | 'wood';
  size?: 'sm' | 'md' | 'lg';
  children: React.ReactNode;
}

export const KenneyButton: React.FC<KenneyButtonProps> = ({
  variant = 'green',
  size = 'md',
  className = '',
  children,
  ...props
}) => {
  const variantStyles = {
    green: 'bg-emerald-500 hover:bg-emerald-400 border-emerald-700 text-white shadow-emerald-950/20',
    blue: 'bg-sky-500 hover:bg-sky-400 border-sky-700 text-white shadow-sky-950/20',
    red: 'bg-rose-500 hover:bg-rose-400 border-rose-700 text-white shadow-rose-950/20',
    yellow: 'bg-amber-400 hover:bg-amber-300 border-amber-600 text-amber-950 shadow-amber-950/20',
    wood: 'bg-amber-100 hover:bg-amber-50 border-amber-800 text-amber-950 shadow-amber-950/25',
  }[variant];

  const sizeStyles = {
    sm: 'px-4 py-2 text-xs rounded-xl border-b-4',
    md: 'px-6 py-3 text-sm rounded-2xl border-b-6',
    lg: 'px-8 py-4 text-base sm:text-lg rounded-3xl border-b-8',
  }[size];

  return (
    <button
      {...props}
      className={`relative select-none font-black font-child tracking-wide uppercase transition-all duration-100 border-2 active:border-b-2 active:translate-y-1.5 shadow-lg active:shadow-xs overflow-hidden ${variantStyles} ${sizeStyles} ${className}`}
    >
      {/* Top Gloss Highlight Edge */}
      <span className="absolute top-0.5 left-2 right-2 h-1.5 bg-white/40 rounded-full pointer-events-none" />
      <span className="relative z-10 flex items-center justify-center gap-2">
        {children}
      </span>
    </button>
  );
};

interface KenneyPanelProps {
  children: React.ReactNode;
  className?: string;
  theme?: 'wood' | 'parchment' | 'metal';
}

export const KenneyPanel: React.FC<KenneyPanelProps> = ({
  children,
  className = '',
  theme = 'wood'
}) => {
  const themeStyles = {
    wood: 'bg-[#FFF8E7] border-4 border-amber-800/90 shadow-xl shadow-amber-950/20 text-amber-950',
    parchment: 'bg-[#FFFDF7] border-4 border-amber-300 shadow-lg shadow-amber-900/10 text-slate-800',
    metal: 'bg-slate-100 border-4 border-slate-400 shadow-md text-slate-800',
  }[theme];

  return (
    <div className={`relative rounded-3xl p-5 select-none font-child ${themeStyles} ${className}`}>
      {/* Corner Rivet Screws (Kenney UI signature style) */}
      <div className="absolute top-2 left-2.5 w-2 h-2 rounded-full bg-amber-900 border border-amber-700 shadow-inner" />
      <div className="absolute top-2 right-2.5 w-2 h-2 rounded-full bg-amber-900 border border-amber-700 shadow-inner" />
      <div className="absolute bottom-2 left-2.5 w-2 h-2 rounded-full bg-amber-900 border border-amber-700 shadow-inner" />
      <div className="absolute bottom-2 right-2.5 w-2 h-2 rounded-full bg-amber-900 border border-amber-700 shadow-inner" />

      {/* Inner Inset Seam Border */}
      <div className="relative z-10">
        {children}
      </div>
    </div>
  );
};

interface KenneyRibbonProps {
  title: string;
  color?: 'amber' | 'teal' | 'rose';
  className?: string;
}

export const KenneyRibbon: React.FC<KenneyRibbonProps> = ({
  title,
  color = 'amber',
  className = ''
}) => {
  const colorMap = {
    amber: 'bg-amber-500 border-amber-700 text-amber-950',
    teal: 'bg-teal-600 border-teal-800 text-white',
    rose: 'bg-rose-500 border-rose-700 text-white',
  }[color];

  return (
    <div className={`relative inline-flex items-center justify-center select-none font-child ${className}`}>
      {/* Folded swallow-tail ribbons */}
      <div className="relative px-6 py-1.5 rounded-lg border-b-4 font-black text-xs uppercase tracking-wider shadow-md z-10 flex items-center justify-center gap-1.5 border-t border-x border-white/30">
        <span className={colorMap}>{title}</span>
      </div>
    </div>
  );
};
