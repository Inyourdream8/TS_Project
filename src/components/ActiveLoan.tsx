
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { LoanApplication } from "@/types/application";
import { Wallet, FileText } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface ActiveLoanProps {
  activeApplication: LoanApplication;
  repaymentSchedule: any[];
  handleWithdraw: (loanId: string) => Promise<void>;
  transactions: any[];
}

const ActiveLoan = ({ 
  activeApplication, 
  repaymentSchedule, 
  handleWithdraw, 
  transactions 
}: ActiveLoanProps) => {
  const navigate = useNavigate();

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

  return (
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
  );
};

export default ActiveLoan;
