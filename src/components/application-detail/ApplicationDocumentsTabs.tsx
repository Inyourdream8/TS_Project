
import { FileText, MessageSquare } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import DocumentUpload from "@/components/DocumentUpload";
import { ApplicationNotes } from "@/components/ApplicationNotes";
import { Document, LoanApplication, Note, StatusHistory } from "@/types/application";

interface ApplicationDocumentsTabsProps {
  applicationId: string;
  documents: Document[];
  notes: Note[];
  statusHistory: StatusHistory[];
  onDocumentUpload: (file: File, documentType: string) => Promise<void>;
  onAddNote: (note: string) => Promise<void>;
}

export const ApplicationDocumentsTabs = ({
  applicationId,
  documents,
  notes,
  statusHistory,
  onDocumentUpload,
  onAddNote
}: ApplicationDocumentsTabsProps) => {
  return (
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
            <DocumentUpload 
              onUpload={onDocumentUpload} 
              existingFiles={documents} 
            />
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
              applicationId={applicationId}
              notes={notes} 
              onNoteAdded={() => {}} 
            />
          </CardContent>
        </Card>
      </TabsContent>
    </Tabs>
  );
};
