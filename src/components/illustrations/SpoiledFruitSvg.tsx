import React from 'react';

interface SpoiledFruitSvgProps {
  size?: number;
  className?: string;
}

export const SpoiledFruitSvg: React.FC<SpoiledFruitSvgProps> = ({
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
        <radialGradient id="spoiledAppleGradient" cx="40%" cy="40%" r="65%">
          <stop offset="0%" stopColor="#A3A375" />
          <stop offset="45%" stopColor="#78716C" />
          <stop offset="90%" stopColor="#57534E" />
          <stop offset="100%" stopColor="#44403C" />
        </radialGradient>
        <filter id="spoiledShadow" x="-10%" y="-10%" width="125%" height="125%">
          <feDropShadow dx="0" dy="6" stdDeviation="5" floodOpacity="0.2" floodColor="#292524" />
        </filter>
      </defs>

      <g filter="url(#spoiledShadow)">
        {/* Crooked Bent Stem */}
        <path
          d="M80 44C82 32 74 22 66 18"
          stroke="#451A03"
          strokeWidth="5"
          strokeLinecap="round"
        />

        {/* Drooping Wilted Leaf (Points Downward) */}
        <path
          d="M74 36C62 38 48 50 48 60C54 62 68 56 74 42Z"
          fill="#713F12"
          stroke="#451A03"
          strokeWidth="1.5"
        />

        {/* Asymmetrical Dented/Sunken Apple Body */}
        <path
          d="M80 48C70 42 46 40 32 58C18 78 18 108 36 130C50 144 68 146 76 142C86 145 106 140 120 128C138 104 140 76 128 58C114 42 90 44 80 48Z"
          fill="url(#spoiledAppleGradient)"
        />

        {/* Large Rotten Bruised Patch (Dark Brown/Purple) */}
        <path
          d="M88 78C108 72 122 84 120 102C118 116 102 124 88 120C78 116 76 96 88 78Z"
          fill="#292524"
          opacity="0.85"
        />

        {/* Mold/Spoil Speckles */}
        <circle cx="96" cy="92" r="3.5" fill="#A8A29E" opacity="0.8" />
        <circle cx="106" cy="102" r="2.5" fill="#A8A29E" opacity="0.8" />
        <circle cx="86" cy="104" r="2" fill="#A8A29E" opacity="0.8" />
        <circle cx="48" cy="80" r="3" fill="#44403C" />
        <circle cx="58" cy="98" r="4" fill="#44403C" />
        <circle cx="68" cy="120" r="2.5" fill="#44403C" />

        {/* Cracks / Wilt Wrinkle Lines */}
        <path
          d="M92 84L96 90L92 98"
          stroke="#78716C"
          strokeWidth="1.5"
          strokeLinecap="round"
        />
        <path
          d="M102 88L106 94L102 100"
          stroke="#78716C"
          strokeWidth="1.5"
          strokeLinecap="round"
        />

        {/* Unpleasant Smell Wave / Fly indicator (Preschool readable) */}
        <path
          d="M126 36C130 42 134 40 138 46"
          stroke="#78716C"
          strokeWidth="2"
          strokeLinecap="round"
          fill="none"
        />
        <circle cx="140" cy="38" r="2" fill="#44403C" />
      </g>
    </svg>
  );
};
