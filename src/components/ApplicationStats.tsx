
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { LoanApplication } from "@/types/application";

interface ApplicationStatsProps {
  applications: LoanApplication[];
  userId?: string;
  isAdmin?: boolean;
}

const ApplicationStats = ({ applications, userId, isAdmin = false }: ApplicationStatsProps) => {
  const getStatusCount = (status: string) => {
    // If admin, count all apps with that status
    // If regular user, only count their own
    if (isAdmin) {
      return applications.filter(app => app.status === status).length;
    }
    return applications.filter(app => app.user_id === userId && app.status === status).length;
  };
  
  const getTotalCount = () => {
    if (isAdmin) {
      return applications.length;
    }
    return applications.filter(app => app.user_id === userId).length;
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-lg font-medium">Total Applications</CardTitle>
          <CardDescription>
            {isAdmin ? "All submitted applications" : "Your submitted applications"}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold">
            {getTotalCount()}
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-lg font-medium">Pending Review</CardTitle>
          <CardDescription>Applications awaiting decision</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold text-amber-500">{getStatusCount("pending")}</div>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-lg font-medium">Approved</CardTitle>
          <CardDescription>Successfully approved applications</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold text-green-500">{getStatusCount("approved")}</div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ApplicationStats;
