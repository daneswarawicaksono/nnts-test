import React, { useState } from 'react';
import type { PatientRecord, TierAlert } from '../../types';
import { FhirExportModal } from './FhirExportModal';
import { ClinicianWorklistView } from './ClinicianWorklistView';
import { DiceBearAvatar } from '../illustrations/DiceBearAvatar';
import { soundFX } from '../../services/audioSynth';
import {
  Radar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from 'recharts';
import {
  ShieldAlert,
  AlertTriangle,
  CheckCircle2,
  FileCode2,
  Calendar,
  Clock,
  Pill,
  Send,
  UserCheck,
  ChevronDown,
  ChevronUp,
  Activity,
  CheckSquare,
  Square,
  ArrowRight,
  ArrowLeft,
  Info,
} from 'lucide-react';

interface ClinicianDashboardViewProps {
  patient: PatientRecord;
  allPatients: PatientRecord[];
  onUpdatePatient: (updated: PatientRecord) => void;
  onSwitchToFamily: () => void;
  onOpenNewPatientModal?: () => void;
}

export const ClinicianDashboardView: React.FC<ClinicianDashboardViewProps> = ({
  patient,
  allPatients,
  onUpdatePatient,
  onSwitchToFamily,
  onOpenNewPatientModal,
}) => {
  // Level 1 vs Level 2 state:
  // If selectedPatient is null, show Level 1 (Worklist queue)
  // If selectedPatient is non-null, show Level 2 (Detail Rekam Medis & Triage)
  const [selectedPatient, setSelectedPatient] = useState<PatientRecord | null>(null);

  const [isFhirModalOpen, setIsFhirModalOpen] = useState(false);
  const [isAlertDetailExpanded, setIsAlertDetailExpanded] = useState(false);
  const [isWhoTableExpanded, setIsWhoTableExpanded] = useState(false);
  const [prescriptionToast, setPrescriptionToast] = useState(false);

  // Active record in Level 2: prefer selectedPatient, fallback to patient prop
  const activePatient = selectedPatient || patient;

  // Radar chart data for 3 axes (Fe, Zn, B12)
  const radarData = [
    { subject: 'Zat Besi (Fe)', risk: activePatient.feDeficiencyRisk, fullMark: 100 },
    { subject: 'Seng (Zn)', risk: activePatient.znDeficiencyRisk, fullMark: 100 },
    { subject: 'Vitamin B12', risk: activePatient.b12DeficiencyRisk, fullMark: 100 },
  ];

  const updateActivePatient = (updated: PatientRecord) => {
    setSelectedPatient(updated);
    onUpdatePatient(updated);
  };

  const handleToggleChecklist = (key: keyof PatientRecord['checklist']) => {
    soundFX.playClick();
    const updated = {
      ...activePatient,
      checklist: {
        ...activePatient.checklist,
        [key]: !activePatient.checklist[key],
      },
    };
    updateActivePatient(updated);
  };

  const handleTogglePrescription = (
    key: keyof Omit<PatientRecord['prescriptions'], 'customNotes' | 'isPrescribed' | 'prescribedAt'>
  ) => {
    soundFX.playClick();
    const updated = {
      ...activePatient,
      prescriptions: {
        ...activePatient.prescriptions,
        [key]: !activePatient.prescriptions[key],
      },
    };
    updateActivePatient(updated);
  };

  const handleNotesChange = (text: string) => {
    const updated = {
      ...activePatient,
      prescriptions: {
        ...activePatient.prescriptions,
        customNotes: text,
      },
    };
    updateActivePatient(updated);
  };

  const handleConfirmPrescription = () => {
    soundFX.playSuccess();
    const updated = {
      ...activePatient,
      prescriptions: {
        ...activePatient.prescriptions,
        isPrescribed: true,
        prescribedAt: new Date().toISOString(),
      },
    };
    updateActivePatient(updated);
    setPrescriptionToast(true);
    setTimeout(() => setPrescriptionToast(false), 3500);
  };

  const handleToggleTier = (newTier: TierAlert) => {
    soundFX.playClick();
    const updated = {
      ...activePatient,
      tierAlert: newTier,
    };
    updateActivePatient(updated);
  };

  // 1-Line Streamlined Alert Box Configuration (Natural Puskesmas Clinician Language)
  const getAlertBoxConfig = () => {
    switch (activePatient.tierAlert) {
      case 'Tier-1 Alert (Merah)':
        return {
          containerClass: 'bg-red-50/90 border-l-8 border-l-red-600 border border-red-200 text-slate-900',
          badgeClass: 'bg-red-600 text-white',
          icon: <ShieldAlert className="w-6 h-6 text-red-600 shrink-0" />,
          conclusion: 'Pasien terindikasi Defisiensi Besi Laten dengan respons refleks motorik melambat.',
          actionText: 'Resepkan Suplemen Besi ➔',
          actionHandler: () => {
            soundFX.playClick();
            const updated = {
              ...activePatient,
              prescriptions: {
                ...activePatient.prescriptions,
                ironSyrup: true,
                localDietCounseling: true,
              },
            };
            updateActivePatient(updated);
          },
          technicalDetails: `Latensi motorik: ${activePatient.reactionTime.avgLatency} ms (+${activePatient.reactionTime.avgLatency - 380} ms vs batas normal 350–420 ms). Akurasi atensi prefrontal: ${activePatient.goNoGo.accuracyRate}% dengan ${activePatient.goNoGo.commissionErrors} kesalahan komisi buah busuk.`,
        };
      case 'Tier-2 Alert (Kuning)':
        return {
          containerClass: 'bg-amber-50/90 border-l-8 border-l-amber-500 border border-amber-200 text-slate-900',
          badgeClass: 'bg-amber-500 text-white',
          icon: <AlertTriangle className="w-6 h-6 text-amber-600 shrink-0" />,
          conclusion: 'Pasien berada di ambang batas waspada kekurangan Seng dan Vitamin B12.',
          actionText: 'Beri Konseling & Suplemen Seng ➔',
          actionHandler: () => {
            soundFX.playClick();
            const updated = {
              ...activePatient,
              prescriptions: {
                ...activePatient.prescriptions,
                zincSupplement: true,
                taburiaMNP: true,
                localDietCounseling: true,
              },
            };
            updateActivePatient(updated);
          },
          technicalDetails: `Lingkar lengan atas (LiLA): ${activePatient.muac} cm (ambang batas kuning 11.5–12.5 cm). Skor memori kerja hipokampus: ${activePatient.memorySpan.spanScore}/5.`,
        };
      case 'Normal (Hijau)':
        return {
          containerClass: 'bg-emerald-50/90 border-l-8 border-l-emerald-500 border border-emerald-200 text-slate-900',
          badgeClass: 'bg-emerald-600 text-white',
          icon: <CheckCircle2 className="w-6 h-6 text-emerald-600 shrink-0" />,
          conclusion: 'Pertumbuhan fisik dan refleks motorik anak dalam batas sehat normal.',
          actionText: 'Jadwalkan Kunjungan Rutin ➔',
          actionHandler: () => {
            soundFX.playClick();
            onSwitchToFamily();
          },
          technicalDetails: `Seluruh parameter kognitif dan somatometri dalam rentang ±1 SD rujukan WHO.`,
        };
    }
  };

  // LEVEL 1: RENDER WORKLIST QUEUE
  if (!selectedPatient) {
    return (
      <div className="bg-slate-100/70 min-h-[calc(100vh-80px)] p-4 md:p-6 font-clinical text-slate-800">
        <ClinicianWorklistView
          patients={allPatients}
          onOpenNewPatientModal={onOpenNewPatientModal}
          onSelectPatient={(p) => {
            setSelectedPatient(p);
            onUpdatePatient(p);
          }}
        />
      </div>
    );
  }

  // LEVEL 2: RENDER PATIENT DETAIL EHR VIEW
  const alertConfig = getAlertBoxConfig();

  return (
    <div className="bg-slate-100/70 min-h-[calc(100vh-80px)] p-4 md:p-6 font-clinical text-slate-800 space-y-6">
      {/* Toast Notification */}
      {prescriptionToast && (
        <div className="fixed top-20 right-6 z-50 bg-emerald-700 text-white px-5 py-3 rounded-xl shadow-xl flex items-center gap-2.5 animate-in slide-in-from-top-4 border border-emerald-600">
          <CheckCircle2 className="w-5 h-5 text-emerald-200" />
          <div>
            <span className="font-bold text-sm block">Resep Pengobatan Telah Disimpan</span>
            <span className="text-xs text-emerald-100">Status rekam medis berhasil diperbarui untuk kunjungan hari ini.</span>
          </div>
        </div>
      )}

      {/* TOP NAVIGATION BREADCRUMB: Kembali ke Daftar Antrean Pasien (Worklist) */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-1 border-b border-slate-200/80">
        <button
          onClick={() => {
            soundFX.playClick();
            setSelectedPatient(null);
          }}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-2xl bg-white hover:bg-slate-50 border border-slate-300 text-slate-700 hover:text-slate-900 text-xs font-bold transition-all shadow-2xs hover:shadow-xs group active:scale-95"
        >
          <ArrowLeft className="w-4 h-4 text-teal-600 transition-transform group-hover:-translate-x-1" />
          <span>← Kembali ke Daftar Pasien (Antrean Worklist)</span>
        </button>

        <div className="flex items-center gap-2 text-xs text-slate-500 font-medium">
          <span>Antrean Puskesmas</span>
          <span>/</span>
          <span className="font-bold text-slate-800">{activePatient.name}</span>
          <span className="font-mono text-slate-400">({activePatient.id})</span>
        </div>
      </div>

      {/* 1. Header Bar: Identitas Pasien dengan Avatar DiceBear & Sub-menu Ekspor Administratif */}
      <div className="bg-white rounded-2xl p-4 border border-slate-200/90 shadow-xs flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3.5">
          <DiceBearAvatar
            seed={activePatient.name}
            gender={activePatient.gender}
            size={52}
            className="border-2 border-slate-100 shadow-2xs"
          />
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-lg font-bold text-slate-900 leading-tight">
                {activePatient.name}
              </h1>
              <span className="font-mono text-[11px] font-bold px-2 py-0.5 rounded-md bg-slate-100 text-slate-600 border border-slate-200">
                {activePatient.id}
              </span>
              <span className="text-xs text-slate-500 font-medium hidden sm:inline">
                • {activePatient.ageMonths} Bulan ({activePatient.gender === 'P' ? 'Perempuan' : 'Laki-laki'})
              </span>
            </div>
            <p className="text-xs text-slate-500 font-medium mt-0.5">
              {activePatient.posyandu} • Tanggal Periksa: {activePatient.examDate}
            </p>
          </div>
        </div>

        {/* Priority Override & Demoted Administrative Link */}
        <div className="flex items-center gap-3">
          <div className="flex items-center bg-slate-100 p-1 rounded-xl border border-slate-200 text-xs font-semibold">
            <span className="text-[11px] text-slate-400 px-2 font-medium">Prioritas:</span>
            {(['Tier-1 Alert (Merah)', 'Tier-2 Alert (Kuning)', 'Normal (Hijau)'] as TierAlert[]).map((tier) => (
              <button
                key={tier}
                onClick={() => handleToggleTier(tier)}
                className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all ${
                  activePatient.tierAlert === tier
                    ? tier.includes('Merah')
                      ? 'bg-red-600 text-white shadow-xs'
                      : tier.includes('Kuning')
                      ? 'bg-amber-500 text-white shadow-xs'
                      : 'bg-emerald-600 text-white shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {tier.split(' ')[0]}
              </button>
            ))}
          </div>

          <button
            onClick={() => {
              soundFX.playClick();
              setIsFhirModalOpen(true);
            }}
            className="px-3 py-1.5 rounded-xl border border-slate-300 hover:bg-slate-50 text-slate-600 hover:text-slate-900 text-xs font-semibold flex items-center gap-1.5 transition-colors shadow-xs"
            title="Ekspor Rekam Medis Standar"
          >
            <FileCode2 className="w-3.5 h-3.5 text-teal-600" />
            <span>Ekspor RME / FHIR</span>
          </button>
        </div>
      </div>

      {/* 2. ALERT BOX STREAMLINED: 1 Baris Kesimpulan + 1 Tombol Aksi + Expand Detail */}
      <div className={`rounded-2xl p-4 sm:p-5 ${alertConfig.containerClass} shadow-xs space-y-2`}>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            {alertConfig.icon}
            <div className="flex flex-wrap items-center gap-2">
              <span className={`text-[10px] font-black px-2 py-0.5 rounded uppercase tracking-wider ${alertConfig.badgeClass}`}>
                {activePatient.tierAlert.split(' ')[0]}
              </span>
              <p className="text-sm sm:text-base font-bold text-slate-900 leading-tight">
                {alertConfig.conclusion}
              </p>
            </div>
          </div>

          <button
            onClick={alertConfig.actionHandler}
            className="px-5 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold shadow-sm flex items-center gap-2 shrink-0 transition-all active:scale-95"
          >
            <span>{alertConfig.actionText}</span>
          </button>
        </div>

        {/* Collapsible Technical Detail */}
        <div className="pt-1 pl-9">
          <button
            onClick={() => setIsAlertDetailExpanded(!isAlertDetailExpanded)}
            className="text-xs font-semibold text-slate-500 hover:text-slate-800 flex items-center gap-1"
          >
            <span>{isAlertDetailExpanded ? 'Sembunyikan rincian teknis' : 'Tampilkan rincian teknis angka'}</span>
            {isAlertDetailExpanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
          </button>

          {isAlertDetailExpanded && (
            <div className="mt-2 p-3 bg-white/80 rounded-xl border border-slate-200 text-xs text-slate-700 font-mono tabular-nums leading-relaxed animate-in fade-in">
              {alertConfig.technicalDetails}
            </div>
          )}
        </div>
      </div>

      {/* 3. Tremor-Style Light KPI Cards (Perkiraan Risiko Kurang Gizi Mikro) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Card Fe */}
        <div className="bg-white rounded-2xl p-4 border border-slate-200/90 shadow-xs relative overflow-hidden">
          <div className={`absolute top-0 left-0 right-0 h-1 ${activePatient.feDeficiencyRisk >= 80 ? 'bg-red-500' : activePatient.feDeficiencyRisk >= 50 ? 'bg-amber-500' : 'bg-emerald-500'}`} />
          <div className="flex justify-between items-start">
            <div>
              <span className="text-xs text-slate-500 font-medium block">Risiko Kurang Zat Besi (Fe)</span>
              <span className="text-2xl font-black text-slate-900 font-mono tabular-nums mt-1 block">
                {activePatient.feDeficiencyRisk}%
              </span>
            </div>
            <span className={`text-xs px-2.5 py-0.5 rounded-full font-bold ${
              activePatient.feDeficiencyRisk >= 80 ? 'bg-red-100 text-red-700 border border-red-200' : 'bg-emerald-100 text-emerald-700'
            }`}>
              {activePatient.feDeficiencyRisk >= 80 ? 'Perlu Terapi' : 'Aman'}
            </span>
          </div>
          <p className="text-[11px] text-slate-500 mt-2">
            Pengaruh: Kecepatan respon refleks & stamina anak
          </p>
        </div>

        {/* Card Zn */}
        <div className="bg-white rounded-2xl p-4 border border-slate-200/90 shadow-xs relative overflow-hidden">
          <div className={`absolute top-0 left-0 right-0 h-1 ${activePatient.znDeficiencyRisk >= 80 ? 'bg-red-500' : activePatient.znDeficiencyRisk >= 50 ? 'bg-amber-500' : 'bg-emerald-500'}`} />
          <div className="flex justify-between items-start">
            <div>
              <span className="text-xs text-slate-500 font-medium block">Risiko Kurang Seng (Zn)</span>
              <span className="text-2xl font-black text-slate-900 font-mono tabular-nums mt-1 block">
                {activePatient.znDeficiencyRisk}%
              </span>
            </div>
            <span className={`text-xs px-2.5 py-0.5 rounded-full font-bold ${
              activePatient.znDeficiencyRisk >= 80 ? 'bg-red-100 text-red-700 border border-red-200' : 'bg-emerald-100 text-emerald-700'
            }`}>
              {activePatient.znDeficiencyRisk >= 80 ? 'Perlu Terapi' : 'Aman'}
            </span>
          </div>
          <p className="text-[11px] text-slate-500 mt-2">
            Pengaruh: Daya tahan tubuh & ketebalan otot (LiLA)
          </p>
        </div>

        {/* Card B12 */}
        <div className="bg-white rounded-2xl p-4 border border-slate-200/90 shadow-xs relative overflow-hidden">
          <div className={`absolute top-0 left-0 right-0 h-1 ${activePatient.b12DeficiencyRisk >= 80 ? 'bg-red-500' : activePatient.b12DeficiencyRisk >= 50 ? 'bg-amber-500' : 'bg-emerald-500'}`} />
          <div className="flex justify-between items-start">
            <div>
              <span className="text-xs text-slate-500 font-medium block">Risiko Kurang Vitamin B12</span>
              <span className="text-2xl font-black text-slate-900 font-mono tabular-nums mt-1 block">
                {activePatient.b12DeficiencyRisk}%
              </span>
            </div>
            <span className={`text-xs px-2.5 py-0.5 rounded-full font-bold ${
              activePatient.b12DeficiencyRisk >= 80 ? 'bg-red-100 text-red-700 border border-red-200' : 'bg-emerald-100 text-emerald-700'
            }`}>
              {activePatient.b12DeficiencyRisk >= 80 ? 'Perlu Terapi' : 'Aman'}
            </span>
          </div>
          <p className="text-[11px] text-slate-500 mt-2">
            Pengaruh: Kemampuan konsentrasi & daya ingat
          </p>
        </div>
      </div>

      {/* 4. Core Clinical Workspace: Spider Radar & Pemeriksaan Fisik / Rencana Terapi */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Perkiraan Risiko Radar */}
        <div className="lg:col-span-5 space-y-4">
          <div className="bg-white rounded-2xl p-5 border border-slate-200/90 shadow-xs space-y-3">
            <div className="border-b border-slate-100 pb-2.5">
              <h3 className="font-bold text-sm text-slate-900">Perkiraan Risiko Kurang Gizi Mikro</h3>
              <p className="text-xs text-slate-500">Korelasi hasil game refleks & ukuran lengan anak</p>
            </div>

            <div className="w-full h-56 flex items-center justify-center">
              <ResponsiveContainer width="100%" height="100%">
                <RadarChart cx="50%" cy="50%" outerRadius="75%" data={radarData}>
                  <PolarGrid stroke="#E2E8F0" />
                  <PolarAngleAxis dataKey="subject" tick={{ fill: '#475569', fontSize: 11, fontWeight: 600 }} />
                  <PolarRadiusAxis angle={30} domain={[0, 100]} stroke="#CBD5E1" tick={{ fontSize: 9, fill: '#94A3B8' }} />
                  <Radar
                    name="Tingkat Risiko"
                    dataKey="risk"
                    stroke="#0D9488"
                    fill="#0D9488"
                    fillOpacity={0.3}
                  />
                </RadarChart>
              </ResponsiveContainer>
            </div>

            {/* Practical Notes */}
            <div className="pt-2 border-t border-slate-100 text-xs space-y-1.5 text-slate-700">
              <span className="font-bold text-slate-800 flex items-center gap-1.5">
                <Info className="w-3.5 h-3.5 text-teal-600" />
                Catatan Petugas Gizi:
              </span>
              {activePatient.clinicalRationale.map((rat, i) => (
                <p key={i} className="text-slate-600 pl-2 border-l-2 border-teal-500 leading-relaxed">
                  {rat}
                </p>
              ))}
            </div>
          </div>
        </div>

        {/* Right: Pemeriksaan Fisik Pasien & Rencana Pengobatan */}
        <div className="lg:col-span-7 space-y-4">
          {/* Pemeriksaan Fisik Sederhana */}
          <div className="bg-white rounded-2xl p-5 border border-slate-200/90 shadow-xs space-y-3">
            <div className="border-b border-slate-100 pb-2">
              <h3 className="font-bold text-sm text-slate-900 flex items-center gap-2">
                <UserCheck className="w-4 h-4 text-teal-600" />
                Pemeriksaan Fisik Pasien (Centang bila ditemukan)
              </h3>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
              <label
                onClick={() => handleToggleChecklist('paleConjunctiva')}
                className={`p-2.5 rounded-xl border flex items-center gap-2 cursor-pointer transition-colors ${
                  activePatient.checklist.paleConjunctiva
                    ? 'bg-red-50 border-red-300 text-red-900 font-semibold'
                    : 'bg-slate-50 border-slate-200 text-slate-700'
                }`}
              >
                {activePatient.checklist.paleConjunctiva ? (
                  <CheckSquare className="w-4 h-4 text-red-600 shrink-0" />
                ) : (
                  <Square className="w-4 h-4 text-slate-400 shrink-0" />
                )}
                <span>Kelopak Mata Pucat (Konjungtiva)</span>
              </label>

              <label
                onClick={() => handleToggleChecklist('posturalFatigue')}
                className={`p-2.5 rounded-xl border flex items-center gap-2 cursor-pointer transition-colors ${
                  activePatient.checklist.posturalFatigue
                    ? 'bg-amber-50 border-amber-300 text-amber-900 font-semibold'
                    : 'bg-slate-50 border-slate-200 text-slate-700'
                }`}
              >
                {activePatient.checklist.posturalFatigue ? (
                  <CheckSquare className="w-4 h-4 text-amber-600 shrink-0" />
                ) : (
                  <Square className="w-4 h-4 text-slate-400 shrink-0" />
                )}
                <span>Anak Tampak Cepat Lelah / Lemas</span>
              </label>

              <label
                onClick={() => handleToggleChecklist('lowAnimalProteinDiet')}
                className={`p-2.5 rounded-xl border flex items-center gap-2 cursor-pointer transition-colors ${
                  activePatient.checklist.lowAnimalProteinDiet
                    ? 'bg-amber-50 border-amber-300 text-amber-900 font-semibold'
                    : 'bg-slate-50 border-slate-200 text-slate-700'
                }`}
              >
                {activePatient.checklist.lowAnimalProteinDiet ? (
                  <CheckSquare className="w-4 h-4 text-amber-600 shrink-0" />
                ) : (
                  <Square className="w-4 h-4 text-slate-400 shrink-0" />
                )}
                <span>Jarang Makan Lauk Hewani (Telur/Ikan/Daging)</span>
              </label>

              <label
                onClick={() => handleToggleChecklist('noAcuteInfection')}
                className={`p-2.5 rounded-xl border flex items-center gap-2 cursor-pointer transition-colors ${
                  activePatient.checklist.noAcuteInfection
                    ? 'bg-emerald-50 border-emerald-300 text-emerald-900 font-semibold'
                    : 'bg-slate-50 border-slate-200 text-slate-700'
                }`}
              >
                {activePatient.checklist.noAcuteInfection ? (
                  <CheckSquare className="w-4 h-4 text-emerald-600 shrink-0" />
                ) : (
                  <Square className="w-4 h-4 text-slate-400 shrink-0" />
                )}
                <span>Tidak Sedang Demam atau Batuk/Pilek Berat</span>
              </label>
            </div>
          </div>

          {/* Rencana Pengobatan & Suplementasi */}
          <div className="bg-white rounded-2xl p-5 border border-slate-200/90 shadow-xs space-y-3">
            <div className="flex items-center justify-between border-b border-slate-100 pb-2">
              <h3 className="font-bold text-sm text-slate-900 flex items-center gap-2">
                <Pill className="w-4 h-4 text-teal-600" />
                Rencana Pengobatan & Suplementasi
              </h3>
              {activePatient.prescriptions.isPrescribed && (
                <span className="px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5" /> Sudah Diresepkan
                </span>
              )}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
              <label
                onClick={() => handleTogglePrescription('ironSyrup')}
                className={`p-2.5 rounded-xl border flex items-center gap-2 cursor-pointer transition-colors ${
                  activePatient.prescriptions.ironSyrup
                    ? 'bg-teal-50 border-teal-400 text-teal-950 font-bold'
                    : 'bg-slate-50 border-slate-200 text-slate-600'
                }`}
              >
                <input type="checkbox" checked={activePatient.prescriptions.ironSyrup} readOnly className="rounded text-teal-600" />
                <span>Sirup Besi (3 mg/kgBB/hari)</span>
              </label>

              <label
                onClick={() => handleTogglePrescription('zincSupplement')}
                className={`p-2.5 rounded-xl border flex items-center gap-2 cursor-pointer transition-colors ${
                  activePatient.prescriptions.zincSupplement
                    ? 'bg-teal-50 border-teal-400 text-teal-950 font-bold'
                    : 'bg-slate-50 border-slate-200 text-slate-600'
                }`}
              >
                <input type="checkbox" checked={activePatient.prescriptions.zincSupplement} readOnly className="rounded text-teal-600" />
                <span>Tablet / Sirup Seng (10–20 mg/hari)</span>
              </label>

              <label
                onClick={() => handleTogglePrescription('taburiaMNP')}
                className={`p-2.5 rounded-xl border flex items-center gap-2 cursor-pointer transition-colors ${
                  activePatient.prescriptions.taburiaMNP
                    ? 'bg-teal-50 border-teal-400 text-teal-950 font-bold'
                    : 'bg-slate-50 border-slate-200 text-slate-600'
                }`}
              >
                <input type="checkbox" checked={activePatient.prescriptions.taburiaMNP} readOnly className="rounded text-teal-600" />
                <span>Bubuk Taburia (Vitamin & Mineral)</span>
              </label>

              <label
                onClick={() => handleTogglePrescription('localDietCounseling')}
                className={`p-2.5 rounded-xl border flex items-center gap-2 cursor-pointer transition-colors ${
                  activePatient.prescriptions.localDietCounseling
                    ? 'bg-teal-50 border-teal-400 text-teal-950 font-bold'
                    : 'bg-slate-50 border-slate-200 text-slate-600'
                }`}
              >
                <input type="checkbox" checked={activePatient.prescriptions.localDietCounseling} readOnly className="rounded text-teal-600" />
                <span>Konseling Menu Hati Ayam & Telur</span>
              </label>
            </div>

            <div>
              <textarea
                value={activePatient.prescriptions.customNotes}
                onChange={(e) => handleNotesChange(e.target.value)}
                rows={2}
                className="w-full text-xs p-2.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-teal-500 text-slate-800"
                placeholder="Catatan tambahan petunjuk minum obat untuk ibu..."
              />
            </div>

            <div className="flex justify-end pt-1">
              <button
                onClick={handleConfirmPrescription}
                className="px-5 py-2.5 bg-teal-600 hover:bg-teal-700 text-white rounded-xl text-xs font-bold flex items-center gap-2 shadow-sm transition-all hover:scale-102"
              >
                <Send className="w-4 h-4" />
                Simpan Resep & Pengobatan
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* 5. Collapsible: Data Uji Lengkap & Rujukan WHO */}
      <div className="bg-white rounded-2xl border border-slate-200/90 overflow-hidden shadow-xs">
        <button
          onClick={() => setIsWhoTableExpanded(!isWhoTableExpanded)}
          className="w-full px-5 py-3.5 flex items-center justify-between text-xs font-bold text-slate-700 hover:bg-slate-50 transition-colors"
        >
          <div className="flex items-center gap-2">
            <Activity className="w-4 h-4 text-teal-600" />
            <span>Data Uji Lengkap & Rujukan WHO (Klik untuk Buka/Tutup)</span>
          </div>
          {isWhoTableExpanded ? <ChevronUp className="w-4 h-4 text-slate-400" /> : <ChevronDown className="w-4 h-4 text-slate-400" />}
        </button>

        {isWhoTableExpanded && (
          <div className="p-4 border-t border-slate-100 overflow-x-auto">
            <table className="w-full text-xs text-left">
              <thead>
                <tr className="bg-slate-50 text-slate-500 border-b border-slate-200">
                  <th className="py-2 px-3">Uji Pemeriksaan</th>
                  <th className="py-2 px-3">Hasil Pasien</th>
                  <th className="py-2 px-3">Batas Rujukan Normal</th>
                  <th className="py-2 px-3">Kesimpulan</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-mono tabular-nums">
                <tr>
                  <td className="py-2 px-3 text-slate-800">Kecepatan Refleks Balon</td>
                  <td className="py-2 px-3 font-bold text-slate-900">{activePatient.reactionTime.avgLatency} ms</td>
                  <td className="py-2 px-3 text-slate-500">350–420 ms</td>
                  <td className="py-2 px-3">
                    <span className={`px-2 py-0.5 rounded text-[11px] font-bold ${activePatient.reactionTime.avgLatency > 480 ? 'bg-red-100 text-red-700' : 'bg-emerald-100 text-emerald-700'}`}>
                      {activePatient.reactionTime.avgLatency > 480 ? 'Melambat' : 'Normal'}
                    </span>
                  </td>
                </tr>
                <tr>
                  <td className="py-2 px-3 text-slate-800">Akurasi Pilih Buah (Go/No-Go)</td>
                  <td className="py-2 px-3 font-bold text-slate-900">{activePatient.goNoGo.accuracyRate}%</td>
                  <td className="py-2 px-3 text-slate-500">&gt; 80%</td>
                  <td className="py-2 px-3">
                    <span className={`px-2 py-0.5 rounded text-[11px] font-bold ${activePatient.goNoGo.accuracyRate < 70 ? 'bg-red-100 text-red-700' : 'bg-emerald-100 text-emerald-700'}`}>
                      {activePatient.goNoGo.accuracyRate < 70 ? 'Kurang Teliti' : 'Bagus'}
                    </span>
                  </td>
                </tr>
                <tr>
                  <td className="py-2 px-3 text-slate-800">Daya Ingat Hewan Terbalik</td>
                  <td className="py-2 px-3 font-bold text-slate-900">Skor {activePatient.memorySpan.spanScore} / 5</td>
                  <td className="py-2 px-3 text-slate-500">&ge; 3</td>
                  <td className="py-2 px-3">
                    <span className={`px-2 py-0.5 rounded text-[11px] font-bold ${activePatient.memorySpan.spanScore <= 2 ? 'bg-amber-100 text-amber-700' : 'bg-emerald-100 text-emerald-700'}`}>
                      {activePatient.memorySpan.spanScore <= 2 ? 'Perlu Dilatih' : 'Bagus'}
                    </span>
                  </td>
                </tr>
                <tr>
                  <td className="py-2 px-3 text-slate-800">Ukuran LiLA (Lingkar Lengan)</td>
                  <td className="py-2 px-3 font-bold text-slate-900">{activePatient.muac} cm</td>
                  <td className="py-2 px-3 text-slate-500">&gt; 12.5 cm (Pita Hijau)</td>
                  <td className="py-2 px-3">
                    <span className={`px-2 py-0.5 rounded text-[11px] font-bold ${activePatient.muac < 11.5 ? 'bg-red-100 text-red-700' : activePatient.muac <= 12.5 ? 'bg-amber-100 text-amber-700' : 'bg-emerald-100 text-emerald-700'}`}>
                      {activePatient.muac < 11.5 ? 'Kurang Gizi' : activePatient.muac <= 12.5 ? 'Waspada' : 'Normal'}
                    </span>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* 6. Jadwal Kontrol & Pemantauan Perbaikan (4 Minggu) */}
      <div className="bg-white rounded-2xl p-5 border border-slate-200/90 shadow-xs space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 pb-3">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-teal-50 text-teal-700 border border-teal-100">
              <Clock className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-sm text-slate-900">Jadwal Kontrol & Pemantauan Perbaikan (4 Minggu)</h3>
              <p className="text-xs text-slate-500">Respons pemulihan refleks motorik setelah suplementasi besi</p>
            </div>
          </div>

          <div className="flex items-center gap-2 bg-teal-50 border border-teal-200 px-3.5 py-1 rounded-xl text-teal-800 text-xs font-bold">
            <Calendar className="w-4 h-4 text-teal-600" />
            Jadwal Tes Ulang: {activePatient.followUpWindowWeeks}
          </div>
        </div>

        <div className="h-52">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={activePatient.historicTrend} margin={{ top: 10, right: 20, left: 0, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" />
              <XAxis dataKey="week" tick={{ fontSize: 11, fill: '#64748B' }} />
              <YAxis domain={[340, 560]} unit="ms" tick={{ fontSize: 11, fill: '#64748B' }} />
              <Tooltip
                contentStyle={{ backgroundColor: '#0F172A', borderRadius: '8px', border: 'none', color: '#F8FAFC', fontSize: '11px' }}
              />
              <Line
                type="monotone"
                dataKey="latency"
                name="Kecepatan Respon Pasien (ms)"
                stroke="#0D9488"
                strokeWidth={3}
                dot={{ r: 5, fill: '#0D9488' }}
              />
              <Line
                type="monotone"
                dataKey="normalBaseline"
                name="Batas Normal (ms)"
                stroke="#94A3B8"
                strokeDasharray="4 4"
                strokeWidth={2}
                dot={false}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Button to Family View */}
      <div className="flex justify-end pt-1">
        <button
          onClick={onSwitchToFamily}
          className="px-5 py-2.5 bg-amber-500 hover:bg-amber-600 text-white rounded-xl text-xs font-bold shadow-md shadow-amber-500/20 flex items-center gap-2 transition-all hover:scale-102"
        >
          <span>Buka Tampilan Laporan Keluarga</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>

      {/* FHIR Export Modal */}
      <FhirExportModal
        isOpen={isFhirModalOpen}
        onClose={() => setIsFhirModalOpen(false)}
        patient={activePatient}
      />
    </div>
  );
};
