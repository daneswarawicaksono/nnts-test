import React, { useState, useMemo } from 'react';
import type { PatientRecord } from '../../types';
import { DiceBearAvatar } from '../illustrations/DiceBearAvatar';
import { soundFX } from '../../services/audioSynth';
import {
  Search,
  ArrowUpDown,
  ShieldAlert,
  AlertTriangle,
  CheckCircle2,
  ChevronRight,
  Clock,
  Activity,
  Users,
  MapPin,
  Calendar,
  RotateCcw,
  Sparkles,
  UserPlus,
} from 'lucide-react';

interface ClinicianWorklistViewProps {
  patients: PatientRecord[];
  onSelectPatient: (patient: PatientRecord) => void;
  onOpenNewPatientModal?: () => void;
}

type SortOption = 'tier-priority' | 'date-desc' | 'name-asc' | 'latency-desc';

export const ClinicianWorklistView: React.FC<ClinicianWorklistViewProps> = ({
  patients,
  onSelectPatient,
  onOpenNewPatientModal,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedPosyandu, setSelectedPosyandu] = useState('all');
  const [selectedTier, setSelectedTier] = useState('all');
  const [sortBy, setSortBy] = useState<SortOption>('tier-priority');

  // Extract unique Posyandu names for filter dropdown
  const posyanduOptions = useMemo(() => {
    const list = Array.from(new Set(patients.map((p) => p.posyandu)));
    return list.sort();
  }, [patients]);

  // Priority weight for sorting: Tier-1 (3) > Tier-2 (2) > Normal (1)
  const getTierWeight = (tier: string) => {
    if (tier.includes('Tier-1') || tier.includes('Merah')) return 3;
    if (tier.includes('Tier-2') || tier.includes('Kuning')) return 2;
    return 1;
  };

  // Filter and sort the patient worklist
  const filteredPatients = useMemo(() => {
    return patients
      .filter((p) => {
        // Search by name or patient ID
        const matchSearch =
          p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          p.id.toLowerCase().includes(searchQuery.toLowerCase());

        // Filter by Posyandu
        const matchPosyandu =
          selectedPosyandu === 'all' || p.posyandu === selectedPosyandu;

        // Filter by Tier Alert
        const matchTier =
          selectedTier === 'all' ||
          (selectedTier === 'tier-1' && p.tierAlert.includes('Tier-1')) ||
          (selectedTier === 'tier-2' && p.tierAlert.includes('Tier-2')) ||
          (selectedTier === 'normal' && p.tierAlert.includes('Normal'));

        return matchSearch && matchPosyandu && matchTier;
      })
      .sort((a, b) => {
        switch (sortBy) {
          case 'tier-priority': {
            const weightDiff = getTierWeight(b.tierAlert) - getTierWeight(a.tierAlert);
            if (weightDiff !== 0) return weightDiff;
            // Secondary sort: highest Fe risk or latency
            return b.reactionTime.avgLatency - a.reactionTime.avgLatency;
          }
          case 'date-desc':
            return new Date(b.examDate).getTime() - new Date(a.examDate).getTime();
          case 'name-asc':
            return a.name.localeCompare(b.name);
          case 'latency-desc':
            return b.reactionTime.avgLatency - a.reactionTime.avgLatency;
          default:
            return 0;
        }
      });
  }, [patients, searchQuery, selectedPosyandu, selectedTier, sortBy]);

  // Overall statistics for worklist header
  const stats = useMemo(() => {
    const tier1 = patients.filter((p) => p.tierAlert.includes('Tier-1')).length;
    const tier2 = patients.filter((p) => p.tierAlert.includes('Tier-2')).length;
    const normal = patients.filter((p) => p.tierAlert.includes('Normal')).length;
    return {
      total: patients.length,
      tier1,
      tier2,
      normal,
    };
  }, [patients]);

  const handleResetFilters = () => {
    soundFX.playClick();
    setSearchQuery('');
    setSelectedPosyandu('all');
    setSelectedTier('all');
    setSortBy('tier-priority');
  };

  return (
    <div className="space-y-6">
      {/* 1. Worklist Top Summary & Intake Title */}
      <div className="bg-white rounded-3xl p-5 sm:p-6 border border-slate-200/90 shadow-xs space-y-4">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2.5">
              <div className="p-2 rounded-xl bg-teal-50 text-teal-700 border border-teal-200/80">
                <Users className="w-5 h-5" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-slate-900 tracking-tight">
                  Antrean Pasien Puskesmas (EHR Worklist)
                </h1>
                <p className="text-xs text-slate-500 font-medium">
                  Sistem Triase Cerdas Defisiensi Mikronutrien Posyandu • Puskesmas FKTP
                </p>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2.5">
            {onOpenNewPatientModal && (
              <button
                onClick={() => {
                  soundFX.playClick();
                  onOpenNewPatientModal();
                }}
                className="px-4 py-2 rounded-2xl bg-teal-600 hover:bg-teal-700 text-white font-extrabold text-xs flex items-center gap-2 shadow-sm shadow-teal-700/20 transition-all hover:scale-105 active:scale-95"
              >
                <UserPlus className="w-4 h-4" />
                <span>+ Daftarkan Pasien Baru</span>
              </button>
            )}
            <div className="hidden sm:flex items-center gap-2 text-xs font-semibold text-slate-500 bg-slate-50 border border-slate-200 px-3.5 py-2 rounded-2xl">
              <Clock className="w-4 h-4 text-teal-600" />
              <span>Skrining Cepat &lt;5 Menit/Anak Tanpa Trauma Jarum Suntik</span>
            </div>
          </div>
        </div>

        {/* 2. Top Summary KPI Queue Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2 border-t border-slate-100">
          <div className="bg-slate-50 rounded-2xl p-3.5 border border-slate-200/80">
            <span className="text-[11px] font-semibold text-slate-500 block">Total Antrean Hari Ini</span>
            <div className="flex items-baseline gap-2 mt-1">
              <span className="text-2xl font-black text-slate-900 font-mono">{stats.total}</span>
              <span className="text-xs text-slate-400 font-medium">anak</span>
            </div>
          </div>

          <div className="bg-red-50/70 rounded-2xl p-3.5 border border-red-200">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold text-red-800">Tier-1 Segera (Merah)</span>
              <span className="w-2 h-2 rounded-full bg-red-600 animate-ping" />
            </div>
            <div className="flex items-baseline gap-2 mt-1">
              <span className="text-2xl font-black text-red-700 font-mono">{stats.tier1}</span>
              <span className="text-xs text-red-600/80 font-medium">perlu resep</span>
            </div>
          </div>

          <div className="bg-amber-50/70 rounded-2xl p-3.5 border border-amber-200">
            <span className="text-[11px] font-bold text-amber-800 block">Tier-2 Waspada (Kuning)</span>
            <div className="flex items-baseline gap-2 mt-1">
              <span className="text-2xl font-black text-amber-700 font-mono">{stats.tier2}</span>
              <span className="text-xs text-amber-600/80 font-medium">konseling</span>
            </div>
          </div>

          <div className="bg-emerald-50/70 rounded-2xl p-3.5 border border-emerald-200">
            <span className="text-[11px] font-bold text-emerald-800 block">Sesuai Rujukan (Hijau)</span>
            <div className="flex items-baseline gap-2 mt-1">
              <span className="text-2xl font-black text-emerald-700 font-mono">{stats.normal}</span>
              <span className="text-xs text-emerald-600/80 font-medium">rutin posyandu</span>
            </div>
          </div>
        </div>
      </div>

      {/* 3. Search, Filter, & Sort Controls */}
      <div className="bg-white rounded-2xl p-4 border border-slate-200/90 shadow-xs flex flex-wrap items-center justify-between gap-3">
        {/* Search input */}
        <div className="relative flex-1 min-w-[240px]">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Cari nama pasien atau ID rekam medis..."
            className="w-full pl-10 pr-4 py-2 rounded-xl border border-slate-200 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-400 hover:text-slate-600"
            >
              ✕
            </button>
          )}
        </div>

        {/* Filter & Sort Dropdowns */}
        <div className="flex flex-wrap items-center gap-2.5">
          {/* Posyandu Filter */}
          <div className="flex items-center gap-1.5 bg-slate-50 border border-slate-200 rounded-xl px-2.5 py-1.5 text-xs">
            <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
            <select
              aria-label="Filter Posyandu Asal"
              value={selectedPosyandu}
              onChange={(e) => setSelectedPosyandu(e.target.value)}
              className="bg-transparent font-medium text-slate-700 focus:outline-none cursor-pointer text-xs"
            >
              <option value="all">Semua Posyandu</option>
              {posyanduOptions.map((p) => (
                <option key={p} value={p}>
                  {p}
                </option>
              ))}
            </select>
          </div>

          {/* Tier Filter */}
          <div className="flex items-center gap-1.5 bg-slate-50 border border-slate-200 rounded-xl px-2.5 py-1.5 text-xs">
            <Activity className="w-3.5 h-3.5 text-slate-400 shrink-0" />
            <select
              aria-label="Filter Status Tier Prioritas"
              value={selectedTier}
              onChange={(e) => setSelectedTier(e.target.value)}
              className="bg-transparent font-medium text-slate-700 focus:outline-none cursor-pointer text-xs"
            >
              <option value="all">Semua Prioritas</option>
              <option value="tier-1">Tier-1 Alert (Merah)</option>
              <option value="tier-2">Tier-2 Alert (Kuning)</option>
              <option value="normal">Normal (Hijau)</option>
            </select>
          </div>

          {/* Sort By Dropdown */}
          <div className="flex items-center gap-1.5 bg-teal-50/80 border border-teal-200 rounded-xl px-2.5 py-1.5 text-xs">
            <ArrowUpDown className="w-3.5 h-3.5 text-teal-600 shrink-0" />
            <span className="text-[11px] font-bold text-teal-800">Urutkan:</span>
            <select
              aria-label="Urutan Daftar Pasien"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as SortOption)}
              className="bg-transparent font-bold text-teal-900 focus:outline-none cursor-pointer text-xs"
            >
              <option value="tier-priority">Prioritas: Tier-1 Merah Teratas</option>
              <option value="date-desc">Tanggal Pemeriksaan Terbaru</option>
              <option value="name-asc">Nama Pasien (A–Z)</option>
              <option value="latency-desc">Latensi Refleks Terlambat</option>
            </select>
          </div>

          {/* Reset Filters button if active */}
          {(searchQuery || selectedPosyandu !== 'all' || selectedTier !== 'all' || sortBy !== 'tier-priority') && (
            <button
              onClick={handleResetFilters}
              className="px-2.5 py-1.5 rounded-xl border border-slate-200 text-slate-500 hover:text-slate-800 hover:bg-slate-100 text-xs font-semibold flex items-center gap-1 transition-colors"
              title="Reset Filter"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset</span>
            </button>
          )}
        </div>
      </div>

      {/* 4. Patient Worklist Table (Desktop) / Cards (Mobile) */}
      <div className="bg-white rounded-3xl border border-slate-200/90 shadow-xs overflow-hidden">
        {filteredPatients.length === 0 ? (
          <div className="p-12 text-center space-y-3">
            <div className="w-12 h-12 rounded-full bg-slate-100 text-slate-400 mx-auto flex items-center justify-center">
              <Search className="w-6 h-6" />
            </div>
            <h3 className="font-bold text-slate-800 text-sm">Tidak Ada Pasien Ditemukan</h3>
            <p className="text-xs text-slate-500 max-w-sm mx-auto">
              Tidak ada data antrean yang sesuai dengan kata kunci atau filter yang dipilih. Silakan reset filter.
            </p>
            <button
              onClick={handleResetFilters}
              className="px-4 py-2 rounded-xl bg-teal-600 text-white text-xs font-bold hover:bg-teal-700 transition-colors inline-flex items-center gap-1.5"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset Semua Filter</span>
            </button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="bg-slate-50/90 border-b border-slate-200/90 text-slate-600 font-bold">
                  <th className="py-3.5 px-4">Pasien & ID Rekam Medis</th>
                  <th className="py-3.5 px-4">Posyandu & Tanggal</th>
                  <th className="py-3.5 px-4">Hasil Skrining Kognitif</th>
                  <th className="py-3.5 px-4">Somatometri (KMS)</th>
                  <th className="py-3.5 px-4">Prioritas Triase CDSS</th>
                  <th className="py-3.5 px-4 text-center">Status Tata Laksana</th>
                  <th className="py-3.5 px-4 text-right">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredPatients.map((p) => {
                  const isTier1 = p.tierAlert.includes('Tier-1') || p.tierAlert.includes('Merah');
                  const isTier2 = p.tierAlert.includes('Tier-2') || p.tierAlert.includes('Kuning');

                  return (
                    <tr
                      key={p.id}
                      onClick={() => {
                        soundFX.playClick();
                        onSelectPatient(p);
                      }}
                      className="hover:bg-teal-50/40 cursor-pointer transition-colors group"
                    >
                      {/* Patient column */}
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-3">
                          <DiceBearAvatar
                            seed={p.name}
                            gender={p.gender}
                            size={42}
                            className="border-2 border-white shadow-xs group-hover:scale-105 transition-transform"
                          />
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="font-bold text-slate-900 text-sm group-hover:text-teal-700 transition-colors">
                                {p.name}
                              </span>
                              <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-slate-100 text-slate-600">
                                {p.gender === 'P' ? 'Perempuan' : 'Laki-laki'}
                              </span>
                            </div>
                            <div className="flex items-center gap-2 mt-0.5 text-slate-500 font-medium text-[11px]">
                              <span className="font-mono">{p.id}</span>
                              <span>• {p.ageMonths} Bulan</span>
                            </div>
                          </div>
                        </div>
                      </td>

                      {/* Posyandu & Date */}
                      <td className="py-3.5 px-4">
                        <div className="text-slate-800 font-medium">{p.posyandu}</div>
                        <div className="text-[11px] text-slate-400 flex items-center gap-1 mt-0.5">
                          <Calendar className="w-3 h-3 text-slate-400" />
                          <span>{p.examDate}</span>
                        </div>
                      </td>

                      {/* Cognitive Results */}
                      <td className="py-3.5 px-4">
                        <div className="space-y-1">
                          <div className="flex items-center gap-1.5">
                            <span className="text-slate-500 text-[11px]">Refleks:</span>
                            <span
                              className={`font-mono font-bold px-1.5 py-0.5 rounded text-[11px] ${
                                p.reactionTime.avgLatency > 480
                                  ? 'bg-red-100 text-red-700'
                                  : 'bg-emerald-100 text-emerald-800'
                              }`}
                            >
                              {p.reactionTime.avgLatency} ms
                            </span>
                          </div>
                          <div className="text-[11px] text-slate-500">
                            Fokus: {p.goNoGo.accuracyRate}% • Memori: {p.memorySpan.spanScore}/5
                          </div>
                        </div>
                      </td>

                      {/* Somatometry */}
                      <td className="py-3.5 px-4 font-mono">
                        <div className="text-slate-800 font-semibold">
                          LiLA: <span className={p.muac < 12.5 ? 'text-amber-700 font-bold' : 'text-slate-700'}>{p.muac} cm</span>
                        </div>
                        <div className="text-[11px] text-slate-400">
                          {p.weight} kg • {p.height} cm
                        </div>
                      </td>

                      {/* Tier Badge & Rationale */}
                      <td className="py-3.5 px-4">
                        <div className="space-y-1">
                          <span
                            className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold ${
                              isTier1
                                ? 'bg-red-100 text-red-800 border border-red-200'
                                : isTier2
                                ? 'bg-amber-100 text-amber-800 border border-amber-200'
                                : 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                            }`}
                          >
                            {isTier1 ? (
                              <ShieldAlert className="w-3.5 h-3.5 text-red-600 shrink-0" />
                            ) : isTier2 ? (
                              <AlertTriangle className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                            ) : (
                              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                            )}
                            <span>{p.tierAlert.split(' ')[0]}</span>
                          </span>

                          <div className="text-[11px] text-slate-500 line-clamp-1 max-w-[220px]" title={p.clinicalRationale[0]}>
                            {p.clinicalRationale[0]}
                          </div>
                        </div>
                      </td>

                      {/* Prescription status */}
                      <td className="py-3.5 px-4 text-center">
                        {p.prescriptions.isPrescribed ? (
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-teal-50 text-teal-800 border border-teal-200 text-[11px] font-bold">
                            <CheckCircle2 className="w-3 h-3 text-teal-600" />
                            Sudah Diresepkan
                          </span>
                        ) : isTier1 ? (
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-red-50 text-red-700 border border-red-200 text-[11px] font-bold">
                            Perlu Tindakan
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 text-[11px] font-medium">
                            Konseling
                          </span>
                        )}
                      </td>

                      {/* Action */}
                      <td className="py-3.5 px-4 text-right">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            soundFX.playClick();
                            onSelectPatient(p);
                          }}
                          className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-slate-900 hover:bg-teal-700 text-white text-xs font-bold transition-all shadow-2xs group-hover:shadow-xs active:scale-95"
                        >
                          <span>Buka Rekam Medis</span>
                          <ChevronRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5" />
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* 5. Natural Posyandu Workflow Guide Banner */}
      <div className="bg-slate-50 rounded-2xl p-4 border border-slate-200/80 flex flex-wrap items-center justify-between gap-3 text-xs text-slate-600">
        <div className="flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-teal-600 shrink-0" />
          <span>
            <strong className="text-slate-800">Alur Kerja Puskesmas FKTP:</strong> Pilih salah satu pasien antrean di atas untuk meninjau data radar risiko mikronutrien, konfirmasi gejala fisik, dan meresepkan suplementasi.
          </span>
        </div>
        <span className="text-[11px] text-slate-400 font-mono">
          Menampilkan {filteredPatients.length} dari {patients.length} pasien
        </span>
      </div>
    </div>
  );
};
