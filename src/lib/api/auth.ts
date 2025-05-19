
import { User } from "@/types/user";
import { delay } from "./utils";

// Mock data for users
const mockUsers: User[] = [
  {
    id: "usr_1",
    email: "john@example.com",
    full_name: "John Doe",
    phone_number: "+15551234567",
    address: "123 Main St, City, State, 12345",
    date_of_birth: "1990-01-01",
    role: "applicant",
    created_at: "2023-01-01T00:00:00Z",
    updated_at: "2023-01-01T00:00:00Z",
  },
  {
    id: "usr_2",
    email: "admin@example.com",
    full_name: "Admin User",
    phone_number: "+15559876543",
    address: "456 Admin St, City, State, 12345",
    date_of_birth: "1985-01-01",
    role: "admin",
    created_at: "2023-01-01T00:00:00Z",
    updated_at: "2023-01-01T00:00:00Z",
  }
];

// Auth endpoints
export const authApi = {
  login: async (email: string, password: string) => {
    // Simulate API call
    await delay(1000);
    
    const user = mockUsers.find(u => u.email === email);
    if (!user) {
      throw new Error("Invalid credentials");
    }
    
    // In a real app, you'd verify the password here
    return {
      user,
      token: "mock_jwt_token",
    };
  },
  
  register: async (userData: any) => {
    // Simulate API call
    await delay(1000);
    
    const newUser: User = {
      id: `usr_${mockUsers.length + 1}`,
      email: userData.email,
      full_name: userData.full_name,
      phone_number: userData.phone_number,
      address: userData.address,
      date_of_birth: userData.date_of_birth,
      role: userData.role || "applicant",
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };
    
    mockUsers.push(newUser);
    
    return {
      user: newUser,
      token: "mock_jwt_token",
    };
  },
  
  getCurrentUser: async () => {
    // Simulate API call
    await delay(500);
    
    // In a real app, you'd verify the JWT token and return the user
    return mockUsers[0];
  },
};

// Export users for other modules to use
export { mockUsers };
