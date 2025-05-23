import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Eye } from "lucide-react";
import { LoanApplication } from "@/types/application";
import { formatDate, formatCurrency } from "@/lib/utils";
import ApplicationStatusBadge from "@/components/ApplicationStatusBadge";

interface ApplicationListProps {
  applications: LoanApplication[];
  isLoading: boolean;
  onView: (id: string) => void;
  compact?: boolean;
  isAdmin?: boolean;
  onApprove?: (applicationId: string) => Promise<void>;
  onReject?: (applicationId: string) => Promise<void>;
  onDisburse?: (applicationId: string) => Promise<void>;
  onSelect?: (application: LoanApplication) => void;
}

const ApplicationList = ({
  applications,
  isLoading,
  onView,
  compact,
  isAdmin = false,
  onApprove,
  onReject,
  onDisburse,
  onSelect
}: ApplicationListProps) => {
  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (applications.length === 0) {
    return (
      <Card>
        <CardContent className="p-6 text-center">
          <h3 className="text-lg font-medium mb-2">No applications found</h3>
          <p className="text-gray-500">You haven't submitted any applications yet.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {applications.map((application) => (
        <Card key={application.id} className={`overflow-hidden ${compact ? 'mb-2' : ''}`}>
          <div className="md:hidden">
            <CardContent className={compact ? "p-4" : "p-6"}>
              <div className="flex items-center justify-between mb-4">
                <div>
                  <p className="text-sm text-gray-500">Application</p>
                  <h3 className="font-semibold">{application.application_number}</h3>
                </div>
                <ApplicationStatusBadge status={application.status} />
              </div>
              
              <div className="space-y-3">
                <div>
                  <p className="text-sm text-gray-500">Amount</p>
                  <p className="font-medium">{formatCurrency(application.loan_amount)}</p>
                </div>
                
                {!compact && (
                  <>
                    <div>
                      <p className="text-sm text-gray-500">Purpose</p>
                      <p>{application.loan_purpose}</p>
                    </div>
                    
                    <div>
                      <p className="text-sm text-gray-500">Date</p>
                      <p>{formatDate(application.created_at)}</p>
                    </div>
                  </>
                )}
              </div>
              
              <Button 
                className="w-full mt-4"
                onClick={() => {
                  onView(application.id);
                  if (onSelect) onSelect(application);
                }}
                size={compact ? "sm" : "default"}
              >
                <Eye className="h-4 w-4 mr-2" />
                View Details
              </Button>
            </CardContent>
          </div>
          
          <div className="hidden md:block">
            <div className={`grid grid-cols-7 gap-4 ${compact ? 'p-4' : 'p-6'} items-center`}>
              <div className="col-span-2">
                <p className="text-sm text-gray-500">Application</p>
                <h3 className="font-semibold">{application.application_number}</h3>
                {!compact && (
                  <p className="text-sm text-gray-500 mt-1">{formatDate(application.created_at)}</p>
                )}
              </div>
              
              <div>
                <p className="text-sm text-gray-500">Amount</p>
                <p className="font-medium">{formatCurrency(application.loan_amount)}</p>
              </div>
              
              <div className={compact ? "col-span-1" : "col-span-2"}>
                {!compact ? (
                  <>
                    <p className="text-sm text-gray-500">Purpose</p>
                    <p>{application.loan_purpose}</p>
                  </>
                ) : (
                  <ApplicationStatusBadge status={application.status} />
                )}
              </div>
              
              {!compact && (
                <div>
                  <ApplicationStatusBadge status={application.status} />
                </div>
              )}
              
              <div className={`text-right ${compact ? "col-span-3" : ""}`}>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    onView(application.id);
                    if (onSelect) onSelect(application);
                  }}
                >
                  <Eye className="h-4 w-4 mr-2" />
                  View
                </Button>
              </div>
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
};

export default ApplicationList;
