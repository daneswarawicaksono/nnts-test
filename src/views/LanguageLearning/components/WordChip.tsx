import React from 'react';

export interface WordChipProps {
  word: string;
  onClick?: () => void;
  disabled?: boolean;
  isSlot?: boolean;
  className?: string;
}

export const WordChip: React.FC<WordChipProps> = ({
  word,
  onClick,
  disabled = false,
  isSlot = false,
  className = '',
}) => {
  // Empty dashed slot placeholder
  if (isSlot) {
    return (
      <div
        className={`h-11 min-w-[72px] px-3.5 rounded-xl border-2 border-dashed border-[#CECECE] bg-[#F8FAFC] flex items-center justify-center select-none ${className}`}
        aria-hidden="true"
      />
    );
  }

  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className={`
        h-11 min-w-[64px] px-4 rounded-xl font-bold font-child text-[15px] select-none
        transition-all duration-75 cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-[#1CB0F6]
        active:translate-y-[2px] active:border-b-2
        ${
          disabled
            ? 'bg-[#F1F5F9] text-[#CBD5E1] border-2 border-transparent shadow-none cursor-default opacity-50'
            : 'bg-white text-[#3C3C3C] border-2 border-[#E5E5E5] border-b-4 border-b-[#D4D4D8] hover:bg-slate-50 active:border-b-2'
        }
        ${className}
      `}
    >
      {word}
    </button>
  );
};
