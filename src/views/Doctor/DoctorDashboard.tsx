import React, { useState, useMemo } from 'react';
import {
  Activity,
  LogOut,
  Search,
  CheckCircle2,
  FileJson,
  Copy,
  Check,
  Sparkles,
  ArrowLeft,
  X,
  Stethoscope,
  ClipboardList,
} from 'lucide-react';
import { GlassCard } from '../../design-system/primitives/GlassCard';
import { Button } from '../../design-system/primitives/Button';
import { soundSynth } from '../../services/audio/synth';
import type { AuthSession } from '../../types/role';

export interface DoctorDashboardProps {
  session: AuthSession;
  onLogout: () => void;
}

export type TriageTier = 'Tier-1 Alert (Merah)' | 'Tier-2 Alert (Kuning)' | 'Normal (Hijau)';

export interface ClinicalPatient {
  id: string;
  childName: string;
  ageMonths: number;
  gender: 'L' | 'P';
  posyandu: string;
  rw: string;
  tier: TriageTier;
  screenedAt: string;
  // Neurocognitive telemetry
  latencyMs: number;
  accuracyRate: number;
  commissionErrors: number;
  memorySpan: number;
  // Somatic anthropometry
  weightKg: number;
  heightCm: number;
  muacCm: number;
  waz: number;
  haz: number;
  whz: number;
  // Clinical physical markers
  paleConjunctiva: boolean;
  angularStomatitis: boolean;
  skinDryness: boolean;
  // Intervention record
  supplementNotes: string[];
  labReferral: string;
  clinicalNotes: string;
  interventionSaved?: boolean;
}

const PRESET_PATIENTS: ClinicalPatient[] = [
  {
    id: 'P-MLT-01',
    childName: 'Ananda Kevin',
    ageMonths: 32,
    gender: 'L',
    posyandu: 'Posyandu Melati 1',
    rw: 'RW 03',
    tier: 'Tier-1 Alert (Merah)',
    screenedAt: '03 Nov 2026',
    latencyMs: 510,
    accuracyRate: 60,
    commissionErrors: 4,
    memorySpan: 2,
    weightKg: 10.8,
    heightCm: 84.5,
    muacCm: 11.2,
    waz: -2.4,
    haz: -2.8,
    whz: -1.9,
    paleConjunctiva: true,
    angularStomatitis: true,
    skinDryness: false,
    supplementNotes: ['Sirup Besi Elemental 3 mg/kgBB/hari (6 pekan)', 'Suplementasi Zinc 20 mg/hari (14 hari)'],
    labReferral: 'Pemeriksaan Serum Ferritin & Darah Lengkap (Hb)',
    clinicalNotes: 'Terindikasi defisiensi zat besi fungsional nyata dengan penurunan transmisi dopaminergik basal dan tanda konjungtiva anemis.',
  },
  {
    id: 'P-MWR-02',
    childName: 'Rian Pratama',
    ageMonths: 28,
    gender: 'L',
    posyandu: 'Posyandu Mawar 2',
    rw: 'RW 05',
    tier: 'Tier-2 Alert (Kuning)',
    screenedAt: '02 Nov 2026',
    latencyMs: 440,
    accuracyRate: 70,
    commissionErrors: 2,
    memorySpan: 2,
    weightKg: 11.5,
    heightCm: 87.0,
    muacCm: 12.3,
    waz: -1.5,
    haz: -1.8,
    whz: -1.1,
    paleConjunctiva: false,
    angularStomatitis: true,
    skinDryness: true,
    supplementNotes: ['Taburia MNP 1 sachet per 2 hari', 'Edukasi PMBA pangan hewani kaya seng'],
    labReferral: 'Pemantauan berkala 2 pekan di Posyandu',
    clinicalNotes: 'Defisiensi seng subklinis ringan dengan kegagalan kontrol inhibisi motorik.',
  },
  {
    id: 'P-MLT-03',
    childName: 'Zahra Salsabila',
    ageMonths: 34,
    gender: 'P',
    posyandu: 'Posyandu Melati 1',
    rw: 'RW 03',
    tier: 'Normal (Hijau)',
    screenedAt: '01 Nov 2026',
    latencyMs: 310,
    accuracyRate: 90,
    commissionErrors: 0,
    memorySpan: 3,
    weightKg: 13.6,
    heightCm: 94.0,
    muacCm: 14.0,
    waz: 0.2,
    haz: -0.4,
    whz: 0.5,
    paleConjunctiva: false,
    angularStomatitis: false,
    skinDryness: false,
    supplementNotes: ['Lanjutkan pemberian makanan keluarga gizi seimbang'],
    labReferral: 'Tidak memerlukan rujukan lanjutan',
    clinicalNotes: 'Tumbuh kembang optimal, atensi dan memori kerja sangat baik.',
  },
];

export const DoctorDashboard: React.FC<DoctorDashboardProps> = ({ session, onLogout }) => {
  const [patients, setPatients] = useState<ClinicalPatient[]>(PRESET_PATIENTS);
  const [selectedPatientId, setSelectedPatientId] = useState<string>('P-MLT-01');
  const [searchQuery, setSearchQuery] = useState('');
  const [tierFilter, setTierFilter] = useState<'all' | 'Tier-1' | 'Tier-2' | 'Normal'>('all');
  const [activeTab, setActiveTab] = useState<'telemetri' | 'somatik' | 'intervensi'>('telemetri');
  const [showFhirModal, setShowFhirModal] = useState(false);
  const [fhirCopied, setFhirCopied] = useState(false);

  // Mobile detail view toggle
  const [isMobileDetailOpen, setIsMobileDetailOpen] = useState(false);

  // Intervention form state for active patient
  const activePatient = patients.find((p) => p.id === selectedPatientId) || patients[0];
  const [interventionText, setInterventionText] = useState(activePatient.clinicalNotes);
  const [labReferralText, setLabReferralText] = useState(activePatient.labReferral);

  // Filtered patients
  const filteredPatients = useMemo(() => {
    return patients.filter((p) => {
      const matchSearch =
        p.childName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.posyandu.toLowerCase().includes(searchQuery.toLowerCase());

      const matchTier =
        tierFilter === 'all' ||
        (tierFilter === 'Tier-1' && p.tier.includes('Tier-1')) ||
        (tierFilter === 'Tier-2' && p.tier.includes('Tier-2')) ||
        (tierFilter === 'Normal' && p.tier.includes('Normal'));

      return matchSearch && matchTier;
    });
  }, [patients, searchQuery, tierFilter]);

  const handleSelectPatient = (patient: ClinicalPatient) => {
    soundSynth.playPop();
    setSelectedPatientId(patient.id);
    setInterventionText(patient.clinicalNotes);
    setLabReferralText(patient.labReferral);
    setIsMobileDetailOpen(true);
  };

  const handleSaveIntervention = () => {
    soundSynth.playChime();
    setPatients((prev) =>
      prev.map((p) =>
        p.id === activePatient.id
          ? {
              ...p,
              clinicalNotes: interventionText,
              labReferral: labReferralText,
              interventionSaved: true,
            }
          : p
      )
    );
    alert('Catatan intervensi medis berhasil disimpan ke rekam faskes.');
  };

  // Generate SATUSEHAT FHIR R4 Bundle JSON
  const fhirBundlePayload = useMemo(() => {
    return {
      resourceType: 'Bundle',
      id: `satusehat-nnts-${activePatient.id.toLowerCase()}`,
      meta: {
        profile: [
          'https://fhir.kemkes.go.id/r4/StructureDefinition/ClinicalDecisionSupportBundle',
          'http://openehr.org/fhir/4.0/StructureDefinition/PediatricNutritionTriage',
        ],
        lastUpdated: new Date().toISOString(),
      },
      type: 'collection',
      entry: [
        {
          fullUrl: `urn:uuid:patient-${activePatient.id}`,
          resource: {
            resourceType: 'Patient',
            id: activePatient.id,
            identifier: [
              {
                system: 'https://fhir.kemkes.go.id/id/satusehat-child-id',
                value: activePatient.id,
              },
            ],
            gender: activePatient.gender === 'P' ? 'female' : 'male',
            extension: [
              {
                url: 'https://fhir.kemkes.go.id/StructureDefinition/administrative-age-months',
                valueInteger: activePatient.ageMonths,
              },
              {
                url: 'https://fhir.kemkes.go.id/StructureDefinition/posyandu-origin',
                valueString: `${activePatient.posyandu} (${activePatient.rw})`,
              },
            ],
          },
        },
        {
          fullUrl: `urn:uuid:obs-neuro-latency-${activePatient.id}`,
          resource: {
            resourceType: 'Observation',
            status: 'final',
            code: {
              coding: [
                {
                  system: 'http://loinc.org',
                  code: '70258-9',
                  display: 'Reaction time test',
                },
              ],
            },
            valueQuantity: {
              value: activePatient.latencyMs,
              unit: 'ms',
              system: 'http://unitsofmeasure.org',
              code: 'ms',
            },
          },
        },
        {
          fullUrl: `urn:uuid:obs-muac-${activePatient.id}`,
          resource: {
            resourceType: 'Observation',
            status: 'final',
            code: {
              coding: [
                {
                  system: 'http://loinc.org',
                  code: '56072-2',
                  display: 'Mid upper arm circumference',
                },
              ],
            },
            valueQuantity: {
              value: activePatient.muacCm,
              unit: 'cm',
              system: 'http://unitsofmeasure.org',
              code: 'cm',
            },
          },
        },
        {
          fullUrl: `urn:uuid:impression-${activePatient.id}`,
          resource: {
            resourceType: 'ClinicalImpression',
            status: 'completed',
            description: activePatient.tier,
            summary: activePatient.clinicalNotes,
          },
        },
      ],
    };
  }, [activePatient]);

  const handleCopyFhir = () => {
    soundSynth.playChime();
    navigator.clipboard.writeText(JSON.stringify(fhirBundlePayload, null, 2));
    setFhirCopied(true);
    setTimeout(() => setFhirCopied(false), 2000);
  };

  return (
    <div className="w-full h-full bg-slate-50 flex flex-col justify-between font-sans select-none relative overflow-hidden">
      {/* CLINICAL TOP WORKSTATION BAR */}
      <header className="px-5 py-3.5 bg-white border-b border-slate-200 flex items-center justify-between z-10 shrink-0 shadow-xs">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-nutri-teal-700 text-white flex items-center justify-center shadow-subtle shrink-0">
            <Stethoscope className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[11px] font-black text-nutri-teal-700 uppercase tracking-wider">
                CDSS Faskes Tingkat Pertama
              </span>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-100 text-slate-700 border border-slate-200">
                {session.user.faskesId || 'Puskesmas Tegalrejo'}
              </span>
            </div>
            <h1 className="text-sm sm:text-base font-extrabold text-slate-900 leading-tight">
              {session.user.fullName}
            </h1>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {/* Quick Preset Scenarios Button */}
          <div className="hidden sm:flex items-center gap-1.5 mr-2">
            <span className="text-[11px] font-semibold text-slate-400">Simulasi:</span>
            <button
              onClick={() => handleSelectPatient(PRESET_PATIENTS[0])}
              className={`text-[11px] font-bold px-2.5 py-1 rounded-lg border transition-colors ${
                selectedPatientId === PRESET_PATIENTS[0].id
                  ? 'bg-rose-50 border-rose-300 text-rose-700'
                  : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
              }`}
            >
              Kasus 1: Defisiensi Fe
            </button>
            <button
              onClick={() => handleSelectPatient(PRESET_PATIENTS[1])}
              className={`text-[11px] font-bold px-2.5 py-1 rounded-lg border transition-colors ${
                selectedPatientId === PRESET_PATIENTS[1].id
                  ? 'bg-amber-50 border-amber-300 text-amber-700'
                  : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
              }`}
            >
              Kasus 2: Inhibisi Zn
            </button>
            <button
              onClick={() => handleSelectPatient(PRESET_PATIENTS[2])}
              className={`text-[11px] font-bold px-2.5 py-1 rounded-lg border transition-colors ${
                selectedPatientId === PRESET_PATIENTS[2].id
                  ? 'bg-emerald-50 border-emerald-300 text-emerald-700'
                  : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
              }`}
            >
              Kasus 3: Normal
            </button>
          </div>

          <button
            onClick={onLogout}
            className="w-9 h-9 rounded-xl bg-slate-100 hover:bg-rose-50 text-slate-500 hover:text-rose-600 flex items-center justify-center transition-colors border border-slate-200"
            title="Keluar dari sesi dokter"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </header>

      {/* WORKSTATION DUAL-PANE BODY */}
      <div className="flex-1 w-full overflow-hidden flex flex-col md:flex-row relative">
        {/* LEFT COLUMN: PATIENT WORKLIST & FILTERS */}
        <div
          className={`w-full md:w-[380px] lg:w-[420px] md:border-r border-slate-200 bg-white flex flex-col shrink-0 ${
            isMobileDetailOpen ? 'hidden md:flex' : 'flex'
          }`}
        >
          {/* Search & Filter Bar */}
          <div className="p-3.5 border-b border-slate-200 space-y-2.5 shrink-0 bg-slate-50/70">
            <div className="relative">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="Cari balita, ID, atau posyandu..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-slate-200 bg-white focus:outline-none focus:ring-2 focus:ring-teal-600 font-sans"
              />
            </div>

            {/* Tier Filter Buttons */}
            <div className="grid grid-cols-4 gap-1">
              {[
                { id: 'all', label: 'Semua' },
                { id: 'Tier-1', label: 'Tier-1 (Merah)' },
                { id: 'Tier-2', label: 'Tier-2 (Kuning)' },
                { id: 'Normal', label: 'Normal' },
              ].map((t) => (
                <button
                  key={t.id}
                  type="button"
                  onClick={() => setTierFilter(t.id as any)}
                  className={`py-1.5 px-1 rounded-lg text-[10px] font-bold text-center transition-all ${
                    tierFilter === t.id
                      ? 'bg-nutri-teal-700 text-white shadow-xs'
                      : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  {t.label}
                </button>
              ))}
            </div>
          </div>

          {/* Patient Cards List */}
          <div className="flex-1 overflow-y-auto p-3 space-y-2">
            <div className="flex items-center justify-between text-[11px] font-bold text-slate-500 px-1">
              <span>Antrean Rujukan ({filteredPatients.length})</span>
              <span className="text-[10px] font-semibold text-slate-400">Urut: Prioritas Risiko</span>
            </div>

            {filteredPatients.map((p) => {
              const isSelected = p.id === selectedPatientId;
              const isTier1 = p.tier.includes('Tier-1');
              const isTier2 = p.tier.includes('Tier-2');

              return (
                <div
                  key={p.id}
                  onClick={() => handleSelectPatient(p)}
                  className={`p-3 rounded-2xl border transition-all cursor-pointer select-none ${
                    isSelected
                      ? 'bg-teal-50/80 border-nutri-teal-600 shadow-sm ring-2 ring-teal-200'
                      : 'bg-white border-slate-200 hover:border-slate-300 hover:shadow-subtle'
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="text-xs font-black text-slate-900">{p.childName}</div>
                      <div className="text-[11px] text-slate-500 font-medium">
                        {p.ageMonths} bln • {p.gender === 'L' ? 'Laki-laki' : 'Perempuan'} • {p.posyandu}
                      </div>
                    </div>
                    <span
                      className={`text-[10px] font-extrabold px-2 py-0.5 rounded-full ${
                        isTier1
                          ? 'bg-rose-100 text-rose-800'
                          : isTier2
                          ? 'bg-amber-100 text-amber-800'
                          : 'bg-emerald-100 text-emerald-800'
                      }`}
                    >
                      {p.tier}
                    </span>
                  </div>

                  <div className="mt-2.5 pt-2 border-t border-slate-100 grid grid-cols-3 gap-1 text-[10px] text-center">
                    <div className="bg-slate-50 py-1 rounded-lg">
                      <span className="text-slate-400 block text-[9px]">Latensi RT</span>
                      <span className={`font-bold ${isTier1 ? 'text-rose-600' : 'text-slate-800'}`}>
                        {p.latencyMs} ms
                      </span>
                    </div>
                    <div className="bg-slate-50 py-1 rounded-lg">
                      <span className="text-slate-400 block text-[9px]">Akurasi Go/No</span>
                      <span className={`font-bold ${p.accuracyRate < 70 ? 'text-amber-600' : 'text-slate-800'}`}>
                        {p.accuracyRate}%
                      </span>
                    </div>
                    <div className="bg-slate-50 py-1 rounded-lg">
                      <span className="text-slate-400 block text-[9px]">LiLA</span>
                      <span className={`font-bold ${p.muacCm < 11.5 ? 'text-rose-600' : 'text-slate-800'}`}>
                        {p.muacCm} cm
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* RIGHT COLUMN: DETAILED CLINICAL WORKSPACE */}
        <div
          className={`flex-1 bg-slate-50/50 flex flex-col overflow-y-auto ${
            isMobileDetailOpen ? 'flex' : 'hidden md:flex'
          }`}
        >
          {/* Header on Mobile for Back Navigation */}
          <div className="md:hidden p-3 bg-white border-b border-slate-200 flex items-center justify-between">
            <button
              onClick={() => setIsMobileDetailOpen(false)}
              className="text-xs font-bold text-teal-700 flex items-center gap-1.5"
            >
              <ArrowLeft className="w-4 h-4" /> Kembali ke Antrean
            </button>
            <span className="text-xs font-bold text-slate-800">{activePatient.childName}</span>
          </div>

          {/* Active Patient Summary Banner */}
          <div className="p-4 sm:p-5 bg-white border-b border-slate-200/90 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-xs">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-black text-slate-400">{activePatient.id}</span>
                <span
                  className={`text-[10px] font-black px-2.5 py-0.5 rounded-full ${
                    activePatient.tier.includes('Tier-1')
                      ? 'bg-rose-100 text-rose-800 border border-rose-300'
                      : activePatient.tier.includes('Tier-2')
                      ? 'bg-amber-100 text-amber-800 border border-amber-300'
                      : 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                  }`}
                >
                  {activePatient.tier}
                </span>
                {activePatient.interventionSaved && (
                  <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full flex items-center gap-1">
                    <Check className="w-3 h-3" /> Intervensi Tersimpan
                  </span>
                )}
              </div>
              <h2 className="text-lg sm:text-xl font-extrabold text-slate-900 mt-0.5">
                {activePatient.childName}
              </h2>
              <p className="text-xs text-slate-500 font-medium mt-0.5">
                Usia {activePatient.ageMonths} Bulan • {activePatient.gender === 'L' ? 'Laki-laki' : 'Perempuan'} • Wilayah {activePatient.posyandu} ({activePatient.rw})
              </p>
            </div>

            {/* Interoperability SATUSEHAT Button */}
            <div className="flex items-center gap-2">
              <Button
                variant="secondary"
                size="sm"
                icon={<FileJson className="w-4 h-4 text-teal-700" />}
                onClick={() => {
                  soundSynth.playPop();
                  setShowFhirModal(true);
                }}
              >
                SATUSEHAT FHIR R4
              </Button>
            </div>
          </div>

          {/* Workspace Tabs */}
          <div className="px-5 pt-3 bg-white border-b border-slate-200 flex gap-4 text-xs font-bold">
            <button
              onClick={() => setActiveTab('telemetri')}
              className={`pb-2.5 border-b-2 transition-colors flex items-center gap-1.5 ${
                activeTab === 'telemetri'
                  ? 'border-nutri-teal-700 text-nutri-teal-700'
                  : 'border-transparent text-slate-500 hover:text-slate-800'
              }`}
            >
              <Activity className="w-3.5 h-3.5" /> Telemetri Neurokognitif
            </button>
            <button
              onClick={() => setActiveTab('somatik')}
              className={`pb-2.5 border-b-2 transition-colors flex items-center gap-1.5 ${
                activeTab === 'somatik'
                  ? 'border-nutri-teal-700 text-nutri-teal-700'
                  : 'border-transparent text-slate-500 hover:text-slate-800'
              }`}
            >
              <ClipboardList className="w-3.5 h-3.5" /> Somatometri & Tanda Fisik
            </button>
            <button
              onClick={() => setActiveTab('intervensi')}
              className={`pb-2.5 border-b-2 transition-colors flex items-center gap-1.5 ${
                activeTab === 'intervensi'
                  ? 'border-nutri-teal-700 text-nutri-teal-700'
                  : 'border-transparent text-slate-500 hover:text-slate-800'
              }`}
            >
              <Stethoscope className="w-3.5 h-3.5" /> [ASUMSI] Catatan Intervensi
            </button>
          </div>

          {/* Workspace Tab Contents */}
          <div className="p-4 sm:p-6 space-y-4 flex-1 overflow-y-auto">
            {/* TAB 1: TELEMETRI NEUROKOGNITIF */}
            {activeTab === 'telemetri' && (
              <div className="space-y-4 animate-in fade-in duration-normal">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
                  {/* Zat Besi (Fe) Card */}
                  <GlassCard padding="md" className="space-y-2 bg-white border-slate-200 shadow-xs">
                    <div className="flex items-center justify-between">
                      <span className="text-[11px] font-bold text-slate-500">Zat Besi (Fe)</span>
                      <span
                        className={`text-[10px] font-black px-2 py-0.5 rounded-full ${
                          activePatient.latencyMs > 480
                            ? 'bg-rose-100 text-rose-800'
                            : activePatient.latencyMs > 400
                            ? 'bg-amber-100 text-amber-800'
                            : 'bg-emerald-100 text-emerald-800'
                        }`}
                      >
                        {activePatient.latencyMs > 480 ? 'Risiko Tinggi' : activePatient.latencyMs > 400 ? 'Waspada' : 'Optimal'}
                      </span>
                    </div>
                    <div className="text-2xl font-black text-slate-900">{activePatient.latencyMs} <span className="text-xs font-semibold text-slate-500">ms</span></div>
                    <p className="text-[11px] text-slate-600 leading-snug">
                      Marker transmisi dopaminergik basal striatum. Rata-rata 5 ronde Balon Kilat.
                    </p>
                  </GlassCard>

                  {/* Seng (Zn) Card */}
                  <GlassCard padding="md" className="space-y-2 bg-white border-slate-200 shadow-xs">
                    <div className="flex items-center justify-between">
                      <span className="text-[11px] font-bold text-slate-500">Seng (Zn)</span>
                      <span
                        className={`text-[10px] font-black px-2 py-0.5 rounded-full ${
                          activePatient.accuracyRate < 65
                            ? 'bg-rose-100 text-rose-800'
                            : activePatient.accuracyRate < 80
                            ? 'bg-amber-100 text-amber-800'
                            : 'bg-emerald-100 text-emerald-800'
                        }`}
                      >
                        {activePatient.accuracyRate < 65 ? 'Risiko Tinggi' : activePatient.accuracyRate < 80 ? 'Waspada' : 'Optimal'}
                      </span>
                    </div>
                    <div className="text-2xl font-black text-slate-900">{activePatient.accuracyRate}%</div>
                    <p className="text-[11px] text-slate-600 leading-snug">
                      Inhibisi prefrontal cortex (Go/No-Go). {activePatient.commissionErrors} kali salah sentuh buah berulat.
                    </p>
                  </GlassCard>

                  {/* Vitamin B12 Card */}
                  <GlassCard padding="md" className="space-y-2 bg-white border-slate-200 shadow-xs">
                    <div className="flex items-center justify-between">
                      <span className="text-[11px] font-bold text-slate-500">Vitamin B12</span>
                      <span
                        className={`text-[10px] font-black px-2 py-0.5 rounded-full ${
                          activePatient.memorySpan < 2
                            ? 'bg-rose-100 text-rose-800'
                            : activePatient.memorySpan === 2
                            ? 'bg-amber-100 text-amber-800'
                            : 'bg-emerald-100 text-emerald-800'
                        }`}
                      >
                        {activePatient.memorySpan < 2 ? 'Defisit' : activePatient.memorySpan === 2 ? 'Cukup' : 'Tinggi'}
                      </span>
                    </div>
                    <div className="text-2xl font-black text-slate-900">Skor {activePatient.memorySpan} <span className="text-xs font-semibold text-slate-500">span</span></div>
                    <p className="text-[11px] text-slate-600 leading-snug">
                      Kapasitas memori kerja spasial urutan terbalik balita (Jejak Hewan).
                    </p>
                  </GlassCard>
                </div>

                {/* Rasional Inferensi CDSS */}
                <GlassCard padding="md" className="space-y-2.5 bg-teal-50/60 border-teal-200/80">
                  <div className="flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-nutri-teal-700" />
                    <h3 className="text-xs font-extrabold text-teal-900">
                      Rekomendasi Algoritma Triase CDSS (Model Terpadu):
                    </h3>
                  </div>
                  <p className="text-xs text-slate-700 leading-relaxed">
                    {activePatient.tier.includes('Tier-1')
                      ? 'Kombinasi latensi respon memanjang (>480ms) dan LiLA < 11.5 cm mengindikasikan defisiensi mikronutrien akut pada jaringan otak sebelum terdeteksi pada indeks berat badan saja. Prioritaskan konfirmasi lab ferritin dan suplementasi mikronutrien terarah.'
                      : activePatient.tier.includes('Tier-2')
                      ? 'Penurunan skor inhibisi motorik mengindikasikan penurunan seng fungsional. Lakukan pemantauan berkala dan berikan konseling PMBA pangan hewani.'
                      : 'Profil telemetri motorik dan memori kerja balita berada dalam rentang optimal. Lanjutkan pemantauan rutin bulanan di Posyandu.'}
                  </p>
                </GlassCard>
              </div>
            )}

            {/* TAB 2: SOMATOMETRI & TANDA FISIK */}
            {activeTab === 'somatik' && (
              <div className="space-y-4 animate-in fade-in duration-normal">
                {/* LiLA Highlight Banner */}
                <div
                  className={`p-3.5 rounded-xl border flex items-center justify-between ${
                    activePatient.muacCm < 11.5
                      ? 'bg-rose-50 border-rose-300 text-rose-900'
                      : activePatient.muacCm <= 12.5
                      ? 'bg-amber-50 border-amber-300 text-amber-900'
                      : 'bg-emerald-50 border-emerald-300 text-emerald-900'
                  }`}
                >
                  <div>
                    <span className="text-[11px] font-bold uppercase tracking-wider">Lingkar Lengan Atas (LiLA):</span>
                    <div className="text-xl font-black">{activePatient.muacCm} cm</div>
                  </div>
                  <span className="text-xs font-extrabold px-3 py-1 rounded-full bg-white shadow-xs">
                    {activePatient.muacCm < 11.5
                      ? 'Pita Merah (<11.5 cm) — Gizi Buruk Akut'
                      : activePatient.muacCm <= 12.5
                      ? 'Pita Kuning (11.5–12.5 cm) — Waspada'
                      : 'Pita Hijau (>12.5 cm) — Normal'}
                  </span>
                </div>

                {/* Z-Scores Grid */}
                <div className="grid grid-cols-3 gap-3">
                  <GlassCard padding="sm" className="bg-white border-slate-200 text-center">
                    <span className="text-[10px] text-slate-500 font-bold">BB/U (WAZ)</span>
                    <div className="text-base font-black text-slate-900">{activePatient.waz} SD</div>
                  </GlassCard>
                  <GlassCard padding="sm" className="bg-white border-slate-200 text-center">
                    <span className="text-[10px] text-slate-500 font-bold">TB/U (HAZ)</span>
                    <div className={`text-base font-black ${activePatient.haz < -2 ? 'text-rose-600' : 'text-slate-900'}`}>
                      {activePatient.haz} SD
                    </div>
                  </GlassCard>
                  <GlassCard padding="sm" className="bg-white border-slate-200 text-center">
                    <span className="text-[10px] text-slate-500 font-bold">BB/TB (WHZ)</span>
                    <div className="text-base font-black text-slate-900">{activePatient.whz} SD</div>
                  </GlassCard>
                </div>

                {/* Tanda Fisik Klinis Checklist */}
                <GlassCard padding="md" className="space-y-2.5 bg-white border-slate-200">
                  <h4 className="text-xs font-bold text-slate-900">Pemeriksaan Tanda Fisik Klinis di Lapangan:</h4>
                  <div className="space-y-2 text-xs">
                    <div className="flex items-center justify-between p-2 rounded-lg bg-slate-50">
                      <span>Pucat Konjungtiva (Tanda Anemia Defisiensi Besi)</span>
                      <span className={`font-bold ${activePatient.paleConjunctiva ? 'text-rose-600' : 'text-emerald-600'}`}>
                        {activePatient.paleConjunctiva ? 'Positif (+)' : 'Negatif (-)'}
                      </span>
                    </div>
                    <div className="flex items-center justify-between p-2 rounded-lg bg-slate-50">
                      <span>Luka Sudut Bibir / Stomatitis Angularis (Defisiensi Zn/B2)</span>
                      <span className={`font-bold ${activePatient.angularStomatitis ? 'text-amber-600' : 'text-emerald-600'}`}>
                        {activePatient.angularStomatitis ? 'Positif (+)' : 'Negatif (-)'}
                      </span>
                    </div>
                    <div className="flex items-center justify-between p-2 rounded-lg bg-slate-50">
                      <span>Kulit Kering Bersisik (Xerosis)</span>
                      <span className={`font-bold ${activePatient.skinDryness ? 'text-amber-600' : 'text-emerald-600'}`}>
                        {activePatient.skinDryness ? 'Positif (+)' : 'Negatif (-)'}
                      </span>
                    </div>
                  </div>
                </GlassCard>
              </div>
            )}

            {/* TAB 3: [ASUMSI] CATATAN INTERVENSI MEDIS */}
            {activeTab === 'intervensi' && (
              <div className="space-y-4 animate-in fade-in duration-normal">
                {/* Suplemen Terjadwal */}
                <GlassCard padding="md" className="space-y-2 bg-white border-slate-200">
                  <div className="text-xs font-extrabold text-slate-900">
                    Protokol Suplementasi Terstandar:
                  </div>
                  <div className="space-y-1.5">
                    {activePatient.supplementNotes.map((item, idx) => (
                      <div key={idx} className="flex items-center gap-2 text-xs text-slate-700 bg-teal-50/60 p-2 rounded-lg">
                        <CheckCircle2 className="w-4 h-4 text-nutri-teal-700 shrink-0" />
                        <span>{item}</span>
                      </div>
                    ))}
                  </div>
                </GlassCard>

                {/* Form Rujukan Lab & Catatan Faskes */}
                <div className="space-y-3 bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
                  <div>
                    <label className="block text-xs font-bold text-slate-800 mb-1">
                      Instruksi Pemeriksaan Penunjang Lab:
                    </label>
                    <input
                      type="text"
                      value={labReferralText}
                      onChange={(e) => setLabReferralText(e.target.value)}
                      className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-teal-600"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-800 mb-1">
                      Catatan Medis & Rencana Intervensi Dokter Puskesmas:
                    </label>
                    <textarea
                      rows={3}
                      value={interventionText}
                      onChange={(e) => setInterventionText(e.target.value)}
                      className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-teal-600"
                    />
                  </div>

                  <Button variant="primary" fullWidth size="md" onClick={handleSaveIntervention}>
                    Simpan Catatan Intervensi ke Rekam Medis
                  </Button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* MODAL EKSPOR SATUSEHAT FHIR R4 BUNDLE */}
      {showFhirModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4 animate-in fade-in duration-fast">
          <div className="bg-white rounded-3xl max-w-xl w-full shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[85vh]">
            <div className="px-5 py-4 border-b border-slate-200 flex items-center justify-between bg-slate-50 shrink-0">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-teal-100 text-teal-800 flex items-center justify-center">
                  <FileJson className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm font-extrabold text-slate-900">
                    Interoperabilitas SATUSEHAT FHIR R4 Bundle
                  </h3>
                  <p className="text-[11px] text-slate-500">
                    Format payload standar Kemenkes RI untuk integrasi e-Puskesmas
                  </p>
                </div>
              </div>
              <button
                onClick={() => setShowFhirModal(false)}
                className="w-7 h-7 rounded-full text-slate-400 hover:text-slate-600 hover:bg-slate-200 flex items-center justify-center transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-4 flex-1 overflow-y-auto bg-slate-900 text-slate-100 font-mono text-[11px] leading-relaxed">
              <pre>{JSON.stringify(fhirBundlePayload, null, 2)}</pre>
            </div>

            <div className="p-4 border-t border-slate-200 bg-white flex justify-end gap-2.5 shrink-0">
              <Button variant="secondary" size="sm" onClick={() => setShowFhirModal(false)}>
                Tutup
              </Button>
              <Button
                variant="primary"
                size="sm"
                icon={fhirCopied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                onClick={handleCopyFhir}
              >
                {fhirCopied ? 'Tersalin ke Clipboard!' : 'Salin JSON FHIR'}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
