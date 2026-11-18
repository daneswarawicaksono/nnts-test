import React from 'react';
import { RefreshCw, ShieldCheck } from 'lucide-react';
import { GlassCard } from '../../../design-system/primitives/GlassCard';
import { Button } from '../../../design-system/primitives/Button';

export const RecapView: React.FC = () => {
  return (
    <div className="p-4 space-y-4">
      <h2 className="text-sm font-bold text-slate-900">Rekapitulasi Layanan Posyandu</h2>

      <div className="grid grid-cols-2 gap-3">
        <GlassCard className="p-3 bg-emerald-50/50 border-emerald-200">
          <div className="text-[10px] text-slate-500 font-semibold">Total Pengukuran</div>
          <div className="text-xl font-extrabold text-emerald-800 mt-1">18 Anak</div>
        </GlassCard>

        <GlassCard className="p-3 bg-amber-50/50 border-amber-200">
          <div className="text-[10px] text-slate-500 font-semibold">Tersimpan di Vault</div>
          <div className="text-xl font-extrabold text-amber-800 mt-1">0 Pending</div>
        </GlassCard>
      </div>

      <GlassCard className="p-4 border-slate-200 space-y-3">
        <div className="flex items-center gap-2">
          <ShieldCheck className="w-5 h-5 text-teal-700" />
          <span className="text-xs font-bold text-slate-800">Status Sinkronisasi Vault</span>
        </div>
        <p className="text-xs text-slate-600 leading-relaxed">
          Semua telemetri balita dan pengukuran antropometri hari ini telah tersinkronisasi ke Cloud API Puskesmas.
        </p>
        <Button
          variant="secondary"
          size="sm"
          fullWidth
          icon={<RefreshCw className="w-3.5 h-3.5" />}
          onClick={() => alert('Semua data sudah up to date!')}
        >
          Sinkronkan Antrean Ulang
        </Button>
      </GlassCard>
    </div>
  );
};
