
import { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/components/ui/use-toast";
import { ArrowLeft, FileText, Download, Upload, PaperclipIcon, MessageSquare } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { api } from "@/lib/api";
import { formatDate, formatCurrency } from "@/lib/utils";
import { LoanApplication } from "@/types/application";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import DocumentUpload from "@/components/DocumentUpload";
import ApplicationNotes from "@/components/ApplicationNotes";
import ApplicationStatusBadge from "@/components/ApplicationStatusBadge";

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
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle>Application Not Found</CardTitle>
            <CardDescription>
              We couldn't find the application you're looking for.
            </CardDescription>
          </CardHeader>
          <CardFooter>
            <Button onClick={() => navigate("/dashboard")} className="w-full">
              Return to Dashboard
            </Button>
          </CardFooter>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-12">
      <header className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center py-4">
            <Button 
              variant="ghost" 
              size="sm" 
              className="mr-4"
              onClick={() => navigate("/dashboard")}
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back
            </Button>
            <h1 className="text-2xl font-bold">Application {application.application_number}</h1>
            <div className="ml-4">
              <ApplicationStatusBadge status={application.status} />
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main content - 2/3 width on large screens */}
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Loan Details</CardTitle>
                <CardDescription>Information about the requested loan</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h3 className="text-sm font-medium text-gray-500">Loan Amount</h3>
                    <p className="mt-1 text-lg font-semibold">{formatCurrency(application.loan_amount)}</p>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-gray-500">Loan Purpose</h3>
                    <p className="mt-1 text-lg">{application.loan_purpose}</p>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-gray-500">Loan Term</h3>
                    <p className="mt-1 text-lg">{application.loan_term} months</p>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-gray-500">Interest Rate</h3>
                    <p className="mt-1 text-lg">{application.interest_rate}%</p>
                  </div>
                </div>
                
                <Separator />
                
                <div>
                  <h3 className="text-sm font-medium text-gray-500 mb-3">Financial Information</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <h4 className="text-sm font-medium text-gray-500">Employment Status</h4>
                      <p className="mt-1">{application.employment_status}</p>
                    </div>
                    <div>
                      <h4 className="text-sm font-medium text-gray-500">Employer</h4>
                      <p className="mt-1">{application.employer}</p>
                    </div>
                    <div>
                      <h4 className="text-sm font-medium text-gray-500">Monthly Income</h4>
                      <p className="mt-1">{formatCurrency(application.monthly_income)}</p>
                    </div>
                    <div>
                      <h4 className="text-sm font-medium text-gray-500">Employment Duration</h4>
                      <p className="mt-1">{application.employment_duration} years</p>
                    </div>
                  </div>
                </div>
                
                <Separator />
                
                <div>
                  <h3 className="text-sm font-medium text-gray-500 mb-3">Banking Information</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <h4 className="text-sm font-medium text-gray-500">Bank Name</h4>
                      <p className="mt-1">{application.bank_name}</p>
                    </div>
                    <div>
                      <h4 className="text-sm font-medium text-gray-500">Account Type</h4>
                      <p className="mt-1">{application.account_type}</p>
                    </div>
                    <div>
                      <h4 className="text-sm font-medium text-gray-500">Account Number</h4>
                      <p className="mt-1">
                        {application.account_number.replace(/\d(?=\d{4})/g, "*")}
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Tabs defaultValue="documents">
              <TabsList className="mb-4">
                <TabsTrigger value="documents" className="flex items-center gap-1">
                  <FileText className="h-4 w-4" />
                  Documents
                </TabsTrigger>
                <TabsTrigger value="notes" className="flex items-center gap-1">
                  <MessageSquare className="h-4 w-4" />
                  Notes & History
                </TabsTrigger>
              </TabsList>
              
              <TabsContent value="documents">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Application Documents</CardTitle>
                    <CardDescription>
                      Upload and manage documents related to this application
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <DocumentUpload onUpload={handleDocumentUpload} documents={application.documents || []} />
                  </CardContent>
                </Card>
              </TabsContent>
              
              <TabsContent value="notes">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Notes & Application History</CardTitle>
                    <CardDescription>
                      View the history and add notes to this application
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ApplicationNotes 
                      notes={application.notes || []} 
                      statusHistory={application.status_history || []}
                      onAddNote={handleAddNote} 
                    />
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
          
          {/* Sidebar - 1/3 width on large screens */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Application Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h3 className="text-sm font-medium text-gray-500">Application Number</h3>
                  <p className="mt-1">{application.application_number}</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-500">Submission Date</h3>
                  <p className="mt-1">{formatDate(application.created_at)}</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-500">Last Updated</h3>
                  <p className="mt-1">{formatDate(application.updated_at)}</p>
                </div>
                <Separator />
                <div>
                  <h3 className="text-sm font-medium text-gray-500">Status</h3>
                  <div className="mt-2">
                    <ApplicationStatusBadge status={application.status} />
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Applicant Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h3 className="text-sm font-medium text-gray-500">Full Name</h3>
                  <p className="mt-1">{user?.full_name}</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-500">Email</h3>
                  <p className="mt-1">{user?.email}</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-500">Phone</h3>
                  <p className="mt-1">{user?.phone_number}</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-500">Address</h3>
                  <p className="mt-1">{user?.address}</p>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Need Help?</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-sm text-gray-500">
                  If you have questions about your application or need assistance, our support team is here to help.
                </p>
                <div className="flex flex-col space-y-2">
                  <Button variant="outline" className="w-full justify-start">
                    <MessageSquare className="mr-2 h-4 w-4" />
                    Contact Support
                  </Button>
                  <Button variant="outline" className="w-full justify-start">
                    <FileText className="mr-2 h-4 w-4" />
                    FAQs
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Application;
