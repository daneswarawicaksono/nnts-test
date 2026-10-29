import { useState } from 'react';
import type { ActiveAppView, PatientRecord } from './types';
import { PRESET_SCENARIOS, ALL_PATIENTS_LIST } from './data/presetScenarios';
import { soundFX } from './services/audioSynth';
import { GlobalNavbar } from './components/GlobalNavbar';
import { ChildScreeningView } from './components/ChildScreening/ChildScreeningView';
import { ClinicianDashboardView } from './components/ClinicianDashboard/ClinicianDashboardView';
import { FamilyReportView } from './components/FamilyReport/FamilyReportView';
import { NewPatientModal } from './components/NewPatientModal';
import { ShareOnlineModal } from './components/ShareOnlineModal';

export function App() {
  const [currentView, setCurrentView] = useState<ActiveAppView>('child-screening');
  const [patientRecord, setPatientRecord] = useState<PatientRecord>(PRESET_SCENARIOS.kasus1);
  const [patientsList, setPatientsList] = useState<PatientRecord[]>(ALL_PATIENTS_LIST);
  const [isMuted, setIsMuted] = useState<boolean>(false);
  const [isNewPatientModalOpen, setIsNewPatientModalOpen] = useState<boolean>(false);
  const [isShareModalOpen, setIsShareModalOpen] = useState<boolean>(false);

  // Sync mute state to synth engine
  const handleToggleMute = () => {
    const nextMuted = !isMuted;
    setIsMuted(nextMuted);
    soundFX.isMuted = nextMuted;
    if (!nextMuted) soundFX.playClick();
  };

  // Change preset scenario
  const handleSelectPreset = (presetKey: string) => {
    if (PRESET_SCENARIOS[presetKey]) {
      const selected = PRESET_SCENARIOS[presetKey];
      setPatientRecord(selected);
    }
  };

  // Update patient across active record and master worklist queue
  const handleUpdatePatient = (updated: PatientRecord) => {
    setPatientRecord(updated);
    setPatientsList((prev) =>
      prev.map((p) => (p.id === updated.id ? updated : p))
    );
  };

  // Save dynamically registered child
  const handleSaveNewPatient = (
    newRecord: PatientRecord,
    startMode: 'child-screening' | 'clinician-dashboard' | 'family-report'
  ) => {
    setPatientRecord(newRecord);
    setPatientsList((prev) => [newRecord, ...prev.filter((p) => p.id !== newRecord.id)]);
    setCurrentView(startMode);
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      {/* Global Mode Switcher & Preset Header */}
      <GlobalNavbar
        currentView={currentView}
        onViewChange={setCurrentView}
        currentPatient={patientRecord}
        onSelectPreset={handleSelectPreset}
        isMuted={isMuted}
        onToggleMute={handleToggleMute}
        onOpenNewPatientModal={() => setIsNewPatientModalOpen(true)}
        onOpenShareModal={() => setIsShareModalOpen(true)}
      />

      {/* Main Dynamic View Renderer */}
      <main className="flex-1">
        {currentView === 'child-screening' && (
          <ChildScreeningView
            patient={patientRecord}
            onUpdatePatient={handleUpdatePatient}
            onNavigateClinician={() => setCurrentView('clinician-dashboard')}
            onNavigateFamily={() => setCurrentView('family-report')}
          />
        )}

        {currentView === 'clinician-dashboard' && (
          <ClinicianDashboardView
            patient={patientRecord}
            allPatients={patientsList}
            onUpdatePatient={handleUpdatePatient}
            onSwitchToFamily={() => setCurrentView('family-report')}
            onOpenNewPatientModal={() => setIsNewPatientModalOpen(true)}
          />
        )}

        {currentView === 'family-report' && (
          <FamilyReportView patient={patientRecord} />
        )}
      </main>

      {/* Modal Pendaftaran / Input Data Pasien Anak Baru */}
      <NewPatientModal
        isOpen={isNewPatientModalOpen}
        onClose={() => setIsNewPatientModalOpen(false)}
        onSavePatient={handleSaveNewPatient}
      />

      {/* Modal Share Online & QR Code HP (Cloudflare) */}
      <ShareOnlineModal
        isOpen={isShareModalOpen}
        onClose={() => setIsShareModalOpen(false)}
      />

      {/* Global Clinical Prototype Footer with Asset Licensing Attribution */}
      <footer className="bg-white border-t border-slate-200 px-4 sm:px-6 py-2.5 text-xs text-slate-500 font-clinical flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          <span className="font-bold text-slate-700">NNTS Prototype v1.0.0</span>
          <span className="text-slate-400">• Puskesmas &amp; Posyandu CDSS</span>
        </div>
        <div className="text-[11px] text-slate-400 flex flex-wrap items-center gap-x-2.5 gap-y-1">
          <span>Ilustrasi: <a href="https://storyset.com" target="_blank" rel="noreferrer" className="text-teal-600 hover:underline font-medium">Storyset by Freepik</a></span>
          <span>•</span>
          <span>Avatar: <a href="https://dicebear.com" target="_blank" rel="noreferrer" className="text-teal-600 hover:underline font-medium">DiceBear (CC BY 4.0)</a></span>
          <span>•</span>
          <span>Stiker Game: <span className="text-slate-600 font-medium">Fluent Emoji (MIT) &amp; OpenMoji</span></span>
          <span>•</span>
          <span>Komponen UI: <span className="text-slate-600 font-medium">Kenney UI Pack (CC0)</span></span>
          <span>•</span>
          <span>Ikon: <span className="text-slate-600 font-medium">Lucide (ISC)</span></span>
        </div>
      </footer>
    </div>
  );
}

export default App;
