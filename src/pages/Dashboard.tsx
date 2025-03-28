
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/components/ui/use-toast";
import { PlusCircle, FileText, User, LogOut } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { api } from "@/lib/api";
import { formatDate } from "@/lib/utils";
import ApplicationList from "@/components/ApplicationList";
import { LoanApplication } from "@/types/application";

const Dashboard = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user, logout } = useAuth();
  const [applications, setApplications] = useState<LoanApplication[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchApplications = async () => {
      try {
        const data = await api.getApplications();
        setApplications(data);
      } catch (error) {
        console.error("Error fetching applications:", error);
        toast({
          variant: "destructive",
          title: "Error fetching applications",
          description: "There was a problem loading your applications.",
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchApplications();
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

  const getStatusCount = (status: string) => {
    return applications.filter(app => app.status === status).length;
  };

  if (!user) {
    navigate("/login");
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center">
              <h1 className="text-2xl font-bold text-blue-600">LoanAPI Zenith</h1>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-500">Hello, {user.full_name}</span>
              <Button 
                variant="ghost" 
                size="sm" 
                className="flex items-center gap-2"
                onClick={handleLogout}
              >
                <LogOut className="h-4 w-4" />
                Logout
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
          <div>
            <h2 className="text-3xl font-bold text-gray-900">Dashboard</h2>
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

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg font-medium">Total Applications</CardTitle>
              <CardDescription>All applications submitted</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{applications.length}</div>
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

        <Tabs defaultValue="all" className="w-full">
          <TabsList className="mb-6">
            <TabsTrigger value="all">All Applications</TabsTrigger>
            <TabsTrigger value="pending">Pending</TabsTrigger>
            <TabsTrigger value="approved">Approved</TabsTrigger>
            <TabsTrigger value="rejected">Rejected</TabsTrigger>
          </TabsList>
          
          <TabsContent value="all">
            <ApplicationList 
              applications={applications} 
              isLoading={isLoading} 
              onView={(id) => navigate(`/application/${id}`)}
            />
          </TabsContent>
          
          <TabsContent value="pending">
            <ApplicationList 
              applications={applications.filter(app => app.status === "pending")} 
              isLoading={isLoading} 
              onView={(id) => navigate(`/application/${id}`)}
            />
          </TabsContent>
          
          <TabsContent value="approved">
            <ApplicationList 
              applications={applications.filter(app => app.status === "approved")} 
              isLoading={isLoading} 
              onView={(id) => navigate(`/application/${id}`)}
            />
          </TabsContent>
          
          <TabsContent value="rejected">
            <ApplicationList 
              applications={applications.filter(app => app.status === "rejected")} 
              isLoading={isLoading} 
              onView={(id) => navigate(`/application/${id}`)}
            />
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};

export default Dashboard;
