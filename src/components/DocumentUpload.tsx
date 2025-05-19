
import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { FormLabel } from "@/components/ui/form";
import { Upload, File, Trash2, Download } from "lucide-react";
import { formatDate } from "@/lib/utils";
import { Document } from "@/types/application";

interface DocumentUploadProps {
  onUpload: (file: File, documentType: string) => Promise<void>;
  existingFiles?: Document[];
  maxFiles?: number;
  acceptedTypes?: string[];
  maxSizeInMB?: number;
}

const documentTypes = [
  { value: "id", label: "Identification Document" },
  { value: "income_proof", label: "Income Proof" },
  { value: "bank_statement", label: "Bank Statement" },
  { value: "address_proof", label: "Address Proof" },
  { value: "other", label: "Other Document" },
];

const DocumentUpload = ({ 
  onUpload, 
  existingFiles = [],
  maxFiles = 5,
  acceptedTypes = ["image/jpeg", "image/png", "application/pdf"],
  maxSizeInMB = 5
}: DocumentUploadProps) => {
  const [documentType, setDocumentType] = useState("");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0]);
    }
  };

  const handleUpload = async () => {
    if (!selectedFile || !documentType) return;
    
    setIsUploading(true);
    try {
      await onUpload(selectedFile, documentType);
      setSelectedFile(null);
      setDocumentType("");
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    } catch (error) {
      console.error("Upload failed:", error);
    } finally {
      setIsUploading(false);
    }
  };

  const getDocumentTypeLabel = (type: string) => {
    const docType = documentTypes.find(dt => dt.value === type);
    return docType ? docType.label : type;
  };

  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <FormLabel>Document Type</FormLabel>
            <Select
              value={documentType}
              onValueChange={setDocumentType}
              disabled={isUploading}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select document type" />
              </SelectTrigger>
              <SelectContent>
                {documentTypes.map((type) => (
                  <SelectItem key={type.value} value={type.value}>
                    {type.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <div>
            <FormLabel>Choose File</FormLabel>
            <Input
              ref={fileInputRef}
              type="file"
              onChange={handleFileChange}
              disabled={isUploading}
              accept={acceptedTypes.join(",")}
            />
          </div>
        </div>
        
        <Button 
          onClick={handleUpload} 
          disabled={!selectedFile || !documentType || isUploading}
          className="w-full md:w-auto"
        >
          {isUploading ? (
            <>
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
              Uploading...
            </>
          ) : (
            <>
              <Upload className="h-4 w-4 mr-2" />
              Upload Document
            </>
          )}
        </Button>
      </div>
      
      <div>
        <h3 className="text-sm font-medium mb-4">Uploaded Documents</h3>
        
        {existingFiles.length === 0 ? (
          <Card>
            <CardContent className="p-6 text-center text-gray-500">
              No documents uploaded yet
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-3">
            {existingFiles.map((document) => (
              <Card key={document.id}>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <File className="h-5 w-5 text-blue-600 mr-3" />
                      <div>
                        <p className="font-medium">{getDocumentTypeLabel(document.document_type)}</p>
                        <p className="text-sm text-gray-500">
                          Uploaded on {formatDate(document.uploaded_at || document.created_at || "")}
                        </p>
                      </div>
                    </div>
                    <div className="flex space-x-2">
                      <Button variant="outline" size="sm">
                        <Download className="h-4 w-4 mr-1" />
                        Download
                      </Button>
                      <Button variant="outline" size="sm" className="text-red-500 hover:text-red-700">
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default DocumentUpload;
