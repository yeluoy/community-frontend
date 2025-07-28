// 文件: src/mocks/auth.ts

// 模拟用户数据
import { User } from '@/types';

// 存储在localStorage中的用户数据键名
const USERS_STORAGE_KEY = 'techforum_users';
const CURRENT_USER_KEY = 'techforum_current_user';
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

// 初始化默认用户（如果不存在）
const initDefaultUsers = () => {
  if (!localStorage.getItem(USERS_STORAGE_KEY)) {
    const defaultUsers = [
      {
        id: '1',
        username: '技术达人',
        email: 'user@example.com',
        password: 'password123', // 模拟存储的密码
        avatar: 'https://space.coze.cn/api/coze_space/gen_image?image_size=square&prompt=User+avatar+1&sign=7cc5e5e9d261bde8ce5fccdb28c709aa',
        joinDate: '2023-01-15',
        postCount: 42
      }
    ];
    localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(defaultUsers));
  }
};

// 模拟登录API (保持不变)
export const login = async (email: string, password: string): Promise<{ 
  success: boolean; 
  user?: User; 
  message?: string 
}> => {
  initDefaultUsers();
  await new Promise(resolve => setTimeout(resolve, 800));
  const usersString = localStorage.getItem(USERS_STORAGE_KEY);
  if (!usersString) {
    return { success: false, message: '用户数据不存在' };
  }
  const users: User[] & { email?: string; password?: string }[] = JSON.parse(usersString);
  const user = users.find(u => u.email === email && u.password === password);
  
  if (user) {
    const { password, ...userWithoutPassword } = user;
    localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(userWithoutPassword));
    return { success: true, user: userWithoutPassword as User };
  } else {
    return { success: false, message: '邮箱或密码不正确' };
  }
};

/**
 * 发送邮箱验证码
 * @param email 邮箱地址
 * @returns Promise
 */
export const sendVerificationCode = async (email: string): Promise<{ success: boolean; message: string }> => {
  const response = await fetch(`${API_BASE_URL}/auth/send-code`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ email }),
  });
  return response.json();
};


/**
 * 用户注册
 * @param username 用户名
 * @param email 邮箱
 * @param password 密码
 * @param verificationCode 邮箱验证码
 * @returns Promise
 */
export const register = async (
  username: string, 
  email: string, 
  password: string,
  verificationCode: string
): Promise<{ success: boolean; message?: string }> => {
  const response = await fetch(`${API_BASE_URL}/auth/register`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ username, email, password, verificationCode }),
  });
  return response.json();
};

// 模拟登出 (保持不变)
export const logout = () => {
  localStorage.removeItem(CURRENT_USER_KEY);
};

// 获取当前登录用户 (保持不变)
export const getCurrentUser = (): User | null => {
  const userString = localStorage.getItem(CURRENT_USER_KEY);
  if (!userString) return null;
  return JSON.parse(userString);
};