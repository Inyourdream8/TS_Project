
import { FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Briefcase } from "lucide-react";
import { UseFormReturn } from "react-hook-form";
import { focusedFieldAnimation } from "@/lib/animate";
import { LoanApplicationFormValues } from "@/types/forms";

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

interface EmploymentSectionProps {
  form: UseFormReturn<LoanApplicationFormValues>;
  isSubmitting: boolean;
}

export const EmploymentSection = ({ form, isSubmitting }: EmploymentSectionProps) => {
  return (
    <div className="space-y-6">
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
  );
};
