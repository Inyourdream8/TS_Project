
import { useState } from "react";
import { useToast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Edit, AlertTriangle, CreditCard, Trash, Send } from "lucide-react";
import { api } from "@/lib/api";
import { LoanApplication } from "@/types/application";
import { 
  TransactionFormValues, 
  OtpFormValues, 
  StatusUpdateFormValues,
  transactionSchema,
  otpSchema,
  statusUpdateSchema
} from "@/types/forms";

interface ApplicationActionsProps {
  selectedApplication: LoanApplication | null;
  onUpdateStatus: () => Promise<void>;
  onDeleteApplication: (id: string) => Promise<void>;
}

export const ApplicationActions = ({ 
  selectedApplication, 
  onUpdateStatus,
  onDeleteApplication 
}: ApplicationActionsProps) => {
  const { toast } = useToast();
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
      
      // Close dialog and refresh data
      setShowStatusDialog(false);
      await onUpdateStatus();
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
      
      // Close dialog and refresh data
      setShowTransactionDialog(false);
      transactionForm.reset();
      await onUpdateStatus();
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

  return (
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
                  if (selectedApplication) {
                    statusForm.setValue("status", selectedApplication.status);
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
                      onDeleteApplication(selectedApplication.id);
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
  );
};
