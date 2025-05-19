
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { User } from "@/types/user";

interface ApplicantInfoCardProps {
  user: User | null;
}

export const ApplicantInfoCard = ({ user }: ApplicantInfoCardProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Applicant Information</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <h3 className="text-sm font-medium text-gray-500">Full Name</h3>
          <p className="mt-1">{user?.full_name}</p>
        </div>
        <div>
          <h3 className="text-sm font-medium text-gray-500">Email</h3>
          <p className="mt-1">{user?.email}</p>
        </div>
        <div>
          <h3 className="text-sm font-medium text-gray-500">Phone</h3>
          <p className="mt-1">{user?.phone_number}</p>
        </div>
        <div>
          <h3 className="text-sm font-medium text-gray-500">Address</h3>
          <p className="mt-1">{user?.address}</p>
        </div>
      </CardContent>
    </Card>
  );
};
