import React, { useState, useEffect, useRef } from 'react';
import { GameHeader } from '../components/GameHeader';
import { soundSynth } from '../../../services/audio/synth';

export interface ModuleGoNoGoProps {
  onComplete: (accuracy: number, commissionErrors: number) => void;
  onExit: () => void;
}

interface StimulusItem {
  id: string;
  isGo: boolean;
  name: string;
  emoji: string;
  category: 'healthy' | 'junk_or_inedible';
  hint: string;
}

// Balanced 8 stimuli: 5 healthy foods (Go) + 3 junk/inedible objects (No-Go)
const STIMULI_LIST: StimulusItem[] = [
  { id: 's1', isGo: true, name: 'Apel Segar', emoji: '🍎', category: 'healthy', hint: 'Nyam! Makanan sehat!' },
  { id: 's2', isGo: true, name: 'Pisang Manis', emoji: '🍌', category: 'healthy', hint: 'Kaya energi & serat!' },
  { id: 's3', isGo: false, name: 'Permen Manis', emoji: '🍭', category: 'junk_or_inedible', hint: 'Stop! Gigi bisa berlubang!' },
  { id: 's4', isGo: true, name: 'Wortel Renyah', emoji: '🥕', category: 'healthy', hint: 'Bagus untuk mata cerah!' },
  { id: 's5', isGo: false, name: 'Ulat Daun', emoji: '🐛', category: 'junk_or_inedible', hint: 'Bukan makanan Kerro!' },
  { id: 's6', isGo: true, name: 'Telur Lezat', emoji: '🍳', category: 'healthy', hint: 'Protein hewani tinggi!' },
  { id: 's7', isGo: false, name: 'Kaos Kaki', emoji: '🧦', category: 'junk_or_inedible', hint: 'Ick! Jangan dimakan!' },
  { id: 's8', isGo: true, name: 'Ikan Segar', emoji: '🐟', category: 'healthy', hint: 'Penuh DHA untuk otak!' },
];

type FrogMascotState = 'idle' | 'open_mouth' | 'chewing' | 'refusal' | 'proud_hold';

export const ModuleGoNoGo: React.FC<ModuleGoNoGoProps> = ({
  onComplete,
  onExit,
}) => {
  const TOTAL_ROUNDS = STIMULI_LIST.length;
  const [currentRound, setCurrentRound] = useState(0);
  const [hasTappedThisRound, setHasTappedThisRound] = useState(false);
  const [frogState, setFrogState] = useState<FrogMascotState>('idle');
  const [feedbackText, setFeedbackText] = useState<string>('');
  const [itemPosition, setItemPosition] = useState<'serving' | 'eaten' | 'rejected'>('serving');

  // Metrics
  const correctCountRef = useRef(0);
  const commissionErrorsRef = useRef(0);
  const roundTimerRef = useRef<number | null>(null);

  const currentStimulus = STIMULI_LIST[currentRound % STIMULI_LIST.length];

  // Advance stimulus every 1600ms if no tap
  useEffect(() => {
    if (currentRound >= TOTAL_ROUNDS) {
      const accuracy = Math.round((correctCountRef.current / TOTAL_ROUNDS) * 100);
      onComplete(accuracy, commissionErrorsRef.current);
      return;
    }

    setHasTappedThisRound(false);
    setFrogState('idle');
    setItemPosition('serving');
    setFeedbackText('');

    // Timeout to evaluate round when expired without child tapping
    roundTimerRef.current = window.setTimeout(() => {
      if (!currentStimulus.isGo) {
        // Child correctly withheld / restrained finger on Junk/Inedible!
        correctCountRef.current += 1;
        setFrogState('proud_hold');
        setFeedbackText('Hebat! Pintar menahan diri! 👍');
        soundSynth.playChime();
      } else {
        // Omission error (missed healthy food)
        setFrogState('idle');
        setFeedbackText('Yah, makanannya lewat!');
      }

      // Smooth advance to next round
      setTimeout(() => {
        setCurrentRound((r) => r + 1);
      }, 500);
    }, 1500);

    return () => {
      if (roundTimerRef.current) clearTimeout(roundTimerRef.current);
    };
  }, [currentRound, currentStimulus, onComplete, TOTAL_ROUNDS]);

  // Handle tap to feed Kerro
  const handleFeedTap = () => {
    if (hasTappedThisRound) return;
    setHasTappedThisRound(true);
    if (roundTimerRef.current) clearTimeout(roundTimerRef.current);

    if (currentStimulus.isGo) {
      // Correct! Child fed Kerro healthy food
      correctCountRef.current += 1;
      setFrogState('open_mouth');
      setItemPosition('eaten');
      soundSynth.playChime();
      setFeedbackText('Nyam nyam! Enak sekali! 😋');

      setTimeout(() => {
        setFrogState('chewing');
      }, 250);

      setTimeout(() => {
        setCurrentRound((r) => r + 1);
      }, 850);
    } else {
      // Commission error! Child fed Kerro junk/inedible item
      commissionErrorsRef.current += 1;
      setFrogState('refusal');
      setItemPosition('rejected');
      soundSynth.playPop();
      setFeedbackText('Huek! Kerro gak mau makan itu! 🤢');

      setTimeout(() => {
        setCurrentRound((r) => r + 1);
      }, 1000);
    }
  };

  return (
    <div
      onClick={handleFeedTap}
      className="w-full h-full flex flex-col justify-between items-center bg-gradient-to-b from-[#FFFBEB] via-[#F0FDF4]/70 to-[#E8F5E9] select-none relative overflow-hidden font-sans cursor-pointer"
    >
      {/* Top Header */}
      <GameHeader
        moduleTitle="Modul 2: Pesta Makan Kerro"
        currentRound={currentRound}
        totalRounds={TOTAL_ROUNDS}
        onExit={onExit}
      />

      {/* Main Interactive Stage */}
      <main className="flex-1 w-full max-w-lg mx-auto flex flex-col items-center justify-between py-2 px-6 z-10 text-center relative">
        
        {/* Top: Stimulus Food Tray */}
        <div className="w-full flex flex-col items-center space-y-2 pt-2">
          {/* Instruction Pill */}
          <div
            className={`inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-wider shadow-xs transition-colors ${
              currentStimulus.isGo
                ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                : 'bg-rose-100 text-rose-800 border border-rose-300'
            }`}
          >
            <span>{currentStimulus.isGo ? 'Makanan Sehat' : 'Bukan Makanan!'}</span>
            <span>{currentStimulus.isGo ? '• Beri Makan Kerro! 👆' : '• Tahan Jarimu! ✋'}</span>
          </div>

          {/* Floating Food Card */}
          <div className="relative h-28 flex items-center justify-center">
            {itemPosition !== 'eaten' && (
              <div
                className={`w-28 h-28 rounded-3xl flex flex-col items-center justify-center border-2 shadow-md transition-all duration-300 ${
                  itemPosition === 'rejected' ? 'animate-shake bg-rose-100 border-rose-400' : ''
                } ${
                  currentStimulus.isGo
                    ? 'bg-white border-amber-300 hover:scale-105'
                    : 'bg-rose-50 border-rose-300'
                }`}
              >
                <span className="text-5xl drop-shadow-sm select-none">
                  {currentStimulus.emoji}
                </span>
                <span className="text-[11px] font-black text-slate-700 mt-1">
                  {currentStimulus.name}
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Center: Interactive Frog Mascot (Kerro Nyam-Nyam) */}
        <div className="relative flex flex-col items-center justify-center my-auto">
          {/* Speech Bubble Feedback */}
          <div className="h-10 flex items-center justify-center mb-1">
            {feedbackText ? (
              <div className="bg-white border-2 border-slate-200 px-4 py-1 rounded-full shadow-sm text-xs font-black text-slate-800 animate-in zoom-in-95 duration-150">
                {feedbackText}
              </div>
            ) : (
              <span className="text-xs font-bold text-slate-500">
                {currentStimulus.isGo ? 'Sentuh layar untuk suapi Kerro!' : 'Jangan disentuh, biarkan lewat!'}
              </span>
            )}
          </div>

          {/* Animated Frog Body SVG with Mouth States */}
          <div className="relative w-48 h-48 sm:w-56 sm:h-56 flex items-center justify-center">
            <svg
              viewBox="0 0 200 200"
              className={`w-full h-full drop-shadow-md transition-transform duration-200 ${
                frogState === 'chewing' ? 'scale-105' : ''
              } ${frogState === 'refusal' ? 'rotate-[-6deg]' : ''}`}
            >
              <defs>
                {/* Frog Green Gradient */}
                <linearGradient id="kerroGreen" x1="100" y1="20" x2="100" y2="180" gradientUnits="userSpaceOnUse">
                  <stop offset="0%" stopColor="#4ADE80" />
                  <stop offset="60%" stopColor="#22C55E" />
                  <stop offset="100%" stopColor="#16A34A" />
                </linearGradient>
                {/* Belly Tint */}
                <radialGradient id="kerroBelly" cx="100" cy="140" r="45" gradientUnits="userSpaceOnUse">
                  <stop offset="0%" stopColor="#DCFCE7" />
                  <stop offset="100%" stopColor="#86EFAC" stopOpacity="0.4" />
                </radialGradient>
                {/* Rosy Cheeks */}
                <radialGradient id="kerroCheek" cx="50%" cy="50%" r="50%">
                  <stop offset="0%" stopColor="#F43F5E" stopOpacity="0.6" />
                  <stop offset="100%" stopColor="#F43F5E" stopOpacity="0" />
                </radialGradient>
              </defs>

              {/* Big Frog Eyes with Highlights */}
              <g>
                {/* Left Eye Bump */}
                <circle cx="62" cy="55" r="28" fill="url(#kerroGreen)" stroke="#15803D" strokeWidth="4" />
                <circle cx="62" cy="55" r="20" fill="#FFFFFF" />
                <circle cx="64" cy="55" r="10" fill="#0F172A" />
                <circle cx="61" cy="51" r="4" fill="#FFFFFF" />

                {/* Right Eye Bump */}
                <circle cx="138" cy="55" r="28" fill="url(#kerroGreen)" stroke="#15803D" strokeWidth="4" />
                <circle cx="138" cy="55" r="20" fill="#FFFFFF" />
                {frogState === 'proud_hold' ? (
                  /* Wink on proud hold */
                  <path d="M128 55 Q138 65 148 55" stroke="#0F172A" strokeWidth="4" strokeLinecap="round" fill="none" />
                ) : (
                  <>
                    <circle cx="136" cy="55" r="10" fill="#0F172A" />
                    <circle cx="133" cy="51" r="4" fill="#FFFFFF" />
                  </>
                )}
              </g>

              {/* Main Head & Body */}
              <ellipse cx="100" cy="115" rx="76" ry="60" fill="url(#kerroGreen)" stroke="#15803D" strokeWidth="4" />

              {/* Cream Belly */}
              <ellipse cx="100" cy="132" rx="48" ry="36" fill="url(#kerroBelly)" />

              {/* Blush Cheeks */}
              <ellipse cx="50" cy="118" rx="12" ry="7" fill="url(#kerroCheek)" />
              <ellipse cx="150" cy="118" rx="12" ry="7" fill="url(#kerroCheek)" />

              {/* MOUTH STATES */}
              {/* 1. Open Mouth (Chomping food) */}
              {(frogState === 'open_mouth' || itemPosition === 'eaten') && (
                <g>
                  {/* Deep Open Cavity */}
                  <ellipse cx="100" cy="118" rx="36" ry="26" fill="#991B1B" stroke="#15803D" strokeWidth="3" />
                  {/* Pink Tongue */}
                  <ellipse cx="100" cy="130" rx="22" ry="12" fill="#F43F5E" />
                </g>
              )}

              {/* 2. Chewing Mouth */}
              {frogState === 'chewing' && (
                <g stroke="#15803D" strokeWidth="5" strokeLinecap="round" fill="none">
                  <path d="M80 118 Q100 134 120 118" />
                  <ellipse cx="100" cy="116" rx="8" ry="5" fill="#F43F5E" stroke="none" />
                </g>
              )}

              {/* 3. Refusal Disgusted Mouth */}
              {frogState === 'refusal' && (
                <g stroke="#15803D" strokeWidth="5" strokeLinecap="round" fill="none">
                  {/* Wobbly wavy mouth */}
                  <path d="M78 124 Q90 112 100 122 T122 114" />
                  {/* Dizzy little tongue sticking out */}
                  <path d="M96 122 Q100 132 104 122 Z" fill="#94A3B8" stroke="#475569" strokeWidth="2" />
                </g>
              )}

              {/* 4. Proud Hold / Peaceful Smile */}
              {frogState === 'proud_hold' && (
                <g stroke="#15803D" strokeWidth="5" strokeLinecap="round" fill="none">
                  <path d="M76 114 Q100 132 124 114" />
                </g>
              )}

              {/* 5. Idle Mouth (Waiting expectant) */}
              {frogState === 'idle' && (
                <g stroke="#15803D" strokeWidth="4.5" strokeLinecap="round" fill="none">
                  <path d="M82 116 Q100 126 118 116" />
                </g>
              )}

              {/* Front Paws resting on belly */}
              <circle cx="68" cy="158" r="9" fill="#22C55E" stroke="#15803D" strokeWidth="3" />
              <circle cx="132" cy="158" r="9" fill="#22C55E" stroke="#15803D" strokeWidth="3" />
            </svg>

            {/* Soft Shadow underneath */}
            <div className="absolute -bottom-2 w-32 h-4 bg-slate-900/15 rounded-full blur-[3px]" />
          </div>
        </div>

        {/* Bottom Tactile Action Hint */}
        <div className="w-full pb-4 shrink-0">
          <div
            className={`w-full py-3.5 px-6 rounded-2xl flex items-center justify-center text-sm font-black uppercase tracking-wider shadow-sm transition-transform ${
              currentStimulus.isGo
                ? 'bg-[#38B865] text-white hover:bg-[#2FA558]'
                : 'bg-slate-200 text-slate-700'
            }`}
          >
            {currentStimulus.isGo ? 'KETUK UNTUK MAKAN (NYAM!) 🍽️' : 'TAHAN! JANGAN DIKETUK 🛑'}
          </div>
        </div>
      </main>

      {/* Footer Progress Indicators */}
      <footer className="w-full text-center pb-4 z-10 shrink-0">
        <p className="text-xs text-slate-400 font-bold">
          Makanan {Math.min(currentRound + 1, TOTAL_ROUNDS)} dari {TOTAL_ROUNDS}
        </p>
      </footer>
    </div>
  );
};
