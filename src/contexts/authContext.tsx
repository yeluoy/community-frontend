import { createContext, useState, useEffect, ReactNode } from "react";

import { User } from '@/types';

interface AuthContextType {
  isAuthenticated: boolean;
  user: User | null;
  login: (email: string, password: string) => Promise<{ success: boolean; message?: string }>;
  register: (username: string, email: string, password: string) => Promise<{ success: boolean; message?: string }>;
  logout: () => void;
}

export const AuthContext = createContext<AuthContextType>({
  isAuthenticated: false,
  user: null,
  login: async () => ({ success: false }),
  register: async () => ({ success: false }),
  logout: () => {},
});

interface AuthProviderProps {
  children: ReactNode;
}

import { login as loginApi, logout as logoutApi, getCurrentUser, register as registerApi } from '@/mocks/auth';

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [user, setUser] = useState<User | null>(null);
  
  // 初始化时检查用户是否已登录
  useEffect(() => {
    const currentUser = getCurrentUser();
    if (currentUser) {
      setIsAuthenticated(true);
      setUser(currentUser);
    }
  }, []);
  
  const login = async (email: string, password: string) => {
    const result = await loginApi(email, password);
    if (result.success && result.user) {
      setIsAuthenticated(true);
      setUser(result.user);
    }
    return result;
  };
  
  const register = async (username: string, email: string, password: string) => {
    return await registerApi(username, email, password);
  };
  
  const logout = () => {
    logoutApi();
    setIsAuthenticated(false);
    setUser(null);
  };
  
  return (
    <AuthContext.Provider value={{ isAuthenticated, user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};