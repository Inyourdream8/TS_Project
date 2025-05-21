
import { useState } from "react";
import { UseFormReturn } from "react-hook-form";
import { LoanApplicationFormValues } from "@/types/forms";

export const useWizardNavigation = (
  form: UseFormReturn<LoanApplicationFormValues>, 
  totalSteps: number,
  documents: File[]
) => {
  const [currentStep, setCurrentStep] = useState(0);
  
  const nextStep = () => {
    if (currentStep < totalSteps - 1) {
      setCurrentStep(prevStep => prevStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(prevStep => prevStep - 1);
    }
  };

  const goToStep = (step: number) => {
    if (step >= 0 && step < totalSteps) {
      setCurrentStep(step);
    }
  };

  // Calculate completion percentage for current step
  const getStepCompletion = (step: number) => {
    switch (step) {
      case 0: // Personal Information
        const personalFieldsCompleted = [
          form.watch("fullName")?.length >= 3,
          form.watch("nationalId")?.length >= 5,
          form.watch("phoneNumber")?.length >= 10,
          form.watch("address")?.length >= 5,
          form.watch("email")?.includes("@")
        ].filter(Boolean).length;
        return Math.min(100, Math.round((personalFieldsCompleted / 5) * 100));
        
      case 1: // Employment
        const employmentFieldsCompleted = [
          !!form.watch("employmentStatus"),
          form.watch("employmentStatus") !== "Employee" || !!form.watch("employer"),
          !!form.watch("employmentDuration"),
          form.watch("monthlyIncome") >= 5000
        ].filter(Boolean).length;
        return Math.min(100, Math.round((employmentFieldsCompleted / 4) * 100));
        
      case 2: // Loan Details
        const loanFieldsCompleted = [
          form.watch("loanAmount") >= 100000 && form.watch("loanAmount") <= 3000000,
          !!form.watch("loanTerm"),
          !!form.watch("loanPurpose")
        ].filter(Boolean).length;
        return Math.min(100, Math.round((loanFieldsCompleted / 3) * 100));
        
      case 3: // Banking
        const bankingFieldsCompleted = [
          !!form.watch("bankName"),
          !!form.watch("accountName") && form.watch("accountName").length >= 3,
          !!form.watch("accountNumber") && form.watch("accountNumber").length >= 8,
          !!form.watch("accountType")
        ].filter(Boolean).length;
        return Math.min(100, Math.round((bankingFieldsCompleted / 4) * 100));
        
      case 4: // Documents
        return documents.length > 0 ? 100 : 0;
        
      default:
        return 0;
    }
  };
  
  return {
    currentStep,
    nextStep,
    prevStep,
    goToStep,
    getStepCompletion
  };
};
