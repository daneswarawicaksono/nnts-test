import React from 'react';

interface AvatarSvgProps {
  gender?: 'L' | 'P';
  size?: number;
  className?: string;
}

export const ChildAvatarSvg: React.FC<AvatarSvgProps> = ({
  gender = 'P',
  size = 72,
  className = '',
}) => {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 100 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`select-none rounded-full ${className}`}
    >
      {/* Background Circle */}
      <circle cx="50" cy="50" r="48" fill={gender === 'P' ? '#FFE4E6' : '#E0F2FE'} />

      {gender === 'P' ? (
        <g>
          {/* Hair Base */}
          <circle cx="50" cy="46" r="28" fill="#451A03" />
          {/* Hair Buns */}
          <circle cx="24" cy="36" r="12" fill="#451A03" />
          <circle cx="76" cy="36" r="12" fill="#451A03" />
          <circle cx="26" cy="38" r="5" fill="#FB7185" />
          <circle cx="74" cy="38" r="5" fill="#FB7185" />
          {/* Face */}
          <circle cx="50" cy="52" r="22" fill="#FED7AA" />
          {/* Hair Bangs */}
          <path d="M30 44C40 38 60 38 70 44C66 40 50 36 30 44Z" fill="#451A03" />
          {/* Eyes */}
          <circle cx="43" cy="52" r="3" fill="#1C1917" />
          <circle cx="57" cy="52" r="3" fill="#1C1917" />
          <circle cx="42" cy="51" r="1" fill="#FFFFFF" />
          <circle cx="56" cy="51" r="1" fill="#FFFFFF" />
          {/* Cheeks */}
          <circle cx="38" cy="56" r="3.5" fill="#FDA4AF" />
          <circle cx="62" cy="56" r="3.5" fill="#FDA4AF" />
          {/* Smile */}
          <path d="M46 58C48 61 52 61 54 58" stroke="#78350F" strokeWidth="2" strokeLinecap="round" fill="none" />
          {/* Shirt */}
          <path d="M28 88C32 74 42 70 50 70C58 70 68 74 72 88Z" fill="#F43F5E" />
          <circle cx="50" cy="76" r="3" fill="#FDE047" />
        </g>
      ) : (
        <g>
          {/* Boy Hair */}
          <path d="M26 44C26 30 36 24 50 24C64 24 74 30 74 44L72 50C68 46 62 44 50 44C38 44 32 46 28 50Z" fill="#292524" />
          {/* Boy Cap (Cute cap) */}
          <path d="M30 36C32 26 42 22 50 22C58 22 68 26 70 36Z" fill="#0284C7" />
          <path d="M30 36C40 38 60 38 76 34" stroke="#0369A1" strokeWidth="4" strokeLinecap="round" />
          {/* Face */}
          <circle cx="50" cy="52" r="22" fill="#FED7AA" />
          {/* Eyes */}
          <circle cx="43" cy="52" r="3" fill="#1C1917" />
          <circle cx="57" cy="52" r="3" fill="#1C1917" />
          <circle cx="42" cy="51" r="1" fill="#FFFFFF" />
          <circle cx="56" cy="51" r="1" fill="#FFFFFF" />
          {/* Cheeks */}
          <circle cx="38" cy="56" r="3.5" fill="#FDA4AF" />
          <circle cx="62" cy="56" r="3.5" fill="#FDA4AF" />
          {/* Smile */}
          <path d="M46 58C48 61 52 61 54 58" stroke="#78350F" strokeWidth="2" strokeLinecap="round" fill="none" />
          {/* Shirt */}
          <path d="M28 88C32 74 42 70 50 70C58 70 68 74 72 88Z" fill="#0284C7" />
          <rect x="47" y="70" width="6" height="12" fill="#38BDF8" />
        </g>
      )}
    </svg>
  );
};
