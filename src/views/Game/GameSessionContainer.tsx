import React, { useState } from 'react';
import { AdventureTrailMap } from './modules/AdventureTrailMap';
import { ModuleReactionTime } from './modules/ModuleReactionTime';
import { ModuleGoNoGo } from './modules/ModuleGoNoGo';
import { ModuleMemorySpan } from './modules/ModuleMemorySpan';
import { GameCelebration } from './modules/GameCelebration';

export interface GameSessionContainerProps {
  childId: string;
  childName: string;
  onExit: () => void;
  onFinishSession: () => void;
}

type GameStep = 'trail-map' | 'module-1' | 'module-2' | 'module-3' | 'celebration';

export const GameSessionContainer: React.FC<GameSessionContainerProps> = ({
  childId,
  childName,
  onExit,
  onFinishSession,
}) => {
  const [completedStages, setCompletedStages] = useState({
    module1: false,
    module2: false,
    module3: false,
  });

  const [activeStage, setActiveStage] = useState<1 | 2 | 3 | 4>(1);

  const [currentStep, setCurrentStep] = useState<GameStep>(() => {
    const stepParam = new URLSearchParams(window.location.search).get('game_step');
    if (stepParam === 'module-1') return 'module-1';
    if (stepParam === 'module-2') return 'module-2';
    if (stepParam === 'module-3') return 'module-3';
    if (stepParam === 'celebration') return 'celebration';
    return 'trail-map';
  });

  // Collected metrics across the 3 modules
  const [reactionTrials, setReactionTrials] = useState<number[]>([310, 290, 320, 280, 305]);
  const [goNoGoAccuracy, setGoNoGoAccuracy] = useState<number>(85);
  const [goNoGoCommissionErrors, setGoNoGoCommissionErrors] = useState<number>(1);
  const [memorySpanScore, setMemorySpanScore] = useState<number>(3);

  const handleStageSelectFromMap = (stage: 1 | 2 | 3 | 4) => {
    if (stage === 1) setCurrentStep('module-1');
    else if (stage === 2) setCurrentStep('module-2');
    else if (stage === 3) setCurrentStep('module-3');
    else if (stage === 4) setCurrentStep('celebration');
  };

  return (
    <div className="w-full h-full flex flex-col justify-between overflow-hidden relative">
      {currentStep === 'trail-map' && (
        <AdventureTrailMap
          childName={childName}
          completedStages={completedStages}
          currentActiveStage={activeStage}
          onSelectStage={handleStageSelectFromMap}
          onExit={onExit}
        />
      )}

      {currentStep === 'module-1' && (
        <ModuleReactionTime
          onComplete={(trials) => {
            setReactionTrials(trials);
            setCompletedStages((prev) => ({ ...prev, module1: true }));
            setActiveStage(2);
            setCurrentStep('trail-map');
          }}
          onExit={() => setCurrentStep('trail-map')}
        />
      )}

      {currentStep === 'module-2' && (
        <ModuleGoNoGo
          onComplete={(accuracy, commissionErrors) => {
            setGoNoGoAccuracy(accuracy);
            setGoNoGoCommissionErrors(commissionErrors);
            setCompletedStages((prev) => ({ ...prev, module2: true }));
            setActiveStage(3);
            setCurrentStep('trail-map');
          }}
          onExit={() => setCurrentStep('trail-map')}
        />
      )}

      {currentStep === 'module-3' && (
        <ModuleMemorySpan
          onComplete={(spanScore) => {
            setMemorySpanScore(spanScore);
            setCompletedStages((prev) => ({ ...prev, module3: true }));
            setActiveStage(4);
            setCurrentStep('trail-map');
          }}
          onExit={() => setCurrentStep('trail-map')}
        />
      )}

      {currentStep === 'celebration' && (
        <GameCelebration
          childId={childId}
          childName={childName}
          trials={reactionTrials}
          accuracy={goNoGoAccuracy}
          commissionErrors={goNoGoCommissionErrors}
          spanScore={memorySpanScore}
          onFinish={onFinishSession}
        />
      )}
    </div>
  );
};
