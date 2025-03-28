
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useToast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { ArrowLeft, ArrowRight, DollarSign, Briefcase, Building, CreditCard, Check, ChevronRight } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { api } from "@/lib/api";
import StepWizard from "@/components/StepWizard";
import { focusedFieldAnimation, stepTransition } from "@/lib/animate";

// Step titles
const STEPS = ["Loan Details", "Employment", "Banking", "Review"];

// Data constants
const loanPurposes = [
  "Home renovation",
  "Debt consolidation",
  "Education",
  "Medical expenses",
  "Business expansion",
  "Vehicle purchase",
  "Travel",
  "Wedding",
  "Other",
];

const employmentStatuses = [
  "employed",
  "self-employed",
  "unemployed",
  "retired",
  "student",
];

const employmentDurations = [
  { value: "less-than-1", label: "Less than 1 year" },
  { value: "1-3", label: "1-3 years" },
  { value: "3-5", label: "3-5 years" },
  { value: "5-10", label: "5-10 years" },
  { value: "more-than-10", label: "More than 10 years" },
];

const accountTypes = ["checking", "savings"];

// Form validation schema
const loanApplicationSchema = z.object({
  loanAmount: z.coerce.number()
    .min(1000, "Loan amount must be at least $1,000")
    .max(50000, "Loan amount cannot exceed $50,000"),
  loanPurpose: z.string().min(1, "Please select a loan purpose"),
  loanTerm: z.coerce.number()
    .min(3, "Loan term must be at least 3 months")
    .max(60, "Loan term cannot exceed 60 months"),
  employmentStatus: z.string().min(1, "Please select your employment status"),
  employer: z.string().min(1, "Please provide your employer's name"),
  monthlyIncome: z.coerce.number()
    .min(1000, "Monthly income must be at least $1,000"),
  employmentDuration: z.string().min(1, "Please select your employment duration"),
  bankName: z.string().min(1, "Please provide your bank name"),
  accountNumber: z.string().min(8, "Please provide a valid account number"),
  accountType: z.string().min(1, "Please select your account type"),
  additionalInfo: z.string().optional(),
});

type LoanApplicationFormValues = z.infer<typeof loanApplicationSchema>;

const Apply = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user } = useAuth();
  const [currentStep, setCurrentStep] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Initialize form with default values
  const form = useForm<LoanApplicationFormValues>({
    resolver: zodResolver(loanApplicationSchema),
    defaultValues: {
      loanAmount: 5000,
      loanTerm: 12,
      loanPurpose: "",
      employmentStatus: "",
      employer: "",
      monthlyIncome: 0,
      employmentDuration: "",
      bankName: "",
      accountNumber: "",
      accountType: "",
      additionalInfo: "",
    },
    mode: "onChange",
  });

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
        employment_status: data.employmentStatus,
        employer: data.employer,
        monthly_income: data.monthlyIncome,
        employment_duration: data.employmentDuration,
        bank_name: data.bankName,
        account_number: data.accountNumber,
        account_type: data.accountType,
        loan_amount: data.loanAmount,
        loan_purpose: data.loanPurpose,
        loan_term: data.loanTerm,
        interest_rate: 5.99, // Example fixed rate
        additional_info: data.additionalInfo,
      };

      const newApplication = await api.createLoanApplication(application);

      toast({
        title: "Application submitted",
        description: `Your loan application ${newApplication.application_number} has been submitted successfully.`,
      });

      navigate(`/application/${newApplication.id}`);
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

  // Check if user is logged in
  if (!user) {
    navigate("/login", { state: { returnTo: "/apply" } });
    return null;
  }

  // Calculate estimated monthly payment (simplified)
  const calculateMonthlyPayment = () => {
    const amount = form.watch("loanAmount") || 0;
    const term = form.watch("loanTerm") || 12;
    const rate = 5.99 / 100 / 12; // Monthly interest rate
    
    if (amount <= 0 || term <= 0) return 0;
    
    const monthlyPayment = (amount * rate * Math.pow(1 + rate, term)) / (Math.pow(1 + rate, term) - 1);
    return monthlyPayment.toFixed(2);
  };

  // Calculate completion percentage for current step
  const getStepCompletion = (step: number) => {
    switch (step) {
      case 0: // Loan Details
        const loanFieldsCompleted = [
          form.watch("loanAmount") >= 1000,
          form.watch("loanTerm") >= 3,
          !!form.watch("loanPurpose")
        ].filter(Boolean).length;
        return Math.min(100, Math.round((loanFieldsCompleted / 3) * 100));
        
      case 1: // Employment
        const employmentFieldsCompleted = [
          !!form.watch("employmentStatus"),
          !!form.watch("employer"),
          form.watch("monthlyIncome") >= 1000,
          !!form.watch("employmentDuration")
        ].filter(Boolean).length;
        return Math.min(100, Math.round((employmentFieldsCompleted / 4) * 100));
        
      case 2: // Banking
        const bankingFieldsCompleted = [
          !!form.watch("bankName"),
          !!form.watch("accountNumber") && form.watch("accountNumber").length >= 8,
          !!form.watch("accountType")
        ].filter(Boolean).length;
        return Math.min(100, Math.round((bankingFieldsCompleted / 3) * 100));
        
      case 3: // Review
        return 100;
        
      default:
        return 0;
    }
  };

  return (
    <div className="min-h-screen financial-gradient py-12 px-4">
      <div className="max-w-3xl mx-auto">
        <div className="mb-8 flex items-center">
          <Button 
            variant="ghost" 
            size="sm" 
            className="mr-4 text-finance-neutral hover:bg-finance-light/50"
            onClick={() => navigate("/dashboard")}
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
          <div>
            <h1 className="text-3xl font-bold text-finance-primary font-heading">Apply for a Loan</h1>
            <p className="text-gray-600 mt-1 font-body">Complete all steps to submit your loan application</p>
          </div>
        </div>

        {/* Step Progress Indicator */}
        <StepWizard 
          steps={STEPS} 
          currentStep={currentStep} 
          onStepClick={goToStep} 
          allowNavigation={true}
        />

        <Card className="border-finance-light shadow-md bg-white/80 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="text-finance-primary font-heading">
              {STEPS[currentStep]}
              <div className="mt-2 h-1 w-full bg-gray-100 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-finance-primary transition-all duration-500 ease-out"
                  style={{ width: `${getStepCompletion(currentStep)}%` }}
                />
              </div>
            </CardTitle>
            <CardDescription>
              {currentStep === 0 && "Tell us about the loan you're looking for"}
              {currentStep === 1 && "Share your employment information"}
              {currentStep === 2 && "Provide your banking details"}
              {currentStep === 3 && "Review your application before submission"}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                {/* Step 1: Loan Details */}
                <div className={stepTransition(currentStep === 0)}>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <FormField
                      control={form.control}
                      name="loanAmount"
                      render={({ field }) => (
                        <FormItem className={focusedFieldAnimation()}>
                          <FormLabel>Loan Amount</FormLabel>
                          <FormControl>
                            <div className="relative">
                              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">$</span>
                              <Input 
                                type="number" 
                                className="pl-8 input-animated" 
                                {...field} 
                                disabled={isSubmitting}
                              />
                            </div>
                          </FormControl>
                          <FormDescription>
                            Amount between $1,000 and $50,000
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="loanTerm"
                      render={({ field }) => (
                        <FormItem className={focusedFieldAnimation()}>
                          <FormLabel>Loan Term (Months)</FormLabel>
                          <FormControl>
                            <Input 
                              type="number" 
                              className="input-animated"
                              {...field} 
                              disabled={isSubmitting}
                            />
                          </FormControl>
                          <FormDescription>
                            Term between 3 and 60 months
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  
                  <FormField
                    control={form.control}
                    name="loanPurpose"
                    render={({ field }) => (
                      <FormItem className="mt-6">
                        <FormLabel>Loan Purpose</FormLabel>
                        <FormControl>
                          <Select 
                            onValueChange={field.onChange} 
                            defaultValue={field.value}
                            disabled={isSubmitting}
                          >
                            <SelectTrigger className={focusedFieldAnimation()}>
                              <SelectValue placeholder="Select loan purpose" />
                            </SelectTrigger>
                            <SelectContent>
                              {loanPurposes.map((purpose) => (
                                <SelectItem key={purpose} value={purpose}>
                                  {purpose}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* Payment Estimate Card */}
                  {form.watch("loanAmount") >= 1000 && form.watch("loanTerm") >= 3 && (
                    <div className="mt-8 p-4 bg-finance-light/50 rounded-lg border border-finance-light animate-fade-in">
                      <h3 className="text-lg font-semibold text-finance-primary mb-2">
                        Estimated Monthly Payment
                      </h3>
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm text-gray-600">Based on {form.watch("loanTerm")} months at 5.99% APR</p>
                        </div>
                        <div className="text-2xl font-bold text-finance-primary">
                          ${calculateMonthlyPayment()}
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {/* Step 2: Employment Information */}
                <div className={stepTransition(currentStep === 1)}>
                  <h3 className="text-lg font-semibold flex items-center mb-4 text-finance-primary">
                    <Briefcase className="mr-2 h-5 w-5" />
                    Employment Information
                  </h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <FormField
                      control={form.control}
                      name="employmentStatus"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Employment Status</FormLabel>
                          <FormControl>
                            <Select 
                              onValueChange={field.onChange} 
                              defaultValue={field.value}
                              disabled={isSubmitting}
                            >
                              <SelectTrigger className={focusedFieldAnimation()}>
                                <SelectValue placeholder="Select status" />
                              </SelectTrigger>
                              <SelectContent>
                                {employmentStatuses.map((status) => (
                                  <SelectItem key={status} value={status}>
                                    {status.charAt(0).toUpperCase() + status.slice(1)}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="employer"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Employer</FormLabel>
                          <FormControl>
                            <Input 
                              {...field} 
                              placeholder="Company name" 
                              className={focusedFieldAnimation()}
                              disabled={isSubmitting}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="monthlyIncome"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Monthly Income</FormLabel>
                          <FormControl>
                            <div className="relative">
                              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">$</span>
                              <Input 
                                type="number" 
                                className={`pl-8 ${focusedFieldAnimation()}`}
                                {...field} 
                                disabled={isSubmitting}
                              />
                            </div>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="employmentDuration"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Duration of Employment</FormLabel>
                          <FormControl>
                            <Select 
                              onValueChange={field.onChange} 
                              defaultValue={field.value}
                              disabled={isSubmitting}
                            >
                              <SelectTrigger className={focusedFieldAnimation()}>
                                <SelectValue placeholder="Select duration" />
                              </SelectTrigger>
                              <SelectContent>
                                {employmentDurations.map((duration) => (
                                  <SelectItem key={duration.value} value={duration.value}>
                                    {duration.label}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </div>

                {/* Step 3: Banking Information */}
                <div className={stepTransition(currentStep === 2)}>
                  <h3 className="text-lg font-semibold flex items-center mb-4 text-finance-primary">
                    <Building className="mr-2 h-5 w-5" />
                    Banking Information
                  </h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <FormField
                      control={form.control}
                      name="bankName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Bank Name</FormLabel>
                          <FormControl>
                            <Input 
                              {...field} 
                              placeholder="Your bank name" 
                              className={focusedFieldAnimation()}
                              disabled={isSubmitting}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="accountType"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Account Type</FormLabel>
                          <FormControl>
                            <Select 
                              onValueChange={field.onChange} 
                              defaultValue={field.value}
                              disabled={isSubmitting}
                            >
                              <SelectTrigger className={focusedFieldAnimation()}>
                                <SelectValue placeholder="Select account type" />
                              </SelectTrigger>
                              <SelectContent>
                                {accountTypes.map((type) => (
                                  <SelectItem key={type} value={type}>
                                    {type.charAt(0).toUpperCase() + type.slice(1)}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="accountNumber"
                      render={({ field }) => (
                        <FormItem className="md:col-span-2">
                          <FormLabel>Account Number</FormLabel>
                          <FormControl>
                            <Input 
                              {...field} 
                              placeholder="Your account number" 
                              className={focusedFieldAnimation()}
                              disabled={isSubmitting}
                            />
                          </FormControl>
                          <FormDescription>
                            Your account information is secure and encrypted
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <FormField
                    control={form.control}
                    name="additionalInfo"
                    render={({ field }) => (
                      <FormItem className="mt-6">
                        <FormLabel>Additional Information (Optional)</FormLabel>
                        <FormControl>
                          <Textarea 
                            {...field} 
                            placeholder="Any additional information that might be relevant to your application" 
                            disabled={isSubmitting}
                            className={`min-h-[100px] ${focusedFieldAnimation()}`}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                {/* Step 4: Review & Submit */}
                <div className={stepTransition(currentStep === 3)}>
                  <h3 className="text-lg font-semibold mb-4 text-finance-primary flex items-center">
                    <Check className="mr-2 h-5 w-5" />
                    Review Your Application
                  </h3>
                  
                  <div className="space-y-6">
                    <div className="bg-finance-light/30 p-4 rounded-lg">
                      <h4 className="font-medium text-finance-primary mb-2">Loan Details</h4>
                      <div className="grid grid-cols-2 gap-2 text-sm">
                        <div className="text-gray-600">Amount:</div>
                        <div className="font-medium">${form.watch("loanAmount").toLocaleString()}</div>
                        
                        <div className="text-gray-600">Purpose:</div>
                        <div className="font-medium">{form.watch("loanPurpose") || "Not specified"}</div>
                        
                        <div className="text-gray-600">Term:</div>
                        <div className="font-medium">{form.watch("loanTerm")} months</div>
                        
                        <div className="text-gray-600">Est. Monthly Payment:</div>
                        <div className="font-medium">${calculateMonthlyPayment()}</div>
                      </div>
                    </div>
                    
                    <div className="bg-finance-light/30 p-4 rounded-lg">
                      <h4 className="font-medium text-finance-primary mb-2">Employment Information</h4>
                      <div className="grid grid-cols-2 gap-2 text-sm">
                        <div className="text-gray-600">Status:</div>
                        <div className="font-medium capitalize">{form.watch("employmentStatus") || "Not specified"}</div>
                        
                        <div className="text-gray-600">Employer:</div>
                        <div className="font-medium">{form.watch("employer") || "Not specified"}</div>
                        
                        <div className="text-gray-600">Monthly Income:</div>
                        <div className="font-medium">${form.watch("monthlyIncome").toLocaleString()}</div>
                        
                        <div className="text-gray-600">Employment Duration:</div>
                        <div className="font-medium">
                          {employmentDurations.find(d => d.value === form.watch("employmentDuration"))?.label || "Not specified"}
                        </div>
                      </div>
                    </div>
                    
                    <div className="bg-finance-light/30 p-4 rounded-lg">
                      <h4 className="font-medium text-finance-primary mb-2">Banking Information</h4>
                      <div className="grid grid-cols-2 gap-2 text-sm">
                        <div className="text-gray-600">Bank:</div>
                        <div className="font-medium">{form.watch("bankName") || "Not specified"}</div>
                        
                        <div className="text-gray-600">Account Type:</div>
                        <div className="font-medium capitalize">{form.watch("accountType") || "Not specified"}</div>
                        
                        <div className="text-gray-600">Account Number:</div>
                        <div className="font-medium">
                          {form.watch("accountNumber") 
                            ? `****${form.watch("accountNumber").slice(-4)}` 
                            : "Not specified"}
                        </div>
                      </div>
                    </div>
                    
                    {form.watch("additionalInfo") && (
                      <div className="bg-finance-light/30 p-4 rounded-lg">
                        <h4 className="font-medium text-finance-primary mb-2">Additional Information</h4>
                        <p className="text-sm">{form.watch("additionalInfo")}</p>
                      </div>
                    )}
                  </div>
                </div>
              </form>
            </Form>
          </CardContent>
          <CardFooter className="flex justify-between border-t pt-6">
            <Button 
              type="button" 
              variant="outline" 
              onClick={prevStep}
              disabled={currentStep === 0 || isSubmitting}
              className="border-finance-primary text-finance-primary"
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Previous
            </Button>
            
            {currentStep < STEPS.length - 1 ? (
              <Button 
                type="button" 
                onClick={nextStep}
                disabled={getStepCompletion(currentStep) < 100 || isSubmitting}
                className="bg-finance-primary hover:bg-finance-primary/90"
              >
                Next
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            ) : (
              <Button 
                type="button" 
                onClick={form.handleSubmit(onSubmit)}
                disabled={isSubmitting}
                className="bg-finance-primary hover:bg-finance-primary/90"
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
          </CardFooter>
        </Card>

        <div className="mt-6 text-center text-sm text-gray-500">
          By submitting this application, you agree to our 
          <a href="#" className="text-finance-primary hover:underline mx-1">Terms of Service</a> 
          and 
          <a href="#" className="text-finance-primary hover:underline mx-1">Privacy Policy</a>
        </div>
      </div>
    </div>
  );
};

export default Apply;
