import React from 'react';
import type { ActiveAppView, PatientRecord } from '../types';
import { PRESET_SCENARIOS } from '../data/presetScenarios';
import { DiceBearAvatar } from './illustrations/DiceBearAvatar';
import { soundFX } from '../services/audioSynth';
import {
  Gamepad2,
  Stethoscope,
  HeartHandshake,
  Volume2,
  VolumeX,
  Activity,
  UserPlus,
  Globe,
} from 'lucide-react';

interface GlobalNavbarProps {
  currentView: ActiveAppView;
  onViewChange: (view: ActiveAppView) => void;
  currentPatient: PatientRecord;
  onSelectPreset: (presetKey: string) => void;
  isMuted: boolean;
  onToggleMute: () => void;
  onOpenNewPatientModal: () => void;
  onOpenShareModal: () => void;
}

export const GlobalNavbar: React.FC<GlobalNavbarProps> = ({
  currentView,
  onViewChange,
  currentPatient,
  onSelectPreset,
  isMuted,
  onToggleMute,
  onOpenNewPatientModal,
  onOpenShareModal,
}) => {
  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200/80 shadow-xs px-4 sm:px-6 py-2.5 transition-all">
      <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-3">
        {/* Brand Logo & Product Name */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-teal-700 via-teal-600 to-teal-500 text-white flex items-center justify-center shadow-sm shadow-teal-700/20">
            <Activity className="w-5 h-5 text-white" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-extrabold text-base tracking-tight text-slate-900 font-clinical">
                NNTS <span className="text-teal-600 font-bold">CDSS</span>
              </span>
              <span className="hidden sm:inline-block px-2 py-0.5 rounded-full text-[10px] font-bold bg-teal-50 text-teal-700 border border-teal-200/80">
                Puskesmas / Posyandu
              </span>
            </div>
            <p className="text-[11px] text-slate-400 font-medium hidden md:block">
              Neuro-Nutrient Triage System for Pediatric Hidden Hunger
            </p>
          </div>
        </div>

        {/* 3-View Mode Switcher Tabs */}
        <div className="flex items-center bg-slate-100/90 p-1 rounded-2xl border border-slate-200/70 text-xs font-bold">
          <button
            onClick={() => {
              soundFX.playClick();
              onViewChange('child-screening');
            }}
            className={`px-3.5 py-1.5 rounded-xl flex items-center gap-2 transition-all ${
              currentView === 'child-screening'
                ? 'bg-teal-600 text-white shadow-xs font-black'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Gamepad2 className="w-4 h-4" />
            <span className="hidden lg:inline">Mode Skrining Anak (Tablet)</span>
            <span className="lg:hidden">Skrining</span>
          </button>

          <button
            onClick={() => {
              soundFX.playClick();
              onViewChange('clinician-dashboard');
            }}
            className={`px-3.5 py-1.5 rounded-xl flex items-center gap-2 transition-all ${
              currentView === 'clinician-dashboard'
                ? 'bg-slate-900 text-white shadow-xs font-black'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Stethoscope className="w-4 h-4" />
            <span className="hidden lg:inline">Dasbor Klinis (Dokter/Gizi)</span>
            <span className="lg:hidden">Dasbor</span>
          </button>

          <button
            onClick={() => {
              soundFX.playClick();
              onViewChange('family-report');
            }}
            className={`px-3.5 py-1.5 rounded-xl flex items-center gap-2 transition-all ${
              currentView === 'family-report'
                ? 'bg-amber-500 text-white shadow-xs font-black'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <HeartHandshake className="w-4 h-4" />
            <span className="hidden lg:inline">Laporan Keluarga (Orang Tua)</span>
            <span className="lg:hidden">Keluarga</span>
          </button>
        </div>

        {/* Quick Demo Preset Selector + Add Patient + Sound FX toggle */}
        <div className="flex items-center gap-2">
          {/* Add New Patient Button */}
          <button
            onClick={() => {
              soundFX.playClick();
              onOpenNewPatientModal();
            }}
            className="px-3 py-1.5 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-extrabold text-xs flex items-center gap-1.5 shadow-sm shadow-teal-700/20 transition-all hover:scale-105 active:scale-95"
            title="Daftarkan / Input Data Pasien Anak Baru"
          >
            <UserPlus className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">+ Isi Data Anak</span>
            <span className="sm:hidden">+ Isi</span>
          </button>

          {/* Share Online / QR di HP Button */}
          <button
            onClick={() => {
              soundFX.playClick();
              onOpenShareModal();
            }}
            className="px-3 py-1.5 rounded-xl bg-indigo-50 hover:bg-indigo-100 text-indigo-700 border border-indigo-200/80 font-extrabold text-xs flex items-center gap-1.5 shadow-xs transition-all hover:scale-105 active:scale-95"
            title="Akses Online & Scan QR di HP (Cloudflare)"
          >
            <Globe className="w-3.5 h-3.5 text-indigo-600" />
            <span className="hidden sm:inline">Online / HP</span>
            <span className="sm:hidden">HP</span>
          </button>

          {/* Preset Selector */}
          <div className="flex items-center gap-2 bg-slate-50 border border-slate-200 rounded-xl px-2.5 py-1 text-xs">
            <DiceBearAvatar seed={currentPatient.name} gender={currentPatient.gender} size={24} />
            <span className="text-slate-500 font-semibold hidden xl:inline">Pasien:</span>
            <select
              aria-label="Pilih Skenario Pasien Demo"
              value={
                currentPatient.id === PRESET_SCENARIOS.kasus1.id
                  ? 'kasus1'
                  : currentPatient.id === PRESET_SCENARIOS.kasus2.id
                  ? 'kasus2'
                  : currentPatient.id === PRESET_SCENARIOS.kasus3.id
                  ? 'kasus3'
                  : currentPatient.id === PRESET_SCENARIOS.kasus4.id
                  ? 'kasus4'
                  : currentPatient.id === PRESET_SCENARIOS.kasus5.id
                  ? 'kasus5'
                  : currentPatient.id === PRESET_SCENARIOS.kasus6.id
                  ? 'kasus6'
                  : 'custom'
              }
              onChange={(e) => {
                soundFX.playClick();
                onSelectPreset(e.target.value);
              }}
              className="bg-transparent font-bold text-slate-800 focus:outline-none cursor-pointer text-xs"
            >
              <option value="kasus1">Anisa (48 Bln) — Tier-1 Latent Fe</option>
              <option value="kasus2">Budi (36 Bln) — Tier-1 Zn & B12</option>
              <option value="kasus3">Citra (54 Bln) — Sehat Normonutrisi</option>
              <option value="kasus4">Daffa (42 Bln) — Tier-1 Gizi Kompleks</option>
              <option value="kasus5">Eka (30 Bln) — Tier-2 Waspada LiLA</option>
              <option value="kasus6">Farhan (48 Bln) — Sehat Normal</option>
            </select>
          </div>

          {/* Sound FX Toggle */}
          <button
            onClick={onToggleMute}
            className={`p-2 rounded-xl border text-xs flex items-center justify-center transition-colors ${
              isMuted
                ? 'bg-rose-50 text-rose-600 border-rose-200'
                : 'bg-slate-50 text-slate-600 hover:bg-slate-100 border-slate-200'
            }`}
            title={isMuted ? 'Aktifkan Efek Suara Synth' : 'Bisukan Efek Suara Synth'}
          >
            {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
          </button>
        </div>
      </div>
    </header>
  );
};
