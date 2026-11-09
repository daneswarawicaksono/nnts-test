import React from 'react';
import { TactileButton } from '../components/TactileButton';
import { NutriSprout } from '../../../design-system/mascot/NutriSprout';
import { soundSynth } from '../../../services/audio/synth';

export interface SplashScreenProps {
  onStart: () => void;
  onLogin?: () => void;
}

export const SplashScreen: React.FC<SplashScreenProps> = ({ onStart, onLogin }) => {
  const handleStart = () => {
    soundSynth.playChime();
    onStart();
  };

  const handleLogin = () => {
    soundSynth.playPop();
    if (onLogin) onLogin();
  };

  return (
    <div className="w-full h-full bg-[#58CC02] flex flex-col justify-between items-center px-6 pt-12 pb-8 select-none relative overflow-hidden">
      {/* Subtle organic cloud curves in background */}
      <div
        className="absolute top-10 -left-16 w-48 h-48 rounded-full bg-white/10 blur-xl pointer-events-none"
        aria-hidden="true"
      />
      <div
        className="absolute bottom-24 -right-16 w-56 h-56 rounded-full bg-white/10 blur-2xl pointer-events-none"
        aria-hidden="true"
      />

      {/* TOP SPACER */}
      <div className="h-4" aria-hidden="true" />

      {/* CENTER HERO: MASCOT & WORDMARK */}
      <div className="flex flex-col items-center justify-center my-auto z-10 text-center">
        {/* Animated Mascot */}
        <div className="animate-float-breath mb-6 cursor-pointer" onClick={() => soundSynth.playPop()}>
          <NutriSprout size={130} mood="happy" showShadow={false} />
        </div>

        {/* Clean Logo Wordmark (WCAG AAA contrast on #58CC02) */}
        <h1 className="text-4xl font-black font-child text-[#052E16] tracking-tight mb-2">
          nnts bahasa
        </h1>
        <p className="text-sm font-bold font-child text-[#052E16] max-w-[240px] leading-snug">
          Petualangan seru kosakata gizi & tumbuh kembang anak
        </p>
      </div>
      {/* BOTTOM ACTIONS */}
      <div className="w-full max-w-xs flex flex-col items-center gap-3.5 z-20">
        <TactileButton
          variant="white"
          size="lg"
          fullWidth
          onClick={handleStart}
          className="text-[#15803D] text-base"
        >
          Mulai Sekarang
        </TactileButton>

        <button
          type="button"
          onClick={handleLogin}
          className="text-xs font-black font-child tracking-wider uppercase text-[#052E16] hover:text-black py-2 px-4 transition-colors cursor-pointer min-h-[44px] flex items-center justify-center underline decoration-[#14532D]/40"
        >
          Sudah punya akun? Masuk
        </button>
      </div>
    </div>
  );
};
