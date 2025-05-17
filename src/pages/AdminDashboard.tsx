
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { api } from "@/lib/api";
import { LoanApplication } from "@/types/application";
import DashboardHeader from "@/components/DashboardHeader";
import ApplicationStats from "@/components/ApplicationStats";
import ApplicationTabs from "@/components/ApplicationTabs";
import LoanCharts from "@/components/LoanCharts";

const AdminDashboard = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user, logout } = useAuth();
  const [applications, setApplications] = useState<LoanApplication[]>([]);
  const [transactions, setTransactions] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        // Fetch all applications for admin
        const applicationsData = await api.applications.getAll();
        setApplications(applicationsData);
        
        // Fetch all transactions
        const allTransactions = await api.transactions.getAll();
        setTransactions(allTransactions);
      } catch (error) {
        console.error("Error fetching data:", error);
        toast({
          variant: "destructive",
          title: "Error loading data",
          description: "There was a problem loading the information.",
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [toast]);

  const handleLogout = async () => {
    try {
      await logout();
      navigate("/login");
    } catch (error) {
      console.error("Logout error:", error);
      toast({
        variant: "destructive",
        title: "Logout failed",
        description: "There was a problem logging you out. Please try again.",
      });
    }
  };

  const handleApprove = async (applicationId: string) => {
    try {
      await api.applications.approve(applicationId);
      toast({
        title: "Application approved",
        description: "The loan application has been approved successfully.",
      });
      
      // Refresh applications after approval
      const updatedApplications = await api.applications.getAll();
      setApplications(updatedApplications);
    } catch (error) {
      console.error("Approval error:", error);
      toast({
        variant: "destructive",
        title: "Approval failed",
        description: "There was a problem approving the application. Please try again.",
      });
    }
  };

  const handleReject = async (applicationId: string) => {
    try {
      await api.applications.reject(applicationId);
      toast({
        title: "Application rejected",
        description: "The loan application has been rejected.",
      });
      
      // Refresh applications after rejection
      const updatedApplications = await api.applications.getAll();
      setApplications(updatedApplications);
    } catch (error) {
      console.error("Rejection error:", error);
      toast({
        variant: "destructive",
        title: "Rejection failed",
        description: "There was a problem rejecting the application. Please try again.",
      });
    }
  };

  if (!user || user.role !== "admin") {
    navigate("/dashboard");
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <DashboardHeader handleLogout={handleLogout} />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
          <div>
            <h2 className="text-3xl font-bold text-gray-900">Admin Dashboard</h2>
            <p className="text-gray-500">Manage all loan applications and user accounts</p>
          </div>
          <div className="mt-4 md:mt-0 space-x-2">
            <Button 
              variant="outline"
              onClick={() => navigate("/admin/users")}
            >
              Manage Users
            </Button>
            <Button 
              variant="outline"
              onClick={() => navigate("/admin/reports")}
            >
              View Reports
            </Button>
          </div>
        </div>

        <ApplicationStats 
          applications={applications}
          isAdmin={true}
        />
        
        <LoanCharts 
          applications={applications}
          transactions={transactions}
          isAdmin={true}
        />

        <div className="mt-6 bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-medium mb-4">All Loan Applications</h3>
          <ApplicationTabs 
            applications={applications}
            isLoading={isLoading}
            isAdmin={true}
            onView={(id) => navigate(`/application/${id}`)}
            onApprove={handleApprove}
            onReject={handleReject}
          />
        </div>
      </main>
    </div>
  );
};

export default AdminDashboard;
