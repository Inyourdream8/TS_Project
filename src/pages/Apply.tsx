
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
import { ArrowLeft, ArrowRight, DollarSign, Briefcase, Building, CreditCard } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { api } from "@/lib/api";

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
  const [isSubmitting, setIsSubmitting] = useState(false);

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
  });

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

  if (!user) {
    navigate("/login", { state: { returnTo: "/apply" } });
    return null;
  }

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
            <h1 className="text-3xl font-bold text-gray-900">Apply for a Loan</h1>
            <p className="text-gray-500 mt-1">Fill out the form below to submit your loan application</p>
          </div>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Loan Application Form</CardTitle>
            <CardDescription>
              Provide accurate information to help us process your application faster
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                <div>
                  <h3 className="text-lg font-semibold flex items-center mb-4">
                    <DollarSign className="mr-2 h-5 w-5 text-blue-600" />
                    Loan Details
                  </h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <FormField
                      control={form.control}
                      name="loanAmount"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Loan Amount</FormLabel>
                          <FormControl>
                            <div className="relative">
                              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">$</span>
                              <Input 
                                type="number" 
                                className="pl-8" 
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
                        <FormItem>
                          <FormLabel>Loan Term (Months)</FormLabel>
                          <FormControl>
                            <Input 
                              type="number" 
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
                            <SelectTrigger>
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
                </div>

                <Separator />

                <div>
                  <h3 className="text-lg font-semibold flex items-center mb-4">
                    <Briefcase className="mr-2 h-5 w-5 text-blue-600" />
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
                              <SelectTrigger>
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
                                className="pl-8" 
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
                              <SelectTrigger>
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

                <Separator />

                <div>
                  <h3 className="text-lg font-semibold flex items-center mb-4">
                    <Building className="mr-2 h-5 w-5 text-blue-600" />
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
                              <SelectTrigger>
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

                <Separator />

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

                <div className="flex justify-end">
                  <Button type="submit" className="w-full md:w-auto" disabled={isSubmitting}>
                    {isSubmitting ? (
                      <div className="flex items-center">
                        <span className="animate-spin h-4 w-4 mr-2 border-2 border-b-transparent border-white rounded-full"></span>
                        Submitting...
                      </div>
                    ) : (
                      <div className="flex items-center">
                        Submit Application
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </div>
                    )}
                  </Button>
                </div>
              </form>
            </Form>
          </CardContent>
        </Card>

        <div className="mt-6 text-center text-sm text-gray-500">
          By submitting this application, you agree to our 
          <a href="#" className="text-blue-600 hover:underline mx-1">Terms of Service</a> 
          and 
          <a href="#" className="text-blue-600 hover:underline mx-1">Privacy Policy</a>
        </div>
      </div>
    </div>
  );
};

export default Apply;
