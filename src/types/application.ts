
export interface LoanApplication {
  id: string;
  user_id: string;
  application_number: string;
  status: "pending" | "approved" | "rejected" | "disbursed" | "closed" | "defaulted";
  
  // Personal Information
  full_name: string;
  national_id?: string;
  phone_number: string;
  address: string;
  email: string;
  
  // Employment Information
  employment_status: string;
  employer: string;
  monthly_income: number;
  employment_duration: string;
  
  // Loan Details
  loan_amount: number;
  loan_purpose: string;
  loan_term: number;
  interest_rate: number;
  
  // Banking Details
  bank_name: string;
  account_name?: string;
  account_number: string;
  account_type: string;
  
  // Additional Information
  additional_info?: string;
  
  // Timestamps
  created_at: string;
  updated_at: string;
}
