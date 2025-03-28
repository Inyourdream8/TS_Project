
export interface LoanApplication {
  id: string;
  user_id: string;
  application_number: string;
  status: string;
  employment_status: string;
  employer: string;
  monthly_income: number;
  employment_duration: string;
  bank_name: string;
  account_number: string;
  account_type: string;
  loan_amount: number;
  loan_purpose: string;
  loan_term: number;
  interest_rate: number;
  additional_info?: string;
  created_at: string;
  updated_at: string;
  documents?: Document[];
  notes?: Note[];
  status_history?: StatusHistory[];
}

export interface Document {
  id: string;
  application_id: string;
  document_type: string;
  file_name: string;
  file_url: string;
  created_at: string;
  created_by?: string;
}

export interface Note {
  id: string;
  application_id: string;
  note: string;
  created_at: string;
  created_by?: string;
}

export interface StatusHistory {
  id: string;
  application_id: string;
  status: string;
  notes?: string;
  created_at: string;
  created_by?: string;
}
