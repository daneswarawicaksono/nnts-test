import React from 'react';

export type AnimalSymbolKey = 'cat' | 'rabbit' | 'turtle' | 'star' | 'car';

interface SymbolGlyphProps {
  symbol: AnimalSymbolKey;
  size?: number;
  className?: string;
  isSelected?: boolean;
}

export const SymbolGlyph: React.FC<SymbolGlyphProps> = ({
  symbol,
  size = 72,
  className = '',
  isSelected = false,
}) => {
  const renderIcon = () => {
    switch (symbol) {
      case 'cat':
        return (
          <g>
            {/* Cat Face */}
            <circle cx="50" cy="54" r="28" fill="#FDE68A" stroke="#D97706" strokeWidth="4" />
            {/* Ears */}
            <path d="M28 36L22 18L40 28Z" fill="#F59E0B" stroke="#D97706" strokeWidth="3" strokeLinejoin="round" />
            <path d="M72 36L78 18L60 28Z" fill="#F59E0B" stroke="#D97706" strokeWidth="3" strokeLinejoin="round" />
            {/* Eyes */}
            <circle cx="39" cy="50" r="3.5" fill="#78350F" />
            <circle cx="61" cy="50" r="3.5" fill="#78350F" />
            {/* Nose & Mouth */}
            <polygon points="50,56 46,60 54,60" fill="#EF4444" />
            <path d="M46 62C48 65 52 65 54 62" stroke="#78350F" strokeWidth="2.5" strokeLinecap="round" fill="none" />
            {/* Whiskers */}
            <path d="M22 52L34 54M20 60L34 58M78 52L66 54M80 60L66 58" stroke="#B45309" strokeWidth="2.5" strokeLinecap="round" />
          </g>
        );

      case 'rabbit':
        return (
          <g>
            {/* Long Ears */}
            <ellipse cx="38" cy="24" rx="8" ry="18" fill="#FCE7F3" stroke="#DB2777" strokeWidth="3.5" />
            <ellipse cx="62" cy="24" rx="8" ry="18" fill="#FCE7F3" stroke="#DB2777" strokeWidth="3.5" />
            <ellipse cx="38" cy="24" rx="4" ry="11" fill="#F472B6" />
            <ellipse cx="62" cy="24" rx="4" ry="11" fill="#F472B6" />
            {/* Face */}
            <circle cx="50" cy="56" r="26" fill="#FFFFFF" stroke="#DB2777" strokeWidth="3.5" />
            {/* Eyes */}
            <circle cx="41" cy="54" r="3.5" fill="#831843" />
            <circle cx="59" cy="54" r="3.5" fill="#831843" />
            {/* Pink Nose */}
            <ellipse cx="50" cy="62" rx="4" ry="3" fill="#EC4899" />
            <path d="M46 66C48 68 52 68 54 66" stroke="#831843" strokeWidth="2" strokeLinecap="round" fill="none" />
          </g>
        );

      case 'turtle':
        return (
          <g>
            {/* Shell */}
            <path d="M26 62C26 40 40 32 50 32C60 32 74 40 74 62Z" fill="#A7F3D0" stroke="#059669" strokeWidth="3.5" />
            {/* Shell Pattern */}
            <polygon points="50,38 40,48 44,58 56,58 60,48" fill="#34D399" stroke="#059669" strokeWidth="2" />
            {/* Head */}
            <ellipse cx="80" cy="54" rx="10" ry="8" fill="#6EE7B7" stroke="#059669" strokeWidth="3" />
            <circle cx="83" cy="52" r="2" fill="#064E3B" />
            {/* Feet */}
            <ellipse cx="32" cy="66" rx="6" ry="4" fill="#6EE7B7" stroke="#059669" strokeWidth="2" />
            <ellipse cx="68" cy="66" rx="6" ry="4" fill="#6EE7B7" stroke="#059669" strokeWidth="2" />
          </g>
        );

      case 'star':
        return (
          <g>
            {/* 5-pointed Star */}
            <path
              d="M50 16L59 36L81 38L65 52L70 74L50 62L30 74L35 52L19 38L41 36Z"
              fill="#FDE047"
              stroke="#D97706"
              strokeWidth="4"
              strokeLinejoin="round"
            />
            {/* Sparkle Eyes & Smile */}
            <circle cx="43" cy="46" r="3" fill="#78350F" />
            <circle cx="57" cy="46" r="3" fill="#78350F" />
            <path d="M46 54C48 57 52 57 54 54" stroke="#78350F" strokeWidth="2.5" strokeLinecap="round" fill="none" />
          </g>
        );

      case 'car':
        return (
          <g>
            {/* Car Cabin */}
            <path d="M30 46C34 34 42 32 50 32H62C70 32 74 38 78 46Z" fill="#93C5FD" stroke="#2563EB" strokeWidth="3.5" />
            <rect x="42" y="36" width="14" height="9" rx="2" fill="#DBEAFE" />
            <rect x="58" y="36" width="14" height="9" rx="2" fill="#DBEAFE" />
            {/* Car Chassis */}
            <rect x="20" y="46" width="64" height="18" rx="6" fill="#3B82F6" stroke="#1D4ED8" strokeWidth="3.5" />
            {/* Headlight */}
            <circle cx="80" cy="53" r="3" fill="#FEF08A" />
            {/* Wheels */}
            <circle cx="34" cy="64" r="9" fill="#1E293B" stroke="#475569" strokeWidth="2" />
            <circle cx="34" cy="64" r="4" fill="#94A3B8" />
            <circle cx="70" cy="64" r="9" fill="#1E293B" stroke="#475569" strokeWidth="2" />
            <circle cx="70" cy="64" r="4" fill="#94A3B8" />
          </g>
        );
    }
  };

  return (
    <div
      className={`inline-flex items-center justify-center rounded-2xl transition-all duration-200 select-none ${
        isSelected
          ? 'ring-4 ring-amber-400 bg-amber-50 scale-105 shadow-md'
          : 'bg-white hover:bg-slate-50 shadow-sm border border-slate-200/80 hover:border-slate-300'
      } ${className}`}
      style={{ width: size, height: size }}
    >
      <svg
        width={size * 0.85}
        height={size * 0.85}
        viewBox="0 0 100 85"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        {renderIcon()}
      </svg>
    </div>
  );
};
