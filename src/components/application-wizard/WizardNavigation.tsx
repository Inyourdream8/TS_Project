
import { Button } from "@/components/ui/button";
import { ArrowLeft, ArrowRight, ChevronRight } from "lucide-react";

interface WizardNavigationProps {
  currentStep: number;
  totalSteps: number;
  onPrevious: () => void;
  onNext: () => void;
  onSubmit: () => void;
  isSubmitting: boolean;
  isStepComplete: boolean;
}

export const WizardNavigation = ({
  currentStep,
  totalSteps,
  onPrevious,
  onNext,
  onSubmit,
  isSubmitting,
  isStepComplete,
}: WizardNavigationProps) => {
  const isLastStep = currentStep === totalSteps - 1;

  return (
    <>
      <Button 
        type="button" 
        variant="outline" 
        onClick={onPrevious}
        disabled={currentStep === 0 || isSubmitting}
      >
        <ArrowLeft className="mr-2 h-4 w-4" />
        Previous
      </Button>
      
      {!isLastStep ? (
        <Button 
          type="button" 
          onClick={onNext}
          disabled={!isStepComplete || isSubmitting}
        >
          Next
          <ArrowRight className="ml-2 h-4 w-4" />
        </Button>
      ) : (
        <Button 
          type="button" 
          onClick={onSubmit}
          disabled={!isStepComplete || isSubmitting}
        >
          {isSubmitting ? (
            <div className="flex items-center">
              <span className="animate-spin h-4 w-4 mr-2 border-2 border-b-transparent border-white rounded-full"></span>
              Submitting...
            </div>
          ) : (
            <div className="flex items-center">
              Submit Application
              <ChevronRight className="ml-2 h-4 w-4" />
            </div>
          )}
        </Button>
      )}
    </>
  );
};
