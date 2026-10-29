import React from 'react';

interface BalloonSvgProps {
  size?: number;
  className?: string;
  color?: string;
}

export const BalloonSvg: React.FC<BalloonSvgProps> = ({
  size = 180,
  className = '',
  color = '#10B981' // Fresh bright green as specified in prompt
}) => {
  return (
    <svg
      width={size}
      height={size * 1.3}
      viewBox="0 0 160 208"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`select-none ${className}`}
    >
      <defs>
        <radialGradient id="balloonGleam" cx="35%" cy="30%" r="65%">
          <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.8" />
          <stop offset="35%" stopColor={color} stopOpacity="0.9" />
          <stop offset="100%" stopColor="#047857" />
        </radialGradient>
        <filter id="balloonDropShadow" x="-10%" y="-10%" width="130%" height="130%">
          <feDropShadow dx="0" dy="8" stdDeviation="6" floodOpacity="0.18" floodColor="#064E3B" />
        </filter>
      </defs>

      <g filter="url(#balloonDropShadow)">
        {/* Main Oval Balloon Body */}
        <path
          d="M80 12C42 12 18 42 18 84C18 124 50 148 76 150L84 150C110 148 142 124 142 84C142 42 118 12 80 12Z"
          fill="url(#balloonGleam)"
        />

        {/* Gloss Highlight Oval */}
        <ellipse
          cx="52"
          cy="48"
          rx="18"
          ry="32"
          transform="rotate(-25 52 48)"
          fill="#FFFFFF"
          opacity="0.55"
        />

        {/* Small Secondary Sparkle */}
        <circle cx="44" cy="90" r="4" fill="#FFFFFF" opacity="0.6" />

        {/* Knot */}
        <path
          d="M74 150L86 150L83 158L77 158Z"
          fill="#065F46"
          stroke="#047857"
          strokeWidth="1.5"
        />
      </g>

      {/* Balloon String (Playful wavy curve) */}
      <path
        d="M80 158C76 168 88 178 82 188C76 198 84 204 80 208"
        stroke="#64748B"
        strokeWidth="2.5"
        strokeLinecap="round"
        fill="none"
      />
    </svg>
  );
};
