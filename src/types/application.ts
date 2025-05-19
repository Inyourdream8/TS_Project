
export interface Note {
  id: string;
  content: string;
  created_at: string;
  created_by: string;
  application_id?: string;
}

export interface StatusHistory {
  id: string;
  status: string;
  notes: string;
  created_at: string;
  created_by: string;
  application_id?: string;
}

export interface Document {
  id: string;
  file_name: string;
  file_url: string;
  document_type: string;
  uploaded_at: string;
  created_at?: string;
  application_id?: string;
}

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
  
  // Related data
  documents?: Document[];
  notes?: Note[];
  status_history?: StatusHistory[];
  
  // Timestamps
  created_at: string;
  updated_at: string;
}
