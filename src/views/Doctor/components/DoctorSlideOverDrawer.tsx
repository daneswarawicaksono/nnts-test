import React, { useState, useEffect } from 'react';
import {
  X,
  Zap,
  Activity,
  CheckCircle2,
  FileJson,
  Save,
  Pill,
  FlaskConical,
  Eye,
  AlertCircle,
  AlertTriangle,
} from 'lucide-react';
import { soundSynth } from '../../../services/audio/synth';
import type { ClinicalPatient } from '../DoctorDashboard';

interface DoctorSlideOverDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  patient: ClinicalPatient | null;
  onSaveIntervention: (lab: string, notes: string) => void;
  onOpenFhirModal: () => void;
}

export const DoctorSlideOverDrawer: React.FC<DoctorSlideOverDrawerProps> = ({
  isOpen,
  onClose,
  patient,
  onSaveIntervention,
  onOpenFhirModal,
}) => {
  const [labReferral, setLabReferral] = useState('');
  const [clinicalNotes, setClinicalNotes] = useState('');
  const [saveSuccess, setSaveSuccess] = useState(false);

  useEffect(() => {
    if (patient) {
      setLabReferral(patient.labReferral || '');
      setClinicalNotes(patient.clinicalNotes || '');
      setSaveSuccess(false);
    }
  }, [patient]);

  if (!isOpen || !patient) return null;

  const isTier1 = patient.tier.includes('Tier-1');
  const isTier2 = patient.tier.includes('Tier-2');

  const handleSave = () => {
    soundSynth.playChime();
    onSaveIntervention(labReferral, clinicalNotes);
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 2500);
  };

  return (
    <div className="fixed inset-0 z-40 overflow-hidden">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs transition-opacity duration-300"
        onClick={() => {
          soundSynth.playPop();
          onClose();
        }}
      />

      {/* Slide-Over Drawer Container */}
      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <aside className="w-screen max-w-lg bg-white border-l border-[#E5E5E5] shadow-2xl flex flex-col justify-between overflow-hidden animate-in slide-in-from-right duration-300">
          {/* 1. DRAWER HEADER */}
          <div className="p-5 border-b border-[#E5E5E5] bg-slate-50/70 flex items-start justify-between shrink-0">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="font-mono text-xs font-black text-slate-500 bg-white px-2 py-0.5 rounded border border-slate-200">
                  {patient.id}
                </span>
                {isTier1 ? (
                  <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-black bg-rose-50 text-rose-700 border border-rose-200">
                    <AlertCircle className="w-3 h-3 text-rose-600" />
                    Tier-1 Merah
                  </span>
                ) : isTier2 ? (
                  <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-black bg-amber-50 text-amber-700 border border-amber-200">
                    <AlertTriangle className="w-3 h-3 text-amber-600" />
                    Tier-2 Kuning
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-black bg-emerald-50 text-emerald-700 border border-emerald-200">
                    <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                    Normal Hijau
                  </span>
                )}
              </div>
              <h2 className="text-base font-black text-slate-900 leading-snug">
                {patient.childName}
              </h2>
              <p className="text-xs text-slate-500 font-semibold mt-0.5">
                {patient.ageMonths} bulan • {patient.gender === 'L' ? 'Laki-laki' : 'Perempuan'} • {patient.posyandu} ({patient.rw})
              </p>
            </div>

            <button
              type="button"
              onClick={() => {
                soundSynth.playPop();
                onClose();
              }}
              className="w-8 h-8 rounded-full bg-white hover:bg-slate-100 text-slate-400 hover:text-slate-600 flex items-center justify-center border border-[#E5E5E5] transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* 2. DRAWER SCROLLABLE CONTENT */}
          <div className="p-5 flex-1 overflow-y-auto space-y-5 text-xs">
            {/* SECTION A: TELEMETRI NEUROKOGNITIF (CLEAN DATA CHIPS) */}
            <div>
              <div className="flex items-center gap-2 mb-2.5">
                <Zap className="w-4 h-4 text-amber-500" />
                <h3 className="text-xs font-black text-slate-900 uppercase tracking-wider">
                  Telemetri Neurokognitif (CDSS)
                </h3>
              </div>

              <div className="grid grid-cols-2 gap-2.5">
                {/* Fe Indicator */}
                <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                  <div className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                    Latensi Reaksi (Fe)
                  </div>
                  <div className="flex items-baseline gap-1 mt-0.5">
                    <span className="text-lg font-black text-slate-900 tabular-nums">
                      {patient.latencyMs}
                    </span>
                    <span className="text-[11px] font-semibold text-slate-500">ms</span>
                  </div>
                  <div className="mt-1 text-[10px] font-bold text-slate-600">
                    Ambang batas: &lt;400 ms
                  </div>
                  <div
                    className={`mt-1.5 inline-block text-[10px] font-black px-2 py-0.5 rounded ${
                      patient.latencyMs >= 480
                        ? 'bg-rose-100 text-rose-800'
                        : patient.latencyMs >= 400
                        ? 'bg-amber-100 text-amber-800'
                        : 'bg-emerald-100 text-emerald-800'
                    }`}
                  >
                    {patient.latencyMs >= 480
                      ? 'Defisiensi Fe Berat'
                      : patient.latencyMs >= 400
                      ? 'Subklinis'
                      : 'Optimal'}
                  </div>
                </div>

                {/* Zn Indicator */}
                <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                  <div className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                    Inhibisi Go/No-Go (Zn)
                  </div>
                  <div className="flex items-baseline gap-1 mt-0.5">
                    <span className="text-lg font-black text-slate-900 tabular-nums">
                      {patient.accuracyRate}
                    </span>
                    <span className="text-[11px] font-semibold text-slate-500">%</span>
                  </div>
                  <div className="mt-1 text-[10px] font-bold text-slate-600">
                    Err: {patient.commissionErrors} commission
                  </div>
                  <div
                    className={`mt-1.5 inline-block text-[10px] font-black px-2 py-0.5 rounded ${
                      patient.accuracyRate <= 65
                        ? 'bg-rose-100 text-rose-800'
                        : patient.accuracyRate <= 75
                        ? 'bg-amber-100 text-amber-800'
                        : 'bg-emerald-100 text-emerald-800'
                    }`}
                  >
                    {patient.accuracyRate <= 65
                      ? 'Inhibisi Rendah'
                      : patient.accuracyRate <= 75
                      ? 'Subklinis'
                      : 'Optimal'}
                  </div>
                </div>
              </div>
            </div>

            {/* SECTION B: ANTROPOMETRI & TANDA KLINIS FISIK */}
            <div>
              <div className="flex items-center gap-2 mb-2.5">
                <Activity className="w-4 h-4 text-emerald-600" />
                <h3 className="text-xs font-black text-slate-900 uppercase tracking-wider">
                  Status Somatik & Antropometri
                </h3>
              </div>

              {/* 4 Z-score / Anthropometry Chips */}
              <div className="grid grid-cols-4 gap-2 mb-3">
                <div className="p-2 rounded-xl bg-slate-50 border border-slate-200 text-center">
                  <span className="text-[10px] font-bold text-slate-400 block">LiLA</span>
                  <span className="text-xs font-black text-slate-900">{patient.muacCm} cm</span>
                </div>
                <div className="p-2 rounded-xl bg-slate-50 border border-slate-200 text-center">
                  <span className="text-[10px] font-bold text-slate-400 block">TB/U (HAZ)</span>
                  <span className={`text-xs font-black ${patient.haz <= -2 ? 'text-rose-600' : 'text-slate-900'}`}>
                    {patient.haz} SD
                  </span>
                </div>
                <div className="p-2 rounded-xl bg-slate-50 border border-slate-200 text-center">
                  <span className="text-[10px] font-bold text-slate-400 block">BB/U (WAZ)</span>
                  <span className={`text-xs font-black ${patient.waz <= -2 ? 'text-rose-600' : 'text-slate-900'}`}>
                    {patient.waz} SD
                  </span>
                </div>
                <div className="p-2 rounded-xl bg-slate-50 border border-slate-200 text-center">
                  <span className="text-[10px] font-bold text-slate-400 block">BB/TB (WHZ)</span>
                  <span className="text-xs font-black text-slate-900">{patient.whz} SD</span>
                </div>
              </div>

              {/* Physical Markers Chips */}
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 space-y-1.5">
                <div className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1 flex items-center gap-1.5">
                  <Eye className="w-3.5 h-3.5 text-slate-400" />
                  <span>Pemeriksaan Tanda Fisik Defisiensi</span>
                </div>
                <div className="flex flex-wrap gap-1.5">
                  <span
                    className={`px-2.5 py-1 rounded-lg text-[10px] font-bold border ${
                      patient.paleConjunctiva
                        ? 'bg-rose-50 text-rose-700 border-rose-300'
                        : 'bg-white text-slate-600 border-slate-200'
                    }`}
                  >
                    Konjungtiva Anemis: {patient.paleConjunctiva ? 'Positif (+)' : 'Negatif (-)'}
                  </span>
                  <span
                    className={`px-2.5 py-1 rounded-lg text-[10px] font-bold border ${
                      patient.angularStomatitis
                        ? 'bg-amber-50 text-amber-700 border-amber-300'
                        : 'bg-white text-slate-600 border-slate-200'
                    }`}
                  >
                    Stomatitis Angularis: {patient.angularStomatitis ? 'Positif (+)' : 'Negatif (-)'}
                  </span>
                  <span
                    className={`px-2.5 py-1 rounded-lg text-[10px] font-bold border ${
                      patient.skinDryness
                        ? 'bg-amber-50 text-amber-700 border-amber-300'
                        : 'bg-white text-slate-600 border-slate-200'
                    }`}
                  >
                    Kulit Kering (Xerosis): {patient.skinDryness ? 'Positif (+)' : 'Negatif (-)'}
                  </span>
                </div>
              </div>
            </div>

            {/* SECTION C: REKOMENDASI SUPLEMEN & TINDAK LANJUT RESEP */}
            <div>
              <div className="flex items-center gap-2 mb-2.5">
                <Pill className="w-4 h-4 text-[#34A853]" />
                <h3 className="text-xs font-black text-slate-900 uppercase tracking-wider">
                  Protokol Suplementasi & Intervensi
                </h3>
              </div>

              {/* Preset Supplements */}
              <div className="space-y-1.5 mb-3">
                {patient.supplementNotes.map((item, idx) => (
                  <div
                    key={idx}
                    className="p-2.5 rounded-xl bg-emerald-50/60 border border-emerald-200 flex items-start gap-2 text-emerald-950 font-semibold"
                  >
                    <CheckCircle2 className="w-3.5 h-3.5 text-[#2B8A44] shrink-0 mt-0.5" />
                    <span>{item}</span>
                  </div>
                ))}
              </div>

              {/* Lab Referral Input */}
              <div className="mb-3">
                <label className="text-[11px] font-bold text-slate-700 block mb-1 flex items-center gap-1.5">
                  <FlaskConical className="w-3.5 h-3.5 text-blue-600" />
                  Rujukan Laboratorium / Faskes Lanjutan
                </label>
                <input
                  type="text"
                  value={labReferral}
                  onChange={(e) => setLabReferral(e.target.value)}
                  placeholder="Contoh: Pemeriksaan Serum Ferritin & Darah Lengkap"
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#34A853]"
                />
              </div>

              {/* Doctor Clinical Notes */}
              <div>
                <label className="text-[11px] font-bold text-slate-700 block mb-1">
                  Catatan Medis Dokter
                </label>
                <textarea
                  rows={2}
                  value={clinicalNotes}
                  onChange={(e) => setClinicalNotes(e.target.value)}
                  placeholder="Instruksi khusus kepada orang tua / kader Posyandu..."
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#34A853] resize-none"
                />
              </div>
            </div>
          </div>

          {/* 3. DRAWER ACTION FOOTER */}
          <div className="p-4 border-t border-[#E5E5E5] bg-slate-50 flex items-center justify-between gap-3 shrink-0">
            {/* FHIR Button */}
            <button
              type="button"
              onClick={() => {
                soundSynth.playPop();
                onOpenFhirModal();
              }}
              className="px-3 py-2 rounded-xl bg-white border border-[#E5E5E5] hover:bg-slate-100 text-slate-700 font-bold text-xs flex items-center gap-1.5 transition-colors"
            >
              <FileJson className="w-3.5 h-3.5 text-emerald-700" />
              <span>SATUSEHAT FHIR</span>
            </button>

            {/* Save Button */}
            <button
              type="button"
              onClick={handleSave}
              className={`flex-1 py-2.5 px-4 rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition-all ${
                saveSuccess
                  ? 'bg-emerald-600 text-white shadow-xs'
                  : 'btn-3d-green text-white'
              }`}
            >
              {saveSuccess ? (
                <>
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Intervensi Tersimpan!</span>
                </>
              ) : (
                <>
                  <Save className="w-4 h-4" />
                  <span>Simpan Catatan Intervensi</span>
                </>
              )}
            </button>
          </div>
        </aside>
      </div>
    </div>
  );
};
