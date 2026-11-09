import React from 'react';
import { Star, Check, ArrowRight, Play, Lock, ChevronLeft, Zap, Apple, Footprints, Trophy, Heart, Flame } from 'lucide-react';
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
  icon: 'zap' | 'apple' | 'footprints' | 'trophy';
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
    icon: 'zap',
    colorScheme: {
      activeBg: 'bg-[#DCFCE7] text-[#15803D]',
      activeBorder: 'border-2 border-[#16A34A] ring-4 ring-[#86EFAC]/60',
      activeShadow: 'shadow-lg shadow-emerald-600/10',
      completedBg: 'bg-[#DCFCE7] border border-[#86EFAC] text-[#15803D]',
      lockedBg: 'bg-slate-100 border border-slate-200 text-slate-700',
      textColor: 'text-[#15803D]',
    },
  },
  {
    id: 2,
    title: 'Kebun Buah Ceria',
    subtitle: 'Pilah Buah Segar & Cermat',
    nutrient: 'Seng (Zn)',
    icon: 'apple',
    colorScheme: {
      activeBg: 'bg-[#E0F2FE] text-[#0369A1]',
      activeBorder: 'border-2 border-[#0284C7] ring-4 ring-[#38BDF8]/60',
      activeShadow: 'shadow-lg shadow-sky-600/10',
      completedBg: 'bg-[#E0F2FE] border border-[#7DD3FC] text-[#0369A1]',
      lockedBg: 'bg-slate-100 border border-slate-200 text-slate-700',
      textColor: 'text-[#0369A1]',
    },
  },
  {
    id: 3,
    title: 'Lembah Jejak Hewan',
    subtitle: 'Ingat Urutan Langkah Terbalik',
    nutrient: 'Vitamin B12',
    icon: 'footprints',
    colorScheme: {
      activeBg: 'bg-[#FFEDD5] text-[#C2410C]',
      activeBorder: 'border-2 border-[#EA580C] ring-4 ring-[#FDBA74]/60',
      activeShadow: 'shadow-lg shadow-orange-600/10',
      completedBg: 'bg-[#FFEDD5] border border-[#FDBA74] text-[#C2410C]',
      lockedBg: 'bg-slate-100 border border-slate-200 text-slate-700',
      textColor: 'text-[#C2410C]',
    },
  },
  {
    id: 4,
    title: 'Puncak Bintang Emas',
    subtitle: 'Peti Hadiah & Hasil Analisis',
    nutrient: 'Selebrasi Nutrisi',
    icon: 'trophy',
    colorScheme: {
      activeBg: 'bg-[#F3E8FF] text-[#7E22CE]',
      activeBorder: 'border-2 border-[#9333EA] ring-4 ring-[#D8B4FE]/60',
      activeShadow: 'shadow-xl shadow-purple-600/10',
      completedBg: 'bg-[#F3E8FF] border border-[#D8B4FE] text-[#7E22CE]',
      lockedBg: 'bg-slate-100 border border-slate-200 text-slate-700',
      textColor: 'text-[#7E22CE]',
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
    <div className="w-full h-full min-h-[100dvh] bg-[#F4FBF7] flex flex-col justify-between font-sans select-none relative overflow-hidden">
      {/* MAP TOP FLOATING HUD BAR (Clearance pt-12 for camera notch) */}
      <header className="px-4 pt-12 pb-3 flex items-center justify-between z-20 shrink-0 bg-white/90 backdrop-blur-md border-b border-slate-200/80 shadow-xs">
        <button
          type="button"
          onClick={onExit}
          className="min-h-[44px] min-w-[44px] px-3 py-2 text-xs font-bold text-slate-700 hover:text-slate-900 flex items-center gap-1 rounded-xl hover:bg-slate-100 transition-colors cursor-pointer active:scale-95"
          aria-label="Keluar ke menu utama"
        >
          <ChevronLeft className="w-5 h-5 stroke-[2.5]" />
          <span>Keluar</span>
        </button>

        <div className="text-center">
          <span className="text-xs font-bold text-teal-800 uppercase tracking-widest block leading-none">
            Peta Petualangan
          </span>
          <span className="text-xs font-black text-slate-900 mt-0.5 block">
            {childName} Juara
          </span>
        </div>

        {/* Floating HUD Economies (Stars & Heart Stamina) */}
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1 bg-[#FFF7ED] border border-[#FED7AA] px-2.5 py-1 rounded-full text-xs font-black text-[#C2410C] shadow-xs">
            <Flame className="w-3.5 h-3.5 fill-[#EA580C] text-[#EA580C]" />
            <span>{completedStarsCount}/3</span>
          </div>
          <div className="flex items-center gap-1 bg-[#FEF2F2] border border-[#FECACA] px-2 py-1 rounded-full text-xs font-black text-[#EF4444] shadow-xs">
            <Heart className="w-3.5 h-3.5 fill-[#EF4444] text-[#EF4444]" />
            <span>∞</span>
          </div>
        </div>
      </header>
      {/* MAP STAGE CANVAS (SCROLLABLE ADVENTURE PATH) */}
      <main className="flex-1 overflow-y-auto px-5 py-4 z-10 relative flex flex-col justify-between">
        {/* Timi Mascot Header Guidance (Natural trail layout without nested card) */}
        <div className="w-full max-w-xs mx-auto flex items-center gap-3 mb-4">
          <div className="shrink-0 animate-float-breath">
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
                  {/* Stepping Stone Node with border-4 border-white rings */}
                  <div
                    className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 border-4 border-white shadow-md transition-transform ${
                      isActive
                        ? 'scale-105'
                        : completed
                        ? 'opacity-100'
                        : 'bg-slate-200 text-slate-400'
                    }`}
                    style={{
                      backgroundColor: isActive || completed ? undefined : '#E2E8F0',
                    }}
                  >
                    {island.icon === 'zap' && <Zap className="w-6 h-6 fill-current" />}
                    {island.icon === 'apple' && <Apple className="w-6 h-6 fill-current" />}
                    {island.icon === 'footprints' && <Footprints className="w-6 h-6" />}
                    {island.icon === 'trophy' && <Trophy className="w-6 h-6 fill-current" />}
                  </div>
                  {/* Island Details */}
                  <div className="flex-1 text-left min-w-0">
                    <div className="flex items-center gap-1.5">
                      <span
                        className={`text-xs font-black uppercase tracking-wider ${
                          isActive ? island.colorScheme.textColor : 'text-slate-600'
                        }`}
                      >
                        Tahap {island.id}
                      </span>
                      {completed && (
                        <span className="w-4 h-4 rounded-full bg-emerald-500 text-white flex items-center justify-center text-xs font-black">
                          <Check className="w-2.5 h-2.5 stroke-[3]" />
                        </span>
                      )}
                    </div>

                    <h3
                      className={`text-xs sm:text-sm font-black truncate leading-tight mt-0.5 ${
                        isActive ? island.colorScheme.textColor : 'text-slate-900'
                      }`}
                    >
                      {island.title}
                    </h3>

                    <p
                      className={`text-xs truncate mt-0.5 font-medium ${
                        isActive ? island.colorScheme.textColor : 'text-slate-600'
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
                      <div className="w-7 h-7 rounded-full bg-white text-slate-900 flex items-center justify-center shadow-md">
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
