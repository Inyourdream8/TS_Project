
import { User } from "@/types/user";
import { LoanApplication, Document, Note, StatusHistory } from "@/types/application";

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
  {
    id: "usr_2",
    email: "admin@example.com",
    full_name: "Admin User",
    phone_number: "+15559876543",
    address: "456 Admin St, City, State, 12345",
    date_of_birth: "1985-01-01",
    role: "admin",
    created_at: "2023-01-01T00:00:00Z",
    updated_at: "2023-01-01T00:00:00Z",
  }
];

// Mock data for applications
const mockApplications: LoanApplication[] = [
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

// Mock data for transactions
const mockTransactions = [
  {
    id: "txn_1",
    user_id: "usr_1",
    loan_id: "app_2",
    type: "withdrawal",
    amount: 5000,
    description: "Loan withdrawal",
    status: "completed",
    created_at: "2023-02-15T10:30:00Z",
  },
  {
    id: "txn_2",
    user_id: "usr_1",
    loan_id: "app_2",
    type: "repayment",
    amount: 450.25,
    description: "Monthly payment",
    status: "completed",
    created_at: "2023-03-15T14:20:00Z",
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

// Calculate loan repayment schedule
const calculateRepaymentSchedule = (loanAmount: number, interestRate: number, termMonths: number) => {
  const monthlyRate = interestRate / 100 / 12;
  const monthlyPayment = loanAmount * monthlyRate * Math.pow(1 + monthlyRate, termMonths) / (Math.pow(1 + monthlyRate, termMonths) - 1);
  
  const schedule = [];
  let remainingBalance = loanAmount;
  
  for (let month = 1; month <= termMonths; month++) {
    const interestPayment = remainingBalance * monthlyRate;
    const principalPayment = monthlyPayment - interestPayment;
    remainingBalance -= principalPayment;
    
    schedule.push({
      paymentNumber: month,
      paymentDate: new Date(Date.now() + month * 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      paymentAmount: monthlyPayment.toFixed(2),
      principalAmount: principalPayment.toFixed(2),
      interestAmount: interestPayment.toFixed(2),
      remainingBalance: remainingBalance > 0 ? remainingBalance.toFixed(2) : 0,
    });
  }
  
  return schedule;
};

// API methods organized by resource
export const api = {
  // Auth endpoints
  auth: {
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
        role: userData.role || "applicant",
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
  },
  
  // User endpoints
  users: {
    getAll: async () => {
      await delay(800);
      return mockUsers;
    },
    
    getById: async (id: string) => {
      await delay(500);
      const user = mockUsers.find(u => u.id === id);
      if (!user) {
        throw new Error("User not found");
      }
      return user;
    },
    
    update: async (id: string, userData: Partial<User>) => {
      await delay(1000);
      const userIndex = mockUsers.findIndex(u => u.id === id);
      if (userIndex === -1) {
        throw new Error("User not found");
      }
      
      mockUsers[userIndex] = {
        ...mockUsers[userIndex],
        ...userData,
        updated_at: new Date().toISOString(),
      };
      
      return mockUsers[userIndex];
    },
    
    delete: async (id: string) => {
      await delay(1000);
      const userIndex = mockUsers.findIndex(u => u.id === id);
      if (userIndex === -1) {
        throw new Error("User not found");
      }
      
      mockUsers.splice(userIndex, 1);
      return { success: true };
    },
  },
  
  // Loan application endpoints
  applications: {
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
  },
  
  // Document endpoints
  documents: {
    upload: async (applicationId: string, file: File, documentType: string) => {
      // Simulate API call
      await delay(2000);
      
      const application = mockApplications.find(app => app.id === applicationId);
      if (!application) {
        throw new Error("Application not found");
      }
      
      if (!application.documents) {
        application.documents = [];
      }
      
      const newDocument: Document = {
        id: `doc_${new Date().getTime()}`,
        application_id: applicationId,
        document_type: documentType,
        file_name: file.name,
        file_url: URL.createObjectURL(file), // In a real app, this would be a server URL
        uploaded_at: new Date().toISOString(),
        created_at: new Date().toISOString(),
      };
      
      application.documents.push(newDocument);
      application.updated_at = new Date().toISOString();
      
      return newDocument;
    },
    
    getById: async (id: string) => {
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
  },
  
  // Transaction endpoints
  transactions: {
    getByUserId: async (userId: string) => {
      await delay(800);
      return mockTransactions.filter(t => t.user_id === userId);
    },
    
    getByLoanId: async (loanId: string) => {
      await delay(800);
      return mockTransactions.filter(t => t.loan_id === loanId);
    },
    
    create: async (transactionData: any) => {
      await delay(1000);
      
      const newTransaction = {
        id: `txn_${mockTransactions.length + 1}`,
        user_id: transactionData.user_id,
        loan_id: transactionData.loan_id,
        type: transactionData.type,
        amount: transactionData.amount,
        description: transactionData.description,
        status: "completed",
        created_at: new Date().toISOString(),
      };
      
      mockTransactions.push(newTransaction);
      return newTransaction;
    },
    
    getAll: async () => {
      await delay(800);
      return mockTransactions;
    },
  },
  
  // For backward compatibility
  getApplications: async () => {
    return api.applications.getAll();
  },
  
  getApplicationById: async (id: string) => {
    return api.applications.getById(id);
  },
  
  createLoanApplication: async (applicationData: any) => {
    return api.applications.create(applicationData);
  },
  
  updateApplicationStatus: async (id: string, status: "pending" | "approved" | "rejected" | "disbursed" | "closed" | "defaulted", notes?: string) => {
    return api.applications.updateStatus(id, status, notes);
  },
  
  addNoteToApplication: async (id: string, note: string) => {
    return api.applications.addNote(id, note);
  },
  
  uploadDocument: async (applicationId: string, file: File, documentType: string) => {
    return api.documents.upload(applicationId, file, documentType);
  },
  
  getDocument: async (id: string) => {
    return api.documents.getById(id);
  },
  
  login: async (email: string, password: string) => {
    return api.auth.login(email, password);
  },
  
  register: async (userData: any) => {
    return api.auth.register(userData);
  },
  
  getCurrentUser: async () => {
    return api.auth.getCurrentUser();
  },
};
