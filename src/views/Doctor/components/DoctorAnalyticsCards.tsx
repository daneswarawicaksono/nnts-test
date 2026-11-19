import React from 'react';
import {
  AlertTriangle,
  AlertCircle,
  CheckCircle2,
  TrendingUp,
  FlaskConical,
  Pill,
} from 'lucide-react';
import { soundSynth } from '../../../services/audio/synth';

interface DoctorAnalyticsCardsProps {
  totalPatients: number;
  tier1Count: number;
  tier2Count: number;
  normalCount: number;
  selectedFilter: 'all' | 'Tier-1' | 'Tier-2' | 'Normal';
  onSelectFilter: (filter: 'all' | 'Tier-1' | 'Tier-2' | 'Normal') => void;
}

export const DoctorAnalyticsCards: React.FC<DoctorAnalyticsCardsProps> = ({
  totalPatients,
  tier1Count,
  tier2Count,
  normalCount,
  selectedFilter,
  onSelectFilter,
}) => {
  // Proportions for segmented bar
  const total = Math.max(1, totalPatients);
  const pTier1 = Math.round((tier1Count / total) * 100);
  const pTier2 = Math.round((tier2Count / total) * 100);
  const pNormal = 100 - pTier1 - pTier2;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
      {/* CARD 1: DISTRIBUSI TRIASE RISIKO BALITA */}
      <div className="bg-white rounded-2xl border border-[#E5E5E5] p-5 shadow-xs flex flex-col justify-between">
        <div>
          <div className="flex items-center justify-between mb-3">
            <div>
              <h2 className="text-sm font-black text-slate-900 tracking-tight">
                Distribusi Triase Risiko Balita
              </h2>
              <p className="text-[11px] text-slate-500 font-medium">
                Skrining telemetri kognitif & antropometri Posyandu
              </p>
            </div>
            <div className="text-right">
              <span className="text-xl font-black text-slate-900 tabular-nums">
                {totalPatients}
              </span>
              <span className="text-[10px] text-slate-400 font-bold block uppercase tracking-wider">
                Total Balita
              </span>
            </div>
          </div>

          {/* Segmented Visual Progress Bar (Quicken Style) */}
          <div className="w-full h-3 bg-slate-100 rounded-full overflow-hidden flex my-3">
            {tier1Count > 0 && (
              <div
                style={{ width: `${pTier1}%` }}
                className="bg-rose-500 h-full transition-all duration-500"
                title={`Tier-1: ${tier1Count} anak (${pTier1}%)`}
              />
            )}
            {tier2Count > 0 && (
              <div
                style={{ width: `${pTier2}%` }}
                className="bg-amber-400 h-full transition-all duration-500"
                title={`Tier-2: ${tier2Count} anak (${pTier2}%)`}
              />
            )}
            {normalCount > 0 && (
              <div
                style={{ width: `${Math.max(5, pNormal)}%` }}
                className="bg-[#34A853] h-full transition-all duration-500"
                title={`Normal: ${normalCount} anak (${pNormal}%)`}
              />
            )}
          </div>
        </div>

        {/* Clickable Legend Breakdown Pills */}
        <div className="grid grid-cols-3 gap-2 pt-2 border-t border-[#F0F0F0]">
          {/* Tier-1 Alert */}
          <button
            type="button"
            onClick={() => {
              soundSynth.playPop();
              onSelectFilter(selectedFilter === 'Tier-1' ? 'all' : 'Tier-1');
            }}
            className={`p-2 rounded-xl text-left transition-all border ${
              selectedFilter === 'Tier-1'
                ? 'bg-rose-50 border-rose-300 ring-1 ring-rose-300'
                : 'bg-slate-50/60 border-transparent hover:bg-rose-50/50 hover:border-rose-200'
            }`}
          >
            <div className="flex items-center gap-1.5 mb-0.5">
              <AlertCircle className="w-3.5 h-3.5 text-rose-600 shrink-0" />
              <span className="text-[11px] font-bold text-rose-800 truncate">
                Tier-1 Merah
              </span>
            </div>
            <div className="flex items-baseline gap-1.5">
              <span className="text-base font-black text-rose-700 tabular-nums">
                {tier1Count}
              </span>
              <span className="text-[10px] font-semibold text-rose-500">
                ({pTier1}%)
              </span>
            </div>
          </button>

          {/* Tier-2 Alert */}
          <button
            type="button"
            onClick={() => {
              soundSynth.playPop();
              onSelectFilter(selectedFilter === 'Tier-2' ? 'all' : 'Tier-2');
            }}
            className={`p-2 rounded-xl text-left transition-all border ${
              selectedFilter === 'Tier-2'
                ? 'bg-amber-50 border-amber-300 ring-1 ring-amber-300'
                : 'bg-slate-50/60 border-transparent hover:bg-amber-50/50 hover:border-amber-200'
            }`}
          >
            <div className="flex items-center gap-1.5 mb-0.5">
              <AlertTriangle className="w-3.5 h-3.5 text-amber-600 shrink-0" />
              <span className="text-[11px] font-bold text-amber-800 truncate">
                Tier-2 Kuning
              </span>
            </div>
            <div className="flex items-baseline gap-1.5">
              <span className="text-base font-black text-amber-700 tabular-nums">
                {tier2Count}
              </span>
              <span className="text-[10px] font-semibold text-amber-500">
                ({pTier2}%)
              </span>
            </div>
          </button>

          {/* Normal */}
          <button
            type="button"
            onClick={() => {
              soundSynth.playPop();
              onSelectFilter(selectedFilter === 'Normal' ? 'all' : 'Normal');
            }}
            className={`p-2 rounded-xl text-left transition-all border ${
              selectedFilter === 'Normal'
                ? 'bg-emerald-50 border-emerald-300 ring-1 ring-emerald-300'
                : 'bg-slate-50/60 border-transparent hover:bg-emerald-50/50 hover:border-emerald-200'
            }`}
          >
            <div className="flex items-center gap-1.5 mb-0.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
              <span className="text-[11px] font-bold text-emerald-800 truncate">
                Normal Hijau
              </span>
            </div>
            <div className="flex items-baseline gap-1.5">
              <span className="text-base font-black text-emerald-700 tabular-nums">
                {normalCount}
              </span>
              <span className="text-[10px] font-semibold text-emerald-500">
                ({pNormal}%)
              </span>
            </div>
          </button>
        </div>
      </div>

      {/* CARD 2: CAPAIAN INTERVENSI KLINIS & RUJUKAN LAB */}
      <div className="bg-white rounded-2xl border border-[#E5E5E5] p-5 shadow-xs flex flex-col justify-between">
        <div>
          <div className="flex items-center justify-between mb-3">
            <div>
              <h2 className="text-sm font-black text-slate-900 tracking-tight">
                Capaian Intervensi Klinis & Lab
              </h2>
              <p className="text-[11px] text-slate-500 font-medium">
                Penyelesaian resep & rujukan konfirmasi faskes
              </p>
            </div>
            <div className="flex items-center gap-1 text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
              <TrendingUp className="w-3 h-3 text-[#2B8A44]" />
              <span>Target Tercapai</span>
            </div>
          </div>

          {/* Metric Rows */}
          <div className="space-y-3 my-2">
            {/* Metric 1: Suplementasi */}
            <div>
              <div className="flex justify-between items-center text-xs mb-1">
                <span className="font-bold text-slate-700 flex items-center gap-1.5">
                  <Pill className="w-3.5 h-3.5 text-emerald-600" />
                  Penyelesaian Resep Suplementasi Fe/Zn
                </span>
                <span className="font-black text-slate-900 tabular-nums">85% (17/20)</span>
              </div>
              <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden">
                <div
                  className="bg-[#34A853] h-full rounded-full transition-all duration-500"
                  style={{ width: '85%' }}
                />
              </div>
            </div>

            {/* Metric 2: Rujukan Lab */}
            <div>
              <div className="flex justify-between items-center text-xs mb-1">
                <span className="font-bold text-slate-700 flex items-center gap-1.5">
                  <FlaskConical className="w-3.5 h-3.5 text-blue-600" />
                  Rujukan Lab Serum Ferritin & Darah
                </span>
                <span className="font-black text-slate-900 tabular-nums">67% (8/12)</span>
              </div>
              <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden">
                <div
                  className="bg-blue-500 h-full rounded-full transition-all duration-500"
                  style={{ width: '67%' }}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Alert Chip */}
        <div className="pt-2 border-t border-[#F0F0F0] flex items-center justify-between text-[11px]">
          <span className="text-slate-500 font-medium">
            Kasus butuh intervensi hari ini:
          </span>
          <span className="font-bold text-rose-700 bg-rose-50 px-2.5 py-0.5 rounded-full border border-rose-200">
            {tier1Count} Kasus Tier-1 Menunggu
          </span>
        </div>
      </div>
    </div>
  );
};
