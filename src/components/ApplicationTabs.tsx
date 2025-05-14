
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import ApplicationList from "@/components/ApplicationList";
import { LoanApplication } from "@/types/application";

interface ApplicationTabsProps {
  applications: LoanApplication[];
  isLoading: boolean;
  userId: string;
  onView: (id: string) => void;
}

const ApplicationTabs = ({ applications, isLoading, userId, onView }: ApplicationTabsProps) => {
  const userApplications = applications.filter(app => app.user_id === userId);
  
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
          applications={userApplications} 
          isLoading={isLoading} 
          onView={onView}
        />
      </TabsContent>
      
      <TabsContent value="pending">
        <ApplicationList 
          applications={userApplications.filter(app => app.status === "pending")} 
          isLoading={isLoading} 
          onView={onView}
        />
      </TabsContent>
      
      <TabsContent value="approved">
        <ApplicationList 
          applications={userApplications.filter(app => app.status === "approved")} 
          isLoading={isLoading} 
          onView={onView}
        />
      </TabsContent>
      
      <TabsContent value="rejected">
        <ApplicationList 
          applications={userApplications.filter(app => app.status === "rejected")} 
          isLoading={isLoading} 
          onView={onView}
        />
      </TabsContent>
    </Tabs>
  );
};

export default ApplicationTabs;
