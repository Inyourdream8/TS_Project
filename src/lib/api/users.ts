
import { User } from "@/types/user";
import { delay } from "./utils";
import { mockUsers } from "./auth";

// User endpoints
export const usersApi = {
  getAll: async () => {
    await delay(800);
    return mockUsers;
  },
  
  getById: async (id: string) => {
    await delay(500);
    const user = mockUsers.find(u => u.id === id);
    if (!user) {
      throw new Error("User not found");
    }
    return user;
  },
  
  update: async (id: string, userData: Partial<User>) => {
    await delay(1000);
    const userIndex = mockUsers.findIndex(u => u.id === id);
    if (userIndex === -1) {
      throw new Error("User not found");
    }
    
    mockUsers[userIndex] = {
      ...mockUsers[userIndex],
      ...userData,
      updated_at: new Date().toISOString(),
    };
    
    return mockUsers[userIndex];
  },
  
  delete: async (id: string) => {
    await delay(1000);
    const userIndex = mockUsers.findIndex(u => u.id === id);
    if (userIndex === -1) {
      throw new Error("User not found");
    }
    
    mockUsers.splice(userIndex, 1);
    return { success: true };
  },
};
