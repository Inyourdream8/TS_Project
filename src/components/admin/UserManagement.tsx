
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { ArrowUpDown, FileText, Edit, Trash } from "lucide-react";

interface User {
  id: string;
  full_name: string;
  email: string;
  phone_number: string;
  role: string;
}

interface UserManagementProps {
  users: User[];
  isLoading: boolean;
  searchTerm: string;
  applicationCount: (userId: string) => number;
  onSearchUserApplications: (email: string) => void;
}

export const UserManagement = ({
  users,
  isLoading,
  searchTerm,
  applicationCount,
  onSearchUserApplications
}: UserManagementProps) => {
  const navigate = useNavigate();
  const [userToDelete, setUserToDelete] = useState<User | null>(null);

  const filteredUsers = users.filter(user => 
    user.full_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.phone_number?.includes(searchTerm)
  );

  return (
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
            {!isLoading && filteredUsers.length === 0 && (
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
              filteredUsers.map((user) => (
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
                      onClick={() => onSearchUserApplications(user.email)}
                    >
                      {applicationCount(user.id)} applications
                    </Button>
                  </td>
                  <td className="p-4 align-middle">
                    <div className="flex items-center gap-2">
                      <Button 
                        variant="ghost" 
                        size="sm"
                        className="h-8 w-8 p-0"
                        onClick={() => {
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
                          navigate(`/admin/users/${user.id}/edit`);
                        }}
                      >
                        <span className="sr-only">Edit</span>
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="sm"
                        className="h-8 w-8 p-0 text-red-500 hover:text-red-700"
                        onClick={() => setUserToDelete(user)}
                      >
                        <span className="sr-only">Delete</span>
                        <Trash className="h-4 w-4" />
                      </Button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <Dialog open={!!userToDelete} onOpenChange={(open) => !open && setUserToDelete(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm user deletion</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete user {userToDelete?.full_name}? 
              This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setUserToDelete(null)}>Cancel</Button>
            <Button 
              variant="destructive" 
              onClick={() => {
                // Delete user logic would go here
                setUserToDelete(null);
              }}
            >
              Delete User
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};
