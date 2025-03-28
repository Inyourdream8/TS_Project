
import React from "react";
import { cn } from "@/lib/utils";
import { CheckCircle2, Circle } from "lucide-react";

interface StepWizardProps {
  steps: string[];
  currentStep: number;
  onStepClick?: (step: number) => void;
  allowNavigation?: boolean;
}

const StepWizard = ({ 
  steps, 
  currentStep, 
  onStepClick, 
  allowNavigation = false 
}: StepWizardProps) => {
  return (
    <div className="mb-8">
      <div className="flex items-center justify-between">
        {steps.map((step, index) => {
          const isCompleted = index < currentStep;
          const isCurrent = index === currentStep;
          
          return (
            <React.Fragment key={index}>
              {/* Step indicator */}
              <div className="flex flex-col items-center">
                <button
                  onClick={() => allowNavigation && onStepClick && onStepClick(index)}
                  disabled={!allowNavigation || (!isCompleted && !isCurrent)}
                  className={cn(
                    "relative flex h-10 w-10 items-center justify-center rounded-full border-2 transition-colors duration-300",
                    isCompleted 
                      ? "border-finance-primary bg-finance-primary text-white" 
                      : isCurrent
                      ? "border-finance-primary bg-white text-finance-primary animate-pulse-scale"
                      : "border-gray-300 bg-white text-gray-300",
                    allowNavigation && isCompleted ? "cursor-pointer hover:bg-finance-primary/90" : ""
                  )}
                >
                  {isCompleted ? (
                    <CheckCircle2 className="h-7 w-7" />
                  ) : (
                    <Circle className="h-7 w-7" />
                  )}
                  <span className="absolute top-full mt-2 text-sm font-medium text-gray-700">
                    {step}
                  </span>
                </button>
              </div>
              
              {/* Connector line */}
              {index < steps.length - 1 && (
                <div className="relative flex-1 mx-4">
                  <div className="absolute inset-0 flex items-center">
                    <div className="h-1 w-full bg-gray-200 rounded">
                      <div 
                        className={cn(
                          "h-full bg-finance-primary rounded",
                          isCompleted ? "w-full" : "w-0",
                          isCompleted ? "animate-progress-fill" : ""
                        )}
                      />
                    </div>
                  </div>
                </div>
              )}
            </React.Fragment>
          );
        })}
      </div>
    </div>
  );
};

export default StepWizard;
