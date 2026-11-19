import React from 'react';
import { AlertTriangle, CheckCircle2, Users } from 'lucide-react';
import { soundSynth } from '../../../services/audio/synth';

interface DoctorKPIBarProps {
  totalPatients: number;
  tier1Count: number;
  tier2Count: number;
  normalCount: number;
  selectedFilter: 'all' | 'Tier-1' | 'Tier-2' | 'Normal';
  onSelectFilter: (filter: 'all' | 'Tier-1' | 'Tier-2' | 'Normal') => void;
}

export const DoctorKPIBar: React.FC<DoctorKPIBarProps> = ({
  totalPatients,
  tier1Count,
  tier2Count,
  normalCount,
  selectedFilter,
  onSelectFilter,
}) => {
  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 select-none">
      {/* CARD 1: TOTAL PASIEN */}
      <div
        onClick={() => {
          soundSynth.playPop();
          onSelectFilter('all');
        }}
        className={`bg-white rounded-2xl p-4 border transition-all cursor-pointer ${
          selectedFilter === 'all'
            ? 'border-[#34A853] ring-2 ring-[#34A853]/15 shadow-sm'
            : 'border-[#E5E5E5] hover:border-slate-300'
        }`}
      >
        <div className="flex items-center justify-between">
          <span className="text-[11px] font-extrabold text-slate-400 uppercase tracking-wider">
            Total Skrining
          </span>
          <div className="w-7 h-7 rounded-lg bg-slate-100 text-slate-600 flex items-center justify-center">
            <Users className="w-4 h-4" />
          </div>
        </div>
        <div className="text-2xl font-black text-slate-900 mt-1 tabular-nums">
          {totalPatients} <span className="text-xs font-bold text-slate-400">Balita</span>
        </div>
        <p className="text-[11px] text-slate-500 font-semibold mt-0.5">
          Posyandu Terban & Sekitarnya
        </p>
      </div>

      {/* CARD 2: KASUS KRITIS TIER-1 */}
      <div
        onClick={() => {
          soundSynth.playPop();
          onSelectFilter('Tier-1');
        }}
        className={`bg-white rounded-2xl p-4 border transition-all cursor-pointer ${
          selectedFilter === 'Tier-1'
            ? 'border-rose-500 ring-2 ring-rose-500/15 shadow-sm'
            : 'border-[#E5E5E5] hover:border-rose-200'
        }`}
      >
        <div className="flex items-center justify-between">
          <span className="text-[11px] font-extrabold text-rose-600 uppercase tracking-wider">
            Tier-1 Alert (Merah)
          </span>
          <span className="w-2 h-2 rounded-full bg-rose-500 animate-pulse" />
        </div>
        <div className="text-2xl font-black text-rose-600 mt-1 tabular-nums">
          {tier1Count} <span className="text-xs font-bold text-rose-400">Balita</span>
        </div>
        <p className="text-[11px] text-slate-500 font-semibold mt-0.5">
          Perlu konfirmasi lab & resep besi
        </p>
      </div>

      {/* CARD 3: TIER-2 ALERT (KUNING) */}
      <div
        onClick={() => {
          soundSynth.playPop();
          onSelectFilter('Tier-2');
        }}
        className={`bg-white rounded-2xl p-4 border transition-all cursor-pointer ${
          selectedFilter === 'Tier-2'
            ? 'border-amber-500 ring-2 ring-amber-500/15 shadow-sm'
            : 'border-[#E5E5E5] hover:border-amber-200'
        }`}
      >
        <div className="flex items-center justify-between">
          <span className="text-[11px] font-extrabold text-amber-600 uppercase tracking-wider">
            Tier-2 Alert (Kuning)
          </span>
          <div className="w-7 h-7 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center">
            <AlertTriangle className="w-4 h-4" />
          </div>
        </div>
        <div className="text-2xl font-black text-amber-600 mt-1 tabular-nums">
          {tier2Count} <span className="text-xs font-bold text-amber-400">Balita</span>
        </div>
        <p className="text-[11px] text-slate-500 font-semibold mt-0.5">
          Konseling PMBA & intervensi pangan
        </p>
      </div>

      {/* CARD 4: NORMAL (HIJAU) */}
      <div
        onClick={() => {
          soundSynth.playPop();
          onSelectFilter('Normal');
        }}
        className={`bg-white rounded-2xl p-4 border transition-all cursor-pointer ${
          selectedFilter === 'Normal'
            ? 'border-[#34A853] ring-2 ring-[#34A853]/15 shadow-sm'
            : 'border-[#E5E5E5] hover:border-emerald-200'
        }`}
      >
        <div className="flex items-center justify-between">
          <span className="text-[11px] font-extrabold text-[#2B8A44] uppercase tracking-wider">
            Tumbuh Optimal
          </span>
          <div className="w-7 h-7 rounded-lg bg-emerald-50 text-[#2B8A44] flex items-center justify-center">
            <CheckCircle2 className="w-4 h-4" />
          </div>
        </div>
        <div className="text-2xl font-black text-[#2B8A44] mt-1 tabular-nums">
          {normalCount} <span className="text-xs font-bold text-emerald-400">Balita</span>
        </div>
        <p className="text-[11px] text-slate-500 font-semibold mt-0.5">
          Pemantauan berkala Posyandu
        </p>
      </div>
    </div>
  );
};
