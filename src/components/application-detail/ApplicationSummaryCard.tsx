
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { LoanApplication } from "@/types/application";
import { formatDate } from "@/lib/utils";
import ApplicationStatusBadge from "@/components/ApplicationStatusBadge";

interface ApplicationSummaryCardProps {
  application: LoanApplication;
}

export const ApplicationSummaryCard = ({ application }: ApplicationSummaryCardProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Application Summary</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <h3 className="text-sm font-medium text-gray-500">Application Number</h3>
          <p className="mt-1">{application.application_number}</p>
        </div>
        <div>
          <h3 className="text-sm font-medium text-gray-500">Submission Date</h3>
          <p className="mt-1">{formatDate(application.created_at)}</p>
        </div>
        <div>
          <h3 className="text-sm font-medium text-gray-500">Last Updated</h3>
          <p className="mt-1">{formatDate(application.updated_at)}</p>
        </div>
        <Separator />
        <div>
          <h3 className="text-sm font-medium text-gray-500">Status</h3>
          <div className="mt-2">
            <ApplicationStatusBadge status={application.status} />
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
