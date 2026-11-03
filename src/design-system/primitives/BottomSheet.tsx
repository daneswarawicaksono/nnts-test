import React, { useEffect } from 'react';
import { X } from 'lucide-react';

export interface BottomSheetProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
}

export const BottomSheet: React.FC<BottomSheetProps> = ({
  isOpen,
  onClose,
  title,
  children,
}) => {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) onClose();
    };
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center sm:items-center">
      {/* Backdrop */}
      <div
        onClick={onClose}
        className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs transition-opacity duration-normal"
        aria-hidden="true"
      />

      {/* Sheet Content Container */}
      <div
        className="relative z-10 w-full max-w-md bg-white rounded-t-xl sm:rounded-xl shadow-sheet p-5 pt-3 animate-in slide-in-from-bottom duration-normal ease-spring-smooth max-h-[85vh] flex flex-col"
        role="dialog"
        aria-modal="true"
      >
        {/* Pull Handle Bar */}
        <div className="w-12 h-1.5 bg-slate-200 rounded-pill mx-auto mb-3 shrink-0" />

        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-100 shrink-0">
          <h3 className="text-base font-bold text-slate-900">{title || ''}</h3>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-slate-100 text-slate-500 hover:text-slate-900 flex items-center justify-center transition-colors"
            aria-label="Tutup"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Scrollable Body */}
        <div className="py-4 overflow-y-auto overflow-x-hidden flex-1">{children}</div>
      </div>
    </div>
  );
};
