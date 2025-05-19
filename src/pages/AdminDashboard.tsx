
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import ApplicationStats from "@/components/ApplicationStats";
import LoanCharts from "@/components/LoanCharts";
import DashboardHeader from "@/components/DashboardHeader";
import { useAuth } from "@/hooks/useAuth";
import { api } from "@/lib/api";
import { AdminDashboardHeader } from "@/components/admin/AdminDashboardHeader";
import { AdminTabsNavigation } from "@/components/admin/AdminTabsNavigation";
import { ApplicationsTab } from "@/components/admin/ApplicationsTab";
import { UsersTab } from "@/components/admin/UsersTab";
import { TransactionsTab } from "@/components/admin/TransactionsTab";
import { TabsContent } from "@/components/ui/tabs";

const AdminDashboard = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user, logout } = useAuth();
  const [applications, setApplications] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [users, setUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [activeTab, setActiveTab] = useState("applications");

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

        // Fetch all users
        const allUsers = await api.users.getAll();
        setUsers(allUsers);
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

  const refreshData = async () => {
    setIsLoading(true);
    try {
      // Fetch updated data
      const applicationsData = await api.applications.getAll();
      setApplications(applicationsData);
      
      const allTransactions = await api.transactions.getAll();
      setTransactions(allTransactions);

      const allUsers = await api.users.getAll();
      setUsers(allUsers);
      
      toast({
        title: "Data refreshed",
        description: "All information has been updated.",
      });
    } catch (error) {
      console.error("Refresh error:", error);
      toast({
        variant: "destructive",
        title: "Refresh failed",
        description: "There was a problem updating the information.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Search for user applications
  const searchUserApplications = (email: string) => {
    setSearchTerm(email);
    setActiveTab("applications");
  };

  if (!user || user.role !== "admin") {
    navigate("/dashboard");
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <DashboardHeader handleLogout={handleLogout} />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Dashboard Header */}
        <AdminDashboardHeader 
          refreshData={refreshData}
          isLoading={isLoading}
        />

        {/* Stats and Charts */}
        <ApplicationStats 
          applications={applications}
          isAdmin={true}
        />
        
        <LoanCharts 
          applications={applications}
          transactions={transactions}
          isAdmin={true}
        />

        {/* Admin Tabs Navigation */}
        <div className="mt-8">
          <AdminTabsNavigation
            activeTab={activeTab}
            setActiveTab={setActiveTab}
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
          >
            {/* Applications Tab Content */}
            <TabsContent value="applications">
              <ApplicationsTab 
                applications={applications}
                isLoading={isLoading}
                searchTerm={searchTerm}
                onRefresh={refreshData}
              />
            </TabsContent>

            {/* Users Tab Content */}
            <TabsContent value="users">
              <UsersTab 
                users={users}
                applications={applications}
                isLoading={isLoading}
                searchTerm={searchTerm}
                onSearchUserApplications={searchUserApplications}
              />
            </TabsContent>

            {/* Transactions Tab Content */}
            <TabsContent value="transactions">
              <TransactionsTab 
                transactions={transactions}
                users={users}
                isLoading={isLoading}
                searchTerm={searchTerm}
                refreshData={refreshData}
              />
            </TabsContent>
          </AdminTabsNavigation>
        </div>
      </main>
    </div>
  );
};

export default AdminDashboard;
