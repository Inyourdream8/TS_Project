
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { TransactionsTable } from "@/components/admin/TransactionsTable";
import { User } from "@/types/user";

interface TransactionsTabProps {
  transactions: any[];
  users: User[];
  isLoading: boolean;
  searchTerm: string;
  refreshData: () => Promise<void>;
}

export function TransactionsTab({
  transactions,
  users,
  isLoading,
  searchTerm,
  refreshData
}: TransactionsTabProps) {
  return (
    <Card className="border rounded-lg bg-white shadow">
      <CardHeader className="pb-3">
        <CardTitle>Transactions</CardTitle>
        <CardDescription>
          View and manage all financial transactions
        </CardDescription>
      </CardHeader>
      <CardContent>
        <TransactionsTable 
          transactions={transactions}
          users={users}
          isLoading={isLoading}
          searchTerm={searchTerm}
          refreshData={refreshData}
        />
      </CardContent>
    </Card>
  );
}
