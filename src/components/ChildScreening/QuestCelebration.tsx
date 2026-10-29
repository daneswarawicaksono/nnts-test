import React, { useEffect } from 'react';
import confetti from 'canvas-confetti';
import { MascotCakra } from '../illustrations/MascotCakra';
import { soundFX } from '../../services/audioSynth';
import type { PatientRecord } from '../../types';
import { Star, Award, Stethoscope, HeartHandshake, RotateCcw } from 'lucide-react';

interface QuestCelebrationProps {
  patient: PatientRecord;
  onNavigateClinician: () => void;
  onNavigateFamily: () => void;
  onRestart: () => void;
}

export const QuestCelebration: React.FC<QuestCelebrationProps> = ({
  patient,
  onNavigateClinician,
  onNavigateFamily,
  onRestart,
}) => {
  useEffect(() => {
    soundFX.playFanfare();

    try {
      confetti({
        particleCount: 100,
        spread: 80,
        origin: { y: 0.6 },
        colors: ['#0D9488', '#F59E0B', '#F43F5E', '#10B981', '#6366F1', '#FDE047'],
      });
    } catch {
      // fallback
    }
  }, []);

  return (
    <div className="flex flex-col items-center justify-center p-6 text-center select-none font-child space-y-6 max-w-2xl mx-auto animate-in zoom-in-95">
      {/* Mascot Cakra in big celebration pose */}
      <div className="relative">
        <div className="absolute -inset-6 bg-gradient-to-r from-amber-300 via-rose-300 to-teal-300 rounded-full blur-2xl opacity-80 animate-pulse" />
        <div className="relative animate-bounce-gentle">
          <MascotCakra size={190} mood="celebrating" />
        </div>
      </div>

      {/* 5 Shiny Golden Stars with Kenney-style badge */}
      <div className="flex justify-center gap-2.5">
        {Array.from({ length: 5 }).map((_, i) => (
          <div
            key={i}
            className="w-14 h-14 rounded-2xl bg-gradient-to-b from-yellow-200 to-amber-400 border-b-4 border-amber-600 flex items-center justify-center text-amber-950 shadow-xl transform hover:scale-125 transition-transform"
            style={{ animationDelay: `${i * 120}ms` }}
          >
            <Star className="w-8 h-8 fill-yellow-300 stroke-amber-700 stroke-2" />
          </div>
        ))}
      </div>

      {/* Wooden Signboard Celebration Notice */}
      <div className="bg-amber-50 border-4 border-amber-800/80 rounded-3xl p-5 shadow-xl text-amber-950 max-w-lg w-full">
        <div className="inline-flex items-center gap-2 px-4 py-1 rounded-full bg-emerald-500 text-white text-xs font-black mb-2 shadow-xs">
          <Award className="w-4 h-4" /> PENJELAJAH BINTANG LIMA!
        </div>
        <h2 className="text-3xl sm:text-4xl font-black text-amber-950 leading-tight">
          Hore! {patient.name} Hebat!
        </h2>
        <p className="text-amber-900 text-sm sm:text-base font-bold mt-1">
          Semua petualangan berhasil diselesaikan! Peti harta karun emas terbuka penuh bintang!
        </p>
      </div>

      {/* Action Buttons (Kenney 3D Chunky Buttons) */}
      <div className="flex flex-col sm:flex-row items-center justify-center gap-4 w-full pt-2">
        <button
          onClick={onNavigateClinician}
          className="relative w-full sm:w-auto px-8 py-4 rounded-3xl bg-teal-600 hover:bg-teal-500 border-b-6 border-teal-800 active:border-b-0 active:translate-y-1.5 text-white font-black text-sm sm:text-base shadow-xl flex items-center justify-center gap-2.5 transition-all"
        >
          <span className="absolute top-1 left-4 right-4 h-1.5 bg-white/40 rounded-full pointer-events-none" />
          <Stethoscope className="w-5 h-5" />
          Buka Dasbor Dokter Puskesmas
        </button>

        <button
          onClick={onNavigateFamily}
          className="relative w-full sm:w-auto px-8 py-4 rounded-3xl bg-amber-500 hover:bg-amber-400 border-b-6 border-amber-700 active:border-b-0 active:translate-y-1.5 text-white font-black text-sm sm:text-base shadow-xl flex items-center justify-center gap-2.5 transition-all"
        >
          <span className="absolute top-1 left-4 right-4 h-1.5 bg-white/40 rounded-full pointer-events-none" />
          <HeartHandshake className="w-5 h-5" />
          Buka Laporan Cerita Keluarga
        </button>
      </div>

      <button
        onClick={onRestart}
        className="text-xs font-black text-amber-900/70 hover:text-amber-950 flex items-center gap-1.5 pt-2"
      >
        <RotateCcw className="w-3.5 h-3.5" />
        Mainkan Lagi dari Awal
      </button>
    </div>
  );
};
