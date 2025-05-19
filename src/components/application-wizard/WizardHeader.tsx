
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

interface WizardHeaderProps {
  onBack: () => void;
}

export const WizardHeader = ({ onBack }: WizardHeaderProps) => {
  return (
    <div className="mb-8 flex items-center">
      <Button 
        variant="ghost" 
        size="sm" 
        className="mr-4"
        onClick={onBack}
      >
        <ArrowLeft className="h-4 w-4 mr-2" />
        Back
      </Button>
      <div>
        <h1 className="text-3xl font-bold">Loan Application</h1>
        <p className="text-gray-600 mt-1">Complete all steps to submit your loan application</p>
      </div>
    </div>
  );
};
