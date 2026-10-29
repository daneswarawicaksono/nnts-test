import React from 'react';

interface MascotCakraProps {
  className?: string;
  size?: number;
  mood?: 'happy' | 'thinking' | 'celebrating';
}

export const MascotCakra: React.FC<MascotCakraProps> = ({
  className = '',
  size = 140,
  mood = 'happy'
}) => {
  return (
    <div className={`relative inline-block select-none animate-idle-bob ${className}`} style={{ width: size, height: size }}>
      <svg
        width="100%"
        height="100%"
        viewBox="0 0 160 160"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Soft Glow Shadow */}
        <ellipse cx="80" cy="148" rx="45" ry="8" fill="#CBD5E1" opacity="0.6" />

        {/* Main Bird Body (Soft Teal & Mint) */}
        <circle cx="80" cy="86" r="48" fill="#0D9488" />
        <circle cx="80" cy="88" r="44" fill="#14B8A6" />

        {/* Belly Patch (Warm Cream) */}
        <path
          d="M60 88C60 76 70 68 80 68C90 68 100 76 100 88C100 108 92 124 80 124C68 124 60 108 60 88Z"
          fill="#FEF3C7"
        />

        {/* Cheeks (Soft Coral Blush) */}
        <ellipse cx="61" cy="94" rx="7" ry="5" fill="#FDA4AF" opacity="0.85" />
        <ellipse cx="99" cy="94" rx="7" ry="5" fill="#FDA4AF" opacity="0.85" />

        {/* Eyes with periodic blinking animation / expressive mood states */}
        {mood === 'celebrating' ? (
          <g>
            {/* Happy Closed Eye Arcs */}
            <path d="M60 82C62 77 68 77 70 82" stroke="#042F2E" strokeWidth="4" strokeLinecap="round" />
            <path d="M90 82C92 77 98 77 100 82" stroke="#042F2E" strokeWidth="4" strokeLinecap="round" />
          </g>
        ) : mood === 'thinking' ? (
          <g>
            {/* Curious Inquisitive Eyes Looking Up */}
            <ellipse cx="66" cy="78" rx="8" ry="9" fill="#042F2E" />
            <ellipse cx="96" cy="78" rx="8" ry="9" fill="#042F2E" />
            <circle cx="68" cy="75" r="3" fill="#FFFFFF" />
            <circle cx="98" cy="75" r="3" fill="#FFFFFF" />
            {/* Soft thinking sparkle dots */}
            <circle cx="118" cy="52" r="3" fill="#F59E0B" opacity="0.7" />
            <circle cx="126" cy="42" r="4.5" fill="#F59E0B" opacity="0.9" />
            <path d="M124 32L126 36L130 38L126 40L124 44L122 40L118 38L122 36Z" fill="#FDE047" />
          </g>
        ) : (
          <g className="animate-blink" style={{ transformOrigin: '80px 80px' }}>
            {/* Big Round Expressive Eyes */}
            <ellipse cx="65" cy="80" rx="8" ry="10" fill="#042F2E" />
            <ellipse cx="95" cy="80" rx="8" ry="10" fill="#042F2E" />
            {/* Eye Sparkles */}
            <circle cx="63" cy="77" r="3.5" fill="#FFFFFF" />
            <circle cx="67" cy="83" r="1.5" fill="#FFFFFF" />
            <circle cx="93" cy="77" r="3.5" fill="#FFFFFF" />
            <circle cx="97" cy="83" r="1.5" fill="#FFFFFF" />
          </g>
        )}

        {/* Beak (Golden Amber) */}
        <path
          d="M74 88C74 86 86 86 86 88L80 97L74 88Z"
          fill="#F59E0B"
          stroke="#D97706"
          strokeWidth="1.5"
          strokeLinejoin="round"
        />

        {/* Posyandu Neckerchief / Scarf (Coral Red with Gold Ring) */}
        <path
          d="M62 110C70 118 90 118 98 110C94 126 86 132 80 134C74 132 66 126 62 110Z"
          fill="#F43F5E"
        />
        <circle cx="80" cy="116" r="4" fill="#FDE047" />

        {/* Wings */}
        {mood === 'celebrating' ? (
          <g>
            <path
              d="M36 84C25 70 20 54 28 50C36 46 44 64 48 76L36 84Z"
              fill="#0F766E"
            />
            <path
              d="M124 84C135 70 140 54 132 50C124 46 116 64 112 76L124 84Z"
              fill="#0F766E"
            />
          </g>
        ) : mood === 'thinking' ? (
          <g>
            {/* Resting Left Wing */}
            <path
              d="M40 86C32 94 30 108 36 116C42 122 48 112 50 98L40 86Z"
              fill="#0F766E"
            />
            {/* Thoughtfully Raised Right Wing Touching Chin */}
            <path
              d="M118 86C116 72 108 84 94 92C92 98 104 104 114 98L118 86Z"
              fill="#0F766E"
            />
          </g>
        ) : (
          <g>
            <path
              d="M40 86C32 94 30 108 36 116C42 122 48 112 50 98L40 86Z"
              fill="#0F766E"
            />
            <path
              d="M120 86C128 94 130 108 124 116C118 122 112 112 110 98L120 86Z"
              fill="#0F766E"
            />
          </g>
        )}

        {/* Head Crest */}
        <path
          d="M80 40C80 28 72 24 76 20C80 16 88 24 84 38L80 40Z"
          fill="#F59E0B"
        />
        <path
          d="M84 42C86 32 94 28 96 24C98 20 102 28 92 40L84 42Z"
          fill="#14B8A6"
        />
      </svg>
    </div>
  );
};
