import React from 'react';
import { Play } from 'lucide-react';
import { NutriSprout } from '../../../design-system/mascot/NutriSprout';
import { Button } from '../../../design-system/primitives/Button';
import { SpeechBubble } from '../../../design-system/primitives/SpeechBubble';
import { soundSynth } from '../../../services/audio/synth';

export interface IntroGuidanceProps {
  childName: string;
  onStartGame: () => void;
  onCancel: () => void;
}

export const IntroGuidance: React.FC<IntroGuidanceProps> = ({
  childName,
  onStartGame,
  onCancel,
}) => {
  return (
    <div className="w-full h-full flex flex-col justify-between items-center px-6 py-6 font-sans select-none relative overflow-hidden">
      {/* Top Bar with Cancel Link */}
      <div className="w-full flex justify-start z-10 shrink-0">
        <button
          type="button"
          onClick={onCancel}
          className="text-xs text-slate-500 hover:text-slate-900 font-semibold py-1 px-2.5 rounded-lg hover:bg-white/60 transition-colors"
        >
          ← Kembali
        </button>
      </div>

      {/* Main Guidance Center */}
      <main className="w-full max-w-xs mx-auto flex flex-col items-center text-center my-auto z-10 space-y-4">
        {/* Mascot Timi */}
        <div className="animate-float-breath">
          <NutriSprout size={115} mood="happy" />
        </div>

        {/* Speech Bubble Guidance */}
        <SpeechBubble
          message={`Halo ${childName}! Ayo main 3 permainan seru bersama Timi. Sentuh layar secepat yang kamu bisa!`}
        />

        <div>
          <h1 className="text-xl font-extrabold text-slate-900 leading-tight">
            Petualangan Ceria <br />
            {childName}
          </h1>
          <p className="text-xs text-slate-500 mt-1 max-w-[240px] mx-auto">
            Hanya 3 menit. Santai, seru, dan tanpa rasa sakit.
          </p>
        </div>
      </main>

      {/* Bottom Start Action Button */}
      <footer className="w-full max-w-xs mx-auto pb-4 shrink-0 z-20">
        <Button
          variant="primary"
          size="lg"
          fullWidth
          icon={<Play className="w-5 h-5 fill-white" />}
          onClick={() => {
            soundSynth.playChime();
            onStartGame();
          }}
        >
          Mulai Petualangan!
        </Button>
      </footer>
    </div>
  );
};
