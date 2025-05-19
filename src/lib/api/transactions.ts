
import { delay } from "./utils";

// Mock data for transactions
export const mockTransactions = [
  {
    id: "txn_1",
    user_id: "usr_1",
    loan_id: "app_2",
    type: "withdrawal",
    amount: 5000,
    description: "Loan withdrawal",
    status: "completed",
    created_at: "2023-02-15T10:30:00Z",
  },
  {
    id: "txn_2",
    user_id: "usr_1",
    loan_id: "app_2",
    type: "repayment",
    amount: 450.25,
    description: "Monthly payment",
    status: "completed",
    created_at: "2023-03-15T14:20:00Z",
  },
];

// Transaction endpoints
export const transactionsApi = {
  getByUserId: async (userId: string) => {
    await delay(800);
    return mockTransactions.filter(t => t.user_id === userId);
  },
  
  getByLoanId: async (loanId: string) => {
    await delay(800);
    return mockTransactions.filter(t => t.loan_id === loanId);
  },
  
  create: async (transactionData: any) => {
    await delay(1000);
    
    const newTransaction = {
      id: `txn_${mockTransactions.length + 1}`,
      user_id: transactionData.user_id,
      loan_id: transactionData.loan_id,
      type: transactionData.type,
      amount: transactionData.amount,
      description: transactionData.description,
      status: "completed",
      created_at: new Date().toISOString(),
    };
    
    mockTransactions.push(newTransaction);
    return newTransaction;
  },
  
  getAll: async () => {
    await delay(800);
    return mockTransactions;
  },
};
