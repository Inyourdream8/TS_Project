
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { FileText, Download, PlusCircle } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { api } from "@/lib/api";
import { transactionSchema, TransactionFormValues } from "@/types/forms";

interface Transaction {
  id: string;
  user_id: string;
  loan_id: string;
  reference: string;
  type: string;
  amount: number;
  description: string;
  created_at: string;
}

interface User {
  id: string;
  full_name: string;
}

interface TransactionsTableProps {
  transactions: Transaction[];
  users: User[];
  isLoading: boolean;
  searchTerm: string;
  refreshData: () => Promise<void>;
}

export const TransactionsTable = ({
  transactions,
  users,
  isLoading,
  searchTerm,
  refreshData
}: TransactionsTableProps) => {
  const { toast } = useToast();
  const [showNewTransactionDialog, setShowNewTransactionDialog] = useState(false);
  
  const transactionForm = useForm<TransactionFormValues>({
    resolver: zodResolver(transactionSchema),
    defaultValues: {
      amount: 0,
      transactionType: "deposit",
      description: "",
    },
  });

  const filteredTransactions = transactions.filter(tx => 
    tx.reference?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    tx.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    tx.type?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleNewTransaction = async (values: TransactionFormValues) => {
    try {
      // This is a mock implementation for the demo
      // In a real app, you would need to select a user/loan
      await api.transactions.create({
        user_id: "mock-user-id",
        loan_id: "mock-loan-id",
        type: values.transactionType,
        amount: values.amount,
        description: values.description
      });
      
      toast({
        title: "Transaction created",
        description: "New transaction has been created successfully.",
      });
      
      await refreshData();
      setShowNewTransactionDialog(false);
      transactionForm.reset();
    } catch (error) {
      console.error("Transaction error:", error);
      toast({
        variant: "destructive",
        title: "Transaction failed",
        description: "There was a problem creating the transaction.",
      });
    }
  };

  return (
    <>
      <div className="rounded-md border">
        <div className="w-full overflow-auto">
          <table className="w-full caption-bottom text-sm">
            <thead className="[&_tr]:border-b">
              <tr className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted">
                <th className="h-12 px-4 text-left align-middle font-medium">Date</th>
                <th className="h-12 px-4 text-left align-middle font-medium">Reference</th>
                <th className="h-12 px-4 text-left align-middle font-medium">User</th>
                <th className="h-12 px-4 text-left align-middle font-medium">Type</th>
                <th className="h-12 px-4 text-right align-middle font-medium">Amount</th>
                <th className="h-12 px-4 text-left align-middle font-medium">Description</th>
                <th className="h-12 px-4 text-left align-middle font-medium">Actions</th>
              </tr>
            </thead>
            <tbody className="[&_tr:last-child]:border-0">
              {!isLoading && filteredTransactions.length === 0 && (
                <tr>
                  <td colSpan={7} className="py-6 text-center text-gray-500">
                    No transactions found
                  </td>
                </tr>
              )}
              {isLoading ? (
                <tr>
                  <td colSpan={7} className="py-6 text-center">
                    <div className="flex justify-center">
                      <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-gray-900"></div>
                    </div>
                  </td>
                </tr>
              ) : (
                filteredTransactions.map((tx) => {
                  const user = users.find(u => u.id === tx.user_id);
                  return (
                    <tr 
                      key={tx.id}
                      className="border-b transition-colors hover:bg-muted/50"
                    >
                      <td className="p-4 align-middle">
                        {new Date(tx.created_at).toLocaleDateString()}
                      </td>
                      <td className="p-4 align-middle font-medium">{tx.reference}</td>
                      <td className="p-4 align-middle">{user ? user.full_name : tx.user_id}</td>
                      <td className="p-4 align-middle">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          tx.type === 'deposit' ? 'bg-green-100 text-green-800' : 'bg-amber-100 text-amber-800'
                        }`}>
                          {tx.type}
                        </span>
                      </td>
                      <td className="p-4 align-middle text-right">
                        <span className={tx.type === 'deposit' ? 'text-green-600' : 'text-red-600'}>
                          {tx.type === 'deposit' ? '+ ' : '- '}
                          ₱{tx.amount.toLocaleString()}
                        </span>
                      </td>
                      <td className="p-4 align-middle">{tx.description}</td>
                      <td className="p-4 align-middle">
                        <div className="flex items-center gap-2">
                          <Button 
                            variant="ghost" 
                            size="sm"
                            className="h-8 w-8 p-0"
                            onClick={() => {
                              // View transaction details
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
                              // Print receipt
                            }}
                          >
                            <span className="sr-only">Print</span>
                            <Download className="h-4 w-4" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  )
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
      
      {/* Add Transaction Button */}
      <div className="mt-4 flex justify-end">
        <Dialog open={showNewTransactionDialog} onOpenChange={setShowNewTransactionDialog}>
          <DialogTrigger asChild>
            <Button className="flex items-center gap-1">
              <PlusCircle className="h-4 w-4" />
              New Transaction
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create New Transaction</DialogTitle>
              <DialogDescription>
                Create a new financial transaction
              </DialogDescription>
            </DialogHeader>
            
            <Form {...transactionForm}>
              <form onSubmit={transactionForm.handleSubmit(handleNewTransaction)} className="space-y-4">
                <FormField
                  control={transactionForm.control}
                  name="transactionType"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Transaction Type</FormLabel>
                      <Select 
                        onValueChange={field.onChange} 
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select type" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="deposit">Deposit (Add Funds)</SelectItem>
                          <SelectItem value="withdrawal">Withdrawal</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={transactionForm.control}
                  name="amount"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Amount (PHP)</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">₱</span>
                          <Input
                            type="number"
                            className="pl-7"
                            {...field}
                          />
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={transactionForm.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Description</FormLabel>
                      <FormControl>
                        <Input 
                          placeholder="Transaction description" 
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <DialogFooter>
                  <Button type="submit">Create Transaction</Button>
                </DialogFooter>
              </form>
            </Form>
          </DialogContent>
        </Dialog>
      </div>
    </>
  );
};
