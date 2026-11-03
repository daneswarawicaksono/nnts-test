import React from 'react';
import { AlertTriangle, RefreshCw } from 'lucide-react';
import { Button } from './Button';

export interface ErrorStateProps {
  title?: string;
  message?: string;
  onRetry?: () => void;
  className?: string;
}

export const ErrorState: React.FC<ErrorStateProps> = ({
  title = 'Gagal Memuat Data',
  message = 'Terjadi kendala saat menyambungkan ke server. Silakan periksa jaringan Anda dan coba lagi.',
  onRetry,
  className = '',
}) => {
  return (
    <div
      className={`flex flex-col items-center justify-center p-6 text-center max-w-sm mx-auto ${className}`}
    >
      <div className="w-14 h-14 rounded-full bg-red-100 text-red-600 flex items-center justify-center mb-3">
        <AlertTriangle className="w-7 h-7" />
      </div>
      <h3 className="text-base font-bold text-slate-900 mb-1">{title}</h3>
      <p className="text-xs text-slate-500 leading-relaxed mb-4">{message}</p>
      {onRetry && (
        <Button variant="secondary" size="sm" onClick={onRetry} icon={<RefreshCw className="w-4 h-4" />}>
          Coba Lagi
        </Button>
      )}
    </div>
  );
};
