import { useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { AuthContext } from '@/contexts/authContext.tsx';
import { cn } from '@/lib/utils';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<{ email?: string; password?: string }>({});

  const auth = useContext(AuthContext);
  const navigate = useNavigate();

  // This check is crucial to ensure AuthContext is available.
  if (!auth) {
    throw new Error("Login component must be used within an AuthProvider");
  }

  // A simple validation function just for the login form.
  const validateForm = (): boolean => {
    const newErrors: { email?: string; password?: string } = {};
    if (!email.trim()) {
      newErrors.email = '请输入邮箱';
    }
    if (!password.trim()) {
      newErrors.password = '请输入密码';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // The handleSubmit function now correctly interacts with the AuthContext.
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) {
      return;
    }

    setIsLoading(true);
    setErrors({}); // Clear previous errors

    try {
      const result = await auth.login(email, password);

      if (result.success) {
        toast.success('登录成功！');
        navigate('/'); // Redirect to home on success
      } else {
        toast.error(result.message || '登录失败，请重试');
      }
    } catch (error) {
      toast.error('登录时发生网络错误，请重试');
      console.error('Login error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // --- Your Original UI Code (Unchanged) ---
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex flex-col">
      {/* 顶部导航 */}
      <div className="bg-white dark:bg-gray-800 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <Link to="/" className="flex items-center">
            <i className="fa-solid fa-comments text-blue-600 text-2xl mr-2"></i>
            <span className="font-bold text-xl text-gray-900 dark:text-white">TechForum</span>
          </Link>
          <div>
            <Link
              to="/"
              className="text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400"
            >
              <i className="fa-solid fa-arrow-left mr-1"></i> 返回首页
            </Link>
          </div>
        </div>
      </div>

      {/* 主内容区 */}
      <div className="flex-grow flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <div className="w-full max-w-md">
          <div className="bg-white dark:bg-gray-800 shadow-lg rounded-2xl overflow-hidden border border-gray-100 dark:border-gray-700">
            <div className="p-6 sm:p-8">
              <div className="text-center mb-8">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">欢迎回来</h2>
                <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
                  请输入您的账号信息登录
                </p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  {/* The label was removed in your latest version, so I've kept it that way */}
                  <div className="relative">
                    <i className="fa-regular fa-envelope absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"></i>
                    <input
                      id="email"
                      name="email"
                      type="email"
                      autoComplete="email"
                      required
                      className={cn(
                        "block w-full pl-10 pr-3 py-3 border rounded-lg focus:ring-blue-500 focus:border-blue-500",
                        "dark:bg-gray-700 dark:text-white dark:border-gray-600",
                        errors.email ? "border-red-500 focus:ring-red-500 focus:border-red-500" : "border-gray-300"
                      )}
                      placeholder="邮箱" // Added placeholder for better UX
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      disabled={isLoading}
                    />
                  </div>
                  {errors.email && (
                    <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.email}</p>
                  )}
                </div>

                <div>
                  <div className="relative">
                     <i className="fa-solid fa-lock absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"></i>
                    <input
                      id="password"
                      name="password"
                      type="password"
                      autoComplete="current-password"
                      required
                      className={cn(
                        "block w-full pl-10 pr-3 py-3 border rounded-lg focus:ring-blue-500 focus:border-blue-500",
                         "dark:bg-gray-700 dark:text-white dark:border-gray-600",
                        errors.password ? "border-red-500 focus:ring-red-500 focus:border-red-500" : "border-gray-300"
                      )}
                      placeholder="密码" // Added placeholder for better UX
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      disabled={isLoading}
                    />
                  </div>
                  {errors.password && (
                    <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.password}</p>
                  )}
                </div>

                <div>
                  <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 dark:focus:ring-offset-gray-800 disabled:opacity-70 disabled:cursor-not-allowed"
                  >
                    {isLoading ? (
                      <>
                        <i className="fa-solid fa-spinner fa-spin mr-2"></i> 
                        <span>登录中...</span>
                      </>
                    ) : (
                      <span>登录</span>
                    )}
                  </button>
                </div>
              </form>

              <div className="mt-6 text-center">
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  还没有账号？{' '}
                  <Link
                    to="/register"
                    className="font-medium text-blue-600 dark:text-blue-400 hover:text-blue-500 dark:hover:text-blue-300"
                  >
                    立即注册
                  </Link>
                </p>
              </div>
            </div>
          </div>
          {/* I've removed the hardcoded test account info to match your latest UI */}
        </div>
      </div>
    </div>
  );
}