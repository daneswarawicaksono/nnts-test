import React from 'react';
import { Check } from 'lucide-react';

export interface StepperProps {
  steps: string[];
  currentStep: number; // 1-based index
  onStepClick?: (step: number) => void;
  className?: string;
}

export const Stepper: React.FC<StepperProps> = ({
  steps,
  currentStep,
  onStepClick,
  className = '',
}) => {
  return (
    <div className={`w-full flex items-center justify-between ${className}`}>
      {steps.map((label, index) => {
        const stepNumber = index + 1;
        const isDone = stepNumber < currentStep;
        const isActive = stepNumber === currentStep;

        return (
          <React.Fragment key={label}>
            {/* Step Node */}
            <div className="flex flex-col items-center gap-1.5 flex-1">
              <button
                type="button"
                disabled={!onStepClick || stepNumber > currentStep}
                onClick={() => onStepClick && onStepClick(stepNumber)}
                className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs transition-all duration-fast ${
                  isDone
                    ? 'bg-emerald-600 text-white'
                    : isActive
                    ? 'bg-nutri-teal-700 text-white ring-4 ring-nutri-teal-100 shadow-sm'
                    : 'bg-slate-100 text-slate-400'
                } ${onStepClick && stepNumber <= currentStep ? 'cursor-pointer hover:scale-105' : 'cursor-default'}`}
              >
                {isDone ? <Check className="w-4 h-4 stroke-[3]" /> : stepNumber}
              </button>
              <span
                className={`text-[11px] font-semibold text-center leading-tight line-clamp-1 ${
                  isActive ? 'text-slate-900 font-bold' : isDone ? 'text-slate-600' : 'text-slate-400'
                }`}
              >
                {label}
              </span>
            </div>

            {/* Connecting Bar */}
            {index < steps.length - 1 && (
              <div
                className={`h-0.5 flex-1 mb-5 transition-colors duration-normal ${
                  stepNumber < currentStep ? 'bg-emerald-500' : 'bg-slate-200'
                }`}
              />
            )}
          </React.Fragment>
        );
      })}
    </div>
  );
};
