import React, { useState } from 'react';
import { SplashScreen } from './screens/SplashScreen';
import { LearningPathScreen } from './screens/LearningPathScreen';
import { InteractiveExerciseScreen } from './screens/InteractiveExerciseScreen';
import { StreakCelebrationOverlay } from './screens/StreakCelebrationOverlay';
import { FlawlessSummaryScreen } from './screens/FlawlessSummaryScreen';

export type LanguageScreenStep = 'splash' | 'path' | 'exercise' | 'streak' | 'summary';

export interface LanguageLearningContainerProps {
  initialStep?: LanguageScreenStep;
  onExit: () => void;
}

export const LanguageLearningContainer: React.FC<LanguageLearningContainerProps> = ({
  initialStep = 'splash',
  onExit,
}) => {
  const [currentStep, setCurrentStep] = useState<LanguageScreenStep>(initialStep);

  return (
    <div className="w-full h-full relative overflow-hidden flex flex-col bg-white">
      {currentStep === 'splash' && (
        <SplashScreen
          onStart={() => setCurrentStep('path')}
          onLogin={() => setCurrentStep('path')}
        />
      )}

      {currentStep === 'path' && (
        <LearningPathScreen
          onSelectNode={() => setCurrentStep('exercise')}
          onExit={onExit}
        />
      )}

      {currentStep === 'exercise' && (
        <InteractiveExerciseScreen
          onExit={() => setCurrentStep('path')}
          onCorrect={() => setCurrentStep('streak')}
        />
      )}

      {currentStep === 'streak' && (
        <StreakCelebrationOverlay
          streakCount={5}
          onContinue={() => setCurrentStep('summary')}
        />
      )}

      {currentStep === 'summary' && (
        <FlawlessSummaryScreen
          onClaim={() => {
            // Once claimed, return to path or back to parent app
            setCurrentStep('path');
          }}
        />
      )}
    </div>
  );
};
