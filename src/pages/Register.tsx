import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useToast } from "@/components/ui/use-toast";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Eye, EyeOff, ArrowLeft } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
const registerSchema = z.object({
  fullName: z.string().min(3, "Full name must be at least 3 characters"),
  email: z.string().email("Please enter a valid email address"),
  phone: z.string().min(10, "Phone number must be at least 10 characters"),
  address: z.string().min(5, "Address must be at least 5 characters"),
  dateOfBirth: z.string().refine(val => {
    const date = new Date(val);
    const eighteenYearsAgo = new Date();
    eighteenYearsAgo.setFullYear(eighteenYearsAgo.getFullYear() - 18);
    return date <= eighteenYearsAgo;
  }, "You must be at least 18 years old"),
  password: z.string().min(8, "Password must be at least 8 characters"),
  confirmPassword: z.string()
}).refine(data => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"]
});
type RegisterFormValues = z.infer<typeof registerSchema>;
const Register = () => {
  const navigate = useNavigate();
  const {
    toast
  } = useToast();
  const {
    register
  } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const form = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      fullName: "",
      email: "",
      phone: "",
      address: "",
      dateOfBirth: "",
      password: "",
      confirmPassword: ""
    }
  });
  const onSubmit = async (data: RegisterFormValues) => {
    setIsLoading(true);
    try {
      await register({
        email: data.email,
        password: data.password,
        full_name: data.fullName,
        phone_number: data.phone,
        address: data.address,
        date_of_birth: data.dateOfBirth,
        role: "applicant"
      });
      toast({
        title: "Registration successful",
        description: "Your account has been created successfully."
      });
      navigate("/dashboard");
    } catch (error) {
      console.error("Registration error:", error);
      toast({
        variant: "destructive",
        title: "Registration failed",
        description: "There was a problem creating your account. Please try again."
      });
    } finally {
      setIsLoading(false);
    }
  };
  return <div className="min-h-screen bg-gray-50 py-12 px-4">
      <Link to="/" className="absolute top-4 left-4 text-blue-600 hover:text-blue-800 flex items-center">
        <ArrowLeft className="w-4 h-4 mr-1" />
        Back to Home
      </Link>
      
      <Card className="w-full max-w-2xl mx-auto">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold text-center">Create an account</CardTitle>
          <CardDescription className="text-center">
            Enter your information to create an account
          </CardDescription>
        </CardHeader>
        
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField control={form.control} name="fullName" render={({
                field
              }) => <FormItem>
                      <FormLabel>Full name</FormLabel>
                      <FormControl>
                        <Input placeholder="John Doe" {...field} disabled={isLoading} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>} />
                
                <FormField control={form.control} name="email" render={({
                field
              }) => <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input placeholder="name@example.com" type="email" {...field} disabled={isLoading} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>} />
                
                <FormField control={form.control} name="phone" render={({
                field
              }) => <FormItem className="w-full">
                      <FormLabel>Phone number</FormLabel>
                      <FormControl>
                        <Input placeholder="+15551234567" disabled={isLoading} className="w-full" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>} />
                
                <FormField control={form.control} name="dateOfBirth" render={({
                field
              }) => {}} />
              </div>
              
              <FormField control={form.control} name="address" render={({
              field
            }) => {}} />
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField control={form.control} name="password" render={({
                field
              }) => <FormItem>
                      <FormLabel>Password</FormLabel>
                      <div className="relative">
                        <FormControl>
                          <Input type={showPassword ? "text" : "password"} placeholder="Create a password" {...field} className="pr-10" disabled={isLoading} />
                        </FormControl>
                        <button type="button" className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700" onClick={() => setShowPassword(!showPassword)} tabIndex={-1}>
                          {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                        </button>
                      </div>
                      <FormMessage />
                    </FormItem>} />
                
                <FormField control={form.control} name="confirmPassword" render={({
                field
              }) => <FormItem>
                      <FormLabel>Confirm Password</FormLabel>
                      <div className="relative">
                        <FormControl>
                          <Input type={showConfirmPassword ? "text" : "password"} placeholder="Confirm your password" {...field} className="pr-10" disabled={isLoading} />
                        </FormControl>
                        <button type="button" className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700" onClick={() => setShowConfirmPassword(!showConfirmPassword)} tabIndex={-1}>
                          {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                        </button>
                      </div>
                      <FormMessage />
                    </FormItem>} />
              </div>
              
              <div className="pt-2">
                <Button type="submit" className="w-full" disabled={isLoading}>
                  {isLoading ? "Creating account..." : "Create account"}
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
        
        <CardFooter className="flex justify-center border-t pt-4">
          <div className="text-sm text-center">
            Already have an account?{" "}
            <Link to="/login" className="text-blue-600 hover:underline font-medium">
              Sign in
            </Link>
          </div>
        </CardFooter>
      </Card>
    </div>;
};
export default Register;