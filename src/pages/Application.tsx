
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";
import { api } from "@/lib/api";
import { LoanApplication } from "@/types/application";

// Import our new components
import { ApplicationHeader } from "@/components/application-detail/ApplicationHeader";
import { LoanDetailsCard } from "@/components/application-detail/LoanDetailsCard";
import { ApplicationSummaryCard } from "@/components/application-detail/ApplicationSummaryCard";
import { ApplicantInfoCard } from "@/components/application-detail/ApplicantInfoCard";
import { SupportCard } from "@/components/application-detail/SupportCard";
import { ApplicationDocumentsTabs } from "@/components/application-detail/ApplicationDocumentsTabs";

const Application = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user } = useAuth();
  const [application, setApplication] = useState<LoanApplication | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchApplication = async () => {
      if (!id) return;
      
      try {
        const data = await api.getApplicationById(id);
        setApplication(data);
      } catch (error) {
        console.error("Error fetching application:", error);
        toast({
          variant: "destructive",
          title: "Error fetching application",
          description: "There was a problem loading the application details.",
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchApplication();
  }, [id, toast]);

  const handleAddNote = async (note: string) => {
    if (!id) return;
    
    try {
      await api.addNoteToApplication(id, note);
      
      // Refresh application data
      const updatedApplication = await api.getApplicationById(id);
      setApplication(updatedApplication);
      
      toast({
        title: "Note added",
        description: "Your note has been added successfully.",
      });
    } catch (error) {
      console.error("Error adding note:", error);
      toast({
        variant: "destructive",
        title: "Error adding note",
        description: "There was a problem adding your note. Please try again.",
      });
    }
  };

  const handleDocumentUpload = async (file: File, documentType: string) => {
    if (!id) return;
    
    try {
      await api.uploadDocument(id, file, documentType);
      
      // Refresh application data
      const updatedApplication = await api.getApplicationById(id);
      setApplication(updatedApplication);
      
      toast({
        title: "Document uploaded",
        description: "Your document has been uploaded successfully.",
      });
    } catch (error) {
      console.error("Error uploading document:", error);
      toast({
        variant: "destructive",
        title: "Error uploading document",
        description: "There was a problem uploading your document. Please try again.",
      });
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-lg text-gray-600">Loading application details...</p>
        </div>
      </div>
    );
  }

  if (!application) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-2">Application Not Found</h2>
          <p className="mb-4">We couldn't find the application you're looking for.</p>
          <button 
            className="bg-blue-600 text-white px-4 py-2 rounded"
            onClick={() => navigate("/dashboard")}
          >
            Return to Dashboard
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-12">
      <ApplicationHeader application={application} />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main content - 2/3 width on large screens */}
          <div className="lg:col-span-2 space-y-6">
            <LoanDetailsCard application={application} />

            <ApplicationDocumentsTabs
              applicationId={application.id}
              documents={application.documents || []}
              notes={application.notes || []}
              statusHistory={application.status_history || []}
              onDocumentUpload={handleDocumentUpload}
              onAddNote={handleAddNote}
            />
          </div>
          
          {/* Sidebar - 1/3 width on large screens */}
          <div className="space-y-6">
            <ApplicationSummaryCard application={application} />
            <ApplicantInfoCard user={user} />
            <SupportCard />
          </div>
        </div>
      </main>
    </div>
  );
};

export default Application;
