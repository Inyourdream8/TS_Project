
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { LoanApplication } from "@/types/application";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend
} from "recharts";
import { ChartContainer, ChartTooltipContent } from "@/components/ui/chart";
import { formatCurrency } from "@/lib/utils";

interface LoanChartsProps {
  applications: LoanApplication[];
  transactions: any[];
  userId?: string;
  isAdmin?: boolean;
}

const LoanCharts = ({ applications, transactions, userId, isAdmin }: LoanChartsProps) => {
  // Filter applications based on user role
  const userApplications = isAdmin 
    ? applications
    : applications.filter(app => app.user_id === userId);
  
  // Generate monthly loan data
  const getMonthlyLoanData = () => {
    const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const currentDate = new Date();
    const currentMonth = currentDate.getMonth();
    const currentYear = currentDate.getFullYear();
    
    // Create data for the last 6 months
    return Array(6).fill(0).map((_, index) => {
      const month = (currentMonth - 5 + index + 12) % 12;
      const year = currentYear - (month > currentMonth ? 1 : 0);
      
      // Filter applications created in this month
      const monthApplications = userApplications.filter(app => {
        const appDate = new Date(app.created_at);
        return appDate.getMonth() === month && appDate.getFullYear() === year;
      });
      
      // Calculate total loan amount for the month
      const totalAmount = monthApplications.reduce((acc, app) => acc + app.loan_amount, 0);
      
      return {
        name: monthNames[month],
        amount: totalAmount,
        count: monthApplications.length
      };
    });
  };
  
  // Generate loan status distribution data
  const getLoanStatusData = () => {
    const statusCounts: Record<string, number> = {
      pending: 0,
      approved: 0,
      rejected: 0
    };
    
    userApplications.forEach(app => {
      if (statusCounts[app.status] !== undefined) {
        statusCounts[app.status]++;
      }
    });
    
    return Object.entries(statusCounts).map(([status, count]) => ({
      name: status.charAt(0).toUpperCase() + status.slice(1),
      value: count
    }));
  };
  
  // Generate payment data from transactions
  const getPaymentData = () => {
    if (!transactions || transactions.length === 0) return [];
    
    const monthlyPayments: Record<string, number> = {};
    const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    
    transactions.forEach(transaction => {
      if (transaction.type === 'payment') {
        const date = new Date(transaction.created_at);
        const monthKey = `${monthNames[date.getMonth()]} ${date.getFullYear()}`;
        
        monthlyPayments[monthKey] = (monthlyPayments[monthKey] || 0) + transaction.amount;
      }
    });
    
    return Object.entries(monthlyPayments).map(([month, amount]) => ({
      name: month,
      amount: amount
    }));
  };
  
  const monthlyLoanData = getMonthlyLoanData();
  const loanStatusData = getLoanStatusData();
  const paymentData = getPaymentData();
  
  const chartConfig = {
    primary: {
      label: "Primary",
      theme: {
        light: "#2563eb",
        dark: "#3b82f6"
      }
    },
    secondary: {
      label: "Secondary",
      theme: {
        light: "#10b981",
        dark: "#34d399"
      }
    },
    tertiary: {
      label: "Tertiary",
      theme: {
        light: "#f59e0b",
        dark: "#fbbf24"
      }
    },
  };
  
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
      <Card>
        <CardHeader>
          <CardTitle className="text-lg font-medium">Loan Applications</CardTitle>
          <CardDescription>Monthly application trends</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-[300px]">
            <ChartContainer config={chartConfig}>
              <BarChart data={monthlyLoanData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip content={<ChartTooltipContent />} />
                <Legend />
                <Bar dataKey="count" name="Applications" fill="var(--color-primary)" />
              </BarChart>
            </ChartContainer>
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle className="text-lg font-medium">Loan Amounts</CardTitle>
          <CardDescription>Monthly loan amount trends</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-[300px]">
            <ChartContainer config={chartConfig}>
              <LineChart data={monthlyLoanData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis tickFormatter={(value) => `$${value.toLocaleString()}`} />
                <Tooltip 
                  content={<ChartTooltipContent formatter={(value) => formatCurrency(Number(value))} />}
                />
                <Legend />
                <Line 
                  type="monotone" 
                  dataKey="amount" 
                  name="Loan Amount" 
                  stroke="var(--color-secondary)" 
                  strokeWidth={2} 
                  activeDot={{ r: 6 }} 
                />
              </LineChart>
            </ChartContainer>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default LoanCharts;
