// 文件: src/services/apiClient.ts
import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8081/api';

const apiClient = axios.create({
  baseURL: API_BASE_URL,
});

// 请求拦截器（保持不变）
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('accessToken');
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// 【关键修改】响应拦截器
apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // 【修复】首先检查 error.response 是否存在
    // 只有当存在 response 且状态码为 401 时，才执行刷新token的逻辑
    if (error.response && error.response.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const refreshToken = localStorage.getItem('refreshToken');
        if (!refreshToken) {
            window.location.href = '/login';
            return Promise.reject(error);
        }

        const { data: refreshResult } = await axios.post(`${API_BASE_URL}/auth/refreshToken`, { refreshToken });
        
        if (refreshResult.success) {
          const { accessToken: newAccessToken, refreshToken: newRefreshToken } = refreshResult.data;
          
          localStorage.setItem('accessToken', newAccessToken);
          localStorage.setItem('refreshToken', newRefreshToken);
          
          apiClient.defaults.headers.common['Authorization'] = `Bearer ${newAccessToken}`;
          originalRequest.headers['Authorization'] = `Bearer ${newAccessToken}`;
          
          return apiClient(originalRequest);
        }
      } catch (refreshError) {
        console.error("无法刷新Token", refreshError);
        // 清理并跳转到登录页
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        localStorage.removeItem('user');
        window.location.href = '/login';
        return Promise.reject(refreshError);
      }
    }

    // 对于其他所有错误（包括网络错误），直接将错误继续传递下去
    return Promise.reject(error);
  }
);

export default apiClient;