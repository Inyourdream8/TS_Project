
import { useState } from "react";
import { useFormContext } from "react-hook-form";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { formatCurrency } from "@/lib/utils";

const loanTermOptions = [
  { value: "6", label: "6 months" },
  { value: "12", label: "12 months" },
  { value: "18", label: "18 months" },
  { value: "24", label: "24 months" },
  { value: "36", label: "36 months" },
  { value: "48", label: "48 months" },
];

const purposeOptions = [
  { value: "personal", label: "Personal Use" },
  { value: "business", label: "Business" },
  { value: "education", label: "Education" },
  { value: "debt_consolidation", label: "Debt Consolidation" },
  { value: "home_improvement", label: "Home Improvement" },
  { value: "emergency", label: "Emergency" },
  { value: "other", label: "Other" },
];

export const LoanDetailsSection = () => {
  const { control } = useFormContext();
  const [sliderValue, setSliderValue] = useState<number>(100000);

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Loan Details</h2>
      <p className="text-gray-500">
        Please provide information about the loan you're requesting
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <FormField
          control={control}
          name="loan_amount"
          render={({ field }) => (
            <FormItem className="col-span-full">
              <FormLabel>Loan Amount</FormLabel>
              <div className="space-y-4">
                <div className="flex justify-between text-sm">
                  <span>₱100,000</span>
                  <span>₱3,000,000</span>
                </div>
                <Slider
                  defaultValue={[sliderValue]}
                  min={100000}
                  max={3000000}
                  step={50000}
                  onValueChange={(value) => {
                    setSliderValue(value[0]);
                    field.onChange(value[0]);
                  }}
                  className="my-4"
                />
                <div className="bg-gray-100 p-4 rounded-md text-center">
                  <span className="text-sm text-gray-500">Selected amount:</span>
                  <div className="text-2xl font-bold text-blue-600">
                    {formatCurrency(sliderValue)}
                  </div>
                </div>
              </div>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={control}
          name="loan_term"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Loan Term</FormLabel>
              <Select
                onValueChange={(value) => field.onChange(parseInt(value))}
                defaultValue={field.value?.toString() || ""}
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select loan term" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {loanTermOptions.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={control}
          name="interest_rate"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Interest Rate (%)</FormLabel>
              <FormControl>
                <Input type="number" step="0.1" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={control}
          name="loan_purpose"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Loan Purpose</FormLabel>
              <Select
                onValueChange={field.onChange}
                defaultValue={field.value}
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select purpose" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {purposeOptions.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={control}
          name="additional_info"
          render={({ field }) => (
            <FormItem className="col-span-full">
              <FormLabel>Additional Information (optional)</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Provide any additional details about your loan request"
                  className="resize-none h-32"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
    </div>
  );
};
