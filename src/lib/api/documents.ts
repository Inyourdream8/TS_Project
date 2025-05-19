
import { Document } from "@/types/application";
import { delay } from "./utils";
import { mockApplications } from "./applications";

// Document endpoints
export const documentsApi = {
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
};
