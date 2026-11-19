import React from 'react';
import { useLocation } from 'wouter';
import { BottomNav } from './BottomNav';
import { LogOut } from 'lucide-react';
import { coreClient } from '../services/api/coreClient';
import type { AuthSession } from '../types/role';

interface MainLayoutProps {
  session: AuthSession;
  children: React.ReactNode;
}

export const MainLayout: React.FC<MainLayoutProps> = ({ session, children }) => {
  const [, setLocation] = useLocation();

  const handleLogout = () => {
    coreClient.clearAuth();
    setLocation('/');
    window.location.reload();
  };

  return (
    <div className="min-h-[100dvh] w-full bg-white font-sans">
      <div className="w-full h-[100dvh] bg-white overflow-hidden relative flex flex-col">

        {/* Global Compact App Header */}
        <header className="shrink-0 h-14 bg-white/95 backdrop-blur border-b border-slate-200/80 px-4 flex items-center justify-between z-20">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-ping" />
            <span className="text-xs font-bold text-slate-800">
              {session.user.fullName}
            </span>
            <span className="text-[10px] font-semibold bg-slate-100 text-slate-600 px-2 py-0.5 rounded-md border border-slate-200">
              {session.user.role === 'cadre' ? 'Kader' : session.user.role === 'doctor' ? 'Dokter' : 'Orang Tua'}
            </span>
          </div>

          <button
            onClick={handleLogout}
            title="Keluar / Logout"
            className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </header>

        {/* Page Main View Container */}
        <main className="flex-1 w-full overflow-y-auto overflow-x-hidden relative flex flex-col">
          {children}
        </main>

        {/* Bottom Tab Bar */}
        <BottomNav role={session.user.role} />
      </div>
    </div>
  );
};
