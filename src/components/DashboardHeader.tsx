
import { Button } from "@/components/ui/button";
import { User, LogOut } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/components/ui/use-toast";
import { useAuth } from "@/hooks/useAuth";

interface DashboardHeaderProps {
  handleLogout: () => Promise<void>;
}

const DashboardHeader = ({ handleLogout }: DashboardHeaderProps) => {
  const { user } = useAuth();

  return (
    <header className="bg-white border-b">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-4">
          <div className="flex items-center">
            <h1 className="text-2xl font-bold text-blue-600">LoanAPI Zenith</h1>
          </div>
          <div className="flex items-center space-x-4">
            <span className="text-sm text-gray-500">Hello, {user?.full_name}</span>
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
  );
};

export default DashboardHeader;
