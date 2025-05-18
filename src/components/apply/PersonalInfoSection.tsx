
import { z } from "zod";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { User } from "lucide-react";
import { UseFormReturn } from "react-hook-form";
import { focusedFieldAnimation } from "@/lib/animate";
import { LoanApplicationFormValues } from "@/types/forms";

interface PersonalInfoSectionProps {
  form: UseFormReturn<LoanApplicationFormValues>;
  isSubmitting: boolean;
}

export const PersonalInfoSection = ({ form, isSubmitting }: PersonalInfoSectionProps) => {
  return (
    <div className="space-y-6">
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
  );
};
