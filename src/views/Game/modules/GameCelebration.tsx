import React, { useEffect, useState } from 'react';
import { Star, CheckCircle, ArrowRight } from 'lucide-react';
import confetti from 'canvas-confetti';
import { GlassCard } from '../../../design-system/primitives/GlassCard';
import { Button } from '../../../design-system/primitives/Button';
import { Skeleton } from '../../../design-system/primitives/Skeleton';
import { soundSynth } from '../../../services/audio/synth';
import { api, type ScreeningEvaluationResponse } from '../../../services/api/client';

export interface GameCelebrationProps {
  childId: string;
  childName: string;
  trials: number[];
  accuracy: number;
  commissionErrors: number;
  spanScore: number;
  onFinish: () => void;
}

export const GameCelebration: React.FC<GameCelebrationProps> = ({
  childId,
  childName,
  trials,
  accuracy,
  commissionErrors,
  spanScore,
  onFinish,
}) => {
  const [evaluation, setEvaluation] = useState<ScreeningEvaluationResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Fire confetti immediately
    try {
      confetti({
        particleCount: 50,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#0F766E', '#10B981', '#F97316', '#FDE047'],
        disableForReducedMotion: true,
      });
    } catch {
      // ignore
    }

    soundSynth.playChime();

    // Submit recorded metrics to backend CDSS
    api
      .submitScreeningSession({
        childId,
        reactionTimeTrials: trials,
        goNoGoAccuracy: accuracy,
        goNoGoCommissionErrors: commissionErrors,
        memorySpanScore: spanScore,
      })
      .then((res) => {
        setEvaluation(res);
        setIsLoading(false);
      })
      .catch(() => {
        setIsLoading(false);
      });
  }, [childId, trials, accuracy, commissionErrors, spanScore]);

  const avgLatency = Math.round(trials.reduce((a, b) => a + b, 0) / (trials.length || 1));

  return (
    <div className="w-full h-full flex flex-col justify-between items-center bg-gradient-to-b from-[#FFFBEB] via-[#F0FDF4]/60 to-[#ECFDF5] px-6 py-6 font-sans select-none relative overflow-y-auto">
      {/* Spacer */}
      <div className="w-full h-2 shrink-0" />

      {/* Main Celebration Stage */}
      <main className="w-full max-w-xs mx-auto flex flex-col items-center text-center my-auto z-10 space-y-4">
        {/* 3 Gold Stars */}
        <div className="flex items-center justify-center gap-2 animate-in zoom-in-75 duration-normal">
          <Star className="w-8 h-8 fill-amber-400 text-amber-500 drop-shadow-sm -rotate-12" />
          <Star className="w-12 h-12 fill-amber-400 text-amber-500 drop-shadow-md -translate-y-2 scale-110" />
          <Star className="w-8 h-8 fill-amber-400 text-amber-500 drop-shadow-sm rotate-12" />
        </div>

        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
            Hebat, {childName}!
          </h1>
          <p className="text-xs text-slate-600 mt-1">
            Seluruh petualangan berhasil diselesaikan dengan ceria.
          </p>
        </div>

        {/* Backend Evaluation Summary Card */}
        <GlassCard padding="md" className="w-full text-left space-y-3 bg-white/95 border-amber-200/80 shadow-md">
          {isLoading ? (
            <div className="space-y-2 py-2">
              <Skeleton variant="text" width="60%" />
              <Skeleton variant="rectangular" height={36} />
              <Skeleton variant="text" width="80%" />
            </div>
          ) : evaluation ? (
            <>
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-bold text-slate-500 uppercase">Status Analisis CDSS:</span>
                <span
                  className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                    evaluation.tier === 'Normal'
                      ? 'bg-emerald-100 text-emerald-800'
                      : 'bg-amber-100 text-amber-800'
                  }`}
                >
                  {evaluation.tier}
                </span>
              </div>

              <div className="p-2.5 rounded-lg bg-teal-50/70 border border-teal-200/60 text-xs font-semibold text-teal-900 flex items-start gap-2">
                <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <p className="leading-snug">{evaluation.summaryFeedback}</p>
              </div>

              {/* Metrics Breakdown */}
              <div className="grid grid-cols-3 gap-2 pt-2 border-t border-slate-100 text-[11px] text-center">
                <div className="bg-slate-50 p-1.5 rounded-lg">
                  <div className="text-slate-400 text-[10px]">Reaksi (Fe)</div>
                  <div className="font-extrabold text-slate-800">{avgLatency} ms</div>
                </div>
                <div className="bg-slate-50 p-1.5 rounded-lg">
                  <div className="text-slate-400 text-[10px]">Fokus (Zn)</div>
                  <div className="font-extrabold text-slate-800">{accuracy}%</div>
                </div>
                <div className="bg-slate-50 p-1.5 rounded-lg">
                  <div className="text-slate-400 text-[10px]">Memori (B12)</div>
                  <div className="font-extrabold text-slate-800">Skor {spanScore}</div>
                </div>
              </div>
            </>
          ) : (
            <p className="text-xs text-slate-600">Sesi tercatat secara lokal.</p>
          )}
        </GlassCard>
      </main>

      {/* Bottom Action: Return to Dashboard */}
      <footer className="w-full max-w-xs mx-auto pb-4 shrink-0 z-20">
        <Button
          variant="primary"
          size="lg"
          fullWidth
          icon={<ArrowRight className="w-5 h-5" />}
          iconPosition="right"
          onClick={() => {
            soundSynth.playPop();
            onFinish();
          }}
        >
          Kembali ke Beranda
        </Button>
      </footer>
    </div>
  );
};
