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
  updateUser: (newUserData: Partial<User>) => void;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

// 这是一个关键的辅助函数，用于从localStorage获取token
// 【关键修复】让 getTokensFromStorage 函数更健壮
const getTokensFromStorage = () => {
    const accessToken = localStorage.getItem('accessToken');
    const refreshToken = localStorage.getItem('refreshToken');
    
    // 从 localStorage 获取 user 字符串
    const userString = localStorage.getItem('user');
    let user = null;

    // 只有在 userString 存在且不是 "undefined" 时才解析
    if (userString && userString !== 'undefined') {
        try {
            user = JSON.parse(userString);
        } catch (e) {
            console.error("解析本地存储的user信息失败", e);
            // 解析失败时，清除脏数据
            localStorage.removeItem('user');
        }
    }
    
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
        //const { accessToken, refreshToken, user: loggedInUser } = result.data;
        // 【关键修复】根据后端返回的真实字段名进行解构
        const { token: accessToken, refreshToken, userInfo: loggedInUser } = result.data;
        
        
        // 确保我们拿到了有效数据再进行存储
        if(accessToken && refreshToken && loggedInUser){
            localStorage.setItem('accessToken', accessToken);
            localStorage.setItem('refreshToken', refreshToken);
            localStorage.setItem('user', JSON.stringify(loggedInUser));

            setUser(loggedInUser);
            setIsAuthenticated(true);
        } else {
             // 如果后端成功响应但数据不完整，也视为登录失败
             return { success: false, message: "登录响应数据不完整" };
        }
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
    // 通知后端登出
    logoutApi().catch(err => console.error("登出API调用失败", err));
    
    // 清除本地存储
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('user');

    // 重置React状态
    setUser(null);
    setIsAuthenticated(false);
    
    // 可以选择跳转到登录页
    window.location.href = '/login';
  };
  // 【新增】更新用户信息的函数
  const updateUser = (newUserData: Partial<User>) => {
    setUser(prevUser => {
      if (!prevUser) return null;
      const updatedUser = { ...prevUser, ...newUserData };
      // 同时更新 localStorage
      localStorage.setItem('user', JSON.stringify(updatedUser));
      return updatedUser;
    });
  };

  const contextValue = {
    isAuthenticated,
    user,
    login,
    logout,
    isLoading,
    updateUser, // 【新增】
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