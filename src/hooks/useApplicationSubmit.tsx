
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/components/ui/use-toast";
import { api } from "@/lib/api";
import { LoanApplicationFormValues } from "@/types/forms";
import { useAuth } from "@/hooks/useAuth";

export const useApplicationSubmit = (documents: File[]) => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const handleSubmit = async (data: LoanApplicationFormValues) => {
    if (!user) {
      toast({
        variant: "destructive",
        title: "Authentication required",
        description: "Please log in to submit a loan application.",
      });
      navigate("/login");
      return;
    }

    setIsSubmitting(true);

    try {
      const application = {
        user_id: user.id,
        application_number: `LW-${new Date().toISOString().slice(0, 10).replace(/-/g, "")}-${Math.floor(1000 + Math.random() * 9000)}`,
        status: "pending",
        
        // Personal Information
        full_name: data.fullName,
        national_id: data.nationalId,
        phone_number: data.phoneNumber,
        address: data.address,
        email: data.email,
        
        // Employment Information
        employment_status: data.employmentStatus,
        employer: data.employer || "",
        monthly_income: data.monthlyIncome,
        employment_duration: data.employmentDuration,
        
        // Loan Details
        loan_amount: data.loanAmount,
        loan_term: parseInt(data.loanTerm),
        loan_purpose: data.loanPurpose,
        interest_rate: 4.0, // Default 4% as specified
        
        // Banking Details
        bank_name: data.bankName,
        account_name: data.accountName,
        account_number: data.accountNumber,
        account_type: data.accountType,
        
        additional_info: data.additionalInfo || "",
        
        // Documents will be handled in a separate API call
      };

      const newApplication = await api.applications.create(application);
      
      // Upload documents if any
      if (documents.length > 0) {
        try {
          await Promise.all(documents.map(file => 
            api.documents.upload(newApplication.id, file, "proof_of_income")
          ));
        } catch (docError) {
          console.error("Error uploading documents:", docError);
          toast({
            title: "Document upload issue",
            description: "Your application was submitted, but there was an issue uploading some documents."
          });
        }
      }

      toast({
        title: "Application submitted",
        description: `Your loan application ${newApplication.application_number} has been submitted successfully.`,
      });

      navigate(`/dashboard`);
    } catch (error) {
      console.error("Error submitting application:", error);
      toast({
        variant: "destructive",
        title: "Submission failed",
        description: "There was a problem submitting your application. Please try again.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return { handleSubmit, isSubmitting };
};
