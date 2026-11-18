import React from 'react';
import { useLocation } from 'wouter';
import { Cpu, ArrowLeft, ShieldAlert } from 'lucide-react';
import { GlassCard } from '../../../design-system/primitives/GlassCard';
import { Button } from '../../../design-system/primitives/Button';

export const CDSSAnalysisView: React.FC = () => {
  const [, setLocation] = useLocation();

  return (
    <div className="p-4 space-y-4">
      <div className="flex items-center gap-2">
        <button
          onClick={() => setLocation('/doctor/worklist')}
          className="p-1 rounded-lg text-slate-500 hover:bg-slate-100"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div>
          <h2 className="text-sm font-bold text-slate-900">Analisis Telemetri CDSS (Gilang Ramadhan)</h2>
          <span className="text-[10px] text-teal-800 font-bold bg-teal-50 px-2 py-0.5 rounded border border-teal-200">
            Model: LightGBM Champion v1.0 (ONNX Runtime Web)
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Telemetry Scores */}
        <GlassCard className="p-4 space-y-3 border-slate-200">
          <div className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
            <Cpu className="w-4 h-4 text-teal-700" /> Hasil Pengujian 3 Aksis Kognitif
          </div>

          <div className="space-y-2 text-xs">
            <div className="flex justify-between py-1 border-b border-slate-100">
              <span className="text-slate-500">Latensi Motorik (SRT)</span>
              <span className="font-bold text-rose-600">485 ms (Terlambat &gt;420 ms)</span>
            </div>
            <div className="flex justify-between py-1 border-b border-slate-100">
              <span className="text-slate-500">Akurasi Inhibisi (Go/No-Go)</span>
              <span className="font-bold text-amber-600">65% (Komisi 3x)</span>
            </div>
            <div className="flex justify-between py-1 border-b border-slate-100">
              <span className="text-slate-500">Working Memory Span</span>
              <span className="font-bold text-slate-800">2 Digit (Backward)</span>
            </div>
          </div>
        </GlassCard>

        {/* Diagnosis & Recommendations */}
        <GlassCard className="p-4 space-y-3 bg-rose-50/40 border-rose-200">
          <div className="text-xs font-bold text-rose-900 flex items-center gap-1.5">
            <ShieldAlert className="w-4 h-4 text-rose-600" />
            Kesimpulan CDSS: Disosiasi Somato-Kognitif
          </div>
          <p className="text-xs text-slate-700 leading-relaxed">
            Antropometri anak berada pada ambang batas gizi kurang ringan, namun uji latensi dan atensi menunjukkan gangguan signifikan yang konsisten dengan <strong>Latent Iron Deficiency (LID)</strong>.
          </p>

          <Button
            variant="primary"
            size="sm"
            fullWidth
            onClick={() => setLocation('/doctor/interventions')}
          >
            Lanjut ke Lembar Intervensi & Resep
          </Button>
        </GlassCard>
      </div>
    </div>
  );
};
