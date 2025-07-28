// 文件: src/services/apiClient.ts

// 封装一个fetch函数，自动添加认证头
export const authFetch = async (url, options = {}) => {
  const token = localStorage.getItem('accessToken');

  const headers = {
    'Content-Type': 'application/json',
    ...options.headers, // 合并传入的headers
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const response = await fetch(url, { ...options, headers });

  // 在这里可以添加全局的错误处理，比如token失效（401错误）时
  // 自动调用刷新token的API，或者直接登出
  if (response.status === 401) {
      // token失效，执行登出逻辑
      // 注意：这里直接调用logout()可能会有问题，最好通过事件或回调
      console.error("Token expired or invalid. Logging out.");
      // 简单的实现：
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
      localStorage.removeItem('user');
      window.location.href = '/login';
  }

  return response;
};