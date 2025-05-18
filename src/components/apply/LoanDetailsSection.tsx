
import { FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { DollarSign } from "lucide-react";
import { UseFormReturn } from "react-hook-form";
import { focusedFieldAnimation } from "@/lib/animate";
import { LoanApplicationFormValues } from "@/types/forms";

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

interface LoanDetailsSectionProps {
  form: UseFormReturn<LoanApplicationFormValues>;
  isSubmitting: boolean;
}

export const LoanDetailsSection = ({ form, isSubmitting }: LoanDetailsSectionProps) => {
  // Calculate estimated monthly payment
  const calculateMonthlyPayment = () => {
    const amount = form.watch("loanAmount") || 0;
    const termMonths = parseInt(form.watch("loanTerm") || "12");
    const rate = 4.0 / 100 / 12; // Monthly interest rate (4% annual)
    
    if (amount <= 0 || termMonths <= 0) return 0;
    
    const monthlyPayment = (amount * rate * Math.pow(1 + rate, termMonths)) / (Math.pow(1 + rate, termMonths) - 1);
    return monthlyPayment.toFixed(2);
  };

  return (
    <div className="space-y-6">
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
  );
};
