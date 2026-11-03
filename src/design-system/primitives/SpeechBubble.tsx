import React from 'react';
import { X } from 'lucide-react';

export interface SpeechBubbleProps {
  message: string;
  onDismiss?: () => void;
  className?: string;
}

export const SpeechBubble: React.FC<SpeechBubbleProps> = ({
  message,
  onDismiss,
  className = '',
}) => {
  return (
    <div className={`relative inline-block max-w-xs ${className}`}>
      {/* Bubble Container */}
      <div className="glass-card rounded-lg p-3 sm:p-3.5 shadow-card text-left relative z-10 border border-slate-200/90">
        <div className="flex items-start justify-between gap-2">
          <p className="text-xs sm:text-sm font-semibold text-slate-800 leading-snug">
            {message}
          </p>
          {onDismiss && (
            <button
              onClick={onDismiss}
              className="w-5 h-5 rounded-full text-slate-400 hover:text-slate-600 hover:bg-slate-100 flex items-center justify-center shrink-0 transition-colors"
              aria-label="Tutup pesan"
            >
              <X className="w-3 h-3" />
            </button>
          )}
        </div>
      </div>

      {/* Downward Pointer Triangle Tail */}
      <div
        className="w-3 h-3 bg-white border-b border-r border-slate-200/90 rotate-45 mx-auto -mt-1.5 relative z-0"
        aria-hidden="true"
      />
    </div>
  );
};
