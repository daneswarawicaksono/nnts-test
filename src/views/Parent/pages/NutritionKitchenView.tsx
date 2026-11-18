import React from 'react';
import { Utensils } from 'lucide-react';
import { GlassCard } from '../../../design-system/primitives/GlassCard';

export const NutritionKitchenView: React.FC = () => {
  return (
    <div className="p-4 space-y-4">
      <div className="flex items-center gap-2">
        <Utensils className="w-5 h-5 text-teal-700" />
        <h2 className="text-sm font-bold text-slate-900">Dapur Gizi Sehat (Kaya Zat Besi & Seng)</h2>
      </div>

      <div className="space-y-3">
        <GlassCard className="p-3.5 border-slate-200 space-y-2">
          <div className="flex items-center gap-2">
            <span className="text-lg">🍲</span>
            <div>
              <h3 className="text-xs font-bold text-slate-900">Bubur Hati Ayam & Bayam Merah</h3>
              <span className="text-[10px] text-teal-800 font-extrabold bg-teal-50 px-1.5 py-0.5 rounded border border-teal-200">
                Tinggi Zat Besi Heme
              </span>
            </div>
          </div>
          <p className="text-[11px] text-slate-600">
            Kombinasi hati ayam dan sayuran hijau lokal yang mudah diserap tubuh untuk mencegah anemia laten.
          </p>
        </GlassCard>

        <GlassCard className="p-3.5 border-slate-200 space-y-2">
          <div className="flex items-center gap-2">
            <span className="text-lg">🍳</span>
            <div>
              <h3 className="text-xs font-bold text-slate-900">Perkedel Tahu Telur Puyuh</h3>
              <span className="text-[10px] text-amber-800 font-extrabold bg-amber-50 px-1.5 py-0.5 rounded border border-amber-200">
                Kaya Seng & Protein
              </span>
            </div>
          </div>
          <p className="text-[11px] text-slate-600">
            Camilan padat gizi yang mendukung pertumbuhan sel otak dan ketangkasan motorik balita.
          </p>
        </GlassCard>
      </div>
    </div>
  );
};
