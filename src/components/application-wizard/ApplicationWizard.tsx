
import { useNavigate } from "react-router-dom";
import { Form } from "@/components/ui/form";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import StepWizard from "@/components/StepWizard";
import { stepTransition } from "@/lib/animate";
import { PersonalInfoSection } from "@/components/apply/PersonalInfoSection";
import { EmploymentSection } from "@/components/apply/EmploymentSection";
import { LoanDetailsSection } from "@/components/apply/LoanDetailsSection";
import { BankingSection } from "@/components/apply/BankingSection";
import { DocumentsSection } from "@/components/apply/DocumentsSection";
import { WizardNavigation } from "./WizardNavigation";
import { WizardHeader } from "./WizardHeader";
import { useLoanApplicationForm } from "@/hooks/useLoanApplicationForm";
import { useWizardNavigation } from "@/hooks/useWizardNavigation";
import { useApplicationSubmit } from "@/hooks/useApplicationSubmit";

// Step titles
const STEPS = ["Personal Information", "Employment", "Loan Details", "Banking", "Documents"];

const ApplicationWizard = () => {
  const navigate = useNavigate();
  
  // Custom hooks
  const { form, documents, handleFileUpload } = useLoanApplicationForm();
  const { currentStep, nextStep, prevStep, goToStep, getStepCompletion } = useWizardNavigation(form, STEPS.length, documents);
  const { handleSubmit, isSubmitting } = useApplicationSubmit(documents);

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-3xl mx-auto">
        <WizardHeader onBack={() => navigate("/dashboard")} />

        {/* Step Progress Indicator */}
        <StepWizard 
          steps={STEPS} 
          currentStep={currentStep} 
          onStepClick={goToStep} 
          allowNavigation={true}
        />

        <Card className="border shadow-md bg-white">
          <CardHeader>
            <CardTitle>
              {STEPS[currentStep]}
              <div className="mt-2 h-1 w-full bg-gray-100 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-blue-600 transition-all duration-500 ease-out"
                  style={{ width: `${getStepCompletion(currentStep)}%` }}
                />
              </div>
            </CardTitle>
            <CardDescription>
              {currentStep === 0 && "Provide your personal information"}
              {currentStep === 1 && "Share your employment information"}
              {currentStep === 2 && "Specify your loan requirements"}
              {currentStep === 3 && "Provide your banking details"}
              {currentStep === 4 && "Upload required documents"}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
                {/* Step 1: Personal Information */}
                <div className={stepTransition(currentStep === 0)}>
                  <PersonalInfoSection form={form} isSubmitting={isSubmitting} />
                </div>

                {/* Step 2: Employment Information */}
                <div className={stepTransition(currentStep === 1)}>
                  <EmploymentSection form={form} isSubmitting={isSubmitting} />
                </div>

                {/* Step 3: Loan Details */}
                <div className={stepTransition(currentStep === 2)}>
                  <LoanDetailsSection form={form} isSubmitting={isSubmitting} />
                </div>

                {/* Step 4: Banking Information */}
                <div className={stepTransition(currentStep === 3)}>
                  <BankingSection form={form} isSubmitting={isSubmitting} />
                </div>

                {/* Step 5: Documents */}
                <div className={stepTransition(currentStep === 4)}>
                  <DocumentsSection 
                    form={form} 
                    isSubmitting={isSubmitting}
                    documents={documents}
                    onDocumentUpload={handleFileUpload}
                  />
                </div>
              </form>
            </Form>
          </CardContent>
          <CardFooter className="flex justify-between border-t pt-6">
            <WizardNavigation
              currentStep={currentStep}
              totalSteps={STEPS.length}
              onPrevious={prevStep}
              onNext={nextStep}
              onSubmit={form.handleSubmit(handleSubmit)}
              isSubmitting={isSubmitting}
              isStepComplete={getStepCompletion(currentStep) === 100}
            />
          </CardFooter>
        </Card>
      </div>
    </div>
  );
};

export default ApplicationWizard;
