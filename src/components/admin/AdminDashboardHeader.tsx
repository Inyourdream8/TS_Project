
import { Button } from "@/components/ui/button";
import { RefreshCcw } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface AdminDashboardHeaderProps {
  refreshData: () => Promise<void>;
  isLoading: boolean;
}

export function AdminDashboardHeader({ refreshData, isLoading }: AdminDashboardHeaderProps) {
  const navigate = useNavigate();
  
  return (
    <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
      <div>
        <h2 className="text-3xl font-bold text-gray-900">Admin Dashboard</h2>
        <p className="text-gray-500">Manage loan applications, users, and transactions</p>
      </div>
      <div className="mt-4 md:mt-0 space-x-2">
        <Button 
          variant="outline"
          className="flex items-center gap-1"
          onClick={refreshData}
          disabled={isLoading}
        >
          <RefreshCcw className="h-4 w-4" />
          Refresh Data
        </Button>
        <Button 
          variant="outline"
          onClick={() => navigate("/admin/reports")}
        >
          View Reports
        </Button>
      </div>
    </div>
  );
}
