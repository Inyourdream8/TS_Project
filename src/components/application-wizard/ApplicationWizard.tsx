import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useToast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, ArrowRight, ChevronRight } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { api } from "@/lib/api";
import StepWizard from "@/components/StepWizard";
import { stepTransition } from "@/lib/animate";
import { LoanApplicationFormValues, loanApplicationSchema } from "@/types/forms";
import { PersonalInfoSection } from "@/components/apply/PersonalInfoSection";
import { EmploymentSection } from "@/components/apply/EmploymentSection";
import { LoanDetailsSection } from "@/components/apply/LoanDetailsSection";
import { BankingSection } from "@/components/apply/BankingSection";
import { DocumentsSection } from "@/components/apply/DocumentsSection";
import { WizardNavigation } from "./WizardNavigation";
import { WizardHeader } from "./WizardHeader";

// Step titles
const STEPS = ["Personal Information", "Employment", "Loan Details", "Banking", "Documents"];

const ApplicationWizard = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user } = useAuth();
  const [currentStep, setCurrentStep] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [documents, setDocuments] = useState<File[]>([]);

  // Initialize form with default values, populate with user data if available
  const form = useForm<LoanApplicationFormValues>({
    resolver: zodResolver(loanApplicationSchema),
    defaultValues: {
      // Personal Information
      fullName: user?.full_name || "",
      nationalId: "",
      phoneNumber: user?.phone_number || "",
      address: user?.address || "",
      email: user?.email || "",
      
      // Employment Information
      employmentStatus: "",
      employer: "",
      employmentDuration: "",
      monthlyIncome: 0,
      
      // Loan Details
      loanAmount: 100000,
      loanTerm: "12",
      loanPurpose: "",
      
      // Banking Details
      bankName: "",
      accountName: "",
      accountNumber: "",
      accountType: "",
      
      // Additional Info
      additionalInfo: "",
    },
    mode: "onChange",
  });

  // Handle file upload
  const handleFileUpload = async (file: File, documentType: string) => {
    // Store uploaded file in state
    setDocuments([...documents, file]);
    return Promise.resolve();
  };

  // Handle form submission
  const onSubmit = async (data: LoanApplicationFormValues) => {
    if (!user) {
      toast({
        variant: "destructive",
        title: "Authentication required",
        description: "Please log in to submit a loan application.",
      });
      navigate("/login");
      return;
    }

    setIsSubmitting(true);

    try {
      const application = {
        user_id: user.id,
        application_number: `LW-${new Date().toISOString().slice(0, 10).replace(/-/g, "")}-${Math.floor(1000 + Math.random() * 9000)}`,
        status: "pending",
        
        // Personal Information
        full_name: data.fullName,
        national_id: data.nationalId,
        phone_number: data.phoneNumber,
        address: data.address,
        email: data.email,
        
        // Employment Information
        employment_status: data.employmentStatus,
        employer: data.employer || "",
        monthly_income: data.monthlyIncome,
        employment_duration: data.employmentDuration,
        
        // Loan Details
        loan_amount: data.loanAmount,
        loan_term: parseInt(data.loanTerm),
        loan_purpose: data.loanPurpose,
        interest_rate: 4.0, // Default 4% as specified
        
        // Banking Details
        bank_name: data.bankName,
        account_name: data.accountName,
        account_number: data.accountNumber,
        account_type: data.accountType,
        
        additional_info: data.additionalInfo || "",
        
        // Documents will be handled in a separate API call
      };

      const newApplication = await api.applications.create(application);
      
      // Upload documents if any
      if (documents.length > 0) {
        try {
          await Promise.all(documents.map(file => 
            api.documents.upload(newApplication.id, file, "proof_of_income")
          ));
        } catch (docError) {
          console.error("Error uploading documents:", docError);
          toast({
            title: "Document upload issue",
            description: "Your application was submitted, but there was an issue uploading some documents."
          });
        }
      }

      toast({
        title: "Application submitted",
        description: `Your loan application ${newApplication.application_number} has been submitted successfully.`,
      });

      navigate(`/dashboard`);
    } catch (error) {
      console.error("Error submitting application:", error);
      toast({
        variant: "destructive",
        title: "Submission failed",
        description: "There was a problem submitting your application. Please try again.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Navigation functions
  const nextStep = () => {
    if (currentStep < STEPS.length - 1) {
      setCurrentStep(prevStep => prevStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(prevStep => prevStep - 1);
    }
  };

  const goToStep = (step: number) => {
    if (step >= 0 && step < STEPS.length) {
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
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
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
              onSubmit={form.handleSubmit(onSubmit)}
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
