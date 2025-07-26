// 模拟用户数据
import { User } from '@/types';

// 存储在localStorage中的用户数据键名
const USERS_STORAGE_KEY = 'techforum_users';
const CURRENT_USER_KEY = 'techforum_current_user';

// 初始化默认用户（如果不存在）
const initDefaultUsers = () => {
  if (!localStorage.getItem(USERS_STORAGE_KEY)) {
    const defaultUsers = [
      {
        id: '1',
        username: '技术达人',
        email: 'user@example.com',
        password: 'password123', // 模拟存储的密码，实际应用中应该是加密存储的
        avatar: 'https://space.coze.cn/api/coze_space/gen_image?image_size=square&prompt=User+avatar+1&sign=7cc5e5e9d261bde8ce5fccdb28c709aa',
        joinDate: '2023-01-15',
        postCount: 42
      }
    ];
    localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(defaultUsers));
  }
};

// 模拟登录API
export const login = async (email: string, password: string): Promise<{ 
  success: boolean; 
  user?: User; 
  message?: string 
}> => {
  // 初始化默认用户数据
  initDefaultUsers();
  
  // 模拟网络延迟
  await new Promise(resolve => setTimeout(resolve, 800));
  
  // 获取存储的用户数据
  const usersString = localStorage.getItem(USERS_STORAGE_KEY);
  if (!usersString) {
    return { success: false, message: '用户数据不存在' };
  }
  
  const users: User[] & { email?: string; password?: string }[] = JSON.parse(usersString);
  const user = users.find(u => u.email === email && u.password === password);
  
  if (user) {
    // 存储当前登录用户（不包含密码）
    const { password, ...userWithoutPassword } = user;
    localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(userWithoutPassword));
    return { success: true, user: userWithoutPassword as User };
  } else {
    return { success: false, message: '邮箱或密码不正确' };
  }
};

// 模拟注册API
export const register = async (username: string, email: string, password: string): Promise<{ 
  success: boolean; 
  message?: string 
}> => {
  // 初始化默认用户数据
  initDefaultUsers();
  
  // 模拟网络延迟
  await new Promise(resolve => setTimeout(resolve, 800));
  
  // 获取存储的用户数据
  const usersString = localStorage.getItem(USERS_STORAGE_KEY);
  if (!usersString) {
    return { success: false, message: '用户数据不存在' };
  }
  
  const users: User[] & { email?: string; password?: string }[] = JSON.parse(usersString);
  
  // 检查邮箱是否已被注册
  if (users.some(u => u.email === email)) {
    return { success: false, message: '该邮箱已被注册' };
  }
  
  // 检查用户名是否已被使用
  if (users.some(u => u.username === username)) {
    return { success: false, message: '该用户名已被使用' };
  }
  
  // 创建新用户
  const newUser = {
    id: Date.now().toString(),
    username,
    email,
    password, // 实际应用中应该存储加密后的密码
    avatar: `https://space.coze.cn/api/coze_space/gen_image?image_size=square&prompt=User+avatar+%24%7BDate.now%28%29%7D&sign=7527d3023311ab796bb86db9f8ba3976 10)}`,
    joinDate: new Date().toISOString().split('T')[0],
    postCount: 0
  };
  
  // 保存新用户
  users.push(newUser);
  localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(users));
  
  return { success: true, message: '注册成功，请登录' };
};

// 模拟登出
export const logout = () => {
  localStorage.removeItem(CURRENT_USER_KEY);
};

// 获取当前登录用户
export const getCurrentUser = (): User | null => {
  const userString = localStorage.getItem(CURRENT_USER_KEY);
  if (!userString) return null;
  return JSON.parse(userString);
};
