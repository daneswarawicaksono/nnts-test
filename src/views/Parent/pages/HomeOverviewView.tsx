import React from 'react';
import { Star, HeartHandshake } from 'lucide-react';
import { GlassCard } from '../../../design-system/primitives/GlassCard';

export const HomeOverviewView: React.FC = () => {
  return (
    <div className="p-4 space-y-4">
      {/* Hero Welcome */}
      <div className="p-4 rounded-3xl bg-gradient-to-br from-teal-700 to-emerald-800 text-white space-y-2">
        <span className="text-[10px] font-extrabold uppercase tracking-wider bg-white/20 px-2 py-0.5 rounded-full">
          Rapor Gizi Cilik
        </span>
        <h2 className="text-lg font-extrabold">Ananda Anisa (36 Bulan)</h2>
        <p className="text-xs text-teal-100">
          Tumbuh sehat dan ceria bersama pemantauan gizi Posyandu Melati.
        </p>
      </div>

      {/* 3 Stars Trophy */}
      <GlassCard className="p-4 border-slate-200 space-y-3">
        <div className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
          <HeartHandshake className="w-4 h-4 text-teal-700" />
          Pencapaian Bintang Petualangan
        </div>

        <div className="grid grid-cols-3 gap-2 text-center">
          <div className="p-2.5 rounded-2xl bg-amber-50 border border-amber-200 flex flex-col items-center">
            <Star className="w-5 h-5 text-amber-500 fill-amber-400" />
            <span className="text-[10px] font-bold text-slate-800 mt-1">Bintang Fisik</span>
            <span className="text-[9px] text-emerald-700 font-extrabold">Normal</span>
          </div>

          <div className="p-2.5 rounded-2xl bg-amber-50 border border-amber-200 flex flex-col items-center">
            <Star className="w-5 h-5 text-amber-500 fill-amber-400" />
            <span className="text-[10px] font-bold text-slate-800 mt-1">Refleks Balon</span>
            <span className="text-[9px] text-emerald-700 font-extrabold">Tangkas</span>
          </div>

          <div className="p-2.5 rounded-2xl bg-amber-50 border border-amber-200 flex flex-col items-center">
            <Star className="w-5 h-5 text-amber-500 fill-amber-400" />
            <span className="text-[10px] font-bold text-slate-800 mt-1">Fokus Buah</span>
            <span className="text-[9px] text-emerald-700 font-extrabold">Hebat</span>
          </div>
        </div>
      </GlassCard>
    </div>
  );
};
