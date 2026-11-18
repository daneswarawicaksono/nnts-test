import React from 'react';
import { LineChart, CheckCircle2 } from 'lucide-react';
import { GlassCard } from '../../../design-system/primitives/GlassCard';

export const KMSDigitalView: React.FC = () => {
  return (
    <div className="p-4 space-y-4">
      <div className="flex items-center gap-2">
        <LineChart className="w-5 h-5 text-teal-700" />
        <h2 className="text-sm font-bold text-slate-900">Kurva Pertumbuhan (KMS Digital)</h2>
      </div>

      <GlassCard className="p-4 border-slate-200 space-y-3">
        <div className="flex justify-between items-center text-xs">
          <span className="font-bold text-slate-800">Status Gizi Berat Menurut Usia (BB/U):</span>
          <span className="font-extrabold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
            Pita Hijau (Gizi Baik)
          </span>
        </div>

        <div className="h-44 w-full bg-slate-50 rounded-2xl border border-dashed border-slate-300 flex items-center justify-center text-xs text-slate-400">
          [Grafik Kurva Z-Score WHO Anthro 2006 Terverifikasi]
        </div>

        <div className="text-[11px] text-slate-600 flex items-center gap-1.5 bg-teal-50/60 p-2.5 rounded-xl border border-teal-100">
          <CheckCircle2 className="w-4 h-4 text-teal-700 shrink-0" />
          Pertumbuhan Ananda selalu naik mengikuti garis pita hijau standar Kemenkes RI.
        </div>
      </GlassCard>
    </div>
  );
};
