
import { authApi } from "./auth";
import { usersApi } from "./users";
import { applicationsApi } from "./applications";
import { documentsApi } from "./documents";
import { transactionsApi } from "./transactions";

// Combined API object
export const api = {
  auth: authApi,
  users: usersApi,
  applications: applicationsApi,
  documents: documentsApi,
  transactions: transactionsApi,
  
  // For backward compatibility
  getApplications: async () => {
    return applicationsApi.getAll();
  },
  
  getApplicationById: async (id: string) => {
    return applicationsApi.getById(id);
  },
  
  createLoanApplication: async (applicationData: any) => {
    return applicationsApi.create(applicationData);
  },
  
  updateApplicationStatus: async (id: string, status: "pending" | "approved" | "rejected" | "disbursed" | "closed" | "defaulted", notes?: string) => {
    return applicationsApi.updateStatus(id, status, notes);
  },
  
  addNoteToApplication: async (id: string, note: string) => {
    return applicationsApi.addNote(id, note);
  },
  
  uploadDocument: async (applicationId: string, file: File, documentType: string) => {
    return documentsApi.upload(applicationId, file, documentType);
  },
  
  getDocument: async (id: string) => {
    return documentsApi.getById(id);
  },
  
  login: async (email: string, password: string) => {
    return authApi.login(email, password);
  },
  
  register: async (userData: any) => {
    return authApi.register(userData);
  },
  
  getCurrentUser: async () => {
    return authApi.getCurrentUser();
  },
};

export default api;
