
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";
import ApplicationList from "@/components/ApplicationList";
import { LoanApplication } from "@/types/application";
import { formatDate } from "@/lib/utils";

interface DashboardGridProps {
  transactions: any[];
  applications: LoanApplication[];
  isLoading: boolean;
  userId?: string;
}

const DashboardGrid = ({ transactions, applications, isLoading, userId }: DashboardGridProps) => {
  const navigate = useNavigate();
  
  const userApplications = userId 
    ? applications.filter(app => app.user_id === userId)
    : applications;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
      <Card>
        <CardHeader>
          <CardTitle className="text-lg font-medium">Recent Transactions</CardTitle>
          <CardDescription>Your recent financial activity</CardDescription>
        </CardHeader>
        <CardContent>
          {transactions.length > 0 ? (
            <div className="space-y-4 max-h-96 overflow-auto">
              {transactions.map((transaction) => (
                <div key={transaction.id} className="flex items-center justify-between py-2 border-b">
                  <div>
                    <p className="font-medium">{transaction.description}</p>
                    <p className="text-sm text-gray-500">
                      {new Date(transaction.created_at).toLocaleDateString()}
                    </p>
                  </div>
                  <div className={`font-semibold ${
                    transaction.type === "withdrawal" ? "text-red-500" : "text-green-500"
                  }`}>
                    {transaction.type === "withdrawal" ? "-" : "+"}${transaction.amount.toLocaleString()}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <p className="text-gray-500">No transactions yet</p>
            </div>
          )}
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle className="text-lg font-medium">Your Applications</CardTitle>
          <CardDescription>Status of your loan applications</CardDescription>
        </CardHeader>
        <CardContent>
          <ApplicationList 
            applications={userApplications} 
            isLoading={isLoading} 
            onView={(id) => navigate(`/application/${id}`)}
            compact
          />
        </CardContent>
      </Card>
    </div>
  );
};

export default DashboardGrid;
