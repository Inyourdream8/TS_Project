
import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarTrigger,
  useSidebar
} from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import {
  LayoutDashboard,
  CreditCard,
  FileText,
  Bell,
  Settings,
  LogOut,
  Users
} from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

interface SidebarNavItemProps {
  to: string;
  icon: React.ReactNode;
  label: string;
}

const SidebarNavItem = ({ to, icon, label }: SidebarNavItemProps) => {
  const location = useLocation();
  const isActive = location.pathname === to;

  return (
    <SidebarMenuItem>
      <SidebarMenuButton
        asChild
        isActive={isActive}
        tooltip={label}
      >
        <Link to={to} className="flex items-center gap-2">
          {icon}
          <span>{label}</span>
        </Link>
      </SidebarMenuButton>
    </SidebarMenuItem>
  );
};

interface SidebarNavigationProps {
  children: React.ReactNode;
  onLogout?: () => void;
}

export const SidebarNavigation = ({
  children,
  onLogout
}: SidebarNavigationProps) => {
  const { user, logout } = useAuth();
  const [open, setOpen] = useState(true);

  const handleLogout = async () => {
    if (onLogout) {
      onLogout();
    } else {
      try {
        await logout();
      } catch (error) {
        console.error("Logout error:", error);
      }
    }
  };

  return (
    <SidebarProvider open={open} onOpenChange={setOpen}>
      <div className="flex min-h-screen w-full">
        <Sidebar>
          <SidebarHeader className="flex flex-col items-center justify-center py-4">
            <div className="flex flex-col items-center justify-center">
              <h2 className="text-xl font-bold">Loan App</h2>
              <p className="text-xs text-muted-foreground">Financial Services</p>
            </div>
          </SidebarHeader>

          <SidebarContent>
            <SidebarGroup>
              <SidebarMenu>
                <SidebarNavItem 
                  to="/dashboard" 
                  icon={<LayoutDashboard className="h-4 w-4" />} 
                  label="Dashboard" 
                />
                <SidebarNavItem 
                  to="/apply" 
                  icon={<FileText className="h-4 w-4" />} 
                  label="Apply for Loan" 
                />
                <SidebarNavItem 
                  to="/applications" 
                  icon={<FileText className="h-4 w-4" />} 
                  label="Applications" 
                />
                <SidebarNavItem 
                  to="/transactions" 
                  icon={<CreditCard className="h-4 w-4" />} 
                  label="Transactions" 
                />
                <SidebarNavItem 
                  to="/notifications" 
                  icon={<Bell className="h-4 w-4" />} 
                  label="Notifications" 
                />
                <SidebarNavItem 
                  to="/settings" 
                  icon={<Settings className="h-4 w-4" />} 
                  label="Settings" 
                />
                {/* Only show admin section if user has admin role */}
                {user?.role === "admin" && (
                  <>
                    <SidebarMenuItem className="mt-4">
                      <div className="px-2 text-xs font-medium text-muted-foreground">Admin</div>
                    </SidebarMenuItem>
                    <SidebarNavItem 
                      to="/admin/users" 
                      icon={<Users className="h-4 w-4" />} 
                      label="Users" 
                    />
                  </>
                )}
              </SidebarMenu>
            </SidebarGroup>
          </SidebarContent>

          <SidebarFooter className="border-t p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Avatar className="h-9 w-9">
                  <AvatarFallback>
                    {user?.name?.charAt(0) || user?.email?.charAt(0) || "U"}
                  </AvatarFallback>
                </Avatar>
                <div className="overflow-hidden">
                  <p className="text-sm font-medium leading-none truncate">{user?.name || user?.email || "User"}</p>
                  {user?.email && <p className="text-xs text-muted-foreground truncate">{user.email}</p>}
                </div>
              </div>
              <Button variant="ghost" size="icon" onClick={handleLogout}>
                <LogOut className="h-4 w-4" />
                <span className="sr-only">Logout</span>
              </Button>
            </div>
          </SidebarFooter>
        </Sidebar>

        <div className="flex flex-1 flex-col">
          <div className="flex items-center border-b px-4 py-2 h-14">
            <SidebarTrigger />
            <div className="ml-3">
              <h2 className="text-lg font-semibold">Finance Dashboard</h2>
            </div>
          </div>
          <main className="flex-1 overflow-auto p-4">
            {children}
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
};

// Create a sidebar wrapper that can be used to wrap any page
export const withSidebar = (
  Component: React.ComponentType<any>,
  props?: { onLogout?: () => void }
) => {
  return (componentProps: any) => (
    <SidebarNavigation onLogout={props?.onLogout}>
      <Component {...componentProps} />
    </SidebarNavigation>
  );
};
