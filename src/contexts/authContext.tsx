// 文件: src/contexts/authContext.tsx

import { createContext, useState, useEffect, ReactNode } from "react";
import { User } from '@/types';
import { 
  login as loginApi, 
  logout as logoutApi, 
  getCurrentUser, 
  register as registerApi,
  sendVerificationCode as sendVerificationCodeApi // 【导入】
} from '@/mocks/authService';

interface AuthContextType {
  isAuthenticated: boolean;
  user: User | null;
  login: (email: string, password: string) => Promise<{ success: boolean; message?: string }>;
  // 【修改】更新 register 函数签名
  register: (username: string, email: string, password: string, verificationCode: string) => Promise<{ success: boolean; message?: string }>;
  logout: () => void;
  // 【新增】添加发送验证码函数
  sendVerificationCode: (email: string) => Promise<{ success: boolean; message: string }>;
}

export const AuthContext = createContext<AuthContextType>({
  isAuthenticated: false,
  user: null,
  login: async () => ({ success: false }),
  // 【修改】更新默认实现
  register: async () => ({ success: false }),
  logout: () => {},
  // 【新增】添加默认实现
  sendVerificationCode: async () => ({ success: false, message: '发送失败' }),
});

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [user, setUser] = useState<User | null>(null);
  
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
  
  // 【修改】更新 register 函数实现
  const register = async (username: string, email: string, password: string, verificationCode: string) => {
    return await registerApi(username, email, password, verificationCode);
  };
  
  const logout = () => {
    logoutApi();
    setIsAuthenticated(false);
    setUser(null);
  };
  
  // 【新增】实现发送验证码函数
  const sendVerificationCode = async (email: string) => {
      return await sendVerificationCodeApi(email);
  };

  return (
    // 【修改】将新函数添加到 Provider 的 value 中
    <AuthContext.Provider value={{ isAuthenticated, user, login, register, logout, sendVerificationCode }}>
      {children}
    </AuthContext.Provider>
  );
};