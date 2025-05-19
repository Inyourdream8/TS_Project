
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FileText, MessageSquare } from "lucide-react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";

export const SupportCard = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Need Help?</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="text-sm text-gray-500">
          If you have questions about your application or need assistance, our support team is here to help.
        </p>
        <div className="flex flex-col space-y-2">
          <Dialog>
            <DialogTrigger asChild>
              <Button variant="outline" className="w-full justify-start">
                <MessageSquare className="mr-2 h-4 w-4" />
                Contact Support
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Contact Support</DialogTitle>
                <DialogDescription>
                  Our support team is available Monday-Friday, 9AM to 5PM.
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <p>Phone: (555) 123-4567</p>
                <p>Email: support@lendingapp.com</p>
                <p>Chat: Available through our mobile app</p>
              </div>
            </DialogContent>
          </Dialog>
          
          <Dialog>
            <DialogTrigger asChild>
              <Button variant="outline" className="w-full justify-start">
                <FileText className="mr-2 h-4 w-4" />
                FAQs
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Frequently Asked Questions</DialogTitle>
              </DialogHeader>
              <div className="space-y-4 py-4 max-h-[60vh] overflow-y-auto">
                <div className="space-y-2">
                  <h3 className="font-bold">How long does the application process take?</h3>
                  <p>Most applications are processed within 2-3 business days.</p>
                </div>
                <div className="space-y-2">
                  <h3 className="font-bold">When will I receive the funds?</h3>
                  <p>Once approved, funds are typically disbursed within 24-48 hours.</p>
                </div>
                <div className="space-y-2">
                  <h3 className="font-bold">What documents do I need to provide?</h3>
                  <p>You'll need to provide a valid ID, proof of income, and possibly additional documents depending on the loan type.</p>
                </div>
                <div className="space-y-2">
                  <h3 className="font-bold">Can I pay my loan early?</h3>
                  <p>Yes, we offer early payment options with no pre-payment penalties.</p>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </CardContent>
    </Card>
  );
};

export default SupportCard;
