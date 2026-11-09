import React, { useState } from 'react';
import { X, Volume2, Sparkles, Zap } from 'lucide-react';
import { GlossyProgressBar } from '../components/GlossyProgressBar';
import { WordChip } from '../components/WordChip';
import { TactileButton } from '../components/TactileButton';
import { NutriSprout } from '../../../design-system/mascot/NutriSprout';
import { soundSynth } from '../../../services/audio/synth';

export interface InteractiveExerciseScreenProps {
  onExit: () => void;
  onCorrect: () => void;
}

export const InteractiveExerciseScreen: React.FC<InteractiveExerciseScreenProps> = ({
  onExit,
  onCorrect,
}) => {
  // Target sentence: "Anak sehat makan sayur bayam"
  const TARGET_WORDS = ['Anak', 'sehat', 'makan', 'sayur', 'bayam'];
  const BANK_WORDS = ['sayur', 'tidur', 'Anak', 'bayam', 'manis', 'sehat', 'makan'];

  const [placedWords, setPlacedWords] = useState<string[]>([]);
  const [bankWords, setBankWords] = useState<string[]>(BANK_WORDS);
  const [isAudioPlaying, setIsAudioPlaying] = useState(false);

  const handlePlayAudio = () => {
    soundSynth.playChime();
    setIsAudioPlaying(true);
    setTimeout(() => setIsAudioPlaying(false), 600);
  };

  const handleSelectWord = (word: string, index: number) => {
    soundSynth.playPop();
    // Add to placed words
    setPlacedWords((prev) => [...prev, word]);
    // Remove from bank
    setBankWords((prev) => prev.filter((_, i) => i !== index));
  };

  const handleRemovePlacedWord = (word: string, index: number) => {
    soundSynth.playPop();
    // Remove from placed
    setPlacedWords((prev) => prev.filter((_, i) => i !== index));
    // Return to bank
    setBankWords((prev) => [...prev, word]);
  };

  const handleCheck = () => {
    const isMatched =
      placedWords.length === TARGET_WORDS.length &&
      placedWords.every((w, i) => w === TARGET_WORDS[i]);

    if (isMatched) {
      soundSynth.playCelebrate();
      onCorrect();
    } else {
      soundSynth.playPop();
    }
  };

  return (
    <div className="w-full h-full bg-[#FFFFFF] flex flex-col justify-between overflow-hidden select-none relative">
      {/* EXERCISE TOP HEADER */}
      <header className="w-full px-4 pt-4 pb-2 flex items-center gap-3 z-20">
        <button
          type="button"
          onClick={() => {
            soundSynth.playPop();
            onExit();
          }}
          className="w-10 h-10 rounded-xl hover:bg-slate-100 active:scale-95 flex items-center justify-center text-slate-400 hover:text-slate-700 transition-all cursor-pointer min-h-[44px] min-w-[44px]"
          title="Keluar Latihan"
        >
          <X className="w-6 h-6 stroke-[3]" />
        </button>

        <div className="flex-1">
          <GlossyProgressBar progress={65} />
        </div>

        <div className="flex items-center gap-1 text-[#FF9600] font-black font-child text-sm">
          <Zap className="w-5 h-5 fill-[#FF9600]" />
          <span>∞</span>
        </div>
      </header>

      {/* MAIN EXERCISE BODY */}
      <main className="flex-1 px-4 py-2 flex flex-col justify-between overflow-y-auto">
        <div className="space-y-4">
          {/* Meta Pill Tag */}
          <div className="flex items-center gap-1.5 w-fit bg-purple-100 text-purple-700 border border-purple-200 px-3 py-1 rounded-full text-xs font-black font-child tracking-wider uppercase">
            <Sparkles className="w-3.5 h-3.5" />
            <span>KATA BARU</span>
          </div>

          {/* Prompt Header */}
          <h2 className="text-xl font-extrabold font-child text-[#3C3C3C] tracking-tight">
            Susun kalimat gizi berikut:
          </h2>

          {/* Character + Speech Bubble Area */}
          <div className="flex items-start gap-3 my-2">
            <div className="shrink-0 pt-1">
              <NutriSprout size={72} mood="happy" showShadow={false} />
            </div>

            {/* Speech Bubble */}
            <div className="flex-1 bg-white border-2 border-[#E5E5E5] rounded-2xl p-3 shadow-subtle relative flex items-center gap-3">
              {/* Audio Speaker Button */}
              <button
                type="button"
                onClick={handlePlayAudio}
                className={`w-10 h-10 rounded-xl bg-[#1CB0F6] shadow-[0_3px_0_0_#1899D6] active:shadow-none active:translate-y-[2px] text-white flex items-center justify-center cursor-pointer transition-all min-h-[44px] min-w-[44px] ${
                  isAudioPlaying ? 'scale-105 brightness-110' : ''
                }`}
                title="Dengarkan Pengucapan"
              >
                <Volume2 className="w-5 h-5" />
              </button>

              <div className="flex flex-col">
                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                  Bahasa Indonesia
                </span>
                <span className="text-base font-extrabold font-child text-[#3C3C3C]">
                  "Anak sehat makan sayur bayam"
                </span>
              </div>
            </div>
          </div>

          {/* Construction Canvas (Assembly line) */}
          <div className="w-full min-h-[96px] p-3 rounded-2xl border-2 border-dashed border-[#CBD5E1] bg-[#F8FAFC] flex flex-wrap items-center gap-2">
            {placedWords.length === 0 ? (
              <span className="text-xs font-bold font-child text-slate-400 italic">
                Ketuk kata di bawah untuk menyusun jawaban...
              </span>
            ) : (
              placedWords.map((word, idx) => (
                <WordChip
                  key={`placed-${word}-${idx}`}
                  word={word}
                  onClick={() => handleRemovePlacedWord(word, idx)}
                />
              ))
            )}
          </div>
        </div>

        {/* Token Bank Tray (Scrambled Chips) */}
        <div className="w-full py-4 border-t-2 border-[#E5E5E5]">
          <div className="flex flex-wrap justify-center gap-2">
            {bankWords.map((word, idx) => (
              <WordChip
                key={`bank-${word}-${idx}`}
                word={word}
                onClick={() => handleSelectWord(word, idx)}
              />
            ))}
          </div>
        </div>
      </main>

      {/* FIXED ACTION FOOTER */}
      <footer className="w-full p-4 bg-white border-t-2 border-[#E5E5E5] z-20">
        <TactileButton
          variant="green"
          size="lg"
          fullWidth
          disabled={placedWords.length === 0}
          onClick={handleCheck}
        >
          Periksa Jawaban
        </TactileButton>
      </footer>
    </div>
  );
};
