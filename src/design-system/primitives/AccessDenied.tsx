import React from 'react';
import { Lock, ArrowLeft } from 'lucide-react';
import { Button } from './Button';

export interface AccessDeniedProps {
  title?: string;
  message?: string;
  onBack?: () => void;
  actionLabel?: string;
}

export const AccessDenied: React.FC<AccessDeniedProps> = ({
  title = 'Akses Terlindungi',
  message = 'Halaman ini dikhususkan untuk peran tertentu guna menjaga privasi dan keamanan data anak.',
  onBack,
  actionLabel = 'Kembali ke Beranda',
}) => {
  return (
    <div className="min-h-[360px] flex flex-col items-center justify-center p-6 text-center max-w-sm mx-auto">
      {/* Friendly Padlock with Leaf Aura */}
      <div className="w-16 h-16 rounded-full bg-emerald-50 border-2 border-emerald-100 flex items-center justify-center text-nutri-teal-700 mb-4 shadow-sm">
        <Lock className="w-7 h-7" />
      </div>

      <h2 className="text-lg font-bold text-slate-900 mb-1.5">{title}</h2>
      <p className="text-xs text-slate-600 leading-relaxed mb-6">{message}</p>

      {onBack && (
        <Button
          variant="secondary"
          size="sm"
          onClick={onBack}
          icon={<ArrowLeft className="w-4 h-4" />}
        >
          {actionLabel}
        </Button>
      )}
    </div>
  );
};
