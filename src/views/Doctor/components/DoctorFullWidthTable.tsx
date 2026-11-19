import React from 'react';
import {
  Search,
  Filter,
  ChevronRight,
  CheckCircle,
  AlertCircle,
  AlertTriangle,
} from 'lucide-react';
import { soundSynth } from '../../../services/audio/synth';
import type { ClinicalPatient } from '../DoctorDashboard';

interface DoctorFullWidthTableProps {
  patients: ClinicalPatient[];
  selectedPatientId: string;
  onSelectPatient: (patient: ClinicalPatient) => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  selectedFilter: 'all' | 'Tier-1' | 'Tier-2' | 'Normal';
  onFilterChange: (filter: 'all' | 'Tier-1' | 'Tier-2' | 'Normal') => void;
}

export const DoctorFullWidthTable: React.FC<DoctorFullWidthTableProps> = ({
  patients,
  selectedPatientId,
  onSelectPatient,
  searchQuery,
  onSearchChange,
  selectedFilter,
  onFilterChange,
}) => {
  const filterTabs: Array<{ id: 'all' | 'Tier-1' | 'Tier-2' | 'Normal'; label: string }> = [
    { id: 'all', label: 'Semua Pasien' },
    { id: 'Tier-1', label: 'Tier-1 Merah' },
    { id: 'Tier-2', label: 'Tier-2 Kuning' },
    { id: 'Normal', label: 'Normal Hijau' },
  ];

  return (
    <div className="bg-white rounded-2xl border border-[#E5E5E5] shadow-xs flex flex-col overflow-hidden">
      {/* Table Toolbar: Search & Segmented Filter Tabs */}
      <div className="p-4 border-b border-[#E5E5E5] flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3 bg-white">
        {/* Search Input */}
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Cari nama balita, ID, atau nama Posyandu..."
            className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-[#E5E5E5] rounded-xl text-xs font-semibold text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#34A853] focus:bg-white transition-all"
          />
        </div>

        {/* Filter Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 md:pb-0">
          <Filter className="w-3.5 h-3.5 text-slate-400 hidden sm:block mr-1" />
          {filterTabs.map((tab) => {
            const isActive = selectedFilter === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => {
                  soundSynth.playPop();
                  onFilterChange(tab.id);
                }}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
                  isActive
                    ? 'bg-slate-900 text-white shadow-xs'
                    : 'bg-slate-50 text-slate-600 hover:bg-slate-100 hover:text-slate-900 border border-[#E5E5E5]'
                }`}
              >
                {tab.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Full-Width Scrollable Table Container */}
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50/80 border-b border-[#E5E5E5] text-[11px] font-black text-slate-500 uppercase tracking-wider">
              <th className="py-3 px-4">ID & Nama Balita</th>
              <th className="py-3 px-4">Usia / JK</th>
              <th className="py-3 px-4">Posyandu & RW</th>
              <th className="py-3 px-4">Status Triase</th>
              <th className="py-3 px-4">Latensi Reaksi (RT)</th>
              <th className="py-3 px-4">Inhibisi Akurasi</th>
              <th className="py-3 px-4">LiLA & HAZ</th>
              <th className="py-3 px-4 text-right">Tindakan</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 text-xs">
            {patients.length === 0 ? (
              <tr>
                <td colSpan={8} className="py-12 text-center text-slate-400 font-semibold">
                  Tidak ada data balita yang sesuai dengan filter pencarian.
                </td>
              </tr>
            ) : (
              patients.map((p) => {
                const isSelected = selectedPatientId === p.id;
                const isTier1 = p.tier.includes('Tier-1');
                const isTier2 = p.tier.includes('Tier-2');

                return (
                  <tr
                    key={p.id}
                    onClick={() => {
                      soundSynth.playPop();
                      onSelectPatient(p);
                    }}
                    className={`transition-colors cursor-pointer group ${
                      isSelected
                        ? 'bg-emerald-50/50 hover:bg-emerald-50/80'
                        : 'hover:bg-slate-50/80'
                    }`}
                  >
                    {/* ID & Name */}
                    <td className="py-3.5 px-4 font-semibold">
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-[11px] font-bold text-slate-400 group-hover:text-slate-600 whitespace-nowrap shrink-0">
                          {p.id}
                        </span>
                        <span className="font-black text-slate-900 group-hover:text-emerald-700 transition-colors whitespace-nowrap">
                          {p.childName}
                        </span>
                        {p.interventionSaved && (
                          <span
                            className="inline-flex items-center gap-0.5 text-[10px] font-bold text-emerald-700 bg-emerald-100 px-1.5 py-0.5 rounded-md shrink-0"
                            title="Intervensi klinis telah disimpan"
                          >
                            <CheckCircle className="w-2.5 h-2.5" />
                            Resep
                          </span>
                        )}
                      </div>
                    </td>

                    {/* Age / Gender */}
                    <td className="py-3.5 px-4 text-slate-600 font-medium">
                      <span>{p.ageMonths} bln</span>
                      <span className="mx-1 text-slate-300">•</span>
                      <span
                        className={`font-bold px-1.5 py-0.5 rounded text-[10px] ${
                          p.gender === 'L'
                            ? 'bg-blue-50 text-blue-700'
                            : 'bg-rose-50 text-rose-700'
                        }`}
                      >
                        {p.gender === 'L' ? 'Laki-laki' : 'Perempuan'}
                      </span>
                    </td>

                    {/* Posyandu & RW */}
                    <td className="py-3.5 px-4 text-slate-600 font-medium">
                      <div className="truncate max-w-[150px]">{p.posyandu}</div>
                      <div className="text-[10px] text-slate-400 font-semibold">{p.rw}</div>
                    </td>

                    {/* Triase Status */}
                    <td className="py-3.5 px-4">
                      {isTier1 ? (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold bg-rose-50 text-rose-700 border border-rose-200">
                          <AlertCircle className="w-3 h-3 text-rose-600 shrink-0" />
                          Tier-1 Merah
                        </span>
                      ) : isTier2 ? (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold bg-amber-50 text-amber-700 border border-amber-200">
                          <AlertTriangle className="w-3 h-3 text-amber-600 shrink-0" />
                          Tier-2 Kuning
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                          <CheckCircle className="w-3 h-3 text-emerald-600 shrink-0" />
                          Normal Hijau
                        </span>
                      )}
                    </td>

                    {/* Latency RT ms */}
                    <td className="py-3.5 px-4 font-semibold tabular-nums">
                      <div
                        className={
                          p.latencyMs >= 480
                            ? 'text-rose-600 font-black'
                            : p.latencyMs >= 400
                            ? 'text-amber-600 font-bold'
                            : 'text-emerald-700'
                        }
                      >
                        {p.latencyMs} ms
                      </div>
                      <div className="text-[10px] text-slate-400 font-medium">
                        {p.latencyMs >= 480
                          ? 'Defisiensi Fe Berat'
                          : p.latencyMs >= 400
                          ? 'Subklinis'
                          : 'Kecepatan Optimal'}
                      </div>
                    </td>

                    {/* Accuracy Rate % */}
                    <td className="py-3.5 px-4 font-semibold tabular-nums">
                      <div
                        className={
                          p.accuracyRate <= 65
                            ? 'text-rose-600 font-black'
                            : p.accuracyRate <= 75
                            ? 'text-amber-600 font-bold'
                            : 'text-emerald-700'
                        }
                      >
                        {p.accuracyRate}%
                      </div>
                      <div className="text-[10px] text-slate-400 font-medium">
                        {p.commissionErrors} commission err
                      </div>
                    </td>

                    {/* MUAC / LiLA & HAZ */}
                    <td className="py-3.5 px-4 font-semibold tabular-nums">
                      <div className="text-slate-800">
                        LiLA: <span className="font-bold">{p.muacCm} cm</span>
                      </div>
                      <div
                        className={`text-[10px] font-bold ${
                          p.haz <= -2 ? 'text-rose-600' : 'text-slate-400'
                        }`}
                      >
                        HAZ: {p.haz} SD {p.haz <= -2 ? '(Stunting)' : ''}
                      </div>
                    </td>

                    {/* Action */}
                    <td className="py-3.5 px-4 text-right">
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          soundSynth.playPop();
                          onSelectPatient(p);
                        }}
                        className={`inline-flex items-center gap-1 px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                          isSelected
                            ? 'bg-[#34A853] text-white shadow-xs'
                            : 'bg-slate-100 text-slate-700 hover:bg-[#34A853] hover:text-white'
                        }`}
                      >
                        <span>Periksa</span>
                        <ChevronRight className="w-3.5 h-3.5" />
                      </button>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* Footer Info */}
      <div className="p-3 bg-slate-50/60 border-t border-[#E5E5E5] flex items-center justify-between text-[11px] text-slate-500 font-medium">
        <span>Menampilkan {patients.length} balita dalam daftar kerja</span>
        <span className="text-[10px] text-slate-400">
          Klik baris balita untuk membuka lembar rekam medis & intervensi
        </span>
      </div>
    </div>
  );
};
