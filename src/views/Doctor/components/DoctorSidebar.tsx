import React from 'react';
import {
  LayoutDashboard,
  Users,
  ClipboardList,
  FileJson,
  Settings,
  Stethoscope,
  LogOut,
} from 'lucide-react';
import { soundSynth } from '../../../services/audio/synth';

interface DoctorSidebarProps {
  activeMenu: string;
  onSelectMenu: (menu: string) => void;
  doctorName: string;
  faskesName: string;
  onLogout: () => void;
}

export const DoctorSidebar: React.FC<DoctorSidebarProps> = ({
  activeMenu,
  onSelectMenu,
  doctorName,
  faskesName,
  onLogout,
}) => {
  const menuItems = [
    { id: 'dashboard', label: 'Dashboard CDSS', icon: LayoutDashboard },
    { id: 'worklist', label: 'Antrean Balita', icon: Users },
    { id: 'intervensi', label: 'Rekam Intervensi', icon: ClipboardList },
    { id: 'satusehat', label: 'SATUSEHAT FHIR', icon: FileJson },
    { id: 'settings', label: 'Pengaturan Faskes', icon: Settings },
  ];

  return (
    <aside className="w-60 bg-white border-r border-[#E5E5E5] flex flex-col justify-between h-full select-none shrink-0">
      {/* Brand Header */}
      <div>
        <div className="p-5 border-b border-[#E5E5E5] flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-[#34A853] text-white flex items-center justify-center shadow-[0_3px_0_#2B8A44] shrink-0">
            <Stethoscope className="w-5 h-5 stroke-[2.2]" />
          </div>
          <div className="min-w-0">
            <span className="text-[10px] font-black text-[#2B8A44] uppercase tracking-wider block">
              CDSS Faskes
            </span>
            <h2 className="text-sm font-black text-slate-900 truncate">
              NNTS Puskesmas
            </h2>
          </div>
        </div>

        {/* Navigation Menu */}
        <nav className="p-3 space-y-1">
          <div className="px-3 py-1.5 text-[10px] font-black text-slate-400 uppercase tracking-wider">
            Menu Utama
          </div>
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeMenu === item.id;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => {
                  soundSynth.playPop();
                  onSelectMenu(item.id);
                }}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-bold transition-all text-left ${
                  isActive
                    ? 'bg-emerald-50 text-[#2B8A44] font-black border border-emerald-200 shadow-xs'
                    : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? 'text-[#34A853]' : 'text-slate-400'}`} />
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>
      </div>

      {/* User Info & Logout at Bottom */}
      <div className="p-3 border-t border-[#E5E5E5] space-y-2 bg-slate-50/50">
        <div className="p-2.5 rounded-xl bg-white border border-[#E5E5E5]">
          <div className="text-xs font-black text-slate-900 truncate">{doctorName}</div>
          <div className="text-[10px] font-semibold text-slate-500 truncate">{faskesName}</div>
        </div>

        <button
          type="button"
          onClick={onLogout}
          className="w-full flex items-center justify-center gap-2 py-2 px-3 rounded-xl text-xs font-bold text-slate-600 hover:text-rose-600 hover:bg-rose-50 border border-transparent hover:border-rose-200 transition-all"
        >
          <LogOut className="w-3.5 h-3.5" />
          <span>Keluar Sesi</span>
        </button>
      </div>
    </aside>
  );
};
