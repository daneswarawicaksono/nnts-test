import React, { useState } from 'react';
import { NutriSprout, type NutriSproutMood } from '../../design-system/mascot/NutriSprout';
import { Button } from '../../design-system/primitives/Button';
import { soundSynth } from '../../services/audio/synth';

export interface WelcomeViewProps {
  onStart: () => void;
  onLogin: () => void;
  onExploreLanguage?: () => void;
}

export const WelcomeView: React.FC<WelcomeViewProps> = ({ onStart, onLogin, onExploreLanguage }) => {
  const [mascotMood, setMascotMood] = useState<NutriSproutMood>('calm');

  const handleMascotClick = () => {
    soundSynth.playPop();
    setMascotMood((prev) => (prev === 'calm' ? 'happy' : prev === 'happy' ? 'curious' : 'calm'));
  };

  const handleStartClick = () => {
    soundSynth.playChime();
    onStart();
  };

  return (
    <div className="w-full h-full bg-gradient-to-b from-[#F0FDF4] via-[#F7FEE7]/50 to-[#FFFBEB] flex flex-col justify-between items-center px-6 py-6 sm:py-8 select-none relative overflow-hidden">
      {/* Decorative Warm Ambient Glow Aura */}
      <div
        className="absolute -top-20 -right-20 w-72 h-72 rounded-full bg-amber-200/35 blur-3xl pointer-events-none"
        aria-hidden="true"
      />
      <div
        className="absolute -bottom-20 -left-20 w-72 h-72 rounded-full bg-teal-200/30 blur-3xl pointer-events-none"
        aria-hidden="true"
      />

      {/* TOP INVISIBLE SPACER */}
      <div className="w-full h-1 shrink-0" aria-hidden="true" />

      {/* CENTER HERO: MASKOT + HEADLINE + 1 KALIMAT */}
      <main className="w-full max-w-xs mx-auto flex flex-col items-center text-center my-auto z-10 shrink-0">
        {/* Karakter Maskot Bernapas */}
        <div
          onClick={handleMascotClick}
          className="cursor-pointer transition-transform active:scale-95 mb-4"
          title="Ketuk Timi untuk menyapa"
          role="button"
          tabIndex={0}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') handleMascotClick();
          }}
        >
          <NutriSprout size={110} mood={mascotMood} />
        </div>

        {/* Headline: Cegah stunting sejak dini */}
        <h1 className="text-2xl sm:text-[26px] font-extrabold text-slate-900 tracking-tight leading-tight mb-2">
          Cegah stunting <br />
          sejak dini
        </h1>

        {/* 1 Kalimat Penjelas Saja */}
        <p className="text-xs sm:text-sm text-slate-600 leading-relaxed max-w-[270px] text-pretty">
          Pantau tumbuh kembang dan penuhi gizi terbaik buah hati dengan mudah bersama&nbsp;Posyandu.
        </p>
      </main>

      {/* BOTTOM ACTIONS: 1 TOMBOL UTAMA + 1 LINK SEKUNDER */}
      <footer className="w-full max-w-xs mx-auto flex flex-col items-center gap-2.5 z-20 shrink-0 pb-4 sm:pb-6">
        {/* 1 Tombol Utama: Mulai */}
        <Button
          variant="primary"
          size="lg"
          fullWidth
          onClick={handleStartClick}
          className="shadow-btn-primary"
        >
          Mulai
        </Button>

        {onExploreLanguage && (
          <Button
            variant="secondary"
            size="md"
            fullWidth
            onClick={() => {
              soundSynth.playChime();
              onExploreLanguage();
            }}
            className="text-xs font-bold text-slate-700"
          >
            Petualangan Bahasa Cakra →
          </Button>
        )}
        {/* 1 Link Sekunder: Sudah punya akun? Masuk */}
        <div className="text-xs text-slate-600 flex items-center justify-center gap-1.5 pt-0.5">
          <span>Sudah punya akun?</span>
          <button
            type="button"
            onClick={onLogin}
            className="text-nutri-teal-700 hover:text-nutri-teal-800 font-bold hover:underline cursor-pointer py-1"
          >
            Masuk
          </button>
        </div>
      </footer>
    </div>
  );
};
