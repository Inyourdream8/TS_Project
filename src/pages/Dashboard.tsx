import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import DashboardHeader from "@/components/DashboardHeader";
import DashboardGrid from "@/components/DashboardGrid";
import { ApplicationTabs } from "@/components/ApplicationTabs";
import ActiveLoan from "@/components/ActiveLoan";
import { useAuth } from "@/hooks/useAuth";
import { api } from "@/lib/api";
import { LoanApplication } from "@/types/application";
import { Loader, PlusCircle } from "lucide-react";
import ApplicationStats from "@/components/ApplicationStats";
import LoanCharts from "@/components/LoanCharts";

const Dashboard = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user, logout } = useAuth();
  const [applications, setApplications] = useState<LoanApplication[]>([]);
  const [transactions, setTransactions] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeApplication, setActiveApplication] = useState<LoanApplication | null>(null);
  const [repaymentSchedule, setRepaymentSchedule] = useState<any[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        
        if (user) {
          // For regular users, only fetch their own applications
          if (user.role === "admin") {
            navigate("/admin/dashboard");
            return;
          }
          
          const applicationsData = await api.applications.getAll();
          const userApplications = applicationsData.filter(app => app.user_id === user.id);
          setApplications(userApplications);
          
          const userTransactions = await api.transactions.getByUserId(user.id);
          setTransactions(userTransactions);
          
          // Get the most recent approved application for the user
          const approvedApp = userApplications.find(app => app.status === "approved");
          
          if (approvedApp) {
            setActiveApplication(approvedApp);
            const schedule = await api.applications.getRepaymentSchedule(approvedApp.id);
            setRepaymentSchedule(schedule);
          }
        }
      } catch (error) {
        console.error("Error fetching data:", error);
        toast({
          variant: "destructive",
          title: "Error loading data",
          description: "There was a problem loading your information.",
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [toast, user, navigate]);

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
  
  const handleWithdraw = async (loanId: string) => {
    if (!user) return;
    
    try {
      const application = applications.find(app => app.id === loanId);
      if (!application) return;
      
      await api.transactions.create({
        user_id: user.id,
        loan_id: loanId,
        type: "withdrawal",
        amount: application.loan_amount,
        description: "Loan funds withdrawal"
      });
      
      toast({
        title: "Withdrawal successful",
        description: `$${application.loan_amount.toLocaleString()} has been withdrawn from your loan.`,
      });
      
      // Refresh transactions
      const updatedTransactions = await api.transactions.getByUserId(user.id);
      setTransactions(updatedTransactions);
    } catch (error) {
      console.error("Withdrawal error:", error);
      toast({
        variant: "destructive",
        title: "Withdrawal failed",
        description: "There was a problem processing your withdrawal. Please try again.",
      });
    }
  };

  if (!user) {
    navigate("/login");
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <DashboardHeader handleLogout={handleLogout} />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
          <div>
            <h2 className="text-3xl font-bold text-gray-900">My Dashboard</h2>
            <p className="text-gray-500">Manage your loan applications and account</p>
          </div>
          <Button 
            className="mt-4 md:mt-0 flex items-center gap-2"
            onClick={() => navigate("/apply")}
          >
            <PlusCircle className="h-4 w-4" />
            New Application
          </Button>
        </div>

        {activeApplication && (
          <ActiveLoan 
            activeApplication={activeApplication}
            repaymentSchedule={repaymentSchedule}
            handleWithdraw={handleWithdraw}
            transactions={transactions}
          />
        )}

        <ApplicationStats 
          applications={applications}
        />
        
        <LoanCharts 
          applications={applications}
          transactions={transactions}
        />

        <DashboardGrid 
          transactions={transactions}
          applications={applications}
          isLoading={isLoading}
        />

        <ApplicationTabs 
          applications={applications.filter(app => app.user_id === user.id)}
          isLoading={isLoading}
          onView={(id) => navigate(`/application/${id}`)}
        />
      </main>
    </div>
  );
};

export default Dashboard;
