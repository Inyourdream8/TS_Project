
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import ApplicationList from "@/components/ApplicationList";
import { LoanApplication } from "@/types/application";

interface ApplicationTabsProps {
  applications: LoanApplication[];
  isLoading: boolean;
  userId?: string;
  isAdmin?: boolean;
  onView: (id: string) => void;
  onApprove?: (id: string) => void;
  onReject?: (id: string) => void;
}

const ApplicationTabs = ({ 
  applications, 
  isLoading, 
  userId, 
  isAdmin, 
  onView,
  onApprove,
  onReject 
}: ApplicationTabsProps) => {
  // Filter applications based on user role
  const filteredApplications = isAdmin 
    ? applications 
    : applications.filter(app => app.user_id === userId);
  
  return (
    <Tabs defaultValue="all" className="w-full">
      <TabsList className="mb-6">
        <TabsTrigger value="all">All Applications</TabsTrigger>
        <TabsTrigger value="pending">Pending</TabsTrigger>
        <TabsTrigger value="approved">Approved</TabsTrigger>
        <TabsTrigger value="rejected">Rejected</TabsTrigger>
      </TabsList>
      
      <TabsContent value="all">
        <ApplicationList 
          applications={filteredApplications} 
          isLoading={isLoading} 
          onView={onView}
          onApprove={onApprove}
          onReject={onReject}
          isAdmin={isAdmin}
        />
      </TabsContent>
      
      <TabsContent value="pending">
        <ApplicationList 
          applications={filteredApplications.filter(app => app.status === "pending")} 
          isLoading={isLoading} 
          onView={onView}
          onApprove={onApprove}
          onReject={onReject}
          isAdmin={isAdmin}
        />
      </TabsContent>
      
      <TabsContent value="approved">
        <ApplicationList 
          applications={filteredApplications.filter(app => app.status === "approved")} 
          isLoading={isLoading} 
          onView={onView}
          onApprove={onApprove}
          onReject={onReject}
          isAdmin={isAdmin}
        />
      </TabsContent>
      
      <TabsContent value="rejected">
        <ApplicationList 
          applications={filteredApplications.filter(app => app.status === "rejected")} 
          isLoading={isLoading} 
          onView={onView}
          onApprove={onApprove}
          onReject={onReject}
          isAdmin={isAdmin}
        />
      </TabsContent>
    </Tabs>
  );
};

export default ApplicationTabs;
