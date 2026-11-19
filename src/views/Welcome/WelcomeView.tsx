import React from 'react';
import { soundSynth } from '../../services/audio/synth';

export interface WelcomeViewProps {
  onStart: () => void;
  onLogin: () => void;
}

export const WelcomeView: React.FC<WelcomeViewProps> = ({ onStart, onLogin }) => {
  const handleStartClick = () => {
    soundSynth.playChime();
    onStart();
  };

  const handleLoginClick = () => {
    soundSynth.playPop();
    onLogin();
  };

  return (
    <div className="w-full h-full bg-white flex flex-col justify-between items-center px-6 py-8 md:px-12 select-none relative overflow-hidden lg:flex-row lg:justify-center lg:gap-20 xl:gap-32">
      {/* Decorative Warm Ambient Glow Aura */}
      <div
        className="absolute -top-24 -right-24 w-80 h-80 rounded-full bg-emerald-100/50 blur-3xl pointer-events-none"
        aria-hidden="true"
      />
      <div
        className="absolute -bottom-24 -left-24 w-80 h-80 rounded-full bg-emerald-50/70 blur-3xl pointer-events-none"
        aria-hidden="true"
      />

      {/* TOP SPACER */}
      <div className="w-full h-6 shrink-0 lg:hidden" aria-hidden="true" />

      {/* CENTER HERO: MASCOT + LOGO + TAGLINE */}
      <main className="w-full max-w-xs lg:max-w-xl mx-auto lg:mx-0 flex flex-col items-center lg:items-start text-center lg:text-left my-auto z-10 shrink-0">
        {/* Kerro Mascot (Standing Pose) */}
        <div
          onClick={handleStartClick}
          className="cursor-pointer transition-transform active:scale-95 mb-4 group"
          title="Kerro Si Katak"
          role="button"
          tabIndex={0}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') handleStartClick();
          }}
        >
          <img
            src="/mascot/kerro_pose6_stand.png"
            alt="Kerro the Frog"
            className="w-36 h-36 sm:w-40 sm:h-40 lg:w-64 lg:h-64 object-contain drop-shadow-md group-hover:scale-105 transition-transform duration-300"
          />
        </div>

        {/* Brand: otakatik */}
        <h1 className="text-3xl sm:text-4xl lg:text-6xl font-extrabold text-[#2F9E44] tracking-tight mb-2">
          otakatik
        </h1>

        {/* Slogan / Subtitle */}
        <p className="text-sm lg:text-xl font-medium text-slate-500 max-w-[240px] lg:max-w-none">
          Smart growth through play.
        </p>
      </main>

      {/* BOTTOM ACTIONS: GET STARTED + I ALREADY HAVE AN ACCOUNT */}
      <footer className="w-full max-w-xs lg:max-w-md mx-auto lg:mx-0 flex flex-col items-center gap-3 z-20 shrink-0 pb-4 sm:pb-6 lg:pb-0 lg:p-10 lg:rounded-[32px] lg:border lg:border-emerald-100 lg:bg-[#F7FBF7] lg:shadow-[0_24px_80px_rgba(30,100,50,0.08)]">
        <div className="hidden lg:block w-full text-left mb-5">
          <span className="text-xs uppercase tracking-[0.18em] font-extrabold text-[#2F9E44]">Mulai bersama Kerro</span>
          <h2 className="mt-3 text-3xl font-black tracking-tight text-[#183122]">Petualangan sehat si kecil dimulai di sini.</h2>
          <p className="mt-3 text-sm leading-relaxed text-slate-600">Buat akun keluarga dan ikuti perkembangan anak lewat aktivitas bermain yang menyenangkan.</p>
        </div>
        {/* GET STARTED */}
        <button
          type="button"
          onClick={handleStartClick}
          className="w-full py-3.5 px-6 rounded-full bg-[#2F9E44] hover:bg-[#2b8a3e] active:scale-[0.98] text-white font-bold text-sm sm:text-base tracking-wide shadow-md hover:shadow-lg transition-all duration-200 cursor-pointer"
        >
          GET STARTED
        </button>

        {/* I ALREADY HAVE AN ACCOUNT */}
        <button
          type="button"
          onClick={handleLoginClick}
          className="w-full py-3.5 px-6 rounded-full bg-white hover:bg-slate-50 active:scale-[0.98] text-[#2F9E44] font-bold text-sm tracking-wide border border-slate-200 hover:border-emerald-300 shadow-sm transition-all duration-200 cursor-pointer"
        >
          I ALREADY HAVE AN ACCOUNT
        </button>
      </footer>
    </div>
  );
};
