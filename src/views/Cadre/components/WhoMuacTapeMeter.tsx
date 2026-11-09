import React from 'react';
import { AlertTriangle, CheckCircle2, Minus, Plus } from 'lucide-react';

export interface WhoMuacTapeMeterProps {
  value: number; // in cm (e.g. 12.2)
  onChange: (newValue: number) => void;
  className?: string;
}

export const WhoMuacTapeMeter: React.FC<WhoMuacTapeMeterProps> = ({
  value,
  onChange,
  className = '',
}) => {
  // Clamped range for toddler MUAC: 9.0cm to 17.0cm
  const minCm = 9.0;
  const maxCm = 17.0;
  const clamped = Math.max(minCm, Math.min(maxCm, value));

  // Percentage position across the tape width (0% to 100%)
  const percentage = ((clamped - minCm) / (maxCm - minCm)) * 100;

  // WHO Clinical Classification
  const isRed = value < 11.5;
  const isYellow = value >= 11.5 && value <= 12.5;

  const handleStep = (delta: number) => {
    const next = Math.round((clamped + delta) * 10) / 10;
    if (next >= 8.0 && next <= 25.0) {
      onChange(next);
    }
  };

  return (
    <div className={`space-y-3 bg-white p-3.5 rounded-2xl border border-slate-200 shadow-xs ${className}`}>
      {/* Tape Readout Header */}
      <div className="flex items-center justify-between">
        <div>
          <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">
            Pita Antropometri LiLA (WHO)
          </span>
          <div className="flex items-baseline gap-1 mt-0.5">
            <span className="text-2xl font-black font-mono text-slate-900 tabular-nums">
              {value.toFixed(1)}
            </span>
            <span className="text-xs font-bold text-slate-500">cm</span>
          </div>
        </div>

        {/* Rapid Thumb Steppers (>=44x44px touch target) */}
        <div className="flex items-center gap-1.5">
          <button
            type="button"
            onClick={() => handleStep(-0.1)}
            className="w-11 h-11 rounded-xl bg-slate-100 hover:bg-slate-200 active:scale-95 text-slate-700 font-black flex items-center justify-center transition-all cursor-pointer min-h-[44px] min-w-[44px]"
            title="Kurangi 0.1 cm"
            aria-label="Kurangi LiLA 0.1 cm"
          >
            <Minus className="w-4 h-4 stroke-[3]" />
          </button>
          <button
            type="button"
            onClick={() => handleStep(0.1)}
            className="w-11 h-11 rounded-xl bg-slate-100 hover:bg-slate-200 active:scale-95 text-slate-700 font-black flex items-center justify-center transition-all cursor-pointer min-h-[44px] min-w-[44px]"
            title="Tambah 0.1 cm"
            aria-label="Tambah LiLA 0.1 cm"
          >
            <Plus className="w-4 h-4 stroke-[3]" />
          </button>
        </div>
      </div>

      {/* Visual LiLA Tape Graphic */}
      <div className="relative pt-3 pb-1">
        {/* Pointer Needle */}
        <div
          className="absolute -top-1 transition-all duration-150 ease-out z-10 flex flex-col items-center -translate-x-1/2 pointer-events-none"
          style={{ left: `${percentage}%` }}
        >
          <span className="text-[9px] font-mono font-bold px-1.5 py-0.5 rounded bg-slate-900 text-white shadow-xs">
            {value.toFixed(1)}
          </span>
          <div className="w-0 h-0 border-l-[4px] border-l-transparent border-r-[4px] border-r-transparent border-t-[5px] border-t-slate-900" />
        </div>

        {/* 3 Color Zones Band */}
        <div className="w-full h-5 rounded-lg overflow-hidden flex border border-slate-300 shadow-inner relative">
          {/* Red Zone: 9.0 to 11.5 (2.5 / 8 = 31.25%) */}
          <div
            className="h-full bg-rose-600 flex items-center justify-center text-[9px] font-bold text-white tracking-wider"
            style={{ width: '31.25%' }}
            title="Zona Merah: <11.5 cm (Wasting Akut)"
          >
            &lt;11.5
          </div>
          {/* Yellow Zone: 11.5 to 12.5 (1.0 / 8 = 12.5%) */}
          <div
            className="h-full bg-amber-400 flex items-center justify-center text-[9px] font-bold text-amber-950 tracking-wider"
            style={{ width: '12.5%' }}
            title="Zona Kuning: 11.5 - 12.5 cm (Waspada)"
          >
            11.5-12.5
          </div>
          {/* Green Zone: 12.5 to 17.0 (4.5 / 8 = 56.25%) */}
          <div
            className="h-full bg-emerald-600 flex items-center justify-center text-[9px] font-bold text-white tracking-wider"
            style={{ width: '56.25%' }}
            title="Zona Hijau: ≥12.5 cm (Normal)"
          >
            &gt;12.5 NORMAL
          </div>
        </div>

        {/* Scale Ticks */}
        <div className="flex justify-between text-[9px] font-mono text-slate-400 px-0.5 pt-1">
          <span>9.0 cm</span>
          <span>11.5 cm</span>
          <span>12.5 cm</span>
          <span>17.0 cm</span>
        </div>
      </div>

      {/* Status Verdict Banner (Clean SVG & Accessible contrast) */}
      <div
        className={`p-2.5 rounded-xl border flex items-center gap-2.5 text-xs font-bold transition-colors ${
          isRed
            ? 'bg-rose-50 border-rose-200 text-rose-900'
            : isYellow
            ? 'bg-amber-50 border-amber-200 text-amber-900'
            : 'bg-emerald-50 border-emerald-200 text-emerald-900'
        }`}
      >
        {isRed ? (
          <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0" />
        ) : isYellow ? (
          <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0" />
        ) : (
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
        )}
        <div className="flex-1 leading-snug">
          <span className="font-extrabold block">
            {isRed
              ? 'Pita Merah : Indikasi Gizi Buruk Akut (Wasting)'
              : isYellow
              ? 'Pita Kuning : Waspada Risiko Defisiensi Zat Besi'
              : 'Pita Hijau : Status Gizi Otot & Lemak Optimal'}
          </span>
          <span className="text-[11px] font-normal text-slate-600 block mt-0.5">
            {isRed
              ? 'Rekomendasi: Rujuk segera ke Puskesmas untuk evaluasi dokter dan terapi F-75/F-100.'
              : isYellow
              ? 'Rekomendasi: Beri konseling PMT kaya hewani (hati ayam, telur) dan pantau 2 pekan.'
              : 'Rekomendasi: Lanjutkan pola asuh gizi seimbang dan imunisasi rutin.'}
          </span>
        </div>
      </div>
    </div>
  );
};
