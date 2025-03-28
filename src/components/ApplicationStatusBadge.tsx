
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

interface ApplicationStatusBadgeProps {
  status: string;
  className?: string;
}

const ApplicationStatusBadge = ({ status, className }: ApplicationStatusBadgeProps) => {
  let badgeVariant: "default" | "outline" | "secondary" | "destructive" = "default";
  let badgeText = status;
  
  switch (status) {
    case "pending":
      badgeVariant = "secondary";
      badgeText = "Pending";
      break;
    case "approved":
      badgeVariant = "default";
      badgeText = "Approved";
      break;
    case "rejected":
      badgeVariant = "destructive";
      badgeText = "Rejected";
      break;
    case "in_review":
      badgeVariant = "outline";
      badgeText = "In Review";
      break;
    default:
      badgeVariant = "secondary";
  }
  
  return (
    <Badge variant={badgeVariant} className={cn(className)}>
      {badgeText.charAt(0).toUpperCase() + badgeText.slice(1)}
    </Badge>
  );
};

export default ApplicationStatusBadge;
