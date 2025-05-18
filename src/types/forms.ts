
import { z } from "zod";

// Form validation schema
export const loanApplicationSchema = z.object({
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

export type LoanApplicationFormValues = z.infer<typeof loanApplicationSchema>;

// Define the transaction schema
export const transactionSchema = z.object({
  amount: z.coerce.number().positive("Amount must be positive"),
  transactionType: z.enum(["deposit", "withdrawal"]),
  description: z.string().min(3, "Description is required"),
});

// Define the OTP schema
export const otpSchema = z.object({
  otp: z.string().length(6, "OTP must be exactly 6 digits"),
});

// Define the status update schema
export const statusUpdateSchema = z.object({
  status: z.enum(["pending", "approved", "rejected", "disbursed", "closed", "defaulted"]),
  notes: z.string().min(3, "Notes are required"),
});

export type TransactionFormValues = z.infer<typeof transactionSchema>;
export type OtpFormValues = z.infer<typeof otpSchema>;
export type StatusUpdateFormValues = z.infer<typeof statusUpdateSchema>;
