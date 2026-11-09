import React from 'react';
import { Check } from 'lucide-react';

export interface AvatarOption {
  id: string;
  name: string;
  emoji: string;
  bgColor: string;
}

export const DEFAULT_AVATARS: AvatarOption[] = [
  { id: 'av-1', name: 'Tunas', emoji: '🌱', bgColor: 'bg-emerald-100' },
  { id: 'av-2', name: 'Jeruk', emoji: '🍊', bgColor: 'bg-orange-100' },
  { id: 'av-3', name: 'Apel', emoji: '🍎', bgColor: 'bg-rose-100' },
  { id: 'av-4', name: 'Bintang', emoji: '⭐', bgColor: 'bg-amber-100' },
  { id: 'av-5', name: 'Kelinci', emoji: '🐰', bgColor: 'bg-sky-100' },
  { id: 'av-6', name: 'Kucing', emoji: '🐱', bgColor: 'bg-purple-100' },
];

export interface AvatarPickerProps {
  selectedId: string;
  onSelect: (id: string) => void;
  options?: AvatarOption[];
}

export const AvatarPicker: React.FC<AvatarPickerProps> = ({
  selectedId,
  onSelect,
  options = DEFAULT_AVATARS,
}) => {
  return (
    <div className="w-full">
      <div className="grid grid-cols-3 gap-2.5 sm:grid-cols-6">
        {options.map((opt) => {
          const isSelected = selectedId === opt.id;
          return (
            <button
              key={opt.id}
              type="button"
              onClick={() => onSelect(opt.id)}
              className={`relative flex flex-col items-center justify-center p-2.5 rounded-lg border-2 transition-all duration-fast select-none ${
                opt.bgColor
              } ${
                isSelected
                  ? 'border-nutri-teal-700 shadow-sm scale-105'
                  : 'border-transparent hover:border-slate-200 opacity-80 hover:opacity-100'
              }`}
            >
              <span className="text-2xl mb-1">{opt.emoji}</span>
              <span className="text-xs font-semibold text-slate-800 whitespace-nowrap overflow-visible text-center">
                {opt.name}
              </span>

              {isSelected && (
                <div className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full bg-nutri-teal-700 text-white flex items-center justify-center shadow-xs">
                  <Check className="w-3 h-3 stroke-[3]" />
                </div>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
};
