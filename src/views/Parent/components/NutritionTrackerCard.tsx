import React from 'react';
import { AlertCircle, Sparkles } from 'lucide-react';

interface NutrientBarProps {
  label: string;
  current: number;
  target: number;
  unit: string;
  color: string;
  badgeText: string;
  status: 'optimal' | 'warning' | 'done';
}

const NutrientBar: React.FC<NutrientBarProps> = ({
  label,
  current,
  target,
  unit,
  color,
  badgeText,
  status,
}) => {
  const percent = Math.min(100, Math.round((current / target) * 100));

  return (
    <div className="space-y-1.5">
      <div className="flex items-center justify-between text-xs">
        <div className="flex items-center gap-1.5">
          <span className="font-extrabold text-slate-900">{label}</span>
          <span className="text-[10px] text-slate-500 font-medium">
            ({current} / {target} {unit})
          </span>
        </div>
        <div className="flex items-center gap-1.5">
          <span
            className={`text-[10px] font-black px-2 py-0.5 rounded-full ${
              status === 'done'
                ? 'bg-emerald-100 text-emerald-800'
                : status === 'optimal'
                ? 'bg-emerald-50 text-[#2B8A44]'
                : 'bg-amber-50 text-amber-700'
            }`}
          >
            {badgeText}
          </span>
          <span className="font-black text-slate-800 text-xs w-8 text-right">
            {percent}%
          </span>
        </div>
      </div>

      {/* Progress Bar Container */}
      <div className="w-full h-3 rounded-full bg-slate-100 overflow-hidden relative">
        <div
          className={`h-full rounded-full transition-all duration-700 ease-out ${color}`}
          style={{ width: `${percent}%` }}
        />
      </div>
    </div>
  );
};

interface NutritionTrackerCardProps {
  bonusIntake: boolean; // True if extra meals were checked in checklist
}

export const NutritionTrackerCard: React.FC<NutritionTrackerCardProps> = ({
  bonusIntake,
}) => {
  // If user checked extra meals, values adjust upwards
  const feVal = bonusIntake ? 9.0 : 7.2;
  const znVal = bonusIntake ? 2.9 : 2.1;
  const b12Val = 0.9;
  const proteinVal = bonusIntake ? 20 : 17;
  const kaloriVal = bonusIntake ? 1100 : 920;

  return (
    <div className="bg-white rounded-3xl border border-[#E5E5E5] p-5 shadow-sm space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <span className="text-[11px] font-extrabold text-[#34A853] uppercase tracking-wider">
            Target Asupan Harian
          </span>
          <h3 className="text-base font-extrabold text-slate-900 mt-0.5">
            Kebutuhan Mikronutrien Anak
          </h3>
        </div>
        <div className="flex items-center gap-1 text-xs font-black text-[#2B8A44] bg-emerald-50 border border-emerald-200 px-2.5 py-1 rounded-full">
          <Sparkles className="w-3.5 h-3.5 text-amber-500 fill-amber-400" />
          <span>{bonusIntake ? '98% Tercapai' : '78% Tercapai'}</span>
        </div>
      </div>

      <p className="text-xs text-slate-600 leading-snug">
        Kombinasi mikronutrien penting pencegah <em>hidden hunger</em> dan risiko stunting pada balita usia 24–59 bulan.
      </p>

      {/* Bars List */}
      <div className="space-y-3.5 pt-1">
        {/* Zat Besi (Fe) */}
        <NutrientBar
          label="Zat Besi (Fe)"
          current={feVal}
          target={9.0}
          unit="mg"
          color="bg-[#34A853]"
          badgeText={feVal >= 9.0 ? 'Lengkap' : 'Perlu +1 Porsi'}
          status={feVal >= 9.0 ? 'done' : 'warning'}
        />

        {/* Seng (Zn) */}
        <NutrientBar
          label="Seng / Zinc (Zn)"
          current={znVal}
          target={3.0}
          unit="mg"
          color="bg-amber-400"
          badgeText={znVal >= 2.8 ? 'Optimal' : 'Cukup'}
          status={znVal >= 2.8 ? 'optimal' : 'warning'}
        />

        {/* Vitamin B12 */}
        <NutrientBar
          label="Vitamin B12"
          current={b12Val}
          target={0.9}
          unit="mcg"
          color="bg-[#4285F4]"
          badgeText="100% Lengkap"
          status="done"
        />

        {/* Protein Hewani & Nabati */}
        <NutrientBar
          label="Protein Total"
          current={proteinVal}
          target={20}
          unit="g"
          color="bg-emerald-500"
          badgeText={proteinVal >= 20 ? 'Optimal' : '85% Tercapai'}
          status={proteinVal >= 20 ? 'done' : 'optimal'}
        />

        {/* Energi / Kalori */}
        <NutrientBar
          label="Kalori Harian"
          current={kaloriVal}
          target={1125}
          unit="kkal"
          color="bg-orange-400"
          badgeText={kaloriVal >= 1100 ? 'Memadai' : 'Kurang Sedikit'}
          status={kaloriVal >= 1100 ? 'optimal' : 'warning'}
        />
      </div>

      {/* Clinical Guidance Tip */}
      <div className="p-3 bg-amber-50/80 rounded-2xl border border-amber-200/80 flex items-start gap-2.5 text-xs text-amber-900">
        <AlertCircle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
        <p className="leading-snug">
          <strong>Rekomendasi Ahli Gizi:</strong> Penyerapan Zat Besi (Fe) meningkat hingga 2x lipat bila disajikan bersama makanan kaya Vitamin C (jeruk, tomat, mangga).
        </p>
      </div>
    </div>
  );
};
