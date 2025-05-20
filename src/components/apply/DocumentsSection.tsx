
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { FileText } from "lucide-react";
import { UseFormReturn } from "react-hook-form";
import DocumentUpload from "@/components/DocumentUpload";
import { LoanApplicationFormValues } from "@/types/forms";

interface DocumentsSectionProps {
  form: UseFormReturn<LoanApplicationFormValues>;
  isSubmitting: boolean;
  documents: File[];
  onDocumentUpload: (file: File, documentType: string) => Promise<void>;
}

export const DocumentsSection = ({ 
  form, 
  isSubmitting, 
  documents, 
  onDocumentUpload 
}: DocumentsSectionProps) => {
  return (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold flex items-center mb-4">
        <FileText className="mr-2 h-5 w-5" />
        Required Documents
      </h3>
      
      <div className="space-y-6">
        <div className="bg-gray-50 p-4 rounded-lg">
          <h4 className="font-medium mb-2">Proof of Income</h4>
          <p className="text-sm text-gray-600 mb-4">
            Please upload at least one document that proves your income (e.g., pay slips, tax returns, bank statements)
          </p>
          
          <DocumentUpload 
            onUpload={(file) => onDocumentUpload(file, "proof_of_income")}
            existingFiles={documents.map(file => ({ 
              name: file.name, 
              size: file.size, 
              type: file.type 
            }))}
            maxFiles={3}
            acceptedTypes={["image/jpeg", "image/png", "application/pdf"]}
            maxSizeInMB={5}
          />
          
          {documents.length === 0 && (
            <p className="text-red-500 text-sm mt-2">
              At least one proof of income document is required
            </p>
          )}
        </div>
        
        <FormField
          control={form.control}
          name="additionalInfo"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Additional Information (Optional)</FormLabel>
              <FormControl>
                <Textarea 
                  {...field} 
                  placeholder="Any additional information that might be relevant to your application" 
                  disabled={isSubmitting}
                  className="min-h-[100px]"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
    </div>
  );
};
