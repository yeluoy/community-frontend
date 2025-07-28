// 文件: src/services/authService.ts
import apiClient from './apiClient';

/**
 * 登录函数
 */
export const loginApi = async (email, password) => {
  // axios返回的数据在 .data 属性里
  const { data } = await apiClient.post('/auth/login', { email, password });
  return data;
};

/**
 * 登出函数
 */
export const logoutApi = async () => {
    // 登出时，后端会从请求头中获取token，所以我们不需要传参
    await apiClient.post('/auth/logout');
};