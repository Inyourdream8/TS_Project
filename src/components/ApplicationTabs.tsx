
import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import ApplicationList from "@/components/ApplicationList";
import { LoanApplication } from "@/types/application";

export interface ApplicationTabsProps {
  applications: LoanApplication[];
  isLoading: boolean;
  isAdmin?: boolean;
  onView: (id: string) => void;
  onApprove?: (applicationId: string) => Promise<void>;
  onReject?: (applicationId: string) => Promise<void>;
  onDisburse?: (applicationId: string) => Promise<void>;
  onSelect?: (application: LoanApplication) => void;
}

export const ApplicationTabs = ({
  applications,
  isLoading,
  isAdmin = false,
  onView,
  onApprove,
  onReject,
  onDisburse,
  onSelect
}: ApplicationTabsProps) => {
  const [activeTab, setActiveTab] = useState("all");
  
  // Filter applications based on the active tab
  const filteredApplications = applications.filter(app => {
    if (activeTab === "all") return true;
    return app.status === activeTab;
  });
  
  const pendingApplications = applications.filter(app => app.status === "pending");
  const approvedApplications = applications.filter(app => app.status === "approved");
  const rejectedApplications = applications.filter(app => app.status === "rejected");
  const disbursedApplications = applications.filter(app => app.status === "disbursed");
  
  return (
    <Tabs defaultValue="all" onValueChange={setActiveTab}>
      <TabsList className="grid grid-cols-5 mb-4">
        <TabsTrigger value="all">
          All ({applications.length})
        </TabsTrigger>
        <TabsTrigger value="pending">
          Pending ({pendingApplications.length})
        </TabsTrigger>
        <TabsTrigger value="approved">
          Approved ({approvedApplications.length})
        </TabsTrigger>
        <TabsTrigger value="rejected">
          Rejected ({rejectedApplications.length})
        </TabsTrigger>
        <TabsTrigger value="disbursed">
          Disbursed ({disbursedApplications.length})
        </TabsTrigger>
      </TabsList>
      
      <TabsContent value="all">
        <ApplicationList 
          applications={applications} 
          isLoading={isLoading} 
          onView={onView} 
          isAdmin={isAdmin}
          onApprove={onApprove}
          onReject={onReject}
          onDisburse={onDisburse}
          onSelect={onSelect}
        />
      </TabsContent>
      
      <TabsContent value="pending">
        <ApplicationList 
          applications={pendingApplications} 
          isLoading={isLoading} 
          onView={onView}
          isAdmin={isAdmin}
          onApprove={onApprove}
          onReject={onReject}
          onDisburse={onDisburse}
          onSelect={onSelect}
        />
      </TabsContent>
      
      <TabsContent value="approved">
        <ApplicationList 
          applications={approvedApplications} 
          isLoading={isLoading} 
          onView={onView}
          isAdmin={isAdmin}
          onApprove={onApprove}
          onReject={onReject}
          onDisburse={onDisburse}
          onSelect={onSelect}
        />
      </TabsContent>
      
      <TabsContent value="rejected">
        <ApplicationList 
          applications={rejectedApplications} 
          isLoading={isLoading} 
          onView={onView}
          isAdmin={isAdmin}
          onApprove={onApprove}
          onReject={onReject}
          onDisburse={onDisburse}
          onSelect={onSelect}
        />
      </TabsContent>
      
      <TabsContent value="disbursed">
        <ApplicationList 
          applications={disbursedApplications} 
          isLoading={isLoading} 
          onView={onView}
          isAdmin={isAdmin}
          onApprove={onApprove}
          onReject={onReject}
          onDisburse={onDisburse}
          onSelect={onSelect}
        />
      </TabsContent>
    </Tabs>
  );
};
