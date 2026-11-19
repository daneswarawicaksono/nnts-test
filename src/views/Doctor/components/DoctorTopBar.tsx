import React from 'react';
import {
  Activity,
  Building2,
  CheckCircle2,
  LogOut,
  User,
} from 'lucide-react';
import { soundSynth } from '../../../services/audio/synth';

interface DoctorTopBarProps {
  doctorName: string;
  faskesName: string;
  onLogout: () => void;
}

export const DoctorTopBar: React.FC<DoctorTopBarProps> = ({
  doctorName,
  faskesName,
  onLogout,
}) => {
  return (
    <header className="h-16 px-6 bg-white border-b border-[#E5E5E5] flex items-center justify-between z-10 shrink-0">
      {/* Left: Title & Context */}
      <div className="flex items-center gap-3">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-sm font-black text-slate-900 tracking-tight">
              Dashboard Pemantauan & Triase CDSS
            </h1>
            <span className="hidden sm:inline-flex items-center gap-1 text-[10px] font-bold text-slate-500 bg-slate-100 px-2 py-0.5 rounded-full border border-slate-200">
              <Activity className="w-3 h-3 text-[#2B8A44]" />
              Faskes Tingkat Pertama
            </span>
          </div>
          <p className="text-[11px] text-slate-500 font-medium hidden md:block">
            Sistem Pendukung Keputusan Klinis Defisiensi Mikronutrien & Stunting
          </p>
        </div>
      </div>

      {/* Right: Faskes, SATUSEHAT status & Doctor Profile */}
      <div className="flex items-center gap-3">
        {/* Faskes Badge */}
        <div className="hidden lg:flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-50 border border-[#E5E5E5]">
          <Building2 className="w-3.5 h-3.5 text-slate-500" />
          <span className="text-xs font-bold text-slate-700">{faskesName}</span>
        </div>

        {/* SATUSEHAT Indicator */}
        <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-50 border border-emerald-200">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
          </span>
          <span className="text-xs font-bold text-emerald-800 hidden sm:inline">
            SATUSEHAT
          </span>
          <CheckCircle2 className="w-3.5 h-3.5 text-[#2B8A44]" />
        </div>

        {/* Doctor Profile Pill */}
        <div className="flex items-center gap-2 pl-2 border-l border-[#E5E5E5]">
          <div className="w-8 h-8 rounded-full bg-emerald-100 border border-emerald-300 text-[#2B8A44] flex items-center justify-center font-bold text-xs shrink-0">
            <User className="w-4 h-4" />
          </div>
          <div className="hidden md:block text-left">
            <div className="text-xs font-black text-slate-900 leading-tight">
              {doctorName}
            </div>
            <div className="text-[10px] font-semibold text-slate-400">
              Dokter Faskes
            </div>
          </div>
        </div>

        {/* Logout Button */}
        <button
          type="button"
          onClick={() => {
            soundSynth.playPop();
            onLogout();
          }}
          className="w-9 h-9 rounded-xl bg-slate-50 hover:bg-rose-50 text-slate-500 hover:text-rose-600 flex items-center justify-center transition-colors border border-[#E5E5E5] hover:border-rose-200"
          title="Keluar dari sesi dokter"
        >
          <LogOut className="w-4 h-4" />
        </button>
      </div>
    </header>
  );
};
