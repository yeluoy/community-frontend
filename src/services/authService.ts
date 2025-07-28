// 文件: src/services/authService.ts (或修改 mocks/auth.ts)

// 从环境变量获取API基地址
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8081/api';

/**
 * 登录函数
 */
export const loginApi = async (email, password) => {
  const response = await fetch(`${API_BASE_URL}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  });
  if (!response.ok) {
    // 如果HTTP状态码不是2xx，也认为是错误
    throw new Error('网络响应错误');
  }
  return response.json();
};

/**
 * 登出函数
 * 注意：一个完整的登出应该把refreshToken发给后端，让后端将其失效
 */
export const logoutApi = async (refreshToken) => {
    // 这是一个可选的实现，如果后端需要知道哪个refreshToken失效了
    // 如果后端登出只是简单地让前端删除token，则此API调用可以省略
    await fetch(`${API_BASE_URL}/auth/logout`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ refreshToken }),
    });
};

// ... 此处还可以添加 refreshTokenApi 等其他函数