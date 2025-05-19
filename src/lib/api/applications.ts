
import { LoanApplication, Document, Note, StatusHistory } from "@/types/application";
import { delay, calculateRepaymentSchedule } from "./utils";
import { mockUsers } from "./auth";

// Mock data for applications
export const mockApplications: LoanApplication[] = [
  {
    id: "app_1",
    user_id: "usr_1",
    application_number: "LW-20230101-1234",
    status: "pending",
    full_name: "John Doe",
    email: "john@example.com",
    phone_number: "+15551234567",
    address: "123 Main St, City, State, 12345",
    employment_status: "employed",
    employer: "Tech Corp Inc.",
    monthly_income: 5000,
    employment_duration: "3-5",
    bank_name: "First National Bank",
    account_number: "1234567890",
    account_type: "checking",
    loan_amount: 10000,
    loan_purpose: "Home renovation",
    loan_term: 24,
    interest_rate: 5.99,
    created_at: "2023-01-15T00:00:00Z",
    updated_at: "2023-01-15T00:00:00Z",
    documents: [
      {
        id: "doc_1",
        application_id: "app_1",
        document_type: "id",
        file_name: "drivers_license.pdf",
        file_url: "/documents/drivers_license.pdf",
        uploaded_at: "2023-01-15T12:30:00Z",
        created_at: "2023-01-15T12:30:00Z",
      },
      {
        id: "doc_2",
        application_id: "app_1",
        document_type: "income_proof",
        file_name: "pay_stub.pdf",
        file_url: "/documents/pay_stub.pdf",
        uploaded_at: "2023-01-15T12:35:00Z",
        created_at: "2023-01-15T12:35:00Z",
      },
    ],
    notes: [
      {
        id: "note_1",
        application_id: "app_1",
        content: "Applicant has excellent credit score.",
        created_at: "2023-01-16T10:00:00Z",
        created_by: "Loan Officer",
      },
    ],
    status_history: [
      {
        id: "stat_1",
        application_id: "app_1",
        status: "submitted",
        notes: "",
        created_at: "2023-01-15T00:00:00Z",
        created_by: "System",
      },
      {
        id: "stat_2",
        application_id: "app_1",
        status: "pending",
        notes: "Application under initial review",
        created_at: "2023-01-15T12:00:00Z",
        created_by: "Loan Officer",
      },
    ],
  },
  {
    id: "app_2",
    user_id: "usr_1",
    application_number: "LW-20230205-5678",
    status: "approved",
    full_name: "John Doe",
    email: "john@example.com",
    phone_number: "+15551234567",
    address: "123 Main St, City, State, 12345",
    employment_status: "employed",
    employer: "Tech Corp Inc.",
    monthly_income: 5000,
    employment_duration: "3-5",
    bank_name: "First National Bank",
    account_number: "1234567890",
    account_type: "checking",
    loan_amount: 5000,
    loan_purpose: "Debt consolidation",
    loan_term: 12,
    interest_rate: 4.99,
    created_at: "2023-02-05T00:00:00Z",
    updated_at: "2023-02-10T00:00:00Z",
    documents: [],
    notes: [],
    status_history: [
      {
        id: "stat_3",
        application_id: "app_2",
        status: "submitted",
        notes: "",
        created_at: "2023-02-05T00:00:00Z",
        created_by: "System",
      },
      {
        id: "stat_4",
        application_id: "app_2",
        status: "pending",
        notes: "",
        created_at: "2023-02-06T00:00:00Z",
        created_by: "System",
      },
      {
        id: "stat_5",
        application_id: "app_2",
        status: "approved",
        notes: "Application approved with standard terms",
        created_at: "2023-02-10T00:00:00Z",
        created_by: "Loan Officer",
      },
    ],
  },
  {
    id: "app_3",
    user_id: "usr_1",
    application_number: "LW-20230310-9012",
    status: "rejected",
    full_name: "John Doe",
    email: "john@example.com",
    phone_number: "+15551234567",
    address: "123 Main St, City, State, 12345",
    employment_status: "employed",
    employer: "Tech Corp Inc.",
    monthly_income: 5000,
    employment_duration: "3-5",
    bank_name: "First National Bank",
    account_number: "1234567890",
    account_type: "checking",
    loan_amount: 25000,
    loan_purpose: "Business expansion",
    loan_term: 36,
    interest_rate: 6.99,
    created_at: "2023-03-10T00:00:00Z",
    updated_at: "2023-03-15T00:00:00Z",
    documents: [],
    notes: [],
    status_history: [],
  },
];

// Application endpoints
export const applicationsApi = {
  getAll: async () => {
    // Simulate API call
    await delay(800);
    return mockApplications;
  },
  
  getById: async (id: string) => {
    // Simulate API call
    await delay(500);
    
    const application = mockApplications.find(app => app.id === id);
    if (!application) {
      throw new Error("Application not found");
    }
    
    return application;
  },
  
  create: async (applicationData: any) => {
    // Simulate API call
    await delay(1500);
    
    const applicationNumber = `LW-${new Date().toISOString().slice(0, 10).replace(/-/g, '')}-${Math.floor(1000 + Math.random() * 9000)}`;
    
    const newApplication: LoanApplication = {
      id: `app_${mockApplications.length + 1}`,
      user_id: applicationData.user_id,
      application_number: applicationNumber,
      status: "pending" as const,
      full_name: applicationData.full_name || "",
      email: applicationData.email || "",
      phone_number: applicationData.phone_number || "",
      address: applicationData.address || "",
      employment_status: applicationData.employment_status,
      employer: applicationData.employer,
      monthly_income: applicationData.monthly_income,
      employment_duration: applicationData.employment_duration,
      bank_name: applicationData.bank_name,
      account_number: applicationData.account_number,
      account_type: applicationData.account_type,
      loan_amount: applicationData.loan_amount,
      loan_purpose: applicationData.loan_purpose,
      loan_term: applicationData.loan_term,
      interest_rate: 4.99, // Default interest rate
      additional_info: applicationData.additional_info,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      documents: [],
      notes: [],
      status_history: [
        {
          id: `stat_${new Date().getTime()}`,
          application_id: `app_${mockApplications.length + 1}`,
          status: "pending",
          notes: "",
          created_at: new Date().toISOString(),
          created_by: "System",
        },
      ],
    };
    
    mockApplications.push(newApplication);
    
    return newApplication;
  },
  
  updateStatus: async (id: string, status: "pending" | "approved" | "rejected" | "disbursed" | "closed" | "defaulted", notes?: string) => {
    // Simulate API call
    await delay(1000);
    
    const application = mockApplications.find(app => app.id === id);
    if (!application) {
      throw new Error("Application not found");
    }
    
    application.status = status;
    application.updated_at = new Date().toISOString();
    
    // Add to status history
    if (!application.status_history) {
      application.status_history = [];
    }
    
    const newStatusHistory: StatusHistory = {
      id: `stat_${new Date().getTime()}`,
      application_id: id,
      status: status,
      notes: notes || "",
      created_at: new Date().toISOString(),
      created_by: "Loan Officer",
    };
    
    application.status_history.push(newStatusHistory);
    
    return application;
  },
  
  addNote: async (id: string, noteContent: string) => {
    // Simulate API call
    await delay(800);
    
    const application = mockApplications.find(app => app.id === id);
    if (!application) {
      throw new Error("Application not found");
    }
    
    if (!application.notes) {
      application.notes = [];
    }
    
    const newNote: Note = {
      id: `note_${new Date().getTime()}`,
      application_id: id,
      content: noteContent,
      created_at: new Date().toISOString(),
      created_by: "You",
    };
    
    application.notes.push(newNote);
    application.updated_at = new Date().toISOString();
    
    return newNote;
  },
  
  getRepaymentSchedule: async (id: string) => {
    await delay(800);
    
    const application = mockApplications.find(app => app.id === id);
    if (!application) {
      throw new Error("Application not found");
    }
    
    return calculateRepaymentSchedule(
      application.loan_amount,
      application.interest_rate,
      application.loan_term
    );
  },
};
