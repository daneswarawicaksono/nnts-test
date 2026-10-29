import React, { useState } from 'react';
import type { PatientRecord } from '../../types';
import { recalculatePatientCDSS } from '../../services/cdssEngine';
import { MascotCakra } from '../illustrations/MascotCakra';
import { QuestReactionTime } from './QuestReactionTime';
import { QuestGoNoGo } from './QuestGoNoGo';
import { QuestMemorySpan } from './QuestMemorySpan';
import { QuestCelebration } from './QuestCelebration';
import { AdventureTrailMap } from './AdventureTrailMap';
import { CadreSlideOverDrawer } from './CadreSlideOverDrawer';
import { KenneyButton, KenneyPanel } from '../kenney/KenneyUI';
import { soundFX } from '../../services/audioSynth';
import { Play, Lock, Sun } from 'lucide-react';

interface ChildScreeningViewProps {
  patient: PatientRecord;
  onUpdatePatient: (updated: PatientRecord) => void;
  onNavigateClinician: () => void;
  onNavigateFamily: () => void;
}

export const ChildScreeningView: React.FC<ChildScreeningViewProps> = ({
  patient,
  onUpdatePatient,
  onNavigateClinician,
  onNavigateFamily,
}) => {
  const [currentStage, setCurrentStage] = useState<number>(0);
  const [isCadreDrawerOpen, setIsCadreDrawerOpen] = useState(false);
  const [stagesCompleted, setStagesCompleted] = useState<boolean[]>([false, false, false, false, false]);

  const markStageCompleted = (idx: number) => {
    setStagesCompleted((prev) => {
      const copy = [...prev];
      copy[idx] = true;
      return copy;
    });
  };

  const handleReactionTimeComplete = (trials: number[], avgLatency: number, variance: number) => {
    markStageCompleted(1);
    const updated = recalculatePatientCDSS({
      ...patient,
      reactionTime: {
        trials,
        avgLatency,
        variance,
        completed: true,
      },
    });
    onUpdatePatient(updated);
  };

  const handleGoNoGoComplete = (accuracyRate: number, commissionErrors: number, omissionErrors: number) => {
    markStageCompleted(2);
    const updated = recalculatePatientCDSS({
      ...patient,
      goNoGo: {
        totalRounds: 10,
        accuracyRate,
        commissionErrors,
        omissionErrors,
        completed: true,
      },
    });
    onUpdatePatient(updated);
  };

  const handleMemorySpanComplete = (spanScore: number, sequenceLengthTested: number) => {
    markStageCompleted(3);
    const updated = recalculatePatientCDSS({
      ...patient,
      memorySpan: {
        spanScore,
        sequenceLengthTested,
        completed: true,
      },
    });
    onUpdatePatient(updated);
  };

  return (
    <div className="relative min-h-[calc(100vh-80px)] overflow-hidden font-child flex flex-col justify-between bg-gradient-to-b from-sky-300 via-sky-100 to-amber-50 select-none">
      {/* 1. PARALLAX 2-LAYER BACKGROUND HILLS & ANIMATED CLOUDS */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden z-0">
        {/* Glowing Sun */}
        <div className="absolute top-6 right-12 w-24 h-24 rounded-full bg-yellow-300 border-4 border-yellow-400 shadow-2xl shadow-yellow-400/50 flex items-center justify-center animate-pulse">
          <Sun className="w-14 h-14 text-amber-500 animate-spin" style={{ animationDuration: '30s' }} />
        </div>

        {/* Drifting Clouds Layer 1 & 2 */}
        <div className="absolute top-12 left-10 opacity-90 animate-cloud-drift-1">
          <svg width="130" height="65" viewBox="0 0 120 60" fill="#FFFFFF">
            <path d="M20 45C10 45 0 35 0 25C0 14 10 5 22 6C28 1 38 0 48 4C56 0 68 2 74 8C82 4 92 6 96 14C106 14 116 22 116 32C116 42 106 48 95 48L20 48Z" />
          </svg>
        </div>

        <div className="absolute top-24 right-44 opacity-80 animate-cloud-drift-2">
          <svg width="160" height="80" viewBox="0 0 150 70" fill="#FFFFFF">
            <path d="M25 55C12 55 0 42 0 30C0 16 12 6 27 7C34 1 47 0 59 5C69 0 84 2 91 10C101 5 113 7 118 17C130 17 142 27 142 39C142 51 130 58 117 58L25 58Z" />
          </svg>
        </div>

        {/* PARALLAX LAYER 1: Back Hills (Gentle slow sway) */}
        <div className="absolute -bottom-16 -left-20 -right-20 h-72 bg-emerald-400/80 rounded-t-[50%] animate-parallax-back" />

        {/* PARALLAX LAYER 2: Front Hills (Foreground counter sway with flowers & grass) */}
        <div className="absolute -bottom-24 -left-12 -right-12 h-64 bg-gradient-to-t from-emerald-600 via-emerald-500 to-emerald-400 rounded-t-[40%] animate-parallax-front" />
      </div>

      {/* 2. Top Header Bar: Child-Friendly Brand & Discreet Cadre Gatekeeper */}
      <header className="relative z-20 px-4 sm:px-8 py-3 flex items-center justify-between">
        {/* Discreet Cadre Access Button */}
        <button
          onClick={() => {
            soundFX.playClick();
            setIsCadreDrawerOpen(true);
          }}
          className="px-3.5 py-1.5 rounded-full bg-white/80 hover:bg-white text-slate-700 text-xs font-bold border border-slate-300 shadow-sm flex items-center gap-1.5 transition-all hover:scale-105 active:scale-95"
          title="Akses Terlindung Petugas Kader"
        >
          <Lock className="w-3.5 h-3.5 text-teal-700" />
          <span className="hidden sm:inline">Panel Kader</span>
        </button>

        {/* Child Badge */}
        <div className="bg-amber-900/90 text-yellow-300 px-5 py-1.5 rounded-full text-xs font-black shadow-md border border-amber-700 flex items-center gap-2">
          <span>Teman Petualang:</span>
          <span className="text-white text-sm font-black underline">{patient.name}</span>
        </div>
      </header>

      {/* 3. Adventure Trail Map with 5 Island Silhouettes */}
      <div className="relative z-20 px-2 sm:px-6">
        <AdventureTrailMap
          currentStage={currentStage}
          onSelectStage={(stage) => setCurrentStage(stage)}
          stagesCompleted={stagesCompleted}
        />
      </div>

      {/* 4. Main Stage Arena (Entrance Animated Containers & Kenney Buttons) */}
      <main className="relative z-20 max-w-4xl mx-auto w-full px-4 py-3 flex-1 flex flex-col justify-center">
        {/* Stage 0: Mascot Sapaan & Welcome */}
        {currentStage === 0 && (
          <div className="flex flex-col items-center justify-center text-center space-y-6 animate-in fade-in zoom-in-90 slide-in-from-bottom-4 duration-300">
            {/* Dominant Mascot with Smooth Idle Bobbing & Eye Blinking */}
            <div className="relative">
              <div className="absolute -inset-10 bg-yellow-300/40 rounded-full blur-2xl" />
              <MascotCakra size={220} mood="happy" />
            </div>

            {/* Kenney Wooden Panel Signboard */}
            <KenneyPanel theme="wood" className="max-w-lg w-full text-center space-y-2">
              <span className="bg-amber-800 text-yellow-300 text-xs font-black px-4 py-1 rounded-full uppercase tracking-wider inline-block">
                Halo Sobat Cilik! 👋
              </span>
              <h2 className="text-2xl sm:text-3xl font-black text-amber-950 leading-tight">
                Aku Cakra, Burung Sahabatmu!
              </h2>
              <p className="text-amber-900 text-sm sm:text-base font-bold leading-relaxed">
                Ayo kita jelajahi 3 pulau ajaib: menangkap balon kilat, memetik buah segar, dan mengingat barisan hewan sahabat!
              </p>
            </KenneyPanel>

            {/* Kenney Chunky 3D Arcade Start Button */}
            <KenneyButton
              variant="green"
              size="lg"
              onClick={() => {
                soundFX.playSuccess();
                markStageCompleted(0);
                setCurrentStage(1);
              }}
              className="flex items-center gap-3 animate-in zoom-in-95"
            >
              <Play className="w-6 h-6 fill-white" />
              <span>Ayo Mulai Petualangan! 🎈</span>
            </KenneyButton>
          </div>
        )}

        {/* Stage 1: Game 1 - Balon Reaksi Cepat */}
        {currentStage === 1 && (
          <div className="animate-in fade-in zoom-in-90 slide-in-from-bottom-4 duration-300">
            <QuestReactionTime
              onComplete={handleReactionTimeComplete}
              onNext={() => {
                soundFX.playClick();
                setCurrentStage(2);
              }}
            />
          </div>
        )}

        {/* Stage 2: Game 2 - Pesta Buah Go/No-Go */}
        {currentStage === 2 && (
          <div className="animate-in fade-in zoom-in-90 slide-in-from-bottom-4 duration-300">
            <QuestGoNoGo
              onComplete={handleGoNoGoComplete}
              onNext={() => {
                soundFX.playClick();
                setCurrentStage(3);
              }}
            />
          </div>
        )}

        {/* Stage 3: Game 3 - Sahabat Hewan Memori Terbalik */}
        {currentStage === 3 && (
          <div className="animate-in fade-in zoom-in-90 slide-in-from-bottom-4 duration-300">
            <QuestMemorySpan
              onComplete={handleMemorySpanComplete}
              onNext={() => {
                soundFX.playSuccess();
                setCurrentStage(4);
              }}
            />
          </div>
        )}

        {/* Stage 4: Celebration - Peti Harta Bintang */}
        {currentStage === 4 && (
          <div className="animate-in fade-in zoom-in-90 slide-in-from-bottom-4 duration-300">
            <QuestCelebration
              patient={patient}
              onNavigateClinician={onNavigateClinician}
              onNavigateFamily={onNavigateFamily}
              onRestart={() => {
                soundFX.playClick();
                setCurrentStage(0);
              }}
            />
          </div>
        )}
      </main>

      {/* 5. Bottom Environment Foothill Spacer */}
      <footer className="relative z-10 py-3 text-center text-xs font-black text-emerald-950/70 pointer-events-none">
        Posyandu Ramah Anak • Petualangan Cakra
      </footer>

      {/* 6. Cadre Hidden Slide-Over Drawer */}
      <CadreSlideOverDrawer
        isOpen={isCadreDrawerOpen}
        onClose={() => setIsCadreDrawerOpen(false)}
        patient={patient}
        onUpdatePatient={onUpdatePatient}
      />
    </div>
  );
};
