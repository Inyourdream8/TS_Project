
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { api } from "@/lib/api";
import { LoanApplication } from "@/types/application";
import { 
  Tabs, TabsContent, TabsList, TabsTrigger 
} from "@/components/ui/tabs";
import {
  Card, CardContent, CardDescription, CardHeader, CardTitle
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { 
  FileText, Users, CreditCard, Search, RefreshCcw
} from "lucide-react";

import DashboardHeader from "@/components/DashboardHeader";
import ApplicationStats from "@/components/ApplicationStats";
import ApplicationTabs from "@/components/ApplicationTabs";
import LoanCharts from "@/components/LoanCharts";
import { ApplicationActions } from "@/components/admin/ApplicationActions";
import { UserManagement } from "@/components/admin/UserManagement";
import { TransactionsTable } from "@/components/admin/TransactionsTable";

const AdminDashboard = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user, logout } = useAuth();
  const [applications, setApplications] = useState<LoanApplication[]>([]);
  const [transactions, setTransactions] = useState<any[]>([]);
  const [users, setUsers] = useState<any[]>([]);
  const [selectedApplication, setSelectedApplication] = useState<LoanApplication | null>(null);
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
      await api.applications.updateStatus(applicationId, "approved", "Application approved by administrator");
      toast({
        title: "Application approved",
        description: "The loan application has been approved successfully.",
      });
      
      // Refresh applications after approval
      await refreshData();
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
      await api.applications.updateStatus(applicationId, "rejected", "Application rejected by administrator");
      toast({
        title: "Application rejected",
        description: "The loan application has been rejected.",
      });
      
      // Refresh applications after rejection
      await refreshData();
    } catch (error) {
      console.error("Rejection error:", error);
      toast({
        variant: "destructive",
        title: "Rejection failed",
        description: "There was a problem rejecting the application. Please try again.",
      });
    }
  };

  const handleDeleteApplication = async (applicationId: string) => {
    try {
      // This is a mock implementation - in production, you might want to soft delete or archive
      // await api.applications.delete(applicationId);
      
      // For now, we'll just remove it from the state
      setApplications(apps => apps.filter(app => app.id !== applicationId));
      setSelectedApplication(null);
      
      toast({
        title: "Application deleted",
        description: "The loan application has been deleted.",
      });
    } catch (error) {
      console.error("Delete error:", error);
      toast({
        variant: "destructive",
        title: "Delete failed",
        description: "There was a problem deleting the application.",
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

  // Get application count for a user
  const getApplicationCount = (userId: string) => {
    return applications.filter(app => app.user_id === userId).length;
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
          <Tabs defaultValue="applications" value={activeTab} onValueChange={setActiveTab}>
            <div className="flex items-center justify-between mb-4">
              <TabsList>
                <TabsTrigger value="applications" className="flex items-center gap-1">
                  <FileText className="h-4 w-4" />
                  Applications
                </TabsTrigger>
                <TabsTrigger value="users" className="flex items-center gap-1">
                  <Users className="h-4 w-4" />
                  Users
                </TabsTrigger>
                <TabsTrigger value="transactions" className="flex items-center gap-1">
                  <CreditCard className="h-4 w-4" />
                  Transactions
                </TabsTrigger>
              </TabsList>
              
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder={`Search ${activeTab}...`}
                  className="pl-9 w-[300px]"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>

            {/* Applications Tab Content */}
            <TabsContent value="applications" className="border rounded-lg bg-white shadow">
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
                  onApprove={handleApprove}
                  onReject={handleReject}
                  onSelect={(app) => setSelectedApplication(app)}
                />

                {/* Application Action Buttons */}
                <ApplicationActions 
                  selectedApplication={selectedApplication}
                  onUpdateStatus={refreshData}
                  onDeleteApplication={handleDeleteApplication}
                />
              </CardContent>
            </TabsContent>

            {/* Users Tab Content */}
            <TabsContent value="users" className="border rounded-lg bg-white shadow">
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
                  onSearchUserApplications={searchUserApplications}
                />
              </CardContent>
            </TabsContent>

            {/* Transactions Tab Content */}
            <TabsContent value="transactions" className="border rounded-lg bg-white shadow">
              <CardHeader className="pb-3">
                <CardTitle>Transactions</CardTitle>
                <CardDescription>
                  View and manage all financial transactions
                </CardDescription>
              </CardHeader>
              <CardContent>
                <TransactionsTable 
                  transactions={transactions}
                  users={users}
                  isLoading={isLoading}
                  searchTerm={searchTerm}
                  refreshData={refreshData}
                />
              </CardContent>
            </TabsContent>
          </Tabs>
        </div>
      </main>
    </div>
  );
};

export default AdminDashboard;
