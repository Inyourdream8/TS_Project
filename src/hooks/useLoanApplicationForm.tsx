
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { LoanApplicationFormValues, loanApplicationSchema } from "@/types/forms";
import { useAuth } from "@/hooks/useAuth";

export const useLoanApplicationForm = () => {
  const { user } = useAuth();
  const [documents, setDocuments] = useState<File[]>([]);
  
  // Initialize form with default values, populate with user data if available
  const form = useForm<LoanApplicationFormValues>({
    resolver: zodResolver(loanApplicationSchema),
    defaultValues: {
      // Personal Information
      fullName: user?.full_name || "",
      nationalId: "",
      phoneNumber: user?.phone_number || "",
      address: user?.address || "",
      email: user?.email || "",
      
      // Employment Information
      employmentStatus: "",
      employer: "",
      employmentDuration: "",
      monthlyIncome: 0,
      
      // Loan Details
      loanAmount: 100000,
      loanTerm: "12",
      loanPurpose: "",
      
      // Banking Details
      bankName: "",
      accountName: "",
      accountNumber: "",
      accountType: "",
      
      // Additional Info
      additionalInfo: "",
    },
    mode: "onChange",
  });

  // Handle file upload
  const handleFileUpload = async (file: File, documentType: string) => {
    // Store uploaded file in state
    setDocuments([...documents, file]);
    return Promise.resolve();
  };

  return {
    form,
    documents,
    handleFileUpload
  };
};
