
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/components/ui/use-toast";
import { PlusCircle, FileText, User, LogOut, Wallet } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { api } from "@/lib/api";
import { formatDate } from "@/lib/utils";
import ApplicationList from "@/components/ApplicationList";
import { LoanApplication } from "@/types/application";
import { Progress } from "@/components/ui/progress";

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
        const applicationsData = await api.applications.getAll();
        setApplications(applicationsData);
        
        if (user) {
          const userTransactions = await api.transactions.getByUserId(user.id);
          setTransactions(userTransactions);
          
          // Get the most recent approved application for the user
          const userApps = applicationsData.filter(app => app.user_id === user.id);
          const approvedApp = userApps.find(app => app.status === "approved");
          
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
  }, [toast, user]);

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
    return applications.filter(app => app.user_id === user?.id && app.status === status).length;
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

  const getLoanProgressStage = (status: string) => {
    switch (status) {
      case "pending":
        return 33;
      case "approved":
        return 66;
      case "withdrawn":
        return 100;
      case "rejected":
        return 0;
      default:
        return 0;
    }
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

        {activeApplication && (
          <div className="mb-8">
            <h3 className="text-xl font-semibold mb-4">Active Loan</h3>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg font-medium">Loan Details</CardTitle>
                  <CardDescription>Application #{activeApplication.application_number}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-gray-500">Status</span>
                    <Badge className={activeApplication.status === "approved" ? "bg-green-500" : 
                                      activeApplication.status === "pending" ? "bg-amber-500" : 
                                      "bg-red-500"}>{activeApplication.status}</Badge>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Amount</span>
                    <span className="font-medium">${activeApplication.loan_amount.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Interest Rate</span>
                    <span className="font-medium">{activeApplication.interest_rate}%</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Term</span>
                    <span className="font-medium">{activeApplication.loan_term} months</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Purpose</span>
                    <span className="font-medium">{activeApplication.loan_purpose}</span>
                  </div>
                  {activeApplication.status === "approved" && (
                    <Button 
                      variant="default" 
                      className="w-full mt-2"
                      onClick={() => handleWithdraw(activeApplication.id)}
                      disabled={transactions.some(t => 
                        t.loan_id === activeApplication.id && t.type === "withdrawal"
                      )}
                    >
                      <Wallet className="h-4 w-4 mr-2" />
                      {transactions.some(t => 
                        t.loan_id === activeApplication.id && t.type === "withdrawal"
                      ) ? "Funds Withdrawn" : "Withdraw Funds"}
                    </Button>
                  )}
                  <Button 
                    variant="outline" 
                    className="w-full mt-2"
                    onClick={() => navigate(`/application/${activeApplication.id}`)}
                  >
                    <FileText className="h-4 w-4 mr-2" />
                    View Details
                  </Button>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg font-medium">Loan Progress</CardTitle>
                  <CardDescription>Application status and timeline</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm mb-1">
                      <span>Applied</span>
                      <span>Approved</span>
                      <span>Withdrawn</span>
                    </div>
                    <Progress value={getLoanProgressStage(activeApplication.status)} className="h-2" />
                  </div>
                  
                  <div className="space-y-3 mt-4">
                    {activeApplication.status_history?.map((status, index) => (
                      <div key={status.id} className="flex items-start">
                        <div className="flex-shrink-0">
                          <div className={`h-3 w-3 rounded-full mt-1 ${
                            status.status === "approved" ? "bg-green-500" : 
                            status.status === "pending" ? "bg-amber-500" : 
                            status.status === "submitted" ? "bg-blue-500" :
                            "bg-gray-300"
                          }`}></div>
                        </div>
                        <div className="ml-3">
                          <p className="text-sm font-medium">
                            Status changed to <span className="capitalize">{status.status}</span>
                          </p>
                          <p className="text-xs text-gray-500">
                            {new Date(status.created_at).toLocaleDateString()}
                          </p>
                          {status.notes && (
                            <p className="text-xs mt-1">{status.notes}</p>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg font-medium">Payment Schedule</CardTitle>
                  <CardDescription>
                    {repaymentSchedule.length > 0 && (
                      <span>Next payment: {repaymentSchedule[0].paymentDate}</span>
                    )}
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-2">
                  {repaymentSchedule.length > 0 ? (
                    <div className="space-y-2 max-h-64 overflow-auto">
                      {repaymentSchedule.slice(0, 6).map((payment, index) => (
                        <div key={index} className="flex justify-between py-2 border-b border-gray-100">
                          <span className="text-sm text-gray-500">{payment.paymentDate}</span>
                          <span className="text-sm font-medium">${payment.paymentAmount}</span>
                        </div>
                      ))}
                      {repaymentSchedule.length > 6 && (
                        <Button 
                          variant="link" 
                          size="sm" 
                          className="w-full"
                          onClick={() => navigate(`/application/${activeApplication.id}`)}
                        >
                          View all payments
                        </Button>
                      )}
                    </div>
                  ) : (
                    <p className="text-sm text-gray-500">No payment schedule available.</p>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg font-medium">Total Applications</CardTitle>
              <CardDescription>Your submitted applications</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">
                {applications.filter(app => app.user_id === user.id).length}
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
                applications={applications.filter(app => app.user_id === user.id)} 
                isLoading={isLoading} 
                onView={(id) => navigate(`/application/${id}`)}
                compact
              />
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
              applications={applications.filter(app => app.user_id === user.id)} 
              isLoading={isLoading} 
              onView={(id) => navigate(`/application/${id}`)}
            />
          </TabsContent>
          
          <TabsContent value="pending">
            <ApplicationList 
              applications={applications.filter(app => app.user_id === user.id && app.status === "pending")} 
              isLoading={isLoading} 
              onView={(id) => navigate(`/application/${id}`)}
            />
          </TabsContent>
          
          <TabsContent value="approved">
            <ApplicationList 
              applications={applications.filter(app => app.user_id === user.id && app.status === "approved")} 
              isLoading={isLoading} 
              onView={(id) => navigate(`/application/${id}`)}
            />
          </TabsContent>
          
          <TabsContent value="rejected">
            <ApplicationList 
              applications={applications.filter(app => app.user_id === user.id && app.status === "rejected")} 
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
