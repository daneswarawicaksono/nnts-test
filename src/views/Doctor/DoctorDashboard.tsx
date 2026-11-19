import React, { useState, useMemo } from 'react';
import {
  LogOut,
  FileJson,
  Copy,
  Check,
  X,
  Stethoscope,
} from 'lucide-react';
import { soundSynth } from '../../services/audio/synth';
import type { AuthSession } from '../../types/role';

import { DoctorKPIBar } from './components/DoctorKPIBar';
import { DoctorPatientTable } from './components/DoctorPatientTable';
import { DoctorClinicalDetailPane } from './components/DoctorClinicalDetailPane';

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
  const [showFhirModal, setShowFhirModal] = useState(false);
  const [fhirCopied, setFhirCopied] = useState(false);

  // Mobile detail view toggle
  const [isMobileDetailOpen, setIsMobileDetailOpen] = useState(false);

  const activePatient = patients.find((p) => p.id === selectedPatientId) || patients[0];

  // Filtered patients list
  const filteredPatients = useMemo(() => {
    return patients.filter((p) => {
      const matchSearch =
        p.childName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.posyandu.toLowerCase().includes(searchQuery.toLowerCase());

      const matchTier =
        tierFilter === 'all'
          ? true
          : tierFilter === 'Tier-1'
          ? p.tier.includes('Tier-1')
          : tierFilter === 'Tier-2'
          ? p.tier.includes('Tier-2')
          : p.tier.includes('Normal');

      return matchSearch && matchTier;
    });
  }, [patients, searchQuery, tierFilter]);

  // Aggregated counts for KPI Bar
  const kpiCounts = useMemo(() => {
    const total = patients.length;
    const tier1 = patients.filter((p) => p.tier.includes('Tier-1')).length;
    const tier2 = patients.filter((p) => p.tier.includes('Tier-2')).length;
    const normal = patients.filter((p) => p.tier.includes('Normal')).length;
    return { total, tier1, tier2, normal };
  }, [patients]);

  const handleSelectPatient = (p: ClinicalPatient) => {
    setSelectedPatientId(p.id);
    setIsMobileDetailOpen(true);
  };

  const handleSaveIntervention = (lab: string, notes: string) => {
    setPatients((prev) =>
      prev.map((p) =>
        p.id === selectedPatientId
          ? { ...p, labReferral: lab, clinicalNotes: notes, interventionSaved: true }
          : p
      )
    );
  };

  // FHIR Bundle Generator
  const fhirBundlePayload = useMemo(() => {
    return {
      resourceType: 'Bundle',
      type: 'collection',
      timestamp: new Date().toISOString(),
      entry: [
        {
          fullUrl: `urn:uuid:patient-${activePatient.id}`,
          resource: {
            resourceType: 'Patient',
            identifier: [{ system: 'https://fhir.kemkes.go.id/id/nik', value: `347101${activePatient.id}` }],
            name: [{ text: activePatient.childName }],
            gender: activePatient.gender === 'L' ? 'male' : 'female',
          },
        },
        {
          fullUrl: `urn:uuid:obs-latency-${activePatient.id}`,
          resource: {
            resourceType: 'Observation',
            status: 'final',
            code: {
              coding: [{ system: 'http://loinc.org', code: '70258-9', display: 'Reaction time test' }],
            },
            valueQuantity: { value: activePatient.latencyMs, unit: 'ms' },
          },
        },
        {
          fullUrl: `urn:uuid:obs-muac-${activePatient.id}`,
          resource: {
            resourceType: 'Observation',
            status: 'final',
            code: {
              coding: [{ system: 'http://loinc.org', code: '56072-2', display: 'Mid upper arm circumference' }],
            },
            valueQuantity: { value: activePatient.muacCm, unit: 'cm' },
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
    <div className="w-full h-full min-h-[100dvh] bg-[#F8F9FA] flex flex-col justify-between font-sans select-none relative overflow-hidden">
      {/* 1. TOP WORKSTATION HEADER */}
      <header className="px-5 py-3.5 bg-white border-b border-[#E5E5E5] flex items-center justify-between z-10 shrink-0 shadow-xs">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-[#34A853] text-white flex items-center justify-center shadow-[0_2px_0_#2B8A44] shrink-0">
            <Stethoscope className="w-5 h-5 stroke-[2.2]" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[11px] font-black text-[#2B8A44] uppercase tracking-wider">
                CDSS Faskes Tingkat Pertama
              </span>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-100 text-slate-700 border border-slate-200">
                {session.user.faskesId || 'Puskesmas Tegalrejo'}
              </span>
              <span className="hidden sm:inline-flex items-center gap-1 text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                SATUSEHAT Aktif
              </span>
            </div>
            <h1 className="text-sm sm:text-base font-black text-slate-900 leading-tight">
              {session.user.fullName}
            </h1>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {/* Simulation Preset Buttons */}
          <div className="hidden lg:flex items-center gap-1.5 mr-2">
            <span className="text-[11px] font-bold text-slate-400">Kasus Demo:</span>
            <button
              type="button"
              onClick={() => handleSelectPatient(PRESET_PATIENTS[0])}
              className={`text-[11px] font-bold px-2.5 py-1 rounded-xl border transition-all ${
                selectedPatientId === PRESET_PATIENTS[0].id
                  ? 'bg-rose-50 border-rose-300 text-rose-700 shadow-xs'
                  : 'bg-white border-[#E5E5E5] text-slate-600 hover:bg-slate-50'
              }`}
            >
              1: Defisiensi Fe
            </button>
            <button
              type="button"
              onClick={() => handleSelectPatient(PRESET_PATIENTS[1])}
              className={`text-[11px] font-bold px-2.5 py-1 rounded-xl border transition-all ${
                selectedPatientId === PRESET_PATIENTS[1].id
                  ? 'bg-amber-50 border-amber-300 text-amber-700 shadow-xs'
                  : 'bg-white border-[#E5E5E5] text-slate-600 hover:bg-slate-50'
              }`}
            >
              2: Inhibisi Zn
            </button>
            <button
              type="button"
              onClick={() => handleSelectPatient(PRESET_PATIENTS[2])}
              className={`text-[11px] font-bold px-2.5 py-1 rounded-xl border transition-all ${
                selectedPatientId === PRESET_PATIENTS[2].id
                  ? 'bg-emerald-50 border-emerald-300 text-[#2B8A44] shadow-xs'
                  : 'bg-white border-[#E5E5E5] text-slate-600 hover:bg-slate-50'
              }`}
            >
              3: Normal
            </button>
          </div>

          <button
            type="button"
            onClick={onLogout}
            className="w-9 h-9 rounded-xl bg-slate-50 hover:bg-rose-50 text-slate-500 hover:text-rose-600 flex items-center justify-center transition-colors border border-[#E5E5E5]"
            title="Keluar dari sesi dokter"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </header>

      {/* MAIN CONTENT AREA */}
      <div className="flex-1 overflow-hidden p-4 sm:p-5 flex flex-col gap-4">
        {/* 2. QUICKEN KPI SUMMARY ROW */}
        <DoctorKPIBar
          totalPatients={kpiCounts.total}
          tier1Count={kpiCounts.tier1}
          tier2Count={kpiCounts.tier2}
          normalCount={kpiCounts.normal}
          selectedFilter={tierFilter}
          onSelectFilter={(f) => setTierFilter(f)}
        />

        {/* 3. DUAL-PANE WORKSTATION: WORKLIST & CLINICAL DETAIL */}
        <div className="flex-1 min-h-0 flex flex-col md:flex-row gap-4 overflow-hidden">
          {/* LEFT PANE: PATIENT TABLE WORKLIST */}
          <div
            className={`w-full md:w-[48%] lg:w-[45%] h-full shrink-0 ${
              isMobileDetailOpen ? 'hidden md:block' : 'block'
            }`}
          >
            <DoctorPatientTable
              patients={filteredPatients}
              selectedPatientId={selectedPatientId}
              onSelectPatient={handleSelectPatient}
              searchQuery={searchQuery}
              onSearchChange={setSearchQuery}
              selectedFilter={tierFilter}
              onFilterChange={setTierFilter}
            />
          </div>

          {/* RIGHT PANE: CLINICAL DETAIL INSPECTION */}
          <div
            className={`w-full md:flex-1 h-full min-w-0 ${
              isMobileDetailOpen ? 'block' : 'hidden md:block'
            }`}
          >
            <DoctorClinicalDetailPane
              patient={activePatient}
              onBackToQueue={() => setIsMobileDetailOpen(false)}
              onOpenFhirModal={() => {
                soundSynth.playPop();
                setShowFhirModal(true);
              }}
              onSaveIntervention={handleSaveIntervention}
            />
          </div>
        </div>
      </div>

      {/* 4. MODAL SATUSEHAT FHIR R4 EXPORT */}
      {showFhirModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-4 animate-in fade-in duration-100">
          <div className="bg-white rounded-3xl max-w-xl w-full shadow-2xl border border-[#E5E5E5] overflow-hidden flex flex-col max-h-[85vh]">
            <div className="px-5 py-4 border-b border-[#E5E5E5] flex items-center justify-between bg-slate-50 shrink-0">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-emerald-100 text-[#2B8A44] flex items-center justify-center">
                  <FileJson className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm font-black text-slate-900">
                    SATUSEHAT FHIR R4 Bundle
                  </h3>
                  <p className="text-[11px] text-slate-500 font-semibold">
                    Format payload standar Kemenkes RI untuk integrasi e-Puskesmas
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setShowFhirModal(false)}
                className="w-7 h-7 rounded-full text-slate-400 hover:text-slate-600 hover:bg-slate-200 flex items-center justify-center transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-4 flex-1 overflow-y-auto bg-slate-900 text-emerald-400 font-mono text-[11px] leading-relaxed">
              <pre>{JSON.stringify(fhirBundlePayload, null, 2)}</pre>
            </div>

            <div className="p-4 border-t border-[#E5E5E5] bg-white flex justify-end gap-2.5 shrink-0">
              <button
                type="button"
                onClick={() => setShowFhirModal(false)}
                className="py-2 px-4 rounded-xl btn-3d-white text-xs font-bold"
              >
                Tutup
              </button>
              <button
                type="button"
                onClick={handleCopyFhir}
                className="py-2 px-4 rounded-xl btn-3d-green text-xs font-bold flex items-center gap-1.5"
              >
                {fhirCopied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                <span>{fhirCopied ? 'Tersalin ke Clipboard!' : 'Salin JSON FHIR'}</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
