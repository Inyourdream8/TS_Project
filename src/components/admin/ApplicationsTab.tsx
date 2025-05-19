
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ApplicationTabs } from "@/components/ApplicationTabs";
import { ApplicationActions } from "@/components/admin/ApplicationActions";
import { LoanApplication } from "@/types/application";
import { useNavigate } from "react-router-dom";

interface ApplicationsTabProps {
  applications: LoanApplication[];
  isLoading: boolean;
  searchTerm: string;
  onRefresh: () => Promise<void>;
}

export function ApplicationsTab({
  applications,
  isLoading,
  searchTerm,
  onRefresh
}: ApplicationsTabProps) {
  const navigate = useNavigate();
  const [selectedApplication, setSelectedApplication] = useState<LoanApplication | null>(null);
  
  // Filter applications based on search term
  const filteredApplications = applications.filter((app) => {
    const searchTermLower = searchTerm.toLowerCase();
    return (
      app.application_number?.toLowerCase().includes(searchTermLower) ||
      app.full_name?.toLowerCase().includes(searchTermLower) ||
      app.email?.toLowerCase().includes(searchTermLower) ||
      app.phone_number?.includes(searchTerm) ||
      app.status?.toLowerCase().includes(searchTermLower)
    );
  });

  const handleDeleteApplication = async (applicationId: string) => {
    // Remove it from the state (in a real app, this would call an API)
    setSelectedApplication(null);
    // Refresh the data
    await onRefresh();
  };

  return (
    <Card className="border rounded-lg bg-white shadow">
      <CardHeader className="pb-3">
        <CardTitle>Loan Applications</CardTitle>
        <CardDescription>
          Manage and review all loan applications
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ApplicationTabs 
          applications={filteredApplications}
          isLoading={isLoading}
          isAdmin={true}
          onView={(id) => {
            navigate(`/application/${id}`);
            setSelectedApplication(applications.find(app => app.id === id) || null);
          }}
          onSelect={(application) => setSelectedApplication(application)}
        />

        {/* Application Action Buttons */}
        <ApplicationActions 
          selectedApplication={selectedApplication}
          onUpdateStatus={onRefresh}
          onDeleteApplication={handleDeleteApplication}
        />
      </CardContent>
    </Card>
  );
}
