import React, { useState } from 'react';
import type { PatientRecord, Gender } from '../types';
import { calculateZScores, evaluateCDSS } from '../services/cdssEngine';
import { DiceBearAvatar } from './illustrations/DiceBearAvatar';
import { soundFX } from '../services/audioSynth';
import {
  UserPlus,
  X,
  Sparkles,
  Scale,
  Ruler,
  Activity,
  Building2,
  Zap,
  Gamepad2,
  CheckCircle,
} from 'lucide-react';

interface NewPatientModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSavePatient: (patient: PatientRecord, startMode: 'child-screening' | 'clinician-dashboard' | 'family-report') => void;
}

type SimulationPreset = 'manual-game' | 'latent-fe' | 'zinc-b12' | 'healthy-normal' | 'complex-deficit';

export const NewPatientModal: React.FC<NewPatientModalProps> = ({
  isOpen,
  onClose,
  onSavePatient,
}) => {
  // Child Identity
  const [name, setName] = useState('');
  const [gender, setGender] = useState<Gender>('L');
  const [ageMonths, setAgeMonths] = useState<number>(36);
  const [parentName, setParentName] = useState('');
  const [posyandu, setPosyandu] = useState('Posyandu Melati 01');
  const [customPosyandu, setCustomPosyandu] = useState('');
  const [patientId, setPatientId] = useState(`ID-POS-${Math.floor(100 + Math.random() * 900)}`);

  // Anthropometry
  const [weight, setWeight] = useState<number>(13.5);
  const [height, setHeight] = useState<number>(93.0);
  const [muac, setMuac] = useState<number>(13.2);

  // Simulation Preset for Demo/Presentation
  const [simPreset, setSimPreset] = useState<SimulationPreset>('manual-game');
  const [targetView, setTargetView] = useState<'child-screening' | 'clinician-dashboard' | 'family-report'>('child-screening');

  if (!isOpen) return null;

  // Real-time Z-Scores
  const { waz, haz, whz } = calculateZScores(ageMonths, weight, height);

  // Real-time MUAC Badge
  let muacColor = 'bg-emerald-50 text-emerald-700 border-emerald-300';
  let muacLabel = 'Normal (>12.5 cm)';
  if (muac < 11.5) {
    muacColor = 'bg-rose-50 text-rose-700 border-rose-300';
    muacLabel = 'Gizi Kurang Akut (<11.5 cm)';
  } else if (muac <= 12.5) {
    muacColor = 'bg-amber-50 text-amber-700 border-amber-300';
    muacLabel = 'Ambang Waspada (11.5–12.5 cm)';
  }

  const effectivePosyandu = posyandu === 'custom' ? (customPosyandu || 'Posyandu Terpadu') : posyandu;
  const effectiveName = name.trim() || 'Balita Baru';

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    soundFX.playSuccess();

    // Determine cognitive scores based on chosen simulation preset
    let reactionTime = {
      trials: [410, 425, 395],
      avgLatency: 410,
      variance: 220,
      completed: false,
    };
    let goNoGo = {
      totalRounds: 10,
      accuracyRate: 85,
      commissionErrors: 1,
      omissionErrors: 0,
      completed: false,
    };
    let memorySpan = {
      spanScore: 3,
      sequenceLengthTested: 3,
      completed: false,
    };

    if (simPreset === 'latent-fe') {
      reactionTime = {
        trials: [530, 495, 520],
        avgLatency: 515,
        variance: 680,
        completed: true,
      };
      goNoGo = {
        totalRounds: 10,
        accuracyRate: 65,
        commissionErrors: 3,
        omissionErrors: 1,
        completed: true,
      };
      memorySpan = {
        spanScore: 3,
        sequenceLengthTested: 3,
        completed: true,
      };
    } else if (simPreset === 'zinc-b12') {
      reactionTime = {
        trials: [435, 440, 425],
        avgLatency: 433,
        variance: 310,
        completed: true,
      };
      goNoGo = {
        totalRounds: 10,
        accuracyRate: 82,
        commissionErrors: 1,
        omissionErrors: 1,
        completed: true,
      };
      memorySpan = {
        spanScore: 1,
        sequenceLengthTested: 2,
        completed: true,
      };
    } else if (simPreset === 'healthy-normal') {
      reactionTime = {
        trials: [385, 390, 395],
        avgLatency: 390,
        variance: 140,
        completed: true,
      };
      goNoGo = {
        totalRounds: 10,
        accuracyRate: 92,
        commissionErrors: 0,
        omissionErrors: 0,
        completed: true,
      };
      memorySpan = {
        spanScore: 4,
        sequenceLengthTested: 4,
        completed: true,
      };
    } else if (simPreset === 'complex-deficit') {
      reactionTime = {
        trials: [560, 545, 580],
        avgLatency: 561,
        variance: 890,
        completed: true,
      };
      goNoGo = {
        totalRounds: 10,
        accuracyRate: 55,
        commissionErrors: 4,
        omissionErrors: 2,
        completed: true,
      };
      memorySpan = {
        spanScore: 1,
        sequenceLengthTested: 2,
        completed: true,
      };
    }

    // Run CDSS Engine
    const cdssResult = evaluateCDSS({
      muac,
      weight,
      height,
      waz,
      haz,
      avgLatency: reactionTime.avgLatency,
      goNoGoAccuracy: goNoGo.accuracyRate,
      memorySpanScore: memorySpan.spanScore,
    });

    const newRecord: PatientRecord = {
      id: patientId,
      name: effectiveName,
      ageMonths,
      gender,
      posyandu: effectivePosyandu,
      examDate: new Date().toISOString().split('T')[0],
      muac,
      weight,
      height,
      waz,
      haz,
      whz,
      reactionTime,
      goNoGo,
      memorySpan,
      feDeficiencyRisk: cdssResult.feDeficiencyRisk,
      znDeficiencyRisk: cdssResult.znDeficiencyRisk,
      b12DeficiencyRisk: cdssResult.b12DeficiencyRisk,
      tierAlert: cdssResult.tierAlert,
      clinicalRationale: cdssResult.clinicalRationale,
      familyStatus: cdssResult.familyStatus,
      checklist: {
        paleConjunctiva: cdssResult.feDeficiencyRisk > 70,
        posturalFatigue: cdssResult.feDeficiencyRisk > 70,
        lowAnimalProteinDiet: true,
        noAcuteInfection: true,
      },
      prescriptions: {
        ironSyrup: cdssResult.feDeficiencyRisk > 70,
        zincSupplement: cdssResult.znDeficiencyRisk > 70,
        taburiaMNP: cdssResult.feDeficiencyRisk > 50 || cdssResult.znDeficiencyRisk > 50,
        localDietCounseling: true,
        customNotes: parentName ? `Pendampingan nutrisi bersama ${parentName}` : '',
        isPrescribed: false,
      },
      followUpWindowWeeks: cdssResult.tierAlert.includes('Tier-1') ? '4 Minggu' : '8 Minggu',
      historicTrend: [
        { week: 'M-4', latency: reactionTime.avgLatency + 20, normalBaseline: 400 },
        { week: 'M-2', latency: reactionTime.avgLatency + 10, normalBaseline: 400 },
        { week: 'Hari Ini', latency: reactionTime.avgLatency, normalBaseline: 400 },
      ],
    };

    onSavePatient(newRecord, targetView);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-900/70 backdrop-blur-xs font-clinical overflow-y-auto animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl max-w-2xl w-full shadow-2xl border border-slate-200 overflow-hidden my-auto max-h-[92vh] flex flex-col">
        {/* Modal Header */}
        <div className="bg-gradient-to-r from-teal-700 via-teal-600 to-teal-500 px-6 py-4 text-white flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-white/15 backdrop-blur-xs flex items-center justify-center border border-white/20">
              <UserPlus className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="font-extrabold text-lg text-white">Daftarkan Pasien Anak Baru</h3>
              <p className="text-xs text-teal-100 font-medium">
                Pencatatan Identitas Posyandu &amp; Somatometri Awal
              </p>
            </div>
          </div>
          <button
            onClick={() => {
              soundFX.playClick();
              onClose();
            }}
            className="p-2 rounded-xl text-white/80 hover:text-white hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Scrollable Body */}
        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto space-y-6 flex-1 text-slate-700 text-sm">
          {/* Section 1: Live Avatar Preview & Identity */}
          <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 flex flex-col sm:flex-row items-center gap-4">
            <div className="relative p-1 rounded-full bg-gradient-to-tr from-amber-400 via-teal-400 to-rose-400 shadow-sm shrink-0">
              <DiceBearAvatar seed={effectiveName} gender={gender} size={72} />
              <div className="absolute -bottom-1 -right-1 bg-teal-600 text-white p-1 rounded-full border-2 border-white">
                <Sparkles className="w-3.5 h-3.5" />
              </div>
            </div>
            <div className="flex-1 w-full space-y-3">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Nama Panggilan / Lengkap Anak <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Contoh: Rayyan / Aisyah"
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 focus:border-teal-500 focus:ring-2 focus:ring-teal-200 outline-none text-slate-800 font-semibold text-sm transition-all"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Jenis Kelamin
                  </label>
                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={() => setGender('L')}
                      className={`flex-1 py-2 px-3 rounded-xl border text-xs font-extrabold flex items-center justify-center gap-1.5 transition-all ${
                        gender === 'L'
                          ? 'bg-blue-600 text-white border-blue-600 shadow-xs'
                          : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-100'
                      }`}
                    >
                      <span>👦 Laki-laki</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setGender('P')}
                      className={`flex-1 py-2 px-3 rounded-xl border text-xs font-extrabold flex items-center justify-center gap-1.5 transition-all ${
                        gender === 'P'
                          ? 'bg-rose-600 text-white border-rose-600 shadow-xs'
                          : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-100'
                      }`}
                    >
                      <span>👧 Perempuan</span>
                    </button>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Usia (Bulan)
                  </label>
                  <div className="flex items-center gap-2">
                    <input
                      type="number"
                      min={24}
                      max={59}
                      value={ageMonths}
                      onChange={(e) => setAgeMonths(parseInt(e.target.value) || 36)}
                      className="w-full px-3 py-2 rounded-xl border border-slate-300 focus:border-teal-500 focus:ring-2 focus:ring-teal-200 outline-none text-slate-800 font-semibold text-sm"
                    />
                    <span className="text-xs text-slate-400 font-medium whitespace-nowrap">
                      ({(ageMonths / 12).toFixed(1)} Th)
                    </span>
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Nama Ibu / Wali
                  </label>
                  <input
                    type="text"
                    value={parentName}
                    onChange={(e) => setParentName(e.target.value)}
                    placeholder="Contoh: Ibu Rahma"
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 focus:border-teal-500 focus:ring-2 focus:ring-teal-200 outline-none text-slate-800 font-semibold text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    No. KMS / ID Rekam
                  </label>
                  <input
                    type="text"
                    value={patientId}
                    onChange={(e) => setPatientId(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 focus:border-teal-500 focus:ring-2 focus:ring-teal-200 outline-none text-slate-800 font-mono text-xs font-bold"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Section 2: Posyandu & Location */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1 flex items-center gap-1.5">
                <Building2 className="w-3.5 h-3.5 text-teal-600" />
                <span>Posyandu Pelaksana</span>
              </label>
              <select
                value={posyandu}
                onChange={(e) => setPosyandu(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-slate-300 focus:border-teal-500 focus:ring-2 focus:ring-teal-200 outline-none text-slate-800 font-semibold text-sm bg-white"
              >
                <option value="Posyandu Melati 01">Posyandu Melati 01 (Desa Sukamaju)</option>
                <option value="Posyandu Melati 03">Posyandu Melati 03 (Kel. Mawar)</option>
                <option value="Posyandu Mawar 02">Posyandu Mawar 02 (Puskesmas FKTP)</option>
                <option value="Posyandu Cempaka 05">Posyandu Cempaka 05 (Kec. Sehat)</option>
                <option value="custom">+ Posyandu / Faskes Lain (Ketik Baru)</option>
              </select>
            </div>
            {posyandu === 'custom' && (
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Nama Faskes / Posyandu Kustom
                </label>
                <input
                  type="text"
                  required
                  value={customPosyandu}
                  onChange={(e) => setCustomPosyandu(e.target.value)}
                  placeholder="Ketik nama Posyandu / Puskesmas"
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 focus:border-teal-500 focus:ring-2 focus:ring-teal-200 outline-none text-slate-800 font-semibold text-sm"
                />
              </div>
            )}
          </div>

          {/* Section 3: Antropometri & WHO Z-Score */}
          <div className="bg-teal-50/50 border border-teal-200/80 rounded-2xl p-4 space-y-3">
            <div className="flex items-center justify-between">
              <h4 className="font-extrabold text-xs uppercase tracking-wider text-teal-900 flex items-center gap-1.5">
                <Activity className="w-4 h-4 text-teal-600" />
                <span>Pengukuran Somatometri Standar WHO</span>
              </h4>
              <span className={`text-[11px] font-bold px-2.5 py-0.5 rounded-full border ${muacColor}`}>
                LiLA: {muacLabel}
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1 flex items-center gap-1">
                  <Scale className="w-3.5 h-3.5 text-teal-600" />
                  <span>Berat Badan (kg)</span>
                </label>
                <input
                  type="number"
                  step="0.1"
                  min="8.0"
                  max="30.0"
                  value={weight}
                  onChange={(e) => setWeight(parseFloat(e.target.value) || 12.0)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 bg-white focus:border-teal-500 outline-none font-bold text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1 flex items-center gap-1">
                  <Ruler className="w-3.5 h-3.5 text-teal-600" />
                  <span>Tinggi Badan (cm)</span>
                </label>
                <input
                  type="number"
                  step="0.5"
                  min="65"
                  max="130"
                  value={height}
                  onChange={(e) => setHeight(parseFloat(e.target.value) || 90.0)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 bg-white focus:border-teal-500 outline-none font-bold text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1 flex items-center gap-1">
                  <Activity className="w-3.5 h-3.5 text-teal-600" />
                  <span>LiLA / MUAC (cm)</span>
                </label>
                <input
                  type="number"
                  step="0.1"
                  min="9.0"
                  max="20.0"
                  value={muac}
                  onChange={(e) => setMuac(parseFloat(e.target.value) || 12.5)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 bg-white focus:border-teal-500 outline-none font-bold text-sm"
                />
              </div>
            </div>

            {/* Calculated Z-Scores Pill Badges */}
            <div className="pt-2 flex flex-wrap items-center gap-2 text-xs">
              <span className="text-slate-500 font-semibold">Estimasi Z-Score:</span>
              <span className={`px-2 py-0.5 rounded-md font-bold font-mono ${waz < -2 ? 'bg-rose-100 text-rose-800' : 'bg-white text-slate-700 border border-slate-200'}`}>
                BB/U (WAZ): {waz > 0 ? `+${waz}` : waz} SD
              </span>
              <span className={`px-2 py-0.5 rounded-md font-bold font-mono ${haz < -2 ? 'bg-rose-100 text-rose-800' : 'bg-white text-slate-700 border border-slate-200'}`}>
                TB/U (HAZ): {haz > 0 ? `+${haz}` : haz} SD {haz < -2 ? '(Stunting)' : ''}
              </span>
              <span className={`px-2 py-0.5 rounded-md font-bold font-mono ${whz < -2 ? 'bg-amber-100 text-amber-800' : 'bg-white text-slate-700 border border-slate-200'}`}>
                BB/TB (WHZ): {whz > 0 ? `+${whz}` : whz} SD
              </span>
            </div>
          </div>

          {/* Section 4: Simulasi Hasil Skrining (Mempermudah Presentasi Online!) */}
          <div className="border border-slate-200 rounded-2xl p-4 bg-slate-50/70 space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-xs font-extrabold uppercase tracking-wider text-slate-800 flex items-center gap-1.5">
                <Zap className="w-4 h-4 text-amber-500" />
                <span>Mode Alur Skrining Pasien Ini</span>
              </label>
              <span className="text-[11px] text-teal-700 font-bold bg-teal-50 px-2 py-0.5 rounded-md border border-teal-200">
                Fitur Presentasi / Live Demo
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
              <label
                className={`p-3 rounded-xl border cursor-pointer transition-all flex flex-col justify-between ${
                  simPreset === 'manual-game'
                    ? 'bg-teal-50/80 border-teal-500 ring-2 ring-teal-200 text-teal-950 font-bold'
                    : 'bg-white border-slate-200 text-slate-600 hover:border-slate-300'
                }`}
              >
                <div className="flex items-center gap-2 mb-1">
                  <input
                    type="radio"
                    name="simPreset"
                    checked={simPreset === 'manual-game'}
                    onChange={() => setSimPreset('manual-game')}
                    className="accent-teal-600"
                  />
                  <Gamepad2 className="w-4 h-4 text-teal-600" />
                  <span className="font-extrabold">🎮 Mainkan Game dari Nol</span>
                </div>
                <p className="text-[11px] text-slate-500 font-normal pl-5">
                  Buka Pulau Cakra dan mainkan game balon, buah, &amp; hewan bersama anak/penguji secara manual.
                </p>
              </label>

              <label
                className={`p-3 rounded-xl border cursor-pointer transition-all flex flex-col justify-between ${
                  simPreset === 'latent-fe'
                    ? 'bg-rose-50/80 border-rose-500 ring-2 ring-rose-200 text-rose-950 font-bold'
                    : 'bg-white border-slate-200 text-slate-600 hover:border-slate-300'
                }`}
              >
                <div className="flex items-center gap-2 mb-1">
                  <input
                    type="radio"
                    name="simPreset"
                    checked={simPreset === 'latent-fe'}
                    onChange={() => setSimPreset('latent-fe')}
                    className="accent-rose-600"
                  />
                  <span className="font-extrabold">⚡ Simulasi: Defisiensi Besi (Fe)</span>
                </div>
                <p className="text-[11px] text-slate-500 font-normal pl-5">
                  Latensi lambat (515ms) + kontrol inhibisi turun. KMS hijau tapi risiko Tier-1 laten terdeteksi!
                </p>
              </label>

              <label
                className={`p-3 rounded-xl border cursor-pointer transition-all flex flex-col justify-between ${
                  simPreset === 'zinc-b12'
                    ? 'bg-amber-50/80 border-amber-500 ring-2 ring-amber-200 text-amber-950 font-bold'
                    : 'bg-white border-slate-200 text-slate-600 hover:border-slate-300'
                }`}
              >
                <div className="flex items-center gap-2 mb-1">
                  <input
                    type="radio"
                    name="simPreset"
                    checked={simPreset === 'zinc-b12'}
                    onChange={() => setSimPreset('zinc-b12')}
                    className="accent-amber-600"
                  />
                  <span className="font-extrabold">⚡ Simulasi: Defisiensi Seng &amp; B12</span>
                </div>
                <p className="text-[11px] text-slate-500 font-normal pl-5">
                  Memori kerja pendek (Span 1) terasosiasi LiLA kuning. Cocok demo preskripsi suplemen seng.
                </p>
              </label>

              <label
                className={`p-3 rounded-xl border cursor-pointer transition-all flex flex-col justify-between ${
                  simPreset === 'healthy-normal'
                    ? 'bg-emerald-50/80 border-emerald-500 ring-2 ring-emerald-200 text-emerald-950 font-bold'
                    : 'bg-white border-slate-200 text-slate-600 hover:border-slate-300'
                }`}
              >
                <div className="flex items-center gap-2 mb-1">
                  <input
                    type="radio"
                    name="simPreset"
                    checked={simPreset === 'healthy-normal'}
                    onChange={() => setSimPreset('healthy-normal')}
                    className="accent-emerald-600"
                  />
                  <span className="font-extrabold">⚡ Simulasi: Anak Sehat Normonutrisi</span>
                </div>
                <p className="text-[11px] text-slate-500 font-normal pl-5">
                  Refleks kilat (390ms), fokus tajam (92%), medali bintang 5 di album orang tua.
                </p>
              </label>
            </div>
          </div>

          {/* Section 5: Target Halaman Setelah Simpan */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5">
              Buka Layar Mana Setelah Disimpan?
            </label>
            <div className="flex gap-2 text-xs">
              <button
                type="button"
                onClick={() => setTargetView('child-screening')}
                className={`flex-1 py-2 px-3 rounded-xl border font-bold flex items-center justify-center gap-1.5 transition-all ${
                  targetView === 'child-screening'
                    ? 'bg-teal-600 text-white border-teal-600 shadow-xs'
                    : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
                }`}
              >
                <span>🎮 Skrining Anak</span>
              </button>
              <button
                type="button"
                onClick={() => setTargetView('clinician-dashboard')}
                className={`flex-1 py-2 px-3 rounded-xl border font-bold flex items-center justify-center gap-1.5 transition-all ${
                  targetView === 'clinician-dashboard'
                    ? 'bg-slate-900 text-white border-slate-900 shadow-xs'
                    : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
                }`}
              >
                <span>🩺 Dasbor Klinis Dokter</span>
              </button>
              <button
                type="button"
                onClick={() => setTargetView('family-report')}
                className={`flex-1 py-2 px-3 rounded-xl border font-bold flex items-center justify-center gap-1.5 transition-all ${
                  targetView === 'family-report'
                    ? 'bg-amber-500 text-white border-amber-500 shadow-xs'
                    : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
                }`}
              >
                <span>📖 Laporan Keluarga</span>
              </button>
            </div>
          </div>

          {/* Footer Actions */}
          <div className="pt-3 border-t border-slate-200 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={() => {
                soundFX.playClick();
                onClose();
              }}
              className="px-4 py-2.5 rounded-xl border border-slate-300 text-slate-600 font-bold hover:bg-slate-100 transition-colors"
            >
              Batal
            </button>
            <button
              type="submit"
              className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-teal-600 to-teal-500 hover:from-teal-700 hover:to-teal-600 text-white font-extrabold shadow-md shadow-teal-600/30 flex items-center gap-2 transition-all hover:scale-[1.02] active:scale-[0.98]"
            >
              <CheckCircle className="w-4 h-4" />
              <span>Simpan &amp; Aktifkan Pasien</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
