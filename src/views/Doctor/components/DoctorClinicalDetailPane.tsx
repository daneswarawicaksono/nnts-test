import React, { useState } from 'react';
import {
  FileJson,
  CheckCircle2,
  ArrowLeft,
  Save,
} from 'lucide-react';
import { soundSynth } from '../../../services/audio/synth';
import type { ClinicalPatient } from '../DoctorDashboard';

interface DoctorClinicalDetailPaneProps {
  patient: ClinicalPatient;
  onBackToQueue?: () => void;
  onOpenFhirModal: () => void;
  onSaveIntervention: (lab: string, notes: string) => void;
}

export const DoctorClinicalDetailPane: React.FC<DoctorClinicalDetailPaneProps> = ({
  patient,
  onBackToQueue,
  onOpenFhirModal,
  onSaveIntervention,
}) => {
  const [labText, setLabText] = useState(patient.labReferral || '');
  const [notesText, setNotesText] = useState(patient.clinicalNotes || '');
  const [activeTab, setActiveTab] = useState<'ringkasan' | 'somatik' | 'intervensi'>('ringkasan');

  const isTier1 = patient.tier.includes('Tier-1');
  const isTier2 = patient.tier.includes('Tier-2');

  const handleSave = () => {
    soundSynth.playChime();
    onSaveIntervention(labText, notesText);
  };

  return (
    <div className="bg-white rounded-2xl border border-[#E5E5E5] flex flex-col h-full shadow-xs overflow-hidden select-none">
      {/* Mobile Back Button Bar */}
      {onBackToQueue && (
        <div className="md:hidden p-3 border-b border-[#E5E5E5] bg-slate-50 flex items-center justify-between">
          <button
            type="button"
            onClick={onBackToQueue}
            className="text-xs font-bold text-[#34A853] flex items-center gap-1"
          >
            <ArrowLeft className="w-4 h-4" /> Antrean Balita
          </button>
          <span className="text-xs font-black text-slate-800">{patient.childName}</span>
        </div>
      )}

      {/* Patient Banner (Header) */}
      <div className="p-4 sm:p-5 border-b border-[#E5E5E5] flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white shrink-0">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-black text-slate-400">{patient.id}</span>
            <span
              className={`text-[10px] font-black px-2.5 py-0.5 rounded-full ${
                isTier1
                  ? 'bg-rose-100 text-rose-800 border border-rose-300'
                  : isTier2
                  ? 'bg-amber-100 text-amber-800 border border-amber-300'
                  : 'bg-emerald-100 text-emerald-800 border border-emerald-300'
              }`}
            >
              {patient.tier}
            </span>
            {patient.interventionSaved && (
              <span className="text-[10px] font-extrabold text-[#2B8A44] bg-emerald-50 px-2 py-0.5 rounded-full flex items-center gap-1 border border-emerald-200">
                <CheckCircle2 className="w-3 h-3" /> Intervensi Tersimpan
              </span>
            )}
          </div>
          <h2 className="text-lg font-black text-slate-900 mt-1">
            {patient.childName}
          </h2>
          <p className="text-xs text-slate-500 font-semibold mt-0.5">
            {patient.ageMonths} Bulan • {patient.gender === 'L' ? 'Laki-laki' : 'Perempuan'} • {patient.posyandu} ({patient.rw})
          </p>
        </div>

        {/* Action Button: SATUSEHAT Export */}
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={onOpenFhirModal}
            className="py-2 px-3.5 rounded-xl btn-3d-white text-xs font-bold flex items-center gap-1.5"
            title="Lihat payload SATUSEHAT FHIR R4 Kemenkes"
          >
            <FileJson className="w-4 h-4 text-[#34A853]" />
            <span>SATUSEHAT FHIR</span>
          </button>
        </div>
      </div>

      {/* Segmented Sub-Tabs */}
      <div className="px-4 pt-2.5 bg-slate-50/70 border-b border-[#E5E5E5] flex gap-2 text-xs font-bold shrink-0">
        <button
          type="button"
          onClick={() => {
            soundSynth.playPop();
            setActiveTab('ringkasan');
          }}
          className={`pb-2 px-2 border-b-2 transition-all ${
            activeTab === 'ringkasan'
              ? 'border-[#34A853] text-[#2B8A44] font-black'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          Telemetri Neurokognitif
        </button>
        <button
          type="button"
          onClick={() => {
            soundSynth.playPop();
            setActiveTab('somatik');
          }}
          className={`pb-2 px-2 border-b-2 transition-all ${
            activeTab === 'somatik'
              ? 'border-[#34A853] text-[#2B8A44] font-black'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          Somatometri & Fisik
        </button>
        <button
          type="button"
          onClick={() => {
            soundSynth.playPop();
            setActiveTab('intervensi');
          }}
          className={`pb-2 px-2 border-b-2 transition-all ${
            activeTab === 'intervensi'
              ? 'border-[#34A853] text-[#2B8A44] font-black'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          Catatan & Resep
        </button>
      </div>

      {/* Main Content Area (Scrollable) */}
      <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-4">
        {/* ========================================= */}
        {/* TAB 1: TELEMETRI NEUROKOGNITIF            */}
        {/* ========================================= */}
        {activeTab === 'ringkasan' && (
          <div className="space-y-4 animate-in fade-in duration-100">
            {/* 3 Metric Stat Chips (Quicken Style) */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {/* Card Zat Besi */}
              <div className="bg-slate-50/70 rounded-2xl p-4 border border-[#E5E5E5] space-y-1.5">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-extrabold text-slate-500">Zat Besi (Fe)</span>
                  <span
                    className={`text-[10px] font-black px-2 py-0.5 rounded-full ${
                      patient.latencyMs > 480
                        ? 'bg-rose-100 text-rose-800'
                        : 'bg-emerald-100 text-emerald-800'
                    }`}
                  >
                    {patient.latencyMs > 480 ? 'Kritis' : 'Optimal'}
                  </span>
                </div>
                <div className="text-2xl font-black text-slate-900 tabular-nums">
                  {patient.latencyMs} <span className="text-xs font-bold text-slate-400">ms</span>
                </div>
                <div className="text-[11px] font-semibold text-slate-500">
                  Transmisi motorik (Ambang batas: 400 ms)
                </div>
              </div>

              {/* Card Seng */}
              <div className="bg-slate-50/70 rounded-2xl p-4 border border-[#E5E5E5] space-y-1.5">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-extrabold text-slate-500">Seng (Zn)</span>
                  <span
                    className={`text-[10px] font-black px-2 py-0.5 rounded-full ${
                      patient.accuracyRate < 70
                        ? 'bg-amber-100 text-amber-800'
                        : 'bg-emerald-100 text-emerald-800'
                    }`}
                  >
                    {patient.accuracyRate < 70 ? 'Defisit' : 'Optimal'}
                  </span>
                </div>
                <div className="text-2xl font-black text-slate-900 tabular-nums">
                  {patient.accuracyRate}%
                </div>
                <div className="text-[11px] font-semibold text-slate-500">
                  Inhibisi kognitif ({patient.commissionErrors} salah sentuh)
                </div>
              </div>

              {/* Card Vitamin B12 */}
              <div className="bg-slate-50/70 rounded-2xl p-4 border border-[#E5E5E5] space-y-1.5">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-extrabold text-slate-500">Vitamin B12</span>
                  <span className="text-[10px] font-black px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                    Memadai
                  </span>
                </div>
                <div className="text-2xl font-black text-slate-900 tabular-nums">
                  {patient.memorySpan} <span className="text-xs font-bold text-slate-400">span</span>
                </div>
                <div className="text-[11px] font-semibold text-slate-500">
                  Kapasitas memori kerja spasial
                </div>
              </div>
            </div>

            {/* Scannable Bullet Points (No More Long Essay!) */}
            <div className="bg-white rounded-2xl border border-[#E5E5E5] p-4 space-y-2.5">
              <span className="text-[11px] font-extrabold text-[#34A853] uppercase tracking-wider block">
                Rekomendasi Algoritma Triase CDSS:
              </span>

              <div className="space-y-2 text-xs">
                <div className="flex items-start gap-2 text-slate-700">
                  <span className="w-1.5 h-1.5 rounded-full bg-slate-400 mt-1.5 shrink-0" />
                  <span>
                    <strong>Diagnosa Presumtif:</strong>{' '}
                    {isTier1
                      ? 'Defisiensi Zat Besi fungsional akut & risiko stunting tersembunyi.'
                      : isTier2
                      ? 'Penurunan transmisi inhibisi fungsional (risiko seng rendah).'
                      : 'Profil telemetri dan kognitif berada dalam rentang normal.'}
                  </span>
                </div>

                <div className="flex items-start gap-2 text-slate-700">
                  <span className="w-1.5 h-1.5 rounded-full bg-slate-400 mt-1.5 shrink-0" />
                  <span>
                    <strong>Tindakan Klinis Prioritas:</strong>{' '}
                    {isTier1
                      ? 'Pemeriksaan serum ferritin & darah lengkap (Hb). Suplementasi zat besi.'
                      : isTier2
                      ? 'Konseling PMBA pangan hewani padat gizi (telur, teri, hati ayam).'
                      : 'Lanjutkan pemantauan rutin bulanan di Posyandu.'}
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ========================================= */}
        {/* TAB 2: SOMATOMETRI & TANDA FISIK          */}
        {/* ========================================= */}
        {activeTab === 'somatik' && (
          <div className="space-y-4 animate-in fade-in duration-100">
            {/* LiLA Highlight Card */}
            <div
              className={`p-4 rounded-2xl border flex items-center justify-between ${
                patient.muacCm < 11.5
                  ? 'bg-rose-50 border-rose-200 text-rose-900'
                  : patient.muacCm <= 12.5
                  ? 'bg-amber-50 border-amber-200 text-amber-900'
                  : 'bg-emerald-50 border-emerald-200 text-emerald-900'
              }`}
            >
              <div>
                <span className="text-[10px] font-extrabold uppercase tracking-wider block">
                  Lingkar Lengan Atas (LiLA):
                </span>
                <div className="text-2xl font-black tabular-nums">{patient.muacCm} cm</div>
              </div>
              <span className="text-xs font-black px-3 py-1 rounded-full bg-white shadow-xs border border-slate-200">
                {patient.muacCm < 11.5
                  ? 'Pita Merah (<11.5 cm) — Gizi Kurang Akut'
                  : patient.muacCm <= 12.5
                  ? 'Pita Kuning (11.5–12.5 cm) — Waspada'
                  : 'Pita Hijau (>12.5 cm) — Normal'}
              </span>
            </div>

            {/* WHO Z-Scores Grid */}
            <div className="grid grid-cols-3 gap-3">
              <div className="bg-slate-50/80 rounded-2xl p-3 border border-[#E5E5E5] text-center">
                <span className="text-[10px] text-slate-500 font-bold block">BB/U (WAZ)</span>
                <div className="text-base font-black text-slate-900 mt-0.5">{patient.waz} SD</div>
              </div>

              <div className="bg-slate-50/80 rounded-2xl p-3 border border-[#E5E5E5] text-center">
                <span className="text-[10px] text-slate-500 font-bold block">TB/U (HAZ)</span>
                <div className={`text-base font-black mt-0.5 ${patient.haz < -2 ? 'text-rose-600' : 'text-slate-900'}`}>
                  {patient.haz} SD
                </div>
              </div>

              <div className="bg-slate-50/80 rounded-2xl p-3 border border-[#E5E5E5] text-center">
                <span className="text-[10px] text-slate-500 font-bold block">BB/TB (WHZ)</span>
                <div className="text-base font-black text-slate-900 mt-0.5">{patient.whz} SD</div>
              </div>
            </div>

            {/* Physical Signs Checklist */}
            <div className="bg-white rounded-2xl border border-[#E5E5E5] p-4 space-y-2">
              <span className="text-[11px] font-extrabold text-[#34A853] uppercase tracking-wider block">
                Pemeriksaan Fisik Klinis:
              </span>

              <div className="space-y-2 text-xs">
                <div className="flex items-center justify-between p-2 rounded-xl bg-slate-50">
                  <span className="font-semibold text-slate-700">Pucat Konjungtiva (Anemia Defisiensi Besi)</span>
                  <span className={`font-black ${patient.paleConjunctiva ? 'text-rose-600' : 'text-[#2B8A44]'}`}>
                    {patient.paleConjunctiva ? 'POSITIF (+)' : 'NEGATIF (-)'}
                  </span>
                </div>

                <div className="flex items-center justify-between p-2 rounded-xl bg-slate-50">
                  <span className="font-semibold text-slate-700">Luka Sudut Bibir / Stomatitis Angularis</span>
                  <span className={`font-black ${patient.angularStomatitis ? 'text-amber-600' : 'text-[#2B8A44]'}`}>
                    {patient.angularStomatitis ? 'POSITIF (+)' : 'NEGATIF (-)'}
                  </span>
                </div>

                <div className="flex items-center justify-between p-2 rounded-xl bg-slate-50">
                  <span className="font-semibold text-slate-700">Kulit Kering Bersisik (Xerosis)</span>
                  <span className={`font-black ${patient.skinDryness ? 'text-amber-600' : 'text-[#2B8A44]'}`}>
                    {patient.skinDryness ? 'POSITIF (+)' : 'NEGATIF (-)'}
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ========================================= */}
        {/* TAB 3: CATATAN INTERVENSI & RESEP         */}
        {/* ========================================= */}
        {activeTab === 'intervensi' && (
          <div className="space-y-4 animate-in fade-in duration-100">
            {/* Standard Supplement Protocols */}
            <div className="bg-white rounded-2xl border border-[#E5E5E5] p-4 space-y-2.5">
              <span className="text-[11px] font-extrabold text-[#34A853] uppercase tracking-wider block">
                Protokol Suplementasi Terstandar:
              </span>

              <div className="space-y-1.5">
                {patient.supplementNotes.map((note, idx) => (
                  <div key={idx} className="flex items-center gap-2 p-2 bg-emerald-50 rounded-xl text-xs font-bold text-emerald-900 border border-emerald-200">
                    <CheckCircle2 className="w-4 h-4 text-[#34A853] shrink-0" />
                    <span>{note}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Quick Rx & Lab Inputs */}
            <div className="bg-white rounded-2xl border border-[#E5E5E5] p-4 space-y-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Pemeriksaan Penunjang Lab:
                </label>
                <input
                  type="text"
                  value={labText}
                  onChange={(e) => setLabText(e.target.value)}
                  placeholder="Contoh: Serum Ferritin, Hb, Profil Besi..."
                  className="w-full px-3 py-2 text-xs rounded-xl border border-[#E5E5E5] focus:outline-none focus:ring-2 focus:ring-[#34A853] font-sans"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Instruksi Klinis Dokter:
                </label>
                <textarea
                  rows={2}
                  value={notesText}
                  onChange={(e) => setNotesText(e.target.value)}
                  placeholder="Catatan tindak lanjut..."
                  className="w-full px-3 py-2 text-xs rounded-xl border border-[#E5E5E5] focus:outline-none focus:ring-2 focus:ring-[#34A853] font-sans"
                />
              </div>

              {/* SINGLE PRIMARY ACTION BUTTON */}
              <button
                type="button"
                onClick={handleSave}
                className="w-full py-3 rounded-xl btn-3d-green text-xs font-black flex items-center justify-center gap-2 shadow-[0_4px_0_#2B8A44]"
              >
                <Save className="w-4 h-4" />
                <span>Simpan Catatan Intervensi ke Rekam Medis</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
