
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import ApplicationStatusBadge from "@/components/ApplicationStatusBadge";
import { LoanApplication } from "@/types/application";

interface ApplicationHeaderProps {
  application: LoanApplication;
}

export const ApplicationHeader = ({ application }: ApplicationHeaderProps) => {
  const navigate = useNavigate();
  
  return (
    <header className="bg-white border-b">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center py-4">
          <Button 
            variant="ghost" 
            size="sm" 
            className="mr-4"
            onClick={() => navigate("/dashboard")}
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
          <h1 className="text-2xl font-bold">Application {application.application_number}</h1>
          <div className="ml-4">
            <ApplicationStatusBadge status={application.status} />
          </div>
        </div>
      </div>
    </header>
  );
};
