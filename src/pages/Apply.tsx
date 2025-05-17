
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
import { ArrowLeft, ArrowRight, DollarSign, Briefcase, Building, CreditCard, Check, ChevronRight, FileText, User, Calendar } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { api } from "@/lib/api";
import StepWizard from "@/components/StepWizard";
import { focusedFieldAnimation, stepTransition } from "@/lib/animate";
import DocumentUpload from "@/components/DocumentUpload";

// Step titles
const STEPS = ["Personal Information", "Employment", "Loan Details", "Banking", "Documents"];

// Data constants
const employmentStatuses = [
  "Employee",
  "Unemployed",
  "Retired",
  "Self Employed"
];

const employmentDurations = [
  { value: "less-than-1", label: "Less than 1 year" },
  { value: "1-3", label: "1-3 years" },
  { value: "3-5", label: "3-5 years" },
  { value: "5-10", label: "5-10 years" },
  { value: "more-than-10", label: "More than 10 years" },
];

const loanTerms = [
  { value: "6", label: "6 months" },
  { value: "12", label: "12 months" },
  { value: "24", label: "24 months" },
  { value: "36", label: "36 months" },
  { value: "48", label: "48 months" },
];

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

const accountTypes = ["checking", "savings"];

// Form validation schema
const loanApplicationSchema = z.object({
  // Personal Information
  fullName: z.string().min(3, "Full name must be at least 3 characters"),
  nationalId: z.string().min(5, "National ID must be at least 5 characters"),
  phoneNumber: z.string().min(10, "Phone number must be at least 10 characters"),
  address: z.string().min(5, "Address must be at least 5 characters"),
  email: z.string().email("Please enter a valid email address"),
  
  // Employment Information
  employmentStatus: z.string().min(1, "Please select your employment status"),
  employer: z.string().optional().refine(val => {
    // Employer is required if employment status is "Employee"
    return val && val.length > 0;
  }, { message: "Employer name is required" }),
  employmentDuration: z.string().min(1, "Please select your employment duration"),
  monthlyIncome: z.coerce.number()
    .min(5000, "Monthly income must be at least PHP 5,000"),
  
  // Loan Details
  loanAmount: z.coerce.number()
    .min(100000, "Loan amount must be at least PHP 100,000")
    .max(3000000, "Loan amount cannot exceed PHP 3,000,000"),
  loanTerm: z.string().min(1, "Please select a loan term"),
  loanPurpose: z.string().min(1, "Please select a loan purpose"),
  
  // Banking Details
  bankName: z.string().min(1, "Please provide your bank name"),
  accountName: z.string().min(3, "Account name must be at least 3 characters"),
  accountNumber: z.string().min(8, "Please provide a valid account number"),
  accountType: z.string().min(1, "Please select your account type"),
  
  // Documents section has file upload, handled separately
  additionalInfo: z.string().optional(),
});

type LoanApplicationFormValues = z.infer<typeof loanApplicationSchema>;

const Apply = () => {
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
  const handleFileUpload = (files: File[]) => {
    setDocuments(files);
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
          // This should be implemented in your API
          await Promise.all(documents.map(file => 
            api.documents.upload(newApplication.id, file, "proof_of_income")
          ));
        } catch (docError) {
          console.error("Error uploading documents:", docError);
          toast({
            variant: "warning",
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

  // Check if user is logged in
  if (!user) {
    navigate("/login", { state: { returnTo: "/apply" } });
    return null;
  }

  // Calculate estimated monthly payment
  const calculateMonthlyPayment = () => {
    const amount = form.watch("loanAmount") || 0;
    const termMonths = parseInt(form.watch("loanTerm") || "12");
    const rate = 4.0 / 100 / 12; // Monthly interest rate (4% annual)
    
    if (amount <= 0 || termMonths <= 0) return 0;
    
    const monthlyPayment = (amount * rate * Math.pow(1 + rate, termMonths)) / (Math.pow(1 + rate, termMonths) - 1);
    return monthlyPayment.toFixed(2);
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
        <div className="mb-8 flex items-center">
          <Button 
            variant="ghost" 
            size="sm" 
            className="mr-4"
            onClick={() => navigate("/dashboard")}
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
          <div>
            <h1 className="text-3xl font-bold">Loan Application</h1>
            <p className="text-gray-600 mt-1">Complete all steps to submit your loan application</p>
          </div>
        </div>

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
                  <h3 className="text-lg font-semibold flex items-center mb-4">
                    <User className="mr-2 h-5 w-5" />
                    Personal Information
                  </h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <FormField
                      control={form.control}
                      name="fullName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Full Name</FormLabel>
                          <FormControl>
                            <Input 
                              {...field} 
                              placeholder="Enter your full name" 
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
                      name="nationalId"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>National ID</FormLabel>
                          <FormControl>
                            <Input 
                              {...field} 
                              placeholder="Enter your National ID number" 
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
                      name="phoneNumber"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Phone Number</FormLabel>
                          <FormControl>
                            <Input 
                              {...field} 
                              placeholder="+639XXXXXXXXX" 
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
                      name="email"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Email</FormLabel>
                          <FormControl>
                            <Input 
                              {...field} 
                              type="email"
                              placeholder="your.email@example.com" 
                              className={focusedFieldAnimation()}
                              disabled={isSubmitting}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  
                  <FormField
                    control={form.control}
                    name="address"
                    render={({ field }) => (
                      <FormItem className="mt-6">
                        <FormLabel>Address</FormLabel>
                        <FormControl>
                          <Textarea 
                            {...field} 
                            placeholder="Enter your complete address" 
                            className={`min-h-[80px] ${focusedFieldAnimation()}`}
                            disabled={isSubmitting}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                {/* Step 2: Employment Information */}
                <div className={stepTransition(currentStep === 1)}>
                  <h3 className="text-lg font-semibold flex items-center mb-4">
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
                                    {status}
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

                    {form.watch("employmentStatus") === "Employee" && (
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
                    )}
                    
                    <FormField
                      control={form.control}
                      name="monthlyIncome"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Monthly Income (PHP)</FormLabel>
                          <FormControl>
                            <div className="relative">
                              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">₱</span>
                              <Input 
                                type="number" 
                                className={`pl-8 ${focusedFieldAnimation()}`}
                                {...field} 
                                disabled={isSubmitting}
                              />
                            </div>
                          </FormControl>
                          <FormDescription>
                            Minimum monthly income: PHP 5,000
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </div>

                {/* Step 3: Loan Details */}
                <div className={stepTransition(currentStep === 2)}>
                  <h3 className="text-lg font-semibold flex items-center mb-4">
                    <DollarSign className="mr-2 h-5 w-5" />
                    Loan Details
                  </h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <FormField
                      control={form.control}
                      name="loanAmount"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Desired Loan Amount (PHP)</FormLabel>
                          <FormControl>
                            <div className="relative">
                              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">₱</span>
                              <Input 
                                type="number" 
                                className={`pl-8 ${focusedFieldAnimation()}`}
                                {...field} 
                                disabled={isSubmitting}
                              />
                            </div>
                          </FormControl>
                          <FormDescription>
                            Amount between PHP 100,000 and PHP 3,000,000
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="loanTerm"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Loan Term</FormLabel>
                          <FormControl>
                            <Select 
                              onValueChange={field.onChange} 
                              defaultValue={field.value}
                              disabled={isSubmitting}
                            >
                              <SelectTrigger className={focusedFieldAnimation()}>
                                <SelectValue placeholder="Select loan term" />
                              </SelectTrigger>
                              <SelectContent>
                                {loanTerms.map((term) => (
                                  <SelectItem key={term.value} value={term.value}>
                                    {term.label}
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
                      name="loanPurpose"
                      render={({ field }) => (
                        <FormItem>
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
                    
                    <FormItem>
                      <FormLabel>Interest Rate</FormLabel>
                      <div className="relative">
                        <Input 
                          value="4.0%" 
                          disabled 
                          className="bg-gray-50"
                        />
                      </div>
                      <FormDescription>
                        Fixed interest rate
                      </FormDescription>
                    </FormItem>
                  </div>

                  {/* Payment Estimate Card */}
                  {form.watch("loanAmount") >= 100000 && form.watch("loanTerm") && (
                    <div className="mt-8 p-4 bg-gray-50 rounded-lg border border-gray-200">
                      <h3 className="text-lg font-semibold text-gray-800 mb-2">
                        Estimated Monthly Payment
                      </h3>
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm text-gray-600">
                            Based on {loanTerms.find(t => t.value === form.watch("loanTerm"))?.label || form.watch("loanTerm") + " months"} at 4% APR
                          </p>
                        </div>
                        <div className="text-2xl font-bold text-blue-600">
                          ₱{new Intl.NumberFormat('en-PH').format(parseFloat(calculateMonthlyPayment()))}
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {/* Step 4: Banking Information */}
                <div className={stepTransition(currentStep === 3)}>
                  <h3 className="text-lg font-semibold flex items-center mb-4">
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
                      name="accountName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Account Name</FormLabel>
                          <FormControl>
                            <Input 
                              {...field} 
                              placeholder="Name on the account" 
                              className={focusedFieldAnimation()}
                              disabled={isSubmitting}
                            />
                          </FormControl>
                          <FormDescription>
                            Enter the name exactly as it appears on your bank account
                          </FormDescription>
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
                        <FormItem>
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
                </div>

                {/* Step 5: Documents */}
                <div className={stepTransition(currentStep === 4)}>
                  <h3 className="text-lg font-semibold flex items-center mb-4">
                    <FileText className="mr-2 h-5 w-5" />
                    Required Documents
                  </h3>
                  
                  <div className="space-y-6">
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <h4 className="font-medium mb-2">Proof of Income</h4>
                      <p className="text-sm text-gray-600 mb-4">
                        Please upload at least one document that proves your income (e.g., pay slips, tax returns, bank statements)
                      </p>
                      
                      <DocumentUpload 
                        onUpload={handleFileUpload}
                        existingFiles={[]}
                        maxFiles={3}
                        acceptedTypes={["image/jpeg", "image/png", "application/pdf"]}
                        maxSizeInMB={5}
                      />
                      
                      {documents.length === 0 && (
                        <p className="text-red-500 text-sm mt-2">
                          At least one proof of income document is required
                        </p>
                      )}
                    </div>
                    
                    <FormField
                      control={form.control}
                      name="additionalInfo"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Additional Information (Optional)</FormLabel>
                          <FormControl>
                            <Textarea 
                              {...field} 
                              placeholder="Any additional information that might be relevant to your application" 
                              disabled={isSubmitting}
                              className="min-h-[100px]"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
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
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Previous
            </Button>
            
            {currentStep < STEPS.length - 1 ? (
              <Button 
                type="button" 
                onClick={nextStep}
                disabled={getStepCompletion(currentStep) < 100 || isSubmitting}
              >
                Next
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            ) : (
              <Button 
                type="button" 
                onClick={form.handleSubmit(onSubmit)}
                disabled={getStepCompletion(currentStep) < 100 || isSubmitting}
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
      </div>
    </div>
  );
};

export default Apply;
