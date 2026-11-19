import React from 'react';
import { Home, Gamepad2, UtensilsCrossed } from 'lucide-react';
import { soundSynth } from '../../../services/audio/synth';

export type ParentTabType = 'beranda' | 'game' | 'rekomendasi';

interface BottomNavVenmoProps {
  activeTab: ParentTabType;
  onChangeTab: (tab: ParentTabType) => void;
}

export const BottomNavVenmo: React.FC<BottomNavVenmoProps> = ({
  activeTab,
  onChangeTab,
}) => {
  return (
    <nav className="relative z-40 w-full bg-white border-t border-[#E5E5E5] px-4 pt-2 pb-5 select-none shadow-[0_-2px_12px_rgba(0,0,0,0.03)]">
      <div className="max-w-[400px] md:max-w-[720px] lg:max-w-[1000px] mx-auto flex items-center justify-between relative">
        {/* TAB 1: BERANDA */}
        <button
          type="button"
          onClick={() => {
            soundSynth.playPop();
            onChangeTab('beranda');
          }}
          className={`flex-1 flex flex-col items-center justify-center py-1 transition-all ${
            activeTab === 'beranda'
              ? 'text-[#34A853]'
              : 'text-slate-400 hover:text-slate-600'
          }`}
        >
          <div className="relative">
            <Home
              className={`w-6 h-6 transition-transform ${
                activeTab === 'beranda' ? 'scale-110 stroke-[2.5]' : 'stroke-2'
              }`}
            />
            {activeTab === 'beranda' && (
              <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1.5 h-1.5 rounded-full bg-[#34A853]" />
            )}
          </div>
          <span
            className={`text-[11px] mt-1 font-bold tracking-tight ${
              activeTab === 'beranda' ? 'font-extrabold text-[#34A853]' : ''
            }`}
          >
            Beranda
          </span>
        </button>

        {/* TAB 2: GAME HUB (VENMO ELEVATED CENTER BUTTON) */}
        <div className="flex-1 flex flex-col items-center justify-center relative -top-3">
          <button
            type="button"
            onClick={() => {
              soundSynth.playChime();
              onChangeTab('game');
            }}
            className={`group relative flex items-center justify-center w-14 h-14 rounded-full transition-all duration-150 ${
              activeTab === 'game'
                ? 'bg-[#34A853] shadow-[0_5px_0_#2B8A44] scale-105 -translate-y-1'
                : 'bg-[#34A853] shadow-[0_4px_0_#2B8A44] hover:-translate-y-0.5'
            } active:translate-y-1 active:shadow-[0_1px_0_#2B8A44]`}
            title="Petualangan Game Kerro"
          >
            {/* Mascot / Game Icon */}
            <div className="relative flex items-center justify-center">
              <Gamepad2 className="w-7 h-7 text-white stroke-[2.2] group-hover:scale-110 transition-transform" />
              <span className="absolute -top-1 -right-1 flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-amber-400 border border-white"></span>
              </span>
            </div>
          </button>
          <span
            className={`text-[11px] mt-1 font-extrabold tracking-tight ${
              activeTab === 'game' ? 'text-[#34A853]' : 'text-slate-500'
            }`}
          >
            Game Kerro
          </span>
        </div>

        {/* TAB 3: REKOMENDASI MAKAN / DAPUR GIZI */}
        <button
          type="button"
          onClick={() => {
            soundSynth.playPop();
            onChangeTab('rekomendasi');
          }}
          className={`flex-1 flex flex-col items-center justify-center py-1 transition-all ${
            activeTab === 'rekomendasi'
              ? 'text-[#34A853]'
              : 'text-slate-400 hover:text-slate-600'
          }`}
        >
          <div className="relative">
            <UtensilsCrossed
              className={`w-6 h-6 transition-transform ${
                activeTab === 'rekomendasi' ? 'scale-110 stroke-[2.5]' : 'stroke-2'
              }`}
            />
            {activeTab === 'rekomendasi' && (
              <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1.5 h-1.5 rounded-full bg-[#34A853]" />
            )}
          </div>
          <span
            className={`text-[11px] mt-1 font-bold tracking-tight ${
              activeTab === 'rekomendasi' ? 'font-extrabold text-[#34A853]' : ''
            }`}
          >
            Dapur Gizi
          </span>
        </button>
      </div>
    </nav>
  );
};
