
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
import {
  Dialog, DialogContent, DialogDescription, DialogFooter,
  DialogHeader, DialogTitle, DialogTrigger
} from "@/components/ui/dialog";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { 
  FileText, Users, CreditCard, AlertTriangle, Check, X, 
  ArrowUpDown, Download, Edit, Trash, Search, RefreshCcw, 
  PlusCircle, Send
} from "lucide-react";

import DashboardHeader from "@/components/DashboardHeader";
import ApplicationStats from "@/components/ApplicationStats";
import ApplicationTabs from "@/components/ApplicationTabs";
import LoanCharts from "@/components/LoanCharts";

// Define the transaction schema
const transactionSchema = z.object({
  amount: z.coerce.number().positive("Amount must be positive"),
  transactionType: z.enum(["deposit", "withdrawal"]),
  description: z.string().min(3, "Description is required"),
});

// Define the OTP schema
const otpSchema = z.object({
  otp: z.string().length(6, "OTP must be exactly 6 digits"),
});

// Define the status update schema
const statusUpdateSchema = z.object({
  status: z.enum(["pending", "approved", "rejected", "disbursed", "closed", "defaulted"]),
  notes: z.string().min(3, "Notes are required"),
});

type TransactionFormValues = z.infer<typeof transactionSchema>;
type OtpFormValues = z.infer<typeof otpSchema>;
type StatusUpdateFormValues = z.infer<typeof statusUpdateSchema>;

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
  const [showOtpDialog, setShowOtpDialog] = useState(false);
  const [showTransactionDialog, setShowTransactionDialog] = useState(false);
  const [showStatusDialog, setShowStatusDialog] = useState(false);

  // Initialize forms
  const transactionForm = useForm<TransactionFormValues>({
    resolver: zodResolver(transactionSchema),
    defaultValues: {
      amount: 0,
      transactionType: "deposit",
      description: "",
    },
  });

  const otpForm = useForm<OtpFormValues>({
    resolver: zodResolver(otpSchema),
    defaultValues: {
      otp: "",
    },
  });

  const statusForm = useForm<StatusUpdateFormValues>({
    resolver: zodResolver(statusUpdateSchema),
    defaultValues: {
      status: "pending",
      notes: "",
    },
  });

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
      await api.applications.updateStatus(applicationId, "rejected", "Application rejected by administrator");
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

  const handleUpdateStatus = async (values: StatusUpdateFormValues) => {
    if (!selectedApplication) return;
    
    try {
      await api.applications.updateStatus(
        selectedApplication.id, 
        values.status, 
        values.notes
      );
      
      toast({
        title: "Status updated",
        description: `Application status has been updated to ${values.status}.`,
      });
      
      // Refresh applications 
      const updatedApplications = await api.applications.getAll();
      setApplications(updatedApplications);
      setShowStatusDialog(false);
    } catch (error) {
      console.error("Status update error:", error);
      toast({
        variant: "destructive",
        title: "Update failed",
        description: "There was a problem updating the application status.",
      });
    }
  };

  const handleTransaction = async (values: TransactionFormValues) => {
    if (!selectedApplication) return;
    
    try {
      await api.transactions.create({
        user_id: selectedApplication.user_id,
        loan_id: selectedApplication.id,
        type: values.transactionType,
        amount: values.amount,
        description: values.description
      });
      
      toast({
        title: "Transaction processed",
        description: `${values.transactionType.charAt(0).toUpperCase() + values.transactionType.slice(1)} of PHP ${values.amount.toLocaleString()} has been processed.`,
      });
      
      // Refresh transactions
      const updatedTransactions = await api.transactions.getAll();
      setTransactions(updatedTransactions);
      setShowTransactionDialog(false);
      transactionForm.reset();
    } catch (error) {
      console.error("Transaction error:", error);
      toast({
        variant: "destructive",
        title: "Transaction failed",
        description: "There was a problem processing the transaction.",
      });
    }
  };

  const handleGenerateOtp = async (values: OtpFormValues) => {
    if (!selectedApplication) return;
    
    try {
      // Mock API call to verify OTP - in production this should be a real API call
      // await api.otp.verify(selectedApplication.id, values.otp);
      
      toast({
        title: "OTP Verified",
        description: "Withdrawal authorized with OTP verification.",
      });
      
      setShowOtpDialog(false);
      otpForm.reset();
      
      // Open transaction dialog for withdrawal after OTP verification
      transactionForm.setValue("transactionType", "withdrawal");
      setShowTransactionDialog(true);
    } catch (error) {
      console.error("OTP verification error:", error);
      toast({
        variant: "destructive",
        title: "Verification failed",
        description: "Invalid OTP. Please try again.",
      });
    }
  };

  const handleDeleteApplication = async (applicationId: string) => {
    try {
      // This is a mock implementation - in production, you might want to soft delete or archive
      // await api.applications.delete(applicationId);
      
      // For now, we'll just remove it from the state
      setApplications(apps => apps.filter(app => app.id !== applicationId));
      
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
                  onView={(id) => navigate(`/application/${id}`)}
                  onApprove={handleApprove}
                  onReject={handleReject}
                />

                {/* Application Action Buttons */}
                <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-lg flex items-center">
                        <Edit className="mr-2 h-4 w-4" />
                        Update Status
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-gray-500 mb-3">
                        Change the status of an application and add notes
                      </p>
                      <Dialog open={showStatusDialog} onOpenChange={setShowStatusDialog}>
                        <DialogTrigger asChild>
                          <Button 
                            variant="outline"
                            className="w-full"
                            onClick={() => {
                              const selectedApp = applications.find(app => app.id === selectedApplication?.id);
                              if (selectedApp) {
                                statusForm.setValue("status", selectedApp.status || "pending");
                              }
                            }}
                            disabled={!selectedApplication}
                          >
                            Update Status
                          </Button>
                        </DialogTrigger>
                        <DialogContent>
                          <DialogHeader>
                            <DialogTitle>Update Application Status</DialogTitle>
                            <DialogDescription>
                              Change the status for application {selectedApplication?.application_number}
                            </DialogDescription>
                          </DialogHeader>
                          
                          <Form {...statusForm}>
                            <form onSubmit={statusForm.handleSubmit(handleUpdateStatus)} className="space-y-4">
                              <FormField
                                control={statusForm.control}
                                name="status"
                                render={({ field }) => (
                                  <FormItem>
                                    <FormLabel>Status</FormLabel>
                                    <Select 
                                      onValueChange={field.onChange} 
                                      defaultValue={field.value}
                                    >
                                      <FormControl>
                                        <SelectTrigger>
                                          <SelectValue placeholder="Select a status" />
                                        </SelectTrigger>
                                      </FormControl>
                                      <SelectContent>
                                        <SelectItem value="pending">Pending</SelectItem>
                                        <SelectItem value="approved">Approved</SelectItem>
                                        <SelectItem value="rejected">Rejected</SelectItem>
                                        <SelectItem value="disbursed">Disbursed</SelectItem>
                                        <SelectItem value="closed">Closed</SelectItem>
                                        <SelectItem value="defaulted">Defaulted</SelectItem>
                                      </SelectContent>
                                    </Select>
                                    <FormMessage />
                                  </FormItem>
                                )}
                              />
                              
                              <FormField
                                control={statusForm.control}
                                name="notes"
                                render={({ field }) => (
                                  <FormItem>
                                    <FormLabel>Notes</FormLabel>
                                    <FormControl>
                                      <Textarea 
                                        placeholder="Add notes about this status change" 
                                        {...field}
                                      />
                                    </FormControl>
                                    <FormMessage />
                                  </FormItem>
                                )}
                              />
                              
                              <DialogFooter>
                                <Button type="submit">Update Status</Button>
                              </DialogFooter>
                            </form>
                          </Form>
                        </DialogContent>
                      </Dialog>
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-lg flex items-center">
                        <CreditCard className="mr-2 h-4 w-4" />
                        Process Transaction
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-gray-500 mb-3">
                        Add funds or process withdrawals for approved applications
                      </p>
                      <div className="flex gap-2">
                        <Dialog open={showTransactionDialog} onOpenChange={setShowTransactionDialog}>
                          <DialogTrigger asChild>
                            <Button 
                              variant="outline"
                              className="w-full"
                              onClick={() => {
                                transactionForm.setValue("transactionType", "deposit");
                              }}
                              disabled={!selectedApplication || selectedApplication.status !== "approved"}
                            >
                              Add Funds
                            </Button>
                          </DialogTrigger>
                          <DialogContent>
                            <DialogHeader>
                              <DialogTitle>Process Transaction</DialogTitle>
                              <DialogDescription>
                                Add or withdraw funds for application {selectedApplication?.application_number}
                              </DialogDescription>
                            </DialogHeader>
                            
                            <Form {...transactionForm}>
                              <form onSubmit={transactionForm.handleSubmit(handleTransaction)} className="space-y-4">
                                <FormField
                                  control={transactionForm.control}
                                  name="transactionType"
                                  render={({ field }) => (
                                    <FormItem>
                                      <FormLabel>Transaction Type</FormLabel>
                                      <Select 
                                        onValueChange={field.onChange} 
                                        defaultValue={field.value}
                                      >
                                        <FormControl>
                                          <SelectTrigger>
                                            <SelectValue placeholder="Select type" />
                                          </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                          <SelectItem value="deposit">Deposit (Add Funds)</SelectItem>
                                          <SelectItem value="withdrawal">Withdrawal</SelectItem>
                                        </SelectContent>
                                      </Select>
                                      <FormMessage />
                                    </FormItem>
                                  )}
                                />
                                
                                <FormField
                                  control={transactionForm.control}
                                  name="amount"
                                  render={({ field }) => (
                                    <FormItem>
                                      <FormLabel>Amount (PHP)</FormLabel>
                                      <FormControl>
                                        <div className="relative">
                                          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">₱</span>
                                          <Input
                                            type="number"
                                            className="pl-7"
                                            {...field}
                                          />
                                        </div>
                                      </FormControl>
                                      <FormMessage />
                                    </FormItem>
                                  )}
                                />
                                
                                <FormField
                                  control={transactionForm.control}
                                  name="description"
                                  render={({ field }) => (
                                    <FormItem>
                                      <FormLabel>Description</FormLabel>
                                      <FormControl>
                                        <Input 
                                          placeholder="Transaction description" 
                                          {...field}
                                        />
                                      </FormControl>
                                      <FormMessage />
                                    </FormItem>
                                  )}
                                />
                                
                                <DialogFooter>
                                  <Button type="submit">Process Transaction</Button>
                                </DialogFooter>
                              </form>
                            </Form>
                          </DialogContent>
                        </Dialog>

                        <Dialog open={showOtpDialog} onOpenChange={setShowOtpDialog}>
                          <DialogTrigger asChild>
                            <Button 
                              variant="outline"
                              className="w-full"
                              disabled={!selectedApplication || selectedApplication.status !== "approved"}
                            >
                              Withdrawal
                            </Button>
                          </DialogTrigger>
                          <DialogContent>
                            <DialogHeader>
                              <DialogTitle>Verify OTP</DialogTitle>
                              <DialogDescription>
                                Enter the OTP code for withdrawal authorization
                              </DialogDescription>
                            </DialogHeader>
                            
                            <Form {...otpForm}>
                              <form onSubmit={otpForm.handleSubmit(handleGenerateOtp)} className="space-y-4">
                                <FormField
                                  control={otpForm.control}
                                  name="otp"
                                  render={({ field }) => (
                                    <FormItem>
                                      <FormLabel>OTP Code</FormLabel>
                                      <FormControl>
                                        <Input 
                                          placeholder="Enter 6-digit OTP" 
                                          maxLength={6}
                                          {...field}
                                        />
                                      </FormControl>
                                      <FormMessage />
                                    </FormItem>
                                  )}
                                />
                                
                                <div className="text-center">
                                  <Button 
                                    type="button" 
                                    variant="outline"
                                    onClick={() => {
                                      toast({
                                        title: "OTP Generated",
                                        description: "A new OTP has been sent to the customer.",
                                      });
                                    }}
                                  >
                                    <Send className="h-4 w-4 mr-2" />
                                    Generate & Send OTP
                                  </Button>
                                </div>
                                
                                <DialogFooter>
                                  <Button type="submit">Verify & Continue</Button>
                                </DialogFooter>
                              </form>
                            </Form>
                          </DialogContent>
                        </Dialog>
                      </div>
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-lg flex items-center">
                        <AlertTriangle className="mr-2 h-4 w-4 text-red-500" />
                        Danger Zone
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-gray-500 mb-3">
                        Cancel or delete application permanently
                      </p>
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button 
                            variant="destructive"
                            className="w-full"
                            disabled={!selectedApplication}
                          >
                            <Trash className="h-4 w-4 mr-2" />
                            Delete Application
                          </Button>
                        </DialogTrigger>
                        <DialogContent>
                          <DialogHeader>
                            <DialogTitle>Confirm Deletion</DialogTitle>
                            <DialogDescription>
                              Are you sure you want to delete application {selectedApplication?.application_number}?
                              This action cannot be undone.
                            </DialogDescription>
                          </DialogHeader>
                          
                          <DialogFooter className="gap-2">
                            <Button 
                              variant="outline" 
                              onClick={() => {}}
                            >
                              Cancel
                            </Button>
                            <Button 
                              variant="destructive" 
                              onClick={() => {
                                if (selectedApplication) {
                                  handleDeleteApplication(selectedApplication.id);
                                }
                              }}
                            >
                              <Trash className="h-4 w-4 mr-2" />
                              Confirm Delete
                            </Button>
                          </DialogFooter>
                        </DialogContent>
                      </Dialog>
                    </CardContent>
                  </Card>
                </div>
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
                <div className="rounded-md border">
                  <div className="w-full overflow-auto">
                    <table className="w-full caption-bottom text-sm">
                      <thead className="[&_tr]:border-b">
                        <tr className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted">
                          <th className="h-12 px-4 text-left align-middle font-medium">
                            <div className="flex items-center space-x-1">
                              <span>Name</span>
                              <ArrowUpDown className="h-3 w-3" />
                            </div>
                          </th>
                          <th className="h-12 px-4 text-left align-middle font-medium">
                            <div className="flex items-center space-x-1">
                              <span>Email</span>
                              <ArrowUpDown className="h-3 w-3" />
                            </div>
                          </th>
                          <th className="h-12 px-4 text-left align-middle font-medium">Phone</th>
                          <th className="h-12 px-4 text-left align-middle font-medium">Role</th>
                          <th className="h-12 px-4 text-left align-middle font-medium">Applications</th>
                          <th className="h-12 px-4 text-left align-middle font-medium">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="[&_tr:last-child]:border-0">
                        {!isLoading && users.length === 0 && (
                          <tr>
                            <td colSpan={6} className="py-6 text-center text-gray-500">
                              No users found
                            </td>
                          </tr>
                        )}
                        {isLoading ? (
                          <tr>
                            <td colSpan={6} className="py-6 text-center">
                              <div className="flex justify-center">
                                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-gray-900"></div>
                              </div>
                            </td>
                          </tr>
                        ) : (
                          users.filter(user => 
                            user.full_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                            user.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                            user.phone_number?.includes(searchTerm)
                          ).map((user) => (
                            <tr 
                              key={user.id}
                              className="border-b transition-colors hover:bg-muted/50"
                            >
                              <td className="p-4 align-middle">
                                <div className="font-medium">{user.full_name}</div>
                              </td>
                              <td className="p-4 align-middle">{user.email}</td>
                              <td className="p-4 align-middle">{user.phone_number}</td>
                              <td className="p-4 align-middle">
                                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                  user.role === 'admin' ? 'bg-blue-100 text-blue-800' : 'bg-green-100 text-green-800'
                                }`}>
                                  {user.role}
                                </span>
                              </td>
                              <td className="p-4 align-middle">
                                <Button 
                                  variant="ghost" 
                                  size="sm"
                                  onClick={() => {
                                    setSearchTerm(user.email);
                                    setActiveTab("applications");
                                  }}
                                >
                                  {applications.filter(app => app.user_id === user.id).length} applications
                                </Button>
                              </td>
                              <td className="p-4 align-middle">
                                <div className="flex items-center gap-2">
                                  <Button 
                                    variant="ghost" 
                                    size="sm"
                                    className="h-8 w-8 p-0"
                                    onClick={() => {
                                      // View user details
                                      navigate(`/admin/users/${user.id}`);
                                    }}
                                  >
                                    <span className="sr-only">View</span>
                                    <FileText className="h-4 w-4" />
                                  </Button>
                                  <Button 
                                    variant="ghost" 
                                    size="sm"
                                    className="h-8 w-8 p-0"
                                    onClick={() => {
                                      // Edit user
                                      navigate(`/admin/users/${user.id}/edit`);
                                    }}
                                  >
                                    <span className="sr-only">Edit</span>
                                    <Edit className="h-4 w-4" />
                                  </Button>
                                  <Dialog>
                                    <DialogTrigger asChild>
                                      <Button 
                                        variant="ghost" 
                                        size="sm"
                                        className="h-8 w-8 p-0 text-red-500 hover:text-red-700"
                                      >
                                        <span className="sr-only">Delete</span>
                                        <Trash className="h-4 w-4" />
                                      </Button>
                                    </DialogTrigger>
                                    <DialogContent>
                                      <DialogHeader>
                                        <DialogTitle>Confirm user deletion</DialogTitle>
                                        <DialogDescription>
                                          Are you sure you want to delete user {user.full_name}? 
                                          This action cannot be undone.
                                        </DialogDescription>
                                      </DialogHeader>
                                      <DialogFooter>
                                        <Button variant="outline">Cancel</Button>
                                        <Button variant="destructive">Delete User</Button>
                                      </DialogFooter>
                                    </DialogContent>
                                  </Dialog>
                                </div>
                              </td>
                            </tr>
                          ))
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
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
                <div className="rounded-md border">
                  <div className="w-full overflow-auto">
                    <table className="w-full caption-bottom text-sm">
                      <thead className="[&_tr]:border-b">
                        <tr className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted">
                          <th className="h-12 px-4 text-left align-middle font-medium">Date</th>
                          <th className="h-12 px-4 text-left align-middle font-medium">Reference</th>
                          <th className="h-12 px-4 text-left align-middle font-medium">User</th>
                          <th className="h-12 px-4 text-left align-middle font-medium">Type</th>
                          <th className="h-12 px-4 text-right align-middle font-medium">Amount</th>
                          <th className="h-12 px-4 text-left align-middle font-medium">Description</th>
                          <th className="h-12 px-4 text-left align-middle font-medium">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="[&_tr:last-child]:border-0">
                        {!isLoading && transactions.length === 0 && (
                          <tr>
                            <td colSpan={7} className="py-6 text-center text-gray-500">
                              No transactions found
                            </td>
                          </tr>
                        )}
                        {isLoading ? (
                          <tr>
                            <td colSpan={7} className="py-6 text-center">
                              <div className="flex justify-center">
                                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-gray-900"></div>
                              </div>
                            </td>
                          </tr>
                        ) : (
                          transactions.filter(tx => 
                            tx.reference?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                            tx.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                            tx.type?.toLowerCase().includes(searchTerm.toLowerCase())
                          ).map((tx) => {
                            const user = users.find(u => u.id === tx.user_id);
                            return (
                              <tr 
                                key={tx.id}
                                className="border-b transition-colors hover:bg-muted/50"
                              >
                                <td className="p-4 align-middle">
                                  {new Date(tx.created_at).toLocaleDateString()}
                                </td>
                                <td className="p-4 align-middle font-medium">{tx.reference}</td>
                                <td className="p-4 align-middle">{user ? user.full_name : tx.user_id}</td>
                                <td className="p-4 align-middle">
                                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                    tx.type === 'deposit' ? 'bg-green-100 text-green-800' : 'bg-amber-100 text-amber-800'
                                  }`}>
                                    {tx.type}
                                  </span>
                                </td>
                                <td className="p-4 align-middle text-right">
                                  <span className={tx.type === 'deposit' ? 'text-green-600' : 'text-red-600'}>
                                    {tx.type === 'deposit' ? '+ ' : '- '}
                                    ₱{tx.amount.toLocaleString()}
                                  </span>
                                </td>
                                <td className="p-4 align-middle">{tx.description}</td>
                                <td className="p-4 align-middle">
                                  <div className="flex items-center gap-2">
                                    <Button 
                                      variant="ghost" 
                                      size="sm"
                                      className="h-8 w-8 p-0"
                                      onClick={() => {
                                        // View transaction details
                                      }}
                                    >
                                      <span className="sr-only">View</span>
                                      <FileText className="h-4 w-4" />
                                    </Button>
                                    <Button 
                                      variant="ghost" 
                                      size="sm"
                                      className="h-8 w-8 p-0"
                                      onClick={() => {
                                        // Print receipt
                                      }}
                                    >
                                      <span className="sr-only">Print</span>
                                      <Download className="h-4 w-4" />
                                    </Button>
                                  </div>
                                </td>
                              </tr>
                            )
                          })
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
                
                {/* Add Transaction Button */}
                <div className="mt-4 flex justify-end">
                  <Button 
                    onClick={() => {
                      setShowTransactionDialog(true);
                    }}
                    className="flex items-center gap-1"
                  >
                    <PlusCircle className="h-4 w-4" />
                    New Transaction
                  </Button>
                </div>
              </CardContent>
            </TabsContent>
          </Tabs>
        </div>
      </main>
    </div>
  );
};

export default AdminDashboard;
