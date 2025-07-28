// 文件: src/contexts/authContext.tsx

import { createContext, useState, useEffect, ReactNode, useCallback } from 'react';
import { User } from '@/types';
import { loginApi, logoutApi } from '@/services/authService'; // 从真实服务导入

// 定义认证上下文提供的数据结构
interface AuthContextType {
  isAuthenticated: boolean;
  user: User | null;
  login: (email, password) => Promise<any>; // 返回Promise以处理UI逻辑
  logout: () => void;
  isLoading: boolean; // 新增一个加载状态，用于处理自动登录
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

// 这是一个关键的辅助函数，用于从localStorage获取token
const getTokensFromStorage = () => {
    const accessToken = localStorage.getItem('accessToken');
    const refreshToken = localStorage.getItem('refreshToken');
    const user = JSON.parse(localStorage.getItem('user') || 'null');
    return { accessToken, refreshToken, user };
};

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true); // 初始为true，因为要检查自动登录

  // 【自动登录逻辑】
  // 使用 useCallback 包装以避免不必要的重渲染
  const attemptAutoLogin = useCallback(() => {
    try {
      const { accessToken, user: storedUser } = getTokensFromStorage();
      if (accessToken && storedUser) {
        // 在实际应用中，这里应该先验证accessToken是否过期
        // 如果过期，则使用refreshToken去换取新的token
        // 为简化，我们暂时只检查token是否存在
        setUser(storedUser);
        setIsAuthenticated(true);
      }
    } catch (error) {
      console.error("自动登录失败", error);
    } finally {
      // 无论成功与否，结束加载状态，显示页面
      setIsLoading(false);
    }
  }, []);

  // 组件首次加载时，执行自动登录检查
  useEffect(() => {
    attemptAutoLogin();
  }, [attemptAutoLogin]);

  // 【登录函数】
  const login = async (email, password) => {
    try {
      const result = await loginApi(email, password);
      if (result.success) {
        const { accessToken, refreshToken, user: loggedInUser } = result.data;
        
        // 将token和用户信息存入localStorage
        localStorage.setItem('accessToken', accessToken);
        localStorage.setItem('refreshToken', refreshToken);
        localStorage.setItem('user', JSON.stringify(loggedInUser));

        // 更新React状态
        setUser(loggedInUser);
        setIsAuthenticated(true);
      }
      return result; // 将完整结果返回给UI层处理
    } catch (error) {
      console.error("登录请求失败", error);
      // 确保在请求失败时也返回一个标准的错误结构
      return { success: false, message: "登录请求失败，请检查网络。" };
    }
  };

  // 【登出函数】
  const logout = () => {
    const { refreshToken } = getTokensFromStorage();
    if(refreshToken) {
        // 通知后端登出（可选）
        logoutApi(refreshToken).catch(err => console.error("登出API调用失败", err));
    }
    
    // 从localStorage清除所有认证信息
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('user');

    // 重置React状态
    setUser(null);
    setIsAuthenticated(false);
    
    // 可以选择跳转到登录页
    window.location.href = '/login';
  };

  const contextValue = {
    isAuthenticated,
    user,
    login,
    logout,
    isLoading,
  };

  // 如果正在检查自动登录，可以显示一个全局的加载动画
  if (isLoading) {
    return <div>Loading...</div>; // 或者一个更美观的Spinner组件
  }

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
};