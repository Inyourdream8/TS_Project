
import { FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Building } from "lucide-react";
import { UseFormReturn } from "react-hook-form";
import { focusedFieldAnimation } from "@/lib/animate";
import { LoanApplicationFormValues } from "@/types/forms";

const accountTypes = ["checking", "savings"];

interface BankingSectionProps {
  form: UseFormReturn<LoanApplicationFormValues>;
  isSubmitting: boolean;
}

export const BankingSection = ({ form, isSubmitting }: BankingSectionProps) => {
  return (
    <div className="space-y-6">
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
  );
};
