import React, { useState } from 'react';
import type { PatientRecord } from '../../types';
import { calculateZScores, recalculatePatientCDSS } from '../../services/cdssEngine';
import { soundFX } from '../../services/audioSynth';
import { Ruler, Scale, Activity, CheckCircle, X } from 'lucide-react';

interface SomaticCalibratorModalProps {
  isOpen: boolean;
  onClose: () => void;
  patient: PatientRecord;
  onUpdatePatient: (updated: PatientRecord) => void;
}

export const SomaticCalibratorModal: React.FC<SomaticCalibratorModalProps> = ({
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
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4 animate-in fade-in">
      <div className="bg-white rounded-3xl max-w-lg w-full shadow-2xl border border-slate-100 overflow-hidden font-child">
        {/* Header */}
        <div className="bg-gradient-to-r from-teal-600 to-teal-700 px-6 py-4 text-white flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-white/20 flex items-center justify-center">
              <Activity className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="font-bold text-lg leading-tight font-clinical">Input Antropometri Somatik Kader</h3>
              <p className="text-xs text-teal-100">Kalibrasi fisik sekunder sebelum/sesudah tes neurokognitif</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full hover:bg-white/20 transition-colors text-white"
            title="Tutup"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <div className="p-6 space-y-5">
          {/* Child Identity mini-card */}
          <div className="bg-slate-50 border border-slate-200/80 rounded-2xl p-3.5 flex items-center justify-between text-sm">
            <div>
              <span className="text-slate-500 text-xs block">Nama Anak</span>
              <span className="font-bold text-slate-800 text-base">{patient.name}</span>
            </div>
            <div className="text-right">
              <span className="text-slate-500 text-xs block">Usia & Posyandu</span>
              <span className="font-semibold text-teal-800">{patient.ageMonths} Bulan • {patient.gender === 'P' ? 'Perempuan' : 'Laki-laki'}</span>
            </div>
          </div>

          {/* Input MUAC / LiLA */}
          <div>
            <div className="flex justify-between items-center mb-1.5">
              <label className="text-sm font-bold text-slate-700 flex items-center gap-2">
                <Ruler className="w-4 h-4 text-teal-600" />
                Lingkar Lengan Atas / LiLA (MUAC)
              </label>
              <span className={`text-xs px-2.5 py-0.5 rounded-full font-bold border ${muacBadgeColor}`}>
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
                className="w-full px-4 py-3 rounded-xl border border-slate-300 focus:ring-2 focus:ring-teal-500 focus:border-teal-500 font-bold text-lg text-slate-800"
              />
              <span className="absolute right-4 top-3 text-slate-400 font-medium">cm</span>
            </div>
          </div>

          {/* Grid BB & TB */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-bold text-slate-700 flex items-center gap-1.5 mb-1.5">
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
                  className="w-full px-4 py-3 rounded-xl border border-slate-300 focus:ring-2 focus:ring-teal-500 focus:border-teal-500 font-bold text-slate-800"
                />
                <span className="absolute right-4 top-3 text-slate-400 text-sm font-medium">kg</span>
              </div>
            </div>

            <div>
              <label className="text-sm font-bold text-slate-700 flex items-center gap-1.5 mb-1.5">
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
                  className="w-full px-4 py-3 rounded-xl border border-slate-300 focus:ring-2 focus:ring-teal-500 focus:border-teal-500 font-bold text-slate-800"
                />
                <span className="absolute right-4 top-3 text-slate-400 text-sm font-medium">cm</span>
              </div>
            </div>
          </div>

          {/* Real-time Calculated WHO Z-Scores */}
          <div className="bg-teal-50/70 border border-teal-200/60 rounded-2xl p-3.5 space-y-2 text-xs">
            <span className="font-bold text-teal-900 block uppercase tracking-wide">Kalkulasi Otomatis Z-Score Somatik</span>
            <div className="grid grid-cols-3 gap-2 text-center">
              <div className="bg-white rounded-xl p-2 shadow-xs border border-teal-100">
                <span className="text-slate-500 block">WAZ (BB/U)</span>
                <span className={`font-black text-sm ${waz < -2 ? 'text-red-600' : 'text-slate-800'}`}>
                  {waz > 0 ? `+${waz}` : waz} SD
                </span>
              </div>
              <div className="bg-white rounded-xl p-2 shadow-xs border border-teal-100">
                <span className="text-slate-500 block">HAZ (TB/U)</span>
                <span className={`font-black text-sm ${haz < -2 ? 'text-red-600' : 'text-slate-800'}`}>
                  {haz > 0 ? `+${haz}` : haz} SD
                </span>
              </div>
              <div className="bg-white rounded-xl p-2 shadow-xs border border-teal-100">
                <span className="text-slate-500 block">WHZ (BB/TB)</span>
                <span className={`font-black text-sm ${whz < -2 ? 'text-amber-600' : 'text-slate-800'}`}>
                  {whz > 0 ? `+${whz}` : whz} SD
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="px-6 py-4 bg-slate-50 border-t border-slate-100 flex items-center justify-end gap-3">
          <button
            onClick={onClose}
            className="px-5 py-2.5 rounded-xl border border-slate-300 font-semibold text-slate-700 hover:bg-slate-100 transition-colors"
          >
            Batal
          </button>
          <button
            onClick={handleSave}
            className="px-6 py-2.5 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-bold shadow-md shadow-teal-600/20 flex items-center gap-2 transition-all hover:scale-[1.02]"
          >
            <CheckCircle className="w-5 h-5" />
            Simpan Kalibrasi Somatik
          </button>
        </div>
      </div>
    </div>
  );
};
