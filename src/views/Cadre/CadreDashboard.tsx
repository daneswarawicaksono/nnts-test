import React, { useState, useMemo, useEffect, useCallback } from 'react';
import {
  Users,
  Plus,
  LogOut,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  Scale,
  Search,
  X,
  UserPlus,
  Gamepad2,
  RefreshCw,
} from 'lucide-react';
import { GlassCard } from '../../design-system/primitives/GlassCard';
import { Button } from '../../design-system/primitives/Button';
import { EmptyState } from '../../design-system/primitives/EmptyState';
import { StreakBadge } from '../../design-system/primitives/StreakBadge';
import { ProgressBar } from '../../design-system/primitives/ProgressBar';
import { GameSessionContainer } from '../Game/GameSessionContainer';
import { soundSynth } from '../../services/audio/synth';
import { api, type PosyanduSubjectItem } from '../../services/api/client';
import { ageInMonths } from '../../utils/age';
import type { AuthSession } from '../../types/role';

export interface CadreDashboardProps {
  session: AuthSession;
  onLogout: () => void;
}

export interface ToddlerRecord {
  id: string;
  name: string;
  ageMonths: number;
  gender: 'L' | 'P';
  birthDate?: string;
  parentName: string;
  weightKg: number | null;
  heightCm: number | null;
  muacCm: number | null;
  hasMeasuredToday: boolean;
  alert: boolean;
  alertReason?: string;
  lastScreeningTier?: string | null;
  lastAssessedAt?: string | null;
}

const INITIAL_TODDLERS: ToddlerRecord[] = [
  {
    id: 'T-01',
    name: 'Gilang Ramadhan',
    ageMonths: 22,
    gender: 'L',
    parentName: 'Ibu Ratna',
    weightKg: 9.8,
    heightCm: 79.0,
    muacCm: 11.2,
    hasMeasuredToday: true,
    alert: true,
    alertReason: 'Pita Merah (<11.5 cm) — Rujuk ke Puskesmas',
  },
  {
    id: 'T-02',
    name: 'Rian Pratama',
    ageMonths: 28,
    gender: 'L',
    parentName: 'Ibu Dewi',
    weightKg: 11.2,
    heightCm: 86.5,
    muacCm: 12.0,
    hasMeasuredToday: true,
    alert: true,
    alertReason: 'Pita Kuning (12.0 cm) — Waspada Defisiensi Besi',
  },
  {
    id: 'T-03',
    name: 'Zahra Salsabila',
    ageMonths: 34,
    gender: 'P',
    parentName: 'Ibu Halimah',
    weightKg: 13.5,
    heightCm: 94.0,
    muacCm: 13.8,
    hasMeasuredToday: true,
    alert: false,
  },
  {
    id: 'T-04',
    name: 'Kania Putri',
    ageMonths: 40,
    gender: 'P',
    parentName: 'Ibu Fitri',
    weightKg: 14.2,
    heightCm: 98.0,
    muacCm: 14.1,
    hasMeasuredToday: false,
    alert: false,
  },
  {
    id: 'T-05',
    name: 'Arka Danendra',
    ageMonths: 18,
    gender: 'L',
    parentName: 'Ibu Maya',
    weightKg: 10.1,
    heightCm: 81.0,
    muacCm: 12.8,
    hasMeasuredToday: false,
    alert: false,
  },
];

export const CadreDashboard: React.FC<CadreDashboardProps> = ({ session, onLogout }) => {
  const cacheKey = `nnts_cadre_toddlers_${session.user.id}`;
  const posyanduId = session.user.posyanduId || 'POS-DIY-MLT01';

  const [toddlers, setToddlers] = useState<ToddlerRecord[]>(() => {
    const cached = localStorage.getItem(cacheKey);
    if (cached) {
      try {
        const parsed = JSON.parse(cached);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      } catch {
        // ignore
      }
    }
    const searchParams = new URLSearchParams(window.location.search);
    if (searchParams.get('role') === 'cadre' || searchParams.get('demo') === '1') {
      return INITIAL_TODDLERS;
    }
    return [];
  });

  const [isLoadingSubjects, setIsLoadingSubjects] = useState(false);
  const [activeGameSubject, setActiveGameSubject] = useState<ToddlerRecord | null>(null);

  // Ambil data registri balita dari server Posyandu
  const fetchPosyanduSubjects = useCallback(async () => {
    setIsLoadingSubjects(true);
    try {
      const data: PosyanduSubjectItem[] = await api.listSubjects(posyanduId);
      if (Array.isArray(data) && data.length > 0) {
        const mapped: ToddlerRecord[] = data.map((item) => {
          const localMeasureStr = localStorage.getItem(`nnts_cadre_measure_${item.pseudo_uuid}`);
          let localMeasure: any = null;
          if (localMeasureStr) {
            try {
              localMeasure = JSON.parse(localMeasureStr);
            } catch {
              // ignore
            }
          }

          const weight = localMeasure?.weight_kg ?? item.last_measurements?.weight_kg ?? null;
          const height = localMeasure?.height_cm ?? item.last_measurements?.height_cm ?? null;
          const muac = localMeasure?.muac_lila_cm ?? item.last_measurements?.muac_lila_cm ?? null;
          const hasMeasured = Boolean(localMeasure?.measured_at);

          const isAlert = Boolean(muac != null && muac < 12.5);
          const alertReason =
            muac != null && muac < 11.5
              ? 'Pita Merah (<11.5 cm) — Rujuk ke Puskesmas'
              : muac != null && muac <= 12.5
              ? 'Pita Kuning (11.5–12.5 cm) — Waspada Defisiensi Besi'
              : undefined;

          return {
            id: item.pseudo_uuid,
            name: item.child_name,
            ageMonths: item.age_in_months,
            gender: item.sex === 'M' ? 'L' : 'P',
            birthDate: item.birth_date,
            parentName: 'Wali Terdaftar',
            weightKg: weight,
            heightCm: height,
            muacCm: muac,
            hasMeasuredToday: hasMeasured,
            alert: isAlert,
            alertReason,
            lastScreeningTier: item.last_screening?.triage_tier || null,
            lastAssessedAt: item.last_screening?.assessed_at || null,
          };
        });
        setToddlers(mapped);
      }
    } catch (e) {
      console.warn('[CadreDashboard] Gagal memuat daftar subjek dari server:', e);
    } finally {
      setIsLoadingSubjects(false);
    }
  }, [posyanduId]);

  useEffect(() => {
    fetchPosyanduSubjects();
  }, [fetchPosyanduSubjects]);

  // Simpan perubahan ke storage
  useEffect(() => {
    localStorage.setItem(cacheKey, JSON.stringify(toddlers));
  }, [toddlers, cacheKey]);

  const handleLoadSimulationData = () => {
    setToddlers(INITIAL_TODDLERS);
    soundSynth.playChime();
  };

  const handleClearData = () => {
    if (confirm('Bersihkan antrean balita hari ini?')) {
      setToddlers([]);
      localStorage.removeItem(cacheKey);
    }
  };

  const [searchQuery, setSearchQuery] = useState('');

  // Modals state
  const [isMeasurementModalOpen, setIsMeasurementModalOpen] = useState(false);
  const [isNewChildModalOpen, setIsNewChildModalOpen] = useState(false);
  const [activeToddlerForMeasure, setActiveToddlerForMeasure] = useState<ToddlerRecord | null>(null);

  // Somatic form fields
  const [measureWeight, setMeasureWeight] = useState('');
  const [measureHeight, setMeasureHeight] = useState('');
  const [measureMuac, setMeasureMuac] = useState('');
  const [measurePaleConjunctiva, setMeasurePaleConjunctiva] = useState(false);
  const [measureStomatitis, setMeasureStomatitis] = useState(false);

  // New child form fields
  const [newName, setNewName] = useState('');
  const todayStr = new Date().toISOString().split('T')[0];
  const getDefaultBirthDate = () => {
    const d = new Date();
    d.setMonth(d.getMonth() - 30);
    return d.toISOString().split('T')[0];
  };
  const [newBirthDate, setNewBirthDate] = useState<string>(getDefaultBirthDate);
  const [newGender, setNewGender] = useState<'L' | 'P'>('P');
  const [newParentName, setNewParentName] = useState('');
  const [newChildSubmitting, setNewChildSubmitting] = useState(false);
  const [newChildError, setNewChildError] = useState<string | null>(null);

  const calculatedNewAge = newBirthDate ? ageInMonths(newBirthDate, todayStr) : 0;
  const isNewAgeValid = Boolean(newBirthDate) && calculatedNewAge >= 24 && calculatedNewAge <= 59;

  // Filtered toddlers
  const filteredToddlers = useMemo(() => {
    return toddlers.filter(
      (t) =>
        t.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        t.parentName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        t.id.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [toddlers, searchQuery]);

  const totalScheduled = toddlers.length;
  const totalMeasured = toddlers.filter((t) => t.hasMeasuredToday).length;
  const progressPercent = Math.round((totalMeasured / (totalScheduled || 1)) * 100);

  const openMeasurementModal = (toddler: ToddlerRecord) => {
    soundSynth.playPop();
    setActiveToddlerForMeasure(toddler);
    setMeasureWeight(toddler.weightKg != null ? toddler.weightKg.toString() : '');
    setMeasureHeight(toddler.heightCm != null ? toddler.heightCm.toString() : '');
    setMeasureMuac(toddler.muacCm != null ? toddler.muacCm.toString() : '');
    setIsMeasurementModalOpen(true);
  };

  const handleSaveMeasurement = () => {
    if (!activeToddlerForMeasure) return;
    soundSynth.playChime();
    const numWeight = measureWeight.trim() ? parseFloat(measureWeight) : activeToddlerForMeasure.weightKg;
    const numHeight = measureHeight.trim() ? parseFloat(measureHeight) : activeToddlerForMeasure.heightCm;
    const numMuac = measureMuac.trim() ? parseFloat(measureMuac) : activeToddlerForMeasure.muacCm;

    const isAlert = Boolean(numMuac != null && numMuac < 12.5);
    const alertReason =
      numMuac != null && numMuac < 11.5
        ? 'Pita Merah (<11.5 cm) — Rujuk ke Puskesmas'
        : numMuac != null && numMuac <= 12.5
        ? 'Pita Kuning (11.5–12.5 cm) — Waspada Defisiensi Besi'
        : undefined;

    // Simpan ke antrean lokal kader per anak
    localStorage.setItem(
      `nnts_cadre_measure_${activeToddlerForMeasure.id}`,
      JSON.stringify({
        weight_kg: numWeight,
        height_cm: numHeight,
        muac_lila_cm: numMuac,
        measured_at: new Date().toISOString(),
      })
    );

    setToddlers((prev) =>
      prev.map((t) =>
        t.id === activeToddlerForMeasure.id
          ? {
              ...t,
              weightKg: numWeight,
              heightCm: numHeight,
              muacCm: numMuac,
              hasMeasuredToday: true,
              alert: isAlert,
              alertReason,
            }
          : t
      )
    );
    setIsMeasurementModalOpen(false);
    alert(`Data fisik ${activeToddlerForMeasure.name} berhasil disimpan!`);
  };

  const handleRegisterNewChild = async () => {
    if (!newName.trim() || !newParentName.trim()) {
      alert('Nama balita dan nama orang tua wajib diisi.');
      return;
    }
    if (!isNewAgeValid) {
      alert(`Usia anak harus 24-59 bulan (saat ini ${calculatedNewAge} bulan).`);
      return;
    }

    setNewChildSubmitting(true);
    setNewChildError(null);
    try {
      const res = await api.createSubject({
        child_name: newName.trim(),
        birth_date: newBirthDate,
        sex: newGender === 'L' ? 'M' : 'F',
        posyandu_id: posyanduId,
        guardian_name: newParentName.trim(),
      });

      soundSynth.playChime();
      const newRecord: ToddlerRecord = {
        id: res.pseudo_uuid,
        name: newName.trim(),
        ageMonths: res.age_in_months,
        gender: newGender,
        birthDate: newBirthDate,
        parentName: newParentName.trim(),
        weightKg: null,
        heightCm: null,
        muacCm: null,
        hasMeasuredToday: false,
        alert: false,
        lastScreeningTier: null,
      };

      setToddlers((prev) => [newRecord, ...prev]);
      setIsNewChildModalOpen(false);
      setNewName('');
      setNewParentName('');
      alert(`Balita baru ${newRecord.name} berhasil didaftarkan ke server Posyandu.`);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Gagal mendaftarkan balita';
      setNewChildError(msg);
      alert(msg);
    } finally {
      setNewChildSubmitting(false);
    }
  };

  // Full-screen Game Runner jika kader memulai game untuk balita tertentu
  if (activeGameSubject) {
    return (
      <GameSessionContainer
        childId={activeGameSubject.id}
        childName={activeGameSubject.name}
        subjectId={activeGameSubject.id}
        birthDate={activeGameSubject.birthDate || '2024-05-19'}
        gender={activeGameSubject.gender}
        onExit={() => setActiveGameSubject(null)}
        onFinishSession={(evaluation) => {
          setActiveGameSubject(null);
          const tierStr =
            evaluation?.tier === 'Tier-1 Alert'
              ? 'TIER_1_MERAH'
              : evaluation?.tier === 'Tier-2 Alert'
              ? 'TIER_2_KUNING'
              : evaluation?.tier === 'Normal'
              ? 'TIER_HIJAU'
              : evaluation?.tier || 'TIER_HIJAU';

          setToddlers((prev) =>
            prev.map((s) =>
              s.id === activeGameSubject.id
                ? {
                    ...s,
                    lastScreeningTier: tierStr,
                    lastAssessedAt: new Date().toISOString(),
                  }
                : s
            )
          );
          soundSynth.playChime();
        }}
      />
    );
  }

  const numCurrentMuac = parseFloat(measureMuac) || 12.0;

  return (
    <div className="w-full h-full bg-slate-50 flex flex-col justify-between font-sans select-none relative overflow-hidden">
      {/* TOP HEADER */}
      <header className="px-5 py-3.5 bg-white border-b border-slate-200 flex items-center justify-between z-10 shrink-0 shadow-xs">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-nutri-teal-700 text-white flex items-center justify-center shadow-subtle shrink-0">
            <Users className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[11px] font-black text-nutri-teal-700 uppercase tracking-wider">
                Posyandu Melati 1 (RW 03)
              </span>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-teal-50 text-teal-800 border border-teal-200">
                Kader Posyandu
              </span>
            </div>
            <h1 className="text-sm sm:text-base font-extrabold text-slate-900 leading-tight">
              {session.user.fullName}
            </h1>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <StreakBadge count={14} label="Balita" />
          <button
            onClick={onLogout}
            className="w-9 h-9 rounded-xl bg-slate-100 hover:bg-rose-50 text-slate-500 hover:text-rose-600 flex items-center justify-center transition-colors border border-slate-200"
            title="Keluar"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </header>

      {/* MAIN BODY WORKSTATION */}
      <div className="flex-1 w-full overflow-y-auto p-4 sm:p-6 space-y-4">
        {/* STATS & QUICK ACTIONS BANNER */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5">
          {/* Progress Card */}
          <GlassCard padding="md" className="bg-white border-slate-200 space-y-2 shadow-xs">
            <div className="flex items-center justify-between text-xs font-bold text-slate-600">
              <span>Progres Penimbangan Sesi Ini</span>
              <span className="text-nutri-teal-700 font-extrabold">{progressPercent}%</span>
            </div>
            <ProgressBar value={progressPercent} variant="emerald" />
            <div className="text-[11px] text-slate-500 font-medium">
              {totalMeasured} dari {totalScheduled} balita selesai ditimbang
            </div>
          </GlassCard>

          {/* Action 1: Ukur Fisik */}
          <GlassCard
            variant="interactive"
            padding="md"
            className="bg-teal-50/70 border-teal-200 flex items-center justify-between shadow-xs cursor-pointer"
            onClick={() => {
              if (toddlers.length > 0) openMeasurementModal(toddlers[0]);
            }}
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-nutri-teal-700 text-white flex items-center justify-center">
                <Scale className="w-5 h-5" />
              </div>
              <div>
                <div className="text-xs font-black text-teal-900">Input Pengukuran Somatik</div>
                <div className="text-[11px] text-teal-700">Catat BB, TB, &amp; LiLA balita</div>
              </div>
            </div>
            <ArrowRight className="w-4 h-4 text-teal-700" />
          </GlassCard>

          {/* Action 2: Tambah Balita */}
          <GlassCard
            variant="interactive"
            padding="md"
            className="bg-amber-50/70 border-amber-200 flex items-center justify-between shadow-xs cursor-pointer"
            onClick={() => {
              soundSynth.playPop();
              setIsNewChildModalOpen(true);
            }}
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-nutri-orange-500 text-white flex items-center justify-center">
                <UserPlus className="w-5 h-5" />
              </div>
              <div>
                <div className="text-xs font-black text-amber-900">Daftarkan Balita Baru</div>
                <div className="text-[11px] text-amber-700">Registrasi peserta Posyandu</div>
              </div>
            </div>
            <Plus className="w-4 h-4 text-amber-700" />
          </GlassCard>
        </div>

        {/* WORKLIST SECTION */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
          {/* Worklist Controls */}
          <div className="p-4 border-b border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-slate-50/60">
            <div>
              <h2 className="text-sm font-black text-slate-900">Daftar Balita Posyandu Hari Ini</h2>
              <p className="text-xs text-slate-500">Pilih balita untuk memperbarui data fisik atau melihat riwayat</p>
            </div>

            <div className="flex items-center gap-2 w-full sm:w-auto">
              <button
                onClick={fetchPosyanduSubjects}
                disabled={isLoadingSubjects}
                className="text-[11px] font-bold text-teal-700 hover:text-teal-900 px-2.5 py-1.5 rounded-lg border border-teal-200 hover:bg-teal-50 transition-colors flex items-center gap-1"
                title="Segarkan daftar dari server"
              >
                <RefreshCw className={`w-3 h-3 ${isLoadingSubjects ? 'animate-spin' : ''}`} />
                <span>Segarkan</span>
              </button>
              {toddlers.length > 0 && (
                <button
                  onClick={handleClearData}
                  className="text-[11px] font-bold text-rose-600 hover:text-rose-800 px-2.5 py-1.5 rounded-lg border border-rose-200 hover:bg-rose-50 transition-colors"
                >
                  Reset Antrean
                </button>
              )}
              <div className="relative w-full sm:w-64">
                <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  placeholder="Cari balita atau orang tua..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-9 pr-3 py-1.5 text-xs rounded-xl border border-slate-200 bg-white focus:outline-none focus:ring-2 focus:ring-teal-600"
                />
              </div>
            </div>
          </div>

          {/* Toddler List Table / Grid */}
          <div className="divide-y divide-slate-100">
            {filteredToddlers.length === 0 ? (
              <div className="py-8">
                <EmptyState
                  title="Belum Ada Antrean Balita"
                  description="Posyandu hari ini masih bersih. Anda dapat mendaftarkan balita baru satu per satu atau memuat data simulasi untuk keperluan uji coba/demo."
                  actionLabel="+ Tambah Balita Baru"
                  onAction={() => setIsNewChildModalOpen(true)}
                />
                <div className="text-center mt-3">
                  <button
                    onClick={handleLoadSimulationData}
                    className="text-xs font-bold text-teal-700 hover:text-teal-900 underline"
                  >
                    Muat 5 Data Simulasi Posyandu (Demo Mode)
                  </button>
                </div>
              </div>
            ) : (
              filteredToddlers.map((t) => {
              const isAlert = t.alert;
              const isMeasured = t.hasMeasuredToday;

              return (
                <div
                  key={t.id}
                  className="p-4 hover:bg-slate-50/80 transition-colors flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                >
                  <div className="flex items-start gap-3">
                    <div
                      className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 font-black text-xs ${
                        isAlert
                          ? 'bg-rose-100 text-rose-700'
                          : isMeasured
                          ? 'bg-emerald-100 text-emerald-700'
                          : 'bg-slate-100 text-slate-500'
                      }`}
                    >
                      {t.gender === 'L' ? '👦' : '👧'}
                    </div>

                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-black text-slate-900">{t.name}</span>
                        <span className="text-[10px] text-slate-400">({t.id})</span>
                        {isMeasured ? (
                          <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full flex items-center gap-1">
                            <CheckCircle2 className="w-3 h-3" /> Sudah Ditimbang
                          </span>
                        ) : (
                          <span className="text-[10px] font-bold text-slate-500 bg-slate-100 px-2 py-0.5 rounded-full">
                            Belum Ditimbang
                          </span>
                        )}
                      </div>

                      <div className="text-[11px] text-slate-500 mt-0.5">
                        Usia {t.ageMonths} Bulan • Orang Tua: {t.parentName}
                      </div>

                      <div className="flex items-center gap-2 mt-1">
                        {t.lastScreeningTier ? (
                          <span
                            className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                              t.lastScreeningTier.includes('1') || t.lastScreeningTier.includes('MERAH')
                                ? 'bg-rose-100 text-rose-800'
                                : t.lastScreeningTier.includes('2') || t.lastScreeningTier.includes('KUNING')
                                ? 'bg-amber-100 text-amber-800'
                                : 'bg-emerald-100 text-emerald-800'
                            }`}
                          >
                            Skrining: {t.lastScreeningTier}
                          </span>
                        ) : (
                          <span className="text-[10px] font-bold text-slate-400 bg-slate-100 px-2 py-0.5 rounded-full">
                            Belum diskrining
                          </span>
                        )}

                        {t.alertReason && (
                          <span className="text-[10px] font-bold text-rose-600 flex items-center gap-1">
                            <AlertTriangle className="w-3 h-3 shrink-0" />
                            <span>{t.alertReason}</span>
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 justify-between sm:justify-end border-t sm:border-t-0 pt-2 sm:pt-0">
                    <div className="flex items-center gap-2 text-xs">
                      <div className="bg-slate-50 border border-slate-200 px-2.5 py-1 rounded-lg text-center">
                        <span className="text-[9px] text-slate-400 block font-semibold">BB</span>
                        <span className="font-extrabold text-slate-800">
                          {t.weightKg != null ? `${t.weightKg} kg` : '-'}
                        </span>
                      </div>
                      <div className="bg-slate-50 border border-slate-200 px-2.5 py-1 rounded-lg text-center">
                        <span className="text-[9px] text-slate-400 block font-semibold">TB</span>
                        <span className="font-extrabold text-slate-800">
                          {t.heightCm != null ? `${t.heightCm} cm` : '-'}
                        </span>
                      </div>
                      <div
                        className={`border px-2.5 py-1 rounded-lg text-center ${
                          t.muacCm == null
                            ? 'bg-slate-50 border-slate-200 text-slate-400'
                            : t.muacCm < 11.5
                            ? 'bg-rose-50 border-rose-300 text-rose-800'
                            : t.muacCm <= 12.5
                            ? 'bg-amber-50 border-amber-300 text-amber-800'
                            : 'bg-emerald-50 border-emerald-300 text-emerald-800'
                        }`}
                      >
                        <span className="text-[9px] block font-semibold opacity-75">LiLA</span>
                        <span className="font-extrabold">
                          {t.muacCm != null ? `${t.muacCm} cm` : '-'}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <Button
                        variant={isMeasured ? 'secondary' : 'primary'}
                        size="sm"
                        onClick={() => openMeasurementModal(t)}
                      >
                        {isMeasured ? 'Ubah Ukuran' : 'Timbang'}
                      </Button>
                      <Button
                        variant="secondary"
                        size="sm"
                        icon={<Gamepad2 className="w-3.5 h-3.5 text-teal-700" />}
                        onClick={() => setActiveGameSubject(t)}
                      >
                        Mulai Game
                      </Button>
                    </div>
                  </div>
                </div>
              );
            })
            )}
          </div>
        </div>
      </div>

      {/* MODAL 1: INPUT PENGUKURAN SOMATIK (LILA & ANTROPOMETRI) */}
      {isMeasurementModalOpen && activeToddlerForMeasure && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4 animate-in fade-in duration-fast">
          <div className="bg-white rounded-3xl max-w-md w-full shadow-2xl border border-slate-200 overflow-hidden flex flex-col">
            <div className="px-5 py-4 border-b border-slate-200 flex items-center justify-between bg-slate-50 shrink-0">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-teal-100 text-teal-800 flex items-center justify-center">
                  <Scale className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm font-extrabold text-slate-900">
                    Pengukuran Antropometri
                  </h3>
                  <p className="text-[11px] text-slate-500">
                    {activeToddlerForMeasure.name} • {activeToddlerForMeasure.ageMonths} Bulan
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIsMeasurementModalOpen(false)}
                className="w-7 h-7 rounded-full text-slate-400 hover:text-slate-600 hover:bg-slate-200 flex items-center justify-center transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-5 space-y-4">
              {/* LiLA Tape Dynamic Preview */}
              <div>
                <label className="block text-xs font-bold text-slate-800 mb-1">
                  Lingkar Lengan Atas (LiLA) dalam cm:
                </label>
                <input
                  type="number"
                  step="0.1"
                  placeholder="Contoh: 12.2"
                  value={measureMuac}
                  onChange={(e) => setMeasureMuac(e.target.value)}
                  className="w-full px-3 py-2 text-sm font-bold rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-teal-600"
                />

                <div
                  className={`mt-2 p-2.5 rounded-xl border flex items-center justify-between text-xs font-bold ${
                    numCurrentMuac < 11.5
                      ? 'bg-rose-50 border-rose-300 text-rose-800'
                      : numCurrentMuac <= 12.5
                      ? 'bg-amber-50 border-amber-300 text-amber-800'
                      : 'bg-emerald-50 border-emerald-300 text-emerald-800'
                  }`}
                >
                  <span>Indikator Pita LiLA:</span>
                  <span>
                    {numCurrentMuac < 11.5
                      ? '🔴 Merah (<11.5 cm) — Gizi Buruk Akut'
                      : numCurrentMuac <= 12.5
                      ? '🟡 Kuning (11.5–12.5 cm) — Waspada'
                      : '🟢 Hijau (>12.5 cm) — Normal'}
                  </span>
                </div>
              </div>

              {/* Weight & Height Grid */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-800 mb-1">
                    Berat Badan (kg):
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    placeholder="Contoh: 11.5"
                    value={measureWeight}
                    onChange={(e) => setMeasureWeight(e.target.value)}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-teal-600"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-800 mb-1">
                    Tinggi Badan (cm):
                  </label>
                  <input
                    type="number"
                    step="0.5"
                    placeholder="Contoh: 87.0"
                    value={measureHeight}
                    onChange={(e) => setMeasureHeight(e.target.value)}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-teal-600"
                  />
                </div>
              </div>

              {/* Physical Markers Checklist */}
              <div className="space-y-2 pt-2 border-t border-slate-100">
                <span className="text-xs font-bold text-slate-800 block">Tanda Fisik Klinis:</span>
                <label className="flex items-center gap-2 text-xs text-slate-700 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={measurePaleConjunctiva}
                    onChange={(e) => setMeasurePaleConjunctiva(e.target.checked)}
                    className="rounded text-teal-700 focus:ring-teal-600"
                  />
                  <span>Kelopak Mata Dalam Terlihat Pucat (Anemia Konjungtiva)</span>
                </label>
                <label className="flex items-center gap-2 text-xs text-slate-700 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={measureStomatitis}
                    onChange={(e) => setMeasureStomatitis(e.target.checked)}
                    className="rounded text-teal-700 focus:ring-teal-600"
                  />
                  <span>Luka Sudut Bibir / Pecah-pecah (Stomatitis Angularis)</span>
                </label>
              </div>
            </div>

            <div className="p-4 border-t border-slate-200 bg-white flex justify-end gap-2.5 shrink-0">
              <Button variant="secondary" size="sm" onClick={() => setIsMeasurementModalOpen(false)}>
                Batal
              </Button>
              <Button variant="primary" size="sm" onClick={handleSaveMeasurement}>
                Simpan Penimbangan
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 2: PENDAFTARAN BALITA BARU */}
      {isNewChildModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4 animate-in fade-in duration-fast">
          <div className="bg-white rounded-3xl max-w-md w-full shadow-2xl border border-slate-200 overflow-hidden flex flex-col">
            <div className="px-5 py-4 border-b border-slate-200 flex items-center justify-between bg-slate-50 shrink-0">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-amber-100 text-amber-800 flex items-center justify-center">
                  <UserPlus className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm font-extrabold text-slate-900">
                    Daftarkan Balita Baru
                  </h3>
                  <p className="text-[11px] text-slate-500">
                    Posyandu Melati 1 (RW 03)
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIsNewChildModalOpen(false)}
                className="w-7 h-7 rounded-full text-slate-400 hover:text-slate-600 hover:bg-slate-200 flex items-center justify-center transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-5 space-y-3.5">
              <div>
                <label className="block text-xs font-bold text-slate-800 mb-1">
                  Nama Lengkap Balita:
                </label>
                <input
                  type="text"
                  placeholder="contoh: Muhammad Alif"
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-teal-600"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <div className="flex justify-between items-center mb-1">
                    <label className="text-xs font-bold text-slate-800">
                      Tgl Lahir:
                    </label>
                    <span className="text-[11px] font-black text-teal-800">
                      {calculatedNewAge} Bulan
                    </span>
                  </div>
                  <input
                    type="date"
                    max={todayStr}
                    value={newBirthDate}
                    onChange={(e) => setNewBirthDate(e.target.value)}
                    className="w-full px-2.5 py-1.5 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-teal-600"
                  />
                  {!isNewAgeValid && newBirthDate && (
                    <span className="text-[10px] text-rose-600 font-bold block mt-0.5">
                      Harus 24-59 bulan
                    </span>
                  )}
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-800 mb-1">
                    Jenis Kelamin:
                  </label>
                  <div className="grid grid-cols-2 gap-1.5 pt-0.5">
                    <button
                      type="button"
                      onClick={() => setNewGender('L')}
                      className={`py-1.5 rounded-lg text-xs font-bold border transition-colors ${
                        newGender === 'L'
                          ? 'bg-teal-50 border-teal-600 text-teal-800'
                          : 'bg-white border-slate-200 text-slate-600'
                      }`}
                    >
                      Laki-laki
                    </button>
                    <button
                      type="button"
                      onClick={() => setNewGender('P')}
                      className={`py-1.5 rounded-lg text-xs font-bold border transition-colors ${
                        newGender === 'P'
                          ? 'bg-rose-50 border-rose-600 text-rose-800'
                          : 'bg-white border-slate-200 text-slate-600'
                      }`}
                    >
                      Perempuan
                    </button>
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-800 mb-1">
                  Nama Ibu / Orang Tua:
                </label>
                <input
                  type="text"
                  placeholder="contoh: Ibu Nurjanah"
                  value={newParentName}
                  onChange={(e) => setNewParentName(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-teal-600"
                />
              </div>
            </div>

            {newChildError && (
              <div className="px-5 pb-2 text-[11px] font-bold text-rose-600">
                {newChildError}
              </div>
            )}
            <div className="p-4 border-t border-slate-200 bg-white flex justify-end gap-2.5 shrink-0">
              <Button variant="secondary" size="sm" onClick={() => setIsNewChildModalOpen(false)}>
                Batal
              </Button>
              <Button
                variant="primary"
                size="sm"
                disabled={!isNewAgeValid || newChildSubmitting}
                isLoading={newChildSubmitting}
                onClick={handleRegisterNewChild}
              >
                Daftarkan ke Posyandu
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
