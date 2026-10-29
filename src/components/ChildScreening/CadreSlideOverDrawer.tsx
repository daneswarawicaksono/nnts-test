import React, { useState } from 'react';
import type { PatientRecord } from '../../types';
import { calculateZScores, recalculatePatientCDSS } from '../../services/cdssEngine';
import { soundFX } from '../../services/audioSynth';
import { Ruler, Scale, Activity, CheckCircle, X, Lock, ShieldCheck } from 'lucide-react';

interface CadreSlideOverDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  patient: PatientRecord;
  onUpdatePatient: (updated: PatientRecord) => void;
}

export const CadreSlideOverDrawer: React.FC<CadreSlideOverDrawerProps> = ({
  isOpen,
  onClose,
  patient,
  onUpdatePatient,
}) => {
  const [muac, setMuac] = useState(patient.muac.toString());
  const [weight, setWeight] = useState(patient.weight.toString());
  const [height, setHeight] = useState(patient.height.toString());

  if (!isOpen) return null;

  const numMuac = parseFloat(muac) || 12.0;
  const numWeight = parseFloat(weight) || 14.0;
  const numHeight = parseFloat(height) || 95.0;

  // Real-time LiLA Status
  let muacBadgeColor = 'bg-emerald-100 text-emerald-800 border-emerald-300';
  let muacLabel = 'Hijau — Normal (>12.5 cm)';
  if (numMuac < 11.5) {
    muacBadgeColor = 'bg-red-100 text-red-800 border-red-300';
    muacLabel = 'Merah — Gizi Kurang Akut (<11.5 cm)';
  } else if (numMuac <= 12.5) {
    muacBadgeColor = 'bg-amber-100 text-amber-800 border-amber-300';
    muacLabel = 'Kuning — Ambang Waspada (11.5–12.5 cm)';
  }

  const { waz, haz, whz } = calculateZScores(patient.ageMonths, numWeight, numHeight);

  const handleSave = () => {
    soundFX.playClick();
    const updated: PatientRecord = recalculatePatientCDSS({
      ...patient,
      muac: numMuac,
      weight: numWeight,
      height: numHeight,
      waz,
      haz,
      whz,
    });
    onUpdatePatient(updated);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-slate-900/60 backdrop-blur-xs animate-in fade-in font-clinical">
      {/* Slide-over Drawer Panel */}
      <div className="bg-white w-full max-w-md h-full shadow-2xl flex flex-col justify-between border-l border-slate-200 animate-in slide-in-from-right-full duration-300">
        {/* Header */}
        <div className="bg-slate-900 px-6 py-5 text-white flex items-center justify-between border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-teal-500/20 text-teal-400 flex items-center justify-center border border-teal-500/30">
              <Lock className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-bold text-base text-white">Panel Khusus Petugas Kader</h3>
                <span className="text-[10px] px-2 py-0.5 rounded bg-teal-900 text-teal-300 font-mono border border-teal-700">
                  Posyandu Gate
                </span>
              </div>
              <p className="text-xs text-slate-400">Tersembunyi dari layar anak selama sesi permainan</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-white transition-colors"
            title="Tutup Panel"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body Content */}
        <div className="p-6 space-y-5 overflow-y-auto flex-1">
          {/* Active Patient Identity Card */}
          <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 space-y-1.5 text-xs">
            <div className="flex justify-between items-center">
              <span className="text-slate-400 font-semibold uppercase tracking-wider">Identitas Anak:</span>
              <span className="px-2 py-0.5 rounded bg-slate-200 text-slate-700 font-mono font-bold">{patient.id}</span>
            </div>
            <h4 className="text-base font-black text-slate-800">{patient.name}</h4>
            <div className="text-slate-600 flex gap-3 pt-1">
              <span>Usia: <strong>{patient.ageMonths} Bulan</strong></span>
              <span>•</span>
              <span>Jenis Kelamin: <strong>{patient.gender === 'P' ? 'Perempuan' : 'Laki-laki'}</strong></span>
            </div>
            <span className="text-teal-800 block text-[11px] font-medium pt-1">
              📍 {patient.posyandu}
            </span>
          </div>

          <div className="bg-amber-50 border border-amber-200 rounded-2xl p-3.5 text-xs text-amber-900 flex items-start gap-2.5">
            <ShieldCheck className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
            <span>
              <strong>Perhatian Kader:</strong> Pastikan balita telah selesai diukur LiLA, BB, dan TB sebelum atau setelah 3 sesi petualangan game neurokognitif.
            </span>
          </div>

          {/* Form Fields: LiLA */}
          <div className="space-y-1.5">
            <div className="flex justify-between items-center">
              <label className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                <Ruler className="w-4 h-4 text-teal-600" />
                Lingkar Lengan Atas / LiLA (MUAC)
              </label>
              <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold border ${muacBadgeColor}`}>
                {muacLabel}
              </span>
            </div>
            <div className="relative">
              <input
                type="number"
                step="0.1"
                min="8"
                max="25"
                value={muac}
                onChange={(e) => setMuac(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-slate-300 focus:ring-2 focus:ring-teal-500 focus:border-teal-500 font-bold text-lg text-slate-900"
              />
              <span className="absolute right-4 top-3 text-slate-400 font-medium text-sm">cm</span>
            </div>
          </div>

          {/* Form Fields: BB & TB */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                <Scale className="w-4 h-4 text-teal-600" />
                Berat Badan (BB)
              </label>
              <div className="relative">
                <input
                  type="number"
                  step="0.1"
                  min="5"
                  max="35"
                  value={weight}
                  onChange={(e) => setWeight(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-slate-300 focus:ring-2 focus:ring-teal-500 focus:border-teal-500 font-bold text-base text-slate-900"
                />
                <span className="absolute right-3.5 top-3.5 text-slate-400 font-medium text-xs">kg</span>
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                <Ruler className="w-4 h-4 text-teal-600" />
                Tinggi Badan (TB)
              </label>
              <div className="relative">
                <input
                  type="number"
                  step="0.5"
                  min="60"
                  max="140"
                  value={height}
                  onChange={(e) => setHeight(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-slate-300 focus:ring-2 focus:ring-teal-500 focus:border-teal-500 font-bold text-base text-slate-900"
                />
                <span className="absolute right-3.5 top-3.5 text-slate-400 font-medium text-xs">cm</span>
              </div>
            </div>
          </div>

          {/* WHO Calculated Z-Scores */}
          <div className="bg-slate-50 border border-slate-200 rounded-2xl p-3.5 space-y-2 text-xs">
            <span className="font-bold text-slate-700 flex items-center gap-1.5 uppercase tracking-wide">
              <Activity className="w-3.5 h-3.5 text-teal-600" />
              Kalkulasi Otomatis Z-Score Somatik WHO
            </span>
            <div className="grid grid-cols-3 gap-2 text-center">
              <div className="bg-white rounded-xl p-2.5 border border-slate-200 shadow-xs">
                <span className="text-slate-400 text-[10px] block">WAZ (BB/U)</span>
                <span className={`font-black text-sm ${waz < -2 ? 'text-red-600' : 'text-slate-800'}`}>
                  {waz > 0 ? `+${waz}` : waz} SD
                </span>
              </div>
              <div className="bg-white rounded-xl p-2.5 border border-slate-200 shadow-xs">
                <span className="text-slate-400 text-[10px] block">HAZ (TB/U)</span>
                <span className={`font-black text-sm ${haz < -2 ? 'text-red-600' : 'text-slate-800'}`}>
                  {haz > 0 ? `+${haz}` : haz} SD
                </span>
              </div>
              <div className="bg-white rounded-xl p-2.5 border border-slate-200 shadow-xs">
                <span className="text-slate-400 text-[10px] block">WHZ (BB/TB)</span>
                <span className={`font-black text-sm ${whz < -2 ? 'text-amber-600' : 'text-slate-800'}`}>
                  {whz > 0 ? `+${whz}` : whz} SD
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="p-5 bg-slate-50 border-t border-slate-200 flex items-center justify-end gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2.5 rounded-xl border border-slate-300 font-semibold text-xs text-slate-600 hover:bg-slate-100 transition-colors"
          >
            Batal
          </button>
          <button
            onClick={handleSave}
            className="px-5 py-2.5 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs shadow-md shadow-teal-600/20 flex items-center gap-1.5 transition-all hover:scale-102"
          >
            <CheckCircle className="w-4 h-4" />
            Simpan Kalibrasi Kader
          </button>
        </div>
      </div>
    </div>
  );
};
