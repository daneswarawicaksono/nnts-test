import React from 'react';
import { Search, ChevronRight, Check } from 'lucide-react';
import { soundSynth } from '../../../services/audio/synth';
import type { ClinicalPatient } from '../DoctorDashboard';

interface DoctorPatientTableProps {
  patients: ClinicalPatient[];
  selectedPatientId: string;
  onSelectPatient: (patient: ClinicalPatient) => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  selectedFilter: 'all' | 'Tier-1' | 'Tier-2' | 'Normal';
  onFilterChange: (filter: 'all' | 'Tier-1' | 'Tier-2' | 'Normal') => void;
}

export const DoctorPatientTable: React.FC<DoctorPatientTableProps> = ({
  patients,
  selectedPatientId,
  onSelectPatient,
  searchQuery,
  onSearchChange,
  selectedFilter,
  onFilterChange,
}) => {
  return (
    <div className="bg-white rounded-2xl border border-[#E5E5E5] flex flex-col h-full shadow-xs overflow-hidden select-none">
      {/* Table Controls (Search & Quick Filter Tabs) */}
      <div className="p-3.5 border-b border-[#E5E5E5] space-y-2.5 bg-slate-50/60 shrink-0">
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2.5">
          {/* Search Box */}
          <div className="relative flex-1">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Cari nama balita, ID rekam medis, atau posyandu..."
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-[#E5E5E5] bg-white focus:outline-none focus:ring-2 focus:ring-[#34A853] font-sans"
            />
          </div>

          {/* Filter Pills */}
          <div className="flex items-center gap-1 overflow-x-auto pb-0.5 sm:pb-0">
            <button
              type="button"
              onClick={() => {
                soundSynth.playPop();
                onFilterChange('all');
              }}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all shrink-0 ${
                selectedFilter === 'all'
                  ? 'bg-slate-900 text-white'
                  : 'bg-white border border-[#E5E5E5] text-slate-600 hover:bg-slate-50'
              }`}
            >
              Semua ({patients.length})
            </button>
            <button
              type="button"
              onClick={() => {
                soundSynth.playPop();
                onFilterChange('Tier-1');
              }}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all shrink-0 ${
                selectedFilter === 'Tier-1'
                  ? 'bg-rose-600 text-white'
                  : 'bg-white border border-[#E5E5E5] text-rose-700 hover:bg-rose-50'
              }`}
            >
              Tier-1 (Kritis)
            </button>
            <button
              type="button"
              onClick={() => {
                soundSynth.playPop();
                onFilterChange('Tier-2');
              }}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all shrink-0 ${
                selectedFilter === 'Tier-2'
                  ? 'bg-amber-500 text-white'
                  : 'bg-white border border-[#E5E5E5] text-amber-700 hover:bg-amber-50'
              }`}
            >
              Tier-2 (Waspada)
            </button>
            <button
              type="button"
              onClick={() => {
                soundSynth.playPop();
                onFilterChange('Normal');
              }}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all shrink-0 ${
                selectedFilter === 'Normal'
                  ? 'bg-[#34A853] text-white'
                  : 'bg-white border border-[#E5E5E5] text-[#2B8A44] hover:bg-emerald-50'
              }`}
            >
              Normal
            </button>
          </div>
        </div>
      </div>

      {/* Tabular Patient List */}
      <div className="flex-1 overflow-y-auto divide-y divide-slate-100">
        {patients.length === 0 ? (
          <div className="p-8 text-center text-xs text-slate-400">
            Tidak ada data balita yang cocok dengan kriteria pencarian.
          </div>
        ) : (
          patients.map((p) => {
            const isSelected = p.id === selectedPatientId;
            const isTier1 = p.tier.includes('Tier-1');
            const isTier2 = p.tier.includes('Tier-2');

            return (
              <div
                key={p.id}
                onClick={() => {
                  soundSynth.playPop();
                  onSelectPatient(p);
                }}
                className={`p-3.5 sm:px-4 cursor-pointer transition-all flex items-center justify-between gap-3 relative ${
                  isSelected
                    ? 'bg-emerald-50/70'
                    : 'bg-white hover:bg-slate-50/80'
                }`}
              >
                {/* Left Active Line Indicator */}
                {isSelected && (
                  <span
                    className={`absolute left-0 top-0 bottom-0 w-1 ${
                      isTier1 ? 'bg-rose-500' : isTier2 ? 'bg-amber-500' : 'bg-[#34A853]'
                    }`}
                  />
                )}

                {/* Patient Primary Info */}
                <div className="flex items-center gap-3 min-w-0 flex-1">
                  <div
                    className={`w-9 h-9 rounded-xl flex items-center justify-center font-black text-xs shrink-0 ${
                      isTier1
                        ? 'bg-rose-100 text-rose-800'
                        : isTier2
                        ? 'bg-amber-100 text-amber-800'
                        : 'bg-emerald-100 text-emerald-800'
                    }`}
                  >
                    {p.gender === 'L' ? '👦' : '👧'}
                  </div>

                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-black text-slate-900 truncate">
                        {p.childName}
                      </span>
                      <span className="text-[10px] font-bold text-slate-400">
                        {p.id}
                      </span>
                    </div>
                    <div className="text-[11px] text-slate-500 font-semibold truncate mt-0.5">
                      {p.ageMonths} bln • {p.posyandu} ({p.rw})
                    </div>
                  </div>
                </div>

                {/* Scannable Metric Chips (Quicken Style) */}
                <div className="hidden sm:flex items-center gap-4 text-xs tabular-nums text-slate-700 shrink-0">
                  <div className="text-right">
                    <span className="text-[10px] font-bold text-slate-400 block leading-none mb-0.5">
                      Latensi (Fe)
                    </span>
                    <span className={`font-black ${p.latencyMs > 480 ? 'text-rose-600' : 'text-slate-800'}`}>
                      {p.latencyMs} ms
                    </span>
                  </div>

                  <div className="text-right">
                    <span className="text-[10px] font-bold text-slate-400 block leading-none mb-0.5">
                      Akurasi (Zn)
                    </span>
                    <span className={`font-black ${p.accuracyRate < 70 ? 'text-amber-600' : 'text-slate-800'}`}>
                      {p.accuracyRate}%
                    </span>
                  </div>

                  <div className="text-right">
                    <span className="text-[10px] font-bold text-slate-400 block leading-none mb-0.5">
                      LiLA
                    </span>
                    <span className={`font-black ${p.muacCm < 11.5 ? 'text-rose-600' : 'text-slate-800'}`}>
                      {p.muacCm} cm
                    </span>
                  </div>
                </div>

                {/* Status Pill & Action */}
                <div className="flex items-center gap-2 shrink-0">
                  <span
                    className={`text-[10px] font-black px-2.5 py-1 rounded-full whitespace-nowrap ${
                      isTier1
                        ? 'bg-rose-100 text-rose-800 border border-rose-200'
                        : isTier2
                        ? 'bg-amber-100 text-amber-800 border border-amber-200'
                        : 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                    }`}
                  >
                    {isTier1 ? 'Tier-1 Kritis' : isTier2 ? 'Tier-2 Waspada' : 'Normal'}
                  </span>

                  {p.interventionSaved ? (
                    <span className="w-6 h-6 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center text-xs" title="Intervensi tersimpan">
                      <Check className="w-3.5 h-3.5 stroke-[3]" />
                    </span>
                  ) : (
                    <ChevronRight className="w-4 h-4 text-slate-400" />
                  )}
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
