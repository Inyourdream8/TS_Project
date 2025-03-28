
import { User } from "@/types/user";
import { LoanApplication } from "@/types/application";

// Mock data for users
const mockUsers: User[] = [
  {
    id: "usr_1",
    email: "john@example.com",
    full_name: "John Doe",
    phone_number: "+15551234567",
    address: "123 Main St, City, State, 12345",
    date_of_birth: "1990-01-01",
    role: "applicant",
    created_at: "2023-01-01T00:00:00Z",
    updated_at: "2023-01-01T00:00:00Z",
  },
];

// Mock data for applications
const mockApplications: LoanApplication[] = [
  {
    id: "app_1",
    user_id: "usr_1",
    application_number: "LW-20230101-1234",
    status: "pending",
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
        created_at: "2023-01-15T12:30:00Z",
      },
      {
        id: "doc_2",
        application_id: "app_1",
        document_type: "income_proof",
        file_name: "pay_stub.pdf",
        file_url: "/documents/pay_stub.pdf",
        created_at: "2023-01-15T12:35:00Z",
      },
    ],
    notes: [
      {
        id: "note_1",
        application_id: "app_1",
        note: "Applicant has excellent credit score.",
        created_at: "2023-01-16T10:00:00Z",
        created_by: "Loan Officer",
      },
    ],
    status_history: [
      {
        id: "stat_1",
        application_id: "app_1",
        status: "submitted",
        created_at: "2023-01-15T00:00:00Z",
      },
      {
        id: "stat_2",
        application_id: "app_1",
        status: "pending",
        notes: "Application under initial review",
        created_at: "2023-01-15T12:00:00Z",
      },
    ],
  },
  {
    id: "app_2",
    user_id: "usr_1",
    application_number: "LW-20230205-5678",
    status: "approved",
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
        created_at: "2023-02-05T00:00:00Z",
      },
      {
        id: "stat_4",
        application_id: "app_2",
        status: "pending",
        created_at: "2023-02-06T00:00:00Z",
      },
      {
        id: "stat_5",
        application_id: "app_2",
        status: "approved",
        notes: "Application approved with standard terms",
        created_at: "2023-02-10T00:00:00Z",
      },
    ],
  },
  {
    id: "app_3",
    user_id: "usr_1",
    application_number: "LW-20230310-9012",
    status: "rejected",
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

// Helper function to simulate API delay
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// Helper to get headers with auth token
const getAuthHeaders = () => {
  const token = localStorage.getItem("auth_token");
  return {
    "Content-Type": "application/json",
    "Authorization": token ? `Bearer ${token}` : "",
  };
};

// API methods
export const api = {
  // Auth endpoints
  login: async (email: string, password: string) => {
    // Simulate API call
    await delay(1000);
    
    const user = mockUsers.find(u => u.email === email);
    if (!user) {
      throw new Error("Invalid credentials");
    }
    
    // In a real app, you'd verify the password here
    return {
      user,
      token: "mock_jwt_token",
    };
  },
  
  register: async (userData: any) => {
    // Simulate API call
    await delay(1000);
    
    const newUser: User = {
      id: `usr_${mockUsers.length + 1}`,
      email: userData.email,
      full_name: userData.full_name,
      phone_number: userData.phone_number,
      address: userData.address,
      date_of_birth: userData.date_of_birth,
      role: userData.role,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };
    
    mockUsers.push(newUser);
    
    return {
      user: newUser,
      token: "mock_jwt_token",
    };
  },
  
  getCurrentUser: async () => {
    // Simulate API call
    await delay(500);
    
    // In a real app, you'd verify the JWT token and return the user
    return mockUsers[0];
  },
  
  // Loan application endpoints
  getApplications: async () => {
    // Simulate API call
    await delay(800);
    
    return mockApplications;
  },
  
  getApplicationById: async (id: string) => {
    // Simulate API call
    await delay(500);
    
    const application = mockApplications.find(app => app.id === id);
    if (!application) {
      throw new Error("Application not found");
    }
    
    return application;
  },
  
  createLoanApplication: async (applicationData: any) => {
    // Simulate API call
    await delay(1500);
    
    const newApplication: LoanApplication = {
      id: `app_${mockApplications.length + 1}`,
      user_id: applicationData.user_id,
      application_number: applicationData.application_number,
      status: applicationData.status,
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
      interest_rate: applicationData.interest_rate,
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
          created_at: new Date().toISOString(),
        },
      ],
    };
    
    mockApplications.push(newApplication);
    
    return newApplication;
  },
  
  updateApplicationStatus: async (id: string, status: string, notes?: string) => {
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
    
    application.status_history.push({
      id: `stat_${new Date().getTime()}`,
      application_id: id,
      status: status,
      notes: notes,
      created_at: new Date().toISOString(),
    });
    
    return application;
  },
  
  addNoteToApplication: async (id: string, note: string) => {
    // Simulate API call
    await delay(800);
    
    const application = mockApplications.find(app => app.id === id);
    if (!application) {
      throw new Error("Application not found");
    }
    
    if (!application.notes) {
      application.notes = [];
    }
    
    const newNote = {
      id: `note_${new Date().getTime()}`,
      application_id: id,
      note: note,
      created_at: new Date().toISOString(),
      created_by: "You",
    };
    
    application.notes.push(newNote);
    application.updated_at = new Date().toISOString();
    
    return newNote;
  },
  
  // Document endpoints
  uploadDocument: async (applicationId: string, file: File, documentType: string) => {
    // Simulate API call
    await delay(2000);
    
    const application = mockApplications.find(app => app.id === applicationId);
    if (!application) {
      throw new Error("Application not found");
    }
    
    if (!application.documents) {
      application.documents = [];
    }
    
    const newDocument = {
      id: `doc_${new Date().getTime()}`,
      application_id: applicationId,
      document_type: documentType,
      file_name: file.name,
      file_url: URL.createObjectURL(file), // In a real app, this would be a server URL
      created_at: new Date().toISOString(),
    };
    
    application.documents.push(newDocument);
    application.updated_at = new Date().toISOString();
    
    return newDocument;
  },
  
  getDocument: async (id: string) => {
    // Simulate API call
    await delay(500);
    
    for (const app of mockApplications) {
      if (app.documents) {
        const document = app.documents.find(doc => doc.id === id);
        if (document) {
          return document;
        }
      }
    }
    
    throw new Error("Document not found");
  },
};
