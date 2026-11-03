import React from 'react';

export type NutriSproutMood = 'calm' | 'happy' | 'curious';

export interface NutriSproutProps {
  size?: number; // width in px (default: 150)
  mood?: NutriSproutMood;
  showShadow?: boolean;
  className?: string;
  onClick?: () => void;
}

export const NutriSprout: React.FC<NutriSproutProps> = ({
  size = 150,
  mood = 'calm',
  showShadow = true,
  className = '',
  onClick,
}) => {
  return (
    <div
      onClick={onClick}
      className={`relative inline-flex flex-col items-center justify-center select-none ${className} ${
        onClick ? 'cursor-pointer active:scale-95 transition-transform duration-fast' : ''
      }`}
      style={{ width: size, height: size * 1.22 }}
      role={onClick ? 'button' : undefined}
      tabIndex={onClick ? 0 : undefined}
    >
      {/* Floating Animated Character Body */}
      <div className="relative z-10 w-full h-full flex items-center justify-center animate-float-breath">
        <svg
          viewBox="0 0 200 240"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-full h-full drop-shadow-sm"
        >
          <defs>
            {/* Tunas Twin Leaf Gradient */}
            <linearGradient id="sproutLeafGrad" x1="100" y1="20" x2="100" y2="70" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="#4ADE80" />
              <stop offset="100%" stopColor="#10B981" />
            </linearGradient>

            {/* Nutri Body Mint-Teal Gradient */}
            <linearGradient id="sproutBodyGrad" x1="100" y1="65" x2="100" y2="210" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="#5EEAD4" />
              <stop offset="40%" stopColor="#2DD4BF" />
              <stop offset="100%" stopColor="#0D9488" />
            </linearGradient>

            {/* Belly Soft Light Spot */}
            <radialGradient id="sproutBelly" cx="100" cy="155" r="48" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="#CCFBF1" stopOpacity="0.5" />
              <stop offset="100%" stopColor="#5EEAD4" stopOpacity="0" />
            </radialGradient>

            {/* Rosy Peach Cheeks */}
            <radialGradient id="sproutCheek" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#FB7185" stopOpacity="0.65" />
              <stop offset="100%" stopColor="#FB7185" stopOpacity="0" />
            </radialGradient>
          </defs>

          {/* SPURT LEAVES (Pucuk Daun Gizi) */}
          <g>
            {/* Left Leaf */}
            <path
              d="M100 62 C85 45, 68 40, 64 26 C78 24, 94 36, 100 62 Z"
              fill="url(#sproutLeafGrad)"
              stroke="#059669"
              strokeWidth="2.5"
              strokeLinejoin="round"
            />
            {/* Right Leaf */}
            <path
              d="M100 62 C115 45, 132 40, 136 26 C122 24, 106 36, 100 62 Z"
              fill="url(#sproutLeafGrad)"
              stroke="#059669"
              strokeWidth="2.5"
              strokeLinejoin="round"
            />
            {/* Stem Base */}
            <path
              d="M97 60 Q100 66 103 60"
              stroke="#059669"
              strokeWidth="3"
              strokeLinecap="round"
            />
          </g>

          {/* SPURT MAIN BODY (Montok & Organik) */}
          <path
            d="M100 66
               C146 66, 168 98, 168 142
               C168 186, 142 208, 100 208
               C58 208, 32 186, 32 142
               C32 98, 54 66, 100 66 Z"
            fill="url(#sproutBodyGrad)"
            stroke="#0F766E"
            strokeWidth="3.5"
          />

          {/* Belly Soft Reflection */}
          <ellipse cx="100" cy="155" rx="46" ry="38" fill="url(#sproutBelly)" />

          {/* ROSY CHEEKS */}
          <ellipse cx="62" cy="144" rx="12" ry="7" fill="url(#sproutCheek)" />
          <ellipse cx="138" cy="144" rx="12" ry="7" fill="url(#sproutCheek)" />

          {/* MOOD EXPRESSIONS */}
          {mood === 'calm' && (
            /* Mata tersenyum damai melengkung - Sensation tenang bebas cemas */
            <g stroke="#0F172A" strokeWidth="3.5" strokeLinecap="round" fill="none">
              <path d="M68 132 Q78 123 88 132" />
              <path d="M112 132 Q122 123 132 132" />
              <path d="M93 148 Q100 154 107 148" strokeWidth="3" />
            </g>
          )}

          {mood === 'happy' && (
            /* Mata berbinar lebar & mulut ceria */
            <g>
              <circle cx="78" cy="130" r="9" fill="#0F172A" />
              <circle cx="75" cy="127" r="3" fill="#FFFFFF" />
              <circle cx="81" cy="133" r="1.5" fill="#FFFFFF" />

              <circle cx="122" cy="130" r="9" fill="#0F172A" />
              <circle cx="119" cy="127" r="3" fill="#FFFFFF" />
              <circle cx="125" cy="133" r="1.5" fill="#FFFFFF" />

              <path
                d="M91 146 Q100 159 109 146 Z"
                fill="#F43F5E"
                stroke="#0F172A"
                strokeWidth="2.5"
                strokeLinejoin="round"
              />
            </g>
          )}

          {mood === 'curious' && (
            /* Kedipan sebelah & mulut kecil penasaran */
            <g stroke="#0F172A" strokeWidth="3.5" strokeLinecap="round">
              <path d="M68 131 Q78 124 88 131" fill="none" />
              <circle cx="122" cy="130" r="8" fill="#0F172A" stroke="none" />
              <circle cx="120" cy="128" r="2.5" fill="#FFFFFF" stroke="none" />
              <ellipse cx="100" cy="150" rx="4.5" ry="5.5" fill="#0F172A" stroke="none" />
            </g>
          )}

          {/* Tiny Foot Anchors */}
          <ellipse cx="82" cy="207" rx="10" ry="5" fill="#0D9488" opacity="0.6" />
          <ellipse cx="118" cy="207" rx="10" ry="5" fill="#0D9488" opacity="0.6" />
        </svg>
      </div>

      {/* Breathing Ground Shadow */}
      {showShadow && (
        <div
          className="absolute bottom-2 w-28 h-3.5 bg-slate-900/20 rounded-full blur-[2px] animate-shadow-breath pointer-events-none"
          aria-hidden="true"
        />
      )}
    </div>
  );
};
