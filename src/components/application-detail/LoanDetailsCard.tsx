
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { LoanApplication } from "@/types/application";
import { formatCurrency } from "@/lib/utils";

interface LoanDetailsCardProps {
  application: LoanApplication;
}

export const LoanDetailsCard = ({ application }: LoanDetailsCardProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Loan Details</CardTitle>
        <CardDescription>Information about the requested loan</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h3 className="text-sm font-medium text-gray-500">Loan Amount</h3>
            <p className="mt-1 text-lg font-semibold">{formatCurrency(application.loan_amount)}</p>
          </div>
          <div>
            <h3 className="text-sm font-medium text-gray-500">Loan Purpose</h3>
            <p className="mt-1 text-lg">{application.loan_purpose}</p>
          </div>
          <div>
            <h3 className="text-sm font-medium text-gray-500">Loan Term</h3>
            <p className="mt-1 text-lg">{application.loan_term} months</p>
          </div>
          <div>
            <h3 className="text-sm font-medium text-gray-500">Interest Rate</h3>
            <p className="mt-1 text-lg">{application.interest_rate}%</p>
          </div>
        </div>
        
        <Separator />
        
        <div>
          <h3 className="text-sm font-medium text-gray-500 mb-3">Financial Information</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="text-sm font-medium text-gray-500">Employment Status</h4>
              <p className="mt-1">{application.employment_status}</p>
            </div>
            <div>
              <h4 className="text-sm font-medium text-gray-500">Employer</h4>
              <p className="mt-1">{application.employer}</p>
            </div>
            <div>
              <h4 className="text-sm font-medium text-gray-500">Monthly Income</h4>
              <p className="mt-1">{formatCurrency(application.monthly_income)}</p>
            </div>
            <div>
              <h4 className="text-sm font-medium text-gray-500">Employment Duration</h4>
              <p className="mt-1">{application.employment_duration} years</p>
            </div>
          </div>
        </div>
        
        <Separator />
        
        <div>
          <h3 className="text-sm font-medium text-gray-500 mb-3">Banking Information</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="text-sm font-medium text-gray-500">Bank Name</h4>
              <p className="mt-1">{application.bank_name}</p>
            </div>
            <div>
              <h4 className="text-sm font-medium text-gray-500">Account Type</h4>
              <p className="mt-1">{application.account_type}</p>
            </div>
            <div>
              <h4 className="text-sm font-medium text-gray-500">Account Number</h4>
              <p className="mt-1">
                {application.account_number.replace(/\d(?=\d{4})/g, "*")}
              </p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
