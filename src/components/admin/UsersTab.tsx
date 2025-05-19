
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { UserManagement } from "@/components/admin/UserManagement";
import { User } from "@/types/user";
import { LoanApplication } from "@/types/application";

interface UsersTabProps {
  users: User[];
  applications: LoanApplication[];
  isLoading: boolean;
  searchTerm: string;
  onSearchUserApplications: (email: string) => void;
}

export function UsersTab({
  users,
  applications,
  isLoading,
  searchTerm,
  onSearchUserApplications
}: UsersTabProps) {
  
  // Get application count for a user
  const getApplicationCount = (userId: string) => {
    return applications.filter(app => app.user_id === userId).length;
  };

  return (
    <Card className="border rounded-lg bg-white shadow">
      <CardHeader className="pb-3">
        <CardTitle>User Management</CardTitle>
        <CardDescription>
          View and manage registered users
        </CardDescription>
      </CardHeader>
      <CardContent>
        <UserManagement 
          users={users}
          isLoading={isLoading}
          searchTerm={searchTerm}
          applicationCount={getApplicationCount}
          onSearchUserApplications={onSearchUserApplications}
        />
      </CardContent>
    </Card>
  );
}
