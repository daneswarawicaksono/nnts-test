import React from 'react';

interface FreshFruitSvgProps {
  size?: number;
  className?: string;
}

export const FreshFruitSvg: React.FC<FreshFruitSvgProps> = ({
  size = 180,
  className = '',
}) => {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 160 160"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`select-none ${className}`}
    >
      <defs>
        <radialGradient id="freshAppleGleam" cx="35%" cy="35%" r="70%">
          <stop offset="0%" stopColor="#F87171" />
          <stop offset="40%" stopColor="#EF4444" />
          <stop offset="90%" stopColor="#B91C1C" />
          <stop offset="100%" stopColor="#991B1B" />
        </radialGradient>
        <filter id="freshShadow" x="-10%" y="-10%" width="125%" height="125%">
          <feDropShadow dx="0" dy="6" stdDeviation="6" floodOpacity="0.16" floodColor="#7F1D1D" />
        </filter>
      </defs>

      <g filter="url(#freshShadow)">
        {/* Apple Stem */}
        <path
          d="M80 44C80 32 88 20 98 16"
          stroke="#78350F"
          strokeWidth="6"
          strokeLinecap="round"
        />

        {/* Crisp Green Upright Leaf */}
        <path
          d="M86 32C100 24 116 26 122 34C122 46 108 52 90 40Z"
          fill="#10B981"
          stroke="#047857"
          strokeWidth="1.5"
        />
        <path d="M88 34Q102 33 116 34" stroke="#D1FAE5" strokeWidth="1.5" strokeLinecap="round" />

        {/* Plump Shiny Red Apple Body */}
        <path
          d="M80 48C68 38 42 38 30 54C14 74 16 112 40 134C54 146 72 148 80 144C88 148 106 146 120 134C144 112 146 74 130 54C118 38 92 38 80 48Z"
          fill="url(#freshAppleGleam)"
        />

        {/* Gloss Highlight Oval */}
        <ellipse
          cx="54"
          cy="68"
          rx="12"
          ry="20"
          transform="rotate(-20 54 68)"
          fill="#FFFFFF"
          opacity="0.6"
        />
        <circle cx="46" cy="98" r="3.5" fill="#FFFFFF" opacity="0.65" />

        {/* Shiny Sparkle Stars (Child-friendly excitement) */}
        <path
          d="M128 32L131 40L139 43L131 46L128 54L125 46L117 43L125 40Z"
          fill="#FDE047"
        />
        <path
          d="M26 44L28 49L33 51L28 53L26 58L24 53L19 51L24 49Z"
          fill="#FDE047"
        />
      </g>
    </svg>
  );
};
