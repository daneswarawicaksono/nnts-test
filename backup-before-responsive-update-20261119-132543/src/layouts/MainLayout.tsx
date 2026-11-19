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

  const isExpandedWorkstation = session.user.role === 'doctor';

  return (
    <div className="min-h-screen w-full bg-slate-100 flex items-center justify-center sm:p-4 font-sans">
      <div
        className={
          isExpandedWorkstation
            ? 'w-full max-w-6xl h-[100dvh] sm:h-[min(900px,96vh)] bg-white sm:rounded-3xl sm:shadow-2xl sm:border border-slate-200/90 overflow-hidden relative flex flex-col'
            : 'w-full sm:max-w-[420px] h-[100dvh] sm:h-[min(840px,94vh)] bg-white sm:rounded-[44px] sm:shadow-2xl sm:border-[8px] sm:border-slate-800 overflow-hidden relative flex flex-col'
        }
      >
        {/* Notch Decorator on Mobile Frame */}
        {!isExpandedWorkstation && (
          <div className="hidden sm:block absolute top-2 left-1/2 -translate-x-1/2 w-28 h-4 bg-slate-800 rounded-full z-50 pointer-events-none" />
        )}

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
