import React from 'react';
import { Star, Check, ArrowRight, Play, Lock, ChevronLeft } from 'lucide-react';
import { NutriSprout } from '../../../design-system/mascot/NutriSprout';
import { SpeechBubble } from '../../../design-system/primitives/SpeechBubble';
import { Button } from '../../../design-system/primitives/Button';
import { soundSynth } from '../../../services/audio/synth';

export interface AdventureTrailMapProps {
  childName: string;
  completedStages: {
    module1: boolean;
    module2: boolean;
    module3: boolean;
  };
  currentActiveStage: 1 | 2 | 3 | 4;
  onSelectStage: (stage: 1 | 2 | 3 | 4) => void;
  onExit: () => void;
}

interface IslandNode {
  id: 1 | 2 | 3 | 4;
  title: string;
  subtitle: string;
  nutrient: string;
  emoji: string;
  colorScheme: {
    activeBg: string;
    activeBorder: string;
    activeShadow: string;
    completedBg: string;
    lockedBg: string;
    textColor: string;
  };
}

const ISLANDS: IslandNode[] = [
  {
    id: 1,
    title: 'Pulau Balon Kilat',
    subtitle: 'Uji Refleks Motorik Cepat',
    nutrient: 'Zat Besi (Fe)',
    emoji: '🎈',
    colorScheme: {
      activeBg: 'bg-sky-500 text-white',
      activeBorder: 'border-sky-400 ring-4 ring-sky-200',
      activeShadow: 'shadow-lg shadow-sky-500/30',
      completedBg: 'bg-sky-100 border-sky-300 text-sky-900',
      lockedBg: 'bg-slate-100 border-slate-200 text-slate-400 opacity-60',
      textColor: 'text-sky-700',
    },
  },
  {
    id: 2,
    title: 'Kebun Buah Ceria',
    subtitle: 'Pilah Buah Segar & Cermat',
    nutrient: 'Seng (Zn)',
    emoji: '🍎',
    colorScheme: {
      activeBg: 'bg-amber-500 text-white',
      activeBorder: 'border-amber-400 ring-4 ring-amber-200',
      activeShadow: 'shadow-lg shadow-amber-500/30',
      completedBg: 'bg-amber-100 border-amber-300 text-amber-900',
      lockedBg: 'bg-slate-100 border-slate-200 text-slate-400 opacity-60',
      textColor: 'text-amber-700',
    },
  },
  {
    id: 3,
    title: 'Lembah Jejak Hewan',
    subtitle: 'Ingat Urutan Langkah Terbalik',
    nutrient: 'Vitamin B12',
    emoji: '🐰',
    colorScheme: {
      activeBg: 'bg-purple-600 text-white',
      activeBorder: 'border-purple-400 ring-4 ring-purple-200',
      activeShadow: 'shadow-lg shadow-purple-500/30',
      completedBg: 'bg-purple-100 border-purple-300 text-purple-900',
      lockedBg: 'bg-slate-100 border-slate-200 text-slate-400 opacity-60',
      textColor: 'text-purple-700',
    },
  },
  {
    id: 4,
    title: 'Puncak Bintang Emas',
    subtitle: 'Peti Hadiah & Hasil Analisis',
    nutrient: 'Selebrasi Nutrisi',
    emoji: '🏆',
    colorScheme: {
      activeBg: 'bg-amber-400 text-amber-950',
      activeBorder: 'border-amber-300 ring-4 ring-amber-200',
      activeShadow: 'shadow-xl shadow-amber-400/40',
      completedBg: 'bg-amber-100 border-amber-400 text-amber-950',
      lockedBg: 'bg-slate-100 border-slate-200 text-slate-400 opacity-60',
      textColor: 'text-amber-800',
    },
  },
];

export const AdventureTrailMap: React.FC<AdventureTrailMapProps> = ({
  childName,
  completedStages,
  currentActiveStage,
  onSelectStage,
  onExit,
}) => {
  const isCompleted = (id: 1 | 2 | 3 | 4) => {
    if (id === 1) return completedStages.module1;
    if (id === 2) return completedStages.module2;
    if (id === 3) return completedStages.module3;
    if (id === 4) return completedStages.module1 && completedStages.module2 && completedStages.module3;
    return false;
  };

  const isUnlocked = (id: 1 | 2 | 3 | 4) => {
    if (id === 1) return true;
    if (id === 2) return completedStages.module1;
    if (id === 3) return completedStages.module1 && completedStages.module2;
    if (id === 4) return completedStages.module1 && completedStages.module2 && completedStages.module3;
    return false;
  };

  const completedStarsCount =
    (completedStages.module1 ? 1 : 0) +
    (completedStages.module2 ? 1 : 0) +
    (completedStages.module3 ? 1 : 0);

  // Timi guidance message based on current stage
  const getTimiSpeech = () => {
    if (currentActiveStage === 1) {
      return `Halo ${childName}! Ayo mulai dari Pulau Balon Kilat. Sentuh balon begitu keluar ya!`;
    }
    if (currentActiveStage === 2) {
      return `Keren! Sekarang ayo ke Kebun Buah Ceria. Petik buah segar, jangan sampai kena ulat!`;
    }
    if (currentActiveStage === 3) {
      return `Tinggal satu pulau lagi! Ayo ke Lembah Jejak Hewan dan sentuh urutan terbalik!`;
    }
    return `Horeee! Semua pulau selesai dijelajahi! Buka Puncak Bintang Emas untuk hadiahmu!`;
  };

  return (
    <div className="w-full h-full min-h-[100dvh] bg-gradient-to-b from-[#F0FDF4] via-[#F8FAFC] to-[#FFFBEB] flex flex-col justify-between font-sans select-none relative overflow-hidden">
      {/* MAP TOP BAR */}
      <header className="px-5 pt-4 sm:pt-7 pb-2.5 flex items-center justify-between z-20 shrink-0 bg-white/70 backdrop-blur-md border-b border-slate-200/80">
        <button
          onClick={onExit}
          className="text-xs font-bold text-slate-500 hover:text-slate-800 flex items-center gap-1 p-1 rounded-lg hover:bg-slate-100 transition-colors"
        >
          <ChevronLeft className="w-4 h-4" /> Keluar
        </button>

        <div className="text-center">
          <span className="text-[10px] font-bold text-teal-800 uppercase tracking-widest block leading-none">
            Peta Petualangan
          </span>
          <span className="text-xs font-black text-slate-900 mt-0.5 block">
            {childName} Juara
          </span>
        </div>

        {/* Star Counter Badge */}
        <div className="flex items-center gap-1 bg-amber-100 border border-amber-300 px-2.5 py-1 rounded-full text-xs font-black text-amber-900 shadow-xs">
          <Star className="w-3.5 h-3.5 fill-amber-500 text-amber-500" />
          <span>{completedStarsCount}/3</span>
        </div>
      </header>

      {/* MAP STAGE CANVAS (SCROLLABLE ADVENTURE PATH) */}
      <main className="flex-1 overflow-y-auto px-5 py-4 z-10 relative flex flex-col justify-between">
        {/* Timi Mascot Header Banner */}
        <div className="w-full max-w-xs mx-auto flex items-center gap-3 bg-white/85 backdrop-blur-sm border border-teal-200/90 rounded-2xl p-3 shadow-subtle mb-4">
          <div className="shrink-0 animate-bounce-gentle">
            <NutriSprout size={56} mood={currentActiveStage === 4 ? 'curious' : 'happy'} showShadow={false} />
          </div>
          <div className="text-left flex-1">
            <SpeechBubble message={getTimiSpeech()} />
          </div>
        </div>

        {/* Winding Adventure Path Container */}
        <div className="w-full max-w-xs mx-auto relative py-2 space-y-4">
          {ISLANDS.map((island, index) => {
            const completed = isCompleted(island.id);
            const unlocked = isUnlocked(island.id);
            const isActive = currentActiveStage === island.id;

            // Alternate placement: Node 1 center, Node 2 right-ish, Node 3 left-ish, Node 4 center
            const alignmentClass =
              island.id === 1
                ? 'items-center'
                : island.id === 2
                ? 'items-end pr-2'
                : island.id === 3
                ? 'items-start pl-2'
                : 'items-center';

            return (
              <div key={island.id} className={`w-full flex flex-col ${alignmentClass} relative`}>
                {/* Connecting Dotted Line to Next Island */}
                {index < ISLANDS.length - 1 && (
                  <div
                    className={`absolute -bottom-5 w-1 h-5 border-l-2 border-dashed z-0 ${
                      completed ? 'border-nutri-teal-600' : 'border-slate-300'
                    }`}
                    style={{
                      left: island.id === 2 ? 'auto' : island.id === 3 ? '40px' : '50%',
                      right: island.id === 2 ? '40px' : 'auto',
                    }}
                  />
                )}

                {/* Island Card Node */}
                <div
                  onClick={() => {
                    if (unlocked) {
                      soundSynth.playPop();
                      onSelectStage(island.id);
                    }
                  }}
                  className={`relative z-10 flex items-center gap-3 p-3 rounded-2xl border-2 transition-all duration-fast select-none cursor-pointer max-w-[280px] w-full ${
                    isActive
                      ? `${island.colorScheme.activeBg} ${island.colorScheme.activeBorder} ${island.colorScheme.activeShadow} scale-[1.03]`
                      : completed
                      ? `${island.colorScheme.completedBg} shadow-xs`
                      : `${island.colorScheme.lockedBg} cursor-not-allowed`
                  }`}
                >
                  {/* Island Circular Icon */}
                  <div
                    className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 text-2xl shadow-xs transition-transform ${
                      isActive ? 'bg-white/20 scale-110' : completed ? 'bg-white' : 'bg-slate-200'
                    }`}
                  >
                    <span>{island.emoji}</span>
                  </div>

                  {/* Island Details */}
                  <div className="flex-1 text-left min-w-0">
                    <div className="flex items-center gap-1.5">
                      <span
                        className={`text-[10px] font-black uppercase tracking-wider ${
                          isActive ? 'text-white/80' : 'text-slate-500'
                        }`}
                      >
                        Tahap {island.id}
                      </span>
                      {completed && (
                        <span className="w-4 h-4 rounded-full bg-emerald-500 text-white flex items-center justify-center text-[10px] font-black">
                          <Check className="w-2.5 h-2.5 stroke-[3]" />
                        </span>
                      )}
                    </div>

                    <h3
                      className={`text-xs sm:text-sm font-black truncate leading-tight mt-0.5 ${
                        isActive ? 'text-white' : 'text-slate-900'
                      }`}
                    >
                      {island.title}
                    </h3>

                    <p
                      className={`text-[10px] truncate mt-0.5 ${
                        isActive ? 'text-white/90 font-medium' : 'text-slate-500'
                      }`}
                    >
                      {island.subtitle}
                    </p>
                  </div>

                  {/* Trailing Status Icon */}
                  <div className="shrink-0 pr-1">
                    {completed ? (
                      <Star className="w-4 h-4 fill-amber-400 text-amber-500" />
                    ) : isActive ? (
                      <div className="w-7 h-7 rounded-full bg-white text-slate-900 flex items-center justify-center shadow-md animate-pulse">
                        <Play className="w-3.5 h-3.5 fill-slate-900 ml-0.5" />
                      </div>
                    ) : (
                      <Lock className="w-4 h-4 text-slate-400" />
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </main>

      {/* STICKY BOTTOM PRIMARY ACTION BUTTON */}
      <footer className="w-full p-4 bg-white/95 backdrop-blur-md border-t border-slate-200/90 z-20 shrink-0">
        <div className="max-w-xs mx-auto">
          <Button
            variant="primary"
            fullWidth
            size="lg"
            icon={<ArrowRight className="w-5 h-5" />}
            iconPosition="right"
            onClick={() => {
              soundSynth.playChime();
              onSelectStage(currentActiveStage);
            }}
          >
            {currentActiveStage === 1
              ? 'Mulai Tahap 1: Pulau Balon →'
              : currentActiveStage === 2
              ? 'Lanjut Tahap 2: Kebun Buah →'
              : currentActiveStage === 3
              ? 'Lanjut Tahap 3: Lembah Hewan →'
              : 'Buka Hasil & Puncak Bintang Emas 🏆'}
          </Button>
        </div>
      </footer>
    </div>
  );
};
