
// Helper function to simulate API delay
export const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// Helper to get headers with auth token
export const getAuthHeaders = () => {
  const token = localStorage.getItem("auth_token");
  return {
    "Content-Type": "application/json",
    "Authorization": token ? `Bearer ${token}` : "",
  };
};

// Calculate loan repayment schedule
export const calculateRepaymentSchedule = (loanAmount: number, interestRate: number, termMonths: number) => {
  const monthlyRate = interestRate / 100 / 12;
  const monthlyPayment = loanAmount * monthlyRate * Math.pow(1 + monthlyRate, termMonths) / (Math.pow(1 + monthlyRate, termMonths) - 1);
  
  const schedule = [];
  let remainingBalance = loanAmount;
  
  for (let month = 1; month <= termMonths; month++) {
    const interestPayment = remainingBalance * monthlyRate;
    const principalPayment = monthlyPayment - interestPayment;
    remainingBalance -= principalPayment;
    
    schedule.push({
      paymentNumber: month,
      paymentDate: new Date(Date.now() + month * 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      paymentAmount: monthlyPayment.toFixed(2),
      principalAmount: principalPayment.toFixed(2),
      interestAmount: interestPayment.toFixed(2),
      remainingBalance: remainingBalance > 0 ? remainingBalance.toFixed(2) : 0,
    });
  }
  
  return schedule;
};
