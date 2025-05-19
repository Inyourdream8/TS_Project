
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { FileText, Users, CreditCard, Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Dispatch, SetStateAction, ReactNode } from "react";

interface AdminTabsNavigationProps {
  activeTab: string;
  setActiveTab: Dispatch<SetStateAction<string>>;
  searchTerm: string;
  setSearchTerm: Dispatch<SetStateAction<string>>;
  children: ReactNode;
}

export function AdminTabsNavigation({
  activeTab,
  setActiveTab,
  searchTerm,
  setSearchTerm,
  children
}: AdminTabsNavigationProps) {
  return (
    <Tabs defaultValue="applications" value={activeTab} onValueChange={setActiveTab}>
      <div className="flex items-center justify-between mb-4">
        <TabsList>
          <TabsTrigger value="applications" className="flex items-center gap-1">
            <FileText className="h-4 w-4" />
            Applications
          </TabsTrigger>
          <TabsTrigger value="users" className="flex items-center gap-1">
            <Users className="h-4 w-4" />
            Users
          </TabsTrigger>
          <TabsTrigger value="transactions" className="flex items-center gap-1">
            <CreditCard className="h-4 w-4" />
            Transactions
          </TabsTrigger>
        </TabsList>
        
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            placeholder={`Search ${activeTab}...`}
            className="pl-9 w-[300px]"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>
      {children}
    </Tabs>
  );
}
