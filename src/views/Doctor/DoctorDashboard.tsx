import React, { useState, useMemo } from 'react';
import {
  FileJson,
  Copy,
  Check,
  X,
} from 'lucide-react';
import { soundSynth } from '../../services/audio/synth';
import type { AuthSession } from '../../types/role';

import { DoctorSidebar } from './components/DoctorSidebar';
import { DoctorTopBar } from './components/DoctorTopBar';
import { DoctorAnalyticsCards } from './components/DoctorAnalyticsCards';
import { DoctorFullWidthTable } from './components/DoctorFullWidthTable';
import { DoctorSlideOverDrawer } from './components/DoctorSlideOverDrawer';

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
    supplementNotes: [
      'Sirup Besi Elemental 3 mg/kgBB/hari (6 pekan)',
      'Suplementasi Zinc 20 mg/hari (14 hari)',
    ],
    labReferral: 'Pemeriksaan Serum Ferritin & Darah Lengkap (Hb)',
    clinicalNotes:
      'Terindikasi defisiensi zat besi fungsional nyata dengan penurunan transmisi dopaminergik basal dan tanda konjungtiva anemis.',
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
    supplementNotes: [
      'Taburia MNP 1 sachet per 2 hari',
      'Edukasi PMBA pangan hewani kaya seng',
    ],
    labReferral: 'Pemantauan berkala 2 pekan di Posyandu',
    clinicalNotes:
      'Defisiensi seng subklinis ringan dengan kegagalan kontrol inhibisi motorik.',
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
  {
    id: 'P-ANG-04',
    childName: 'Bagas Aditya',
    ageMonths: 30,
    gender: 'L',
    posyandu: 'Posyandu Anggrek 3',
    rw: 'RW 02',
    tier: 'Tier-2 Alert (Kuning)',
    screenedAt: '31 Okt 2026',
    latencyMs: 425,
    accuracyRate: 72,
    commissionErrors: 3,
    memorySpan: 2,
    weightKg: 11.8,
    heightCm: 88.0,
    muacCm: 12.5,
    waz: -1.3,
    haz: -1.6,
    whz: -0.9,
    paleConjunctiva: false,
    angularStomatitis: false,
    skinDryness: true,
    supplementNotes: ['Konseling gizi seimbang & MPASI kaya protein'],
    labReferral: 'Jadwalkan ulang skrining posyandu bulan berikutnya',
    clinicalNotes: 'Perlu penguatan stimulasi visual motorik dan asupan mikronutrien harian.',
  },
  {
    id: 'P-FLM-05',
    childName: 'Aisyah Putri',
    ageMonths: 36,
    gender: 'P',
    posyandu: 'Posyandu Flamboyan 4',
    rw: 'RW 07',
    tier: 'Normal (Hijau)',
    screenedAt: '30 Okt 2026',
    latencyMs: 320,
    accuracyRate: 92,
    commissionErrors: 0,
    memorySpan: 3,
    weightKg: 14.2,
    heightCm: 96.5,
    muacCm: 14.5,
    waz: 0.5,
    haz: 0.1,
    whz: 0.7,
    paleConjunctiva: false,
    angularStomatitis: false,
    skinDryness: false,
    supplementNotes: ['Pertahankan pola asuh dan asupan bergizi'],
    labReferral: 'Tidak ada rujukan',
    clinicalNotes: 'Status gizi baik dan fungsi eksekutif sangat matang.',
  },
];

export const DoctorDashboard: React.FC<DoctorDashboardProps> = ({ session, onLogout }) => {
  const [patients, setPatients] = useState<ClinicalPatient[]>(PRESET_PATIENTS);
  const [selectedPatientId, setSelectedPatientId] = useState<string>('P-MLT-01');
  const [activeMenu, setActiveMenu] = useState('dashboard');
  const [searchQuery, setSearchQuery] = useState('');
  const [tierFilter, setTierFilter] = useState<'all' | 'Tier-1' | 'Tier-2' | 'Normal'>('all');
  const [isDrawerOpen, setIsDrawerOpen] = useState(() => {
    if (typeof window !== 'undefined') {
      return new URLSearchParams(window.location.search).get('drawer') === '1';
    }
    return false;
  });
  const [showFhirModal, setShowFhirModal] = useState(false);
  const [fhirCopied, setFhirCopied] = useState(false);

  const activePatient = useMemo(() => {
    return patients.find((p) => p.id === selectedPatientId) || patients[0];
  }, [patients, selectedPatientId]);

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

  // Aggregated counts for Analytics Cards
  const kpiCounts = useMemo(() => {
    const total = patients.length;
    const tier1 = patients.filter((p) => p.tier.includes('Tier-1')).length;
    const tier2 = patients.filter((p) => p.tier.includes('Tier-2')).length;
    const normal = patients.filter((p) => p.tier.includes('Normal')).length;
    return { total, tier1, tier2, normal };
  }, [patients]);

  const handleSelectPatient = (p: ClinicalPatient) => {
    setSelectedPatientId(p.id);
    setIsDrawerOpen(true);
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
            identifier: [
              {
                system: 'https://fhir.kemkes.go.id/id/nik',
                value: `347101${activePatient.id}`,
              },
            ],
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
              coding: [
                {
                  system: 'http://loinc.org',
                  code: '70258-9',
                  display: 'Reaction time test',
                },
              ],
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
              coding: [
                {
                  system: 'http://loinc.org',
                  code: '56072-2',
                  display: 'Mid upper arm circumference',
                },
              ],
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
    <div className="w-full h-screen min-h-screen bg-[#F8F9FA] flex flex-row overflow-hidden font-sans select-none">
      {/* 1. LEFT NAVIGATION SIDEBAR (QUICKEN WEB 37 STYLE) */}
      <div className="hidden md:block shrink-0">
        <DoctorSidebar
          activeMenu={activeMenu}
          onSelectMenu={setActiveMenu}
          doctorName={session.user.fullName}
          faskesName={session.user.faskesId || 'Puskesmas Tegalrejo'}
          onLogout={onLogout}
        />
      </div>

      {/* 2. MAIN APPLICATION WORKSTATION AREA */}
      <div className="flex-1 flex flex-col h-screen min-w-0 overflow-hidden">
        {/* Top Header */}
        <DoctorTopBar
          doctorName={session.user.fullName}
          faskesName={session.user.faskesId || 'Puskesmas Tegalrejo'}
          onLogout={onLogout}
        />

        {/* Scrollable Workstation Body */}
        <main className="flex-1 overflow-y-auto p-5 sm:p-6 space-y-5">
          {/* Upper Section: Quicken 2-Card 50/50 Grid */}
          <DoctorAnalyticsCards
            totalPatients={kpiCounts.total}
            tier1Count={kpiCounts.tier1}
            tier2Count={kpiCounts.tier2}
            normalCount={kpiCounts.normal}
            selectedFilter={tierFilter}
            onSelectFilter={setTierFilter}
          />

          {/* Lower Section: Full-Width Tabular Worklist */}
          <DoctorFullWidthTable
            patients={filteredPatients}
            selectedPatientId={selectedPatientId}
            onSelectPatient={handleSelectPatient}
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
            selectedFilter={tierFilter}
            onFilterChange={setTierFilter}
          />
        </main>
      </div>

      {/* 3. SLIDE-OVER CLINICAL INSPECTION DRAWER */}
      <DoctorSlideOverDrawer
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
        patient={activePatient}
        onSaveIntervention={handleSaveIntervention}
        onOpenFhirModal={() => {
          soundSynth.playPop();
          setShowFhirModal(true);
        }}
      />

      {/* 4. MODAL SATUSEHAT FHIR R4 EXPORT */}
      {showFhirModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4 animate-in fade-in duration-100">
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
