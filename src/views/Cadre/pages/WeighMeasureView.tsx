import React, { useState } from 'react';
import { Scale, CheckCircle2 } from 'lucide-react';
import { GlassCard } from '../../../design-system/primitives/GlassCard';
import { Button } from '../../../design-system/primitives/Button';
import { TextField } from '../../../design-system/primitives/TextField';

export const WeighMeasureView: React.FC = () => {
  const [weight, setWeight] = useState('10.5');
  const [height, setHeight] = useState('84.0');
  const [muac, setMuac] = useState('12.2');
  const [isSaved, setIsSaved] = useState(false);

  const numMuac = parseFloat(muac) || 0;
  const isRed = numMuac < 11.5;
  const isYellow = numMuac >= 11.5 && numMuac <= 12.5;

  const handleSave = () => {
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 2500);
  };

  return (
    <div className="p-4 space-y-4">
      <div className="flex items-center gap-2">
        <Scale className="w-5 h-5 text-teal-700" />
        <h2 className="text-sm font-bold text-slate-900">Pencatatan Antropometri</h2>
      </div>

      <GlassCard className="p-4 space-y-3.5 border-slate-200">
        <TextField
          label="Berat Badan (kg)"
          type="number"
          step="0.1"
          value={weight}
          onChange={(e) => setWeight(e.target.value)}
        />

        <TextField
          label="Tinggi Badan (cm)"
          type="number"
          step="0.5"
          value={height}
          onChange={(e) => setHeight(e.target.value)}
        />

        <div className="space-y-1">
          <TextField
            label="Lingkar Lengan Atas / LiLA (cm)"
            type="number"
            step="0.1"
            value={muac}
            onChange={(e) => setMuac(e.target.value)}
          />
          
          {/* Dynamic LiLA Indicator */}
          <div className="mt-2 p-2 rounded-xl text-xs flex items-center justify-between font-bold border transition-all">
            <span>Status Pita LiLA:</span>
            {isRed ? (
              <span className="text-rose-700 bg-rose-50 px-2 py-0.5 rounded border border-rose-300">
                🔴 Merah (&lt;11.5 cm) - Waspada Gizi Kurang
              </span>
            ) : isYellow ? (
              <span className="text-amber-800 bg-amber-50 px-2 py-0.5 rounded border border-amber-300">
                🟡 Kuning (11.5 - 12.5 cm) - Risiko Defisiensi Fe
              </span>
            ) : (
              <span className="text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-300">
                🟢 Hijau (&gt;12.5 cm) - Normal
              </span>
            )}
          </div>
        </div>

        <Button
          variant="primary"
          size="md"
          fullWidth
          onClick={handleSave}
          icon={isSaved ? <CheckCircle2 className="w-4 h-4" /> : undefined}
        >
          {isSaved ? 'Berhasil Disimpan' : 'Simpan Pengukuran'}
        </Button>
      </GlassCard>
    </div>
  );
};
