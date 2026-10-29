import React from 'react';
import { Star, Check, Sparkles, MapPin } from 'lucide-react';
import { soundFX } from '../../services/audioSynth';
import {
  StickerHouse,
  StickerBalloon,
  StickerFruitTree,
  StickerCat,
  StickerTrophy,
} from '../illustrations/IslandStickers';

interface AdventureTrailMapProps {
  currentStage: number;
  onSelectStage: (stage: number) => void;
  stagesCompleted: boolean[];
}

interface TrailIsland {
  id: number;
  title: string;
  theme: string;
  renderSticker: (isCurrent: boolean, isCompleted: boolean) => React.ReactNode;
}

export const AdventureTrailMap: React.FC<AdventureTrailMapProps> = ({
  currentStage,
  onSelectStage,
  stagesCompleted,
}) => {
  const ISLANDS: TrailIsland[] = [
    {
      id: 0,
      title: 'Pondok Cakra',
      theme: 'Cottage',
      renderSticker: (isCurrent) => (
        <div
          className={`w-14 h-14 sm:w-16 sm:h-16 rounded-2xl p-1.5 flex items-center justify-center transition-all ${
            isCurrent
              ? 'bg-amber-100 border-4 border-amber-500 shadow-lg shadow-amber-500/30'
              : 'bg-amber-50/90 border-2 border-amber-300'
          }`}
        >
          <StickerHouse size={44} />
        </div>
      ),
    },
    {
      id: 1,
      title: 'Pulau Balon',
      theme: 'Cloud Balloon',
      renderSticker: (isCurrent) => (
        <div
          className={`w-14 h-14 sm:w-16 sm:h-16 rounded-2xl p-1.5 flex items-center justify-center transition-all ${
            isCurrent
              ? 'bg-sky-100 border-4 border-sky-500 shadow-lg shadow-sky-500/30'
              : 'bg-sky-50/90 border-2 border-sky-300'
          }`}
        >
          <StickerBalloon size={44} />
        </div>
      ),
    },
    {
      id: 2,
      title: 'Kebun Buah',
      theme: 'Fruit Tree',
      renderSticker: (isCurrent) => (
        <div
          className={`w-14 h-14 sm:w-16 sm:h-16 rounded-2xl p-1.5 flex items-center justify-center transition-all ${
            isCurrent
              ? 'bg-emerald-100 border-4 border-emerald-500 shadow-lg shadow-emerald-500/30'
              : 'bg-emerald-50/90 border-2 border-emerald-300'
          }`}
        >
          <StickerFruitTree size={44} />
        </div>
      ),
    },
    {
      id: 3,
      title: 'Lembah Hewan',
      theme: 'Animal Valley',
      renderSticker: (isCurrent) => (
        <div
          className={`w-14 h-14 sm:w-16 sm:h-16 rounded-2xl p-1.5 flex items-center justify-center transition-all ${
            isCurrent
              ? 'bg-purple-100 border-4 border-purple-500 shadow-lg shadow-purple-500/30'
              : 'bg-purple-50/90 border-2 border-purple-300'
          }`}
        >
          <StickerCat size={44} />
        </div>
      ),
    },
    {
      id: 4,
      title: 'Peti Harta',
      theme: 'Treasure Trophy',
      renderSticker: (isCurrent) => (
        <div
          className={`w-14 h-14 sm:w-16 sm:h-16 rounded-2xl p-1.5 flex items-center justify-center transition-all ${
            isCurrent
              ? 'bg-yellow-100 border-4 border-yellow-500 shadow-lg shadow-yellow-500/30'
              : 'bg-yellow-50/90 border-2 border-yellow-300'
          }`}
        >
          <StickerTrophy size={44} />
        </div>
      ),
    },
  ];

  return (
    <div className="relative w-full max-w-4xl mx-auto py-2 px-3 select-none font-child">
      {/* Wooden Signboard Track Container (Kenney Game Panel style) */}
      <div className="relative bg-gradient-to-r from-amber-100 via-amber-50 to-amber-100 rounded-3xl p-3 sm:p-4 border-4 border-amber-800/90 shadow-xl shadow-amber-950/20">
        {/* Corner Rivet Screws */}
        <div className="absolute top-2 left-2.5 w-2.5 h-2.5 rounded-full bg-amber-900 border border-amber-700 shadow-inner" />
        <div className="absolute top-2 right-2.5 w-2.5 h-2.5 rounded-full bg-amber-900 border border-amber-700 shadow-inner" />
        <div className="absolute bottom-2 left-2.5 w-2.5 h-2.5 rounded-full bg-amber-900 border border-amber-700 shadow-inner" />
        <div className="absolute bottom-2 right-2.5 w-2.5 h-2.5 rounded-full bg-amber-900 border border-amber-700 shadow-inner" />

        {/* Trail Banner Header */}
        <div className="flex items-center justify-between px-2 mb-2">
          <div className="inline-flex items-center gap-1.5 bg-amber-800 text-yellow-300 px-3.5 py-1 rounded-full text-xs font-black shadow-inner border border-amber-700">
            <Sparkles className="w-3.5 h-3.5 text-yellow-300" />
            <span>PETA JALUR PULAU PETUALANGAN</span>
          </div>
          <span className="text-xs font-extrabold text-amber-900">
            Pulau {currentStage + 1} dari 5
          </span>
        </div>

        {/* Trail Line with 5 Distinct Authentic Licensed Stickers */}
        <div className="relative py-4 flex items-center justify-between px-2 sm:px-6">
          {/* Dashed Dirt Trail Path Line */}
          <div className="absolute left-6 right-6 top-1/2 -translate-y-1/2 h-3.5 bg-amber-300/80 rounded-full border-2 border-dashed border-amber-600/70 z-0" />

          {ISLANDS.map((island) => {
            const isCurrent = currentStage === island.id;
            const isCompleted = stagesCompleted[island.id] || currentStage > island.id;

            return (
              <div key={island.id} className="relative z-10 flex flex-col items-center">
                {/* Jumping Bouncing Mascot Pin on Active Island */}
                {isCurrent && (
                  <div className="absolute -top-7 animate-bounce flex flex-col items-center z-20">
                    <span className="text-[10px] font-black bg-amber-900 text-yellow-300 px-2.5 py-0.5 rounded-full shadow-lg whitespace-nowrap border border-amber-700">
                      Kamu di sini!
                    </span>
                    <MapPin className="w-4 h-4 text-amber-900 -mt-1 fill-yellow-400" />
                  </div>
                )}

                {/* Unique Sticker Island Button */}
                <button
                  onClick={() => {
                    soundFX.playClick();
                    onSelectStage(island.id);
                  }}
                  className={`relative transition-all duration-200 cursor-pointer active:scale-95 ${
                    isCurrent
                      ? 'scale-120 -translate-y-2'
                      : isCompleted
                      ? 'scale-105 hover:scale-110'
                      : 'opacity-75 hover:opacity-100 hover:scale-105'
                  }`}
                  title={island.title}
                >
                  {island.renderSticker(isCurrent, isCompleted)}

                  {/* Completion Star Badge */}
                  {isCompleted && !isCurrent && (
                    <div className="absolute -top-1 -right-1 bg-emerald-500 rounded-full p-1 border-2 border-white shadow-md">
                      <Check className="w-3.5 h-3.5 text-white stroke-[3.5]" />
                    </div>
                  )}

                  {isCompleted && (
                    <Star className="w-4 h-4 fill-yellow-300 stroke-amber-700 absolute -bottom-1 -left-1 animate-pulse" />
                  )}
                </button>

                {/* Island Name Label Pill */}
                <span
                  className={`mt-2 text-[10px] sm:text-xs font-black px-2.5 py-0.5 rounded-xl whitespace-nowrap border transition-colors ${
                    isCurrent
                      ? 'bg-amber-950 text-yellow-300 border-amber-900 shadow-sm scale-105'
                      : isCompleted
                      ? 'bg-emerald-100 text-emerald-900 border-emerald-300'
                      : 'bg-amber-100/90 text-amber-900 border-amber-200'
                  }`}
                >
                  {island.title}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
