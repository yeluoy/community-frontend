// 文件: src/pages/Register.tsx

import { useState, useContext, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { AuthContext } from '@/contexts/authContext.tsx';
import { cn } from '@/lib/utils';

// 定义表单错误类型
type FormErrors = {
  email?: string;
  verificationCode?: string;
  username?: string;
  password?: string;
  confirmPassword?: string;
};

export default function Register() {
  // 表单字段的状态
  const [email, setEmail] = useState('');
  const [verificationCode, setVerificationCode] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  // 邮箱验证码相关的状态
  const [isCodeSending, setIsCodeSending] = useState(false);
  const [countdown, setCountdown] = useState(0);
  // 【新增】状态，用于跟踪用户是否已成功请求发送验证码
  const [hasSentCode, setHasSentCode] = useState(false);

  // 通用状态
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<FormErrors>({});
  
  const { register, sendVerificationCode } = useContext(AuthContext);
  const navigate = useNavigate();

  // 【新增】在组件加载时，检查sessionStorage来恢复状态
  useEffect(() => {
    const sentInfo = sessionStorage.getItem('verificationCodeSent');
    if (sentInfo) {
      const { email: storedEmail, timestamp } = JSON.parse(sentInfo);
      // 检查是否在5分钟有效期内
      if (Date.now() - timestamp < 5 * 60 * 1000) {
        setEmail(storedEmail);
        setHasSentCode(true);
        // 让用户不能再点击获取验证码或修改邮箱，除非他们刷新或重新进入
      } else {
        // 如果已过期，则清除存储
        sessionStorage.removeItem('verificationCodeSent');
      }
    }
  }, []); // 空依赖数组确保只在组件首次加载时运行

  // 处理发送邮箱验证码
  const handleSendCode = async () => {
    if (!email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setErrors({ email: '请输入有效的邮箱地址' });
      return;
    }
    
    setIsCodeSending(true);
    try {
      const result = await sendVerificationCode(email);
      if (result.success) {
        toast.success(result.message);
        setCountdown(60);
        // 【修改】当验证码发送成功时，更新状态
        setHasSentCode(true); 
        // 【新增】将发送状态和时间戳存入 sessionStorage
        const sentInfo = {
          email: email,
          timestamp: Date.now()
        };
        sessionStorage.setItem('verificationCodeSent', JSON.stringify(sentInfo));

      } else {
        toast.error(result.message);
        setErrors({ email: result.message });
      }
    } catch (err) {
      toast.error('发送失败，请稍后重试');
    } finally {
      setIsCodeSending(false);
    }
  };
  
  // 表单验证
  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};
    if (!email.trim()) newErrors.email = '请输入邮箱';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) newErrors.email = '请输入有效的邮箱地址';

    if (!verificationCode.trim()) newErrors.verificationCode = '请输入邮箱验证码';
    if (!username.trim()) newErrors.username = '请输入昵称';
    else if (username.length < 3 || username.length > 20) newErrors.username = '昵称长度必须在3-20个字符之间';
    
    // 【关键修改】使用正则表达式来验证密码
    if (!password) {
        newErrors.password = '请输入密码';
    } else {
        // 定义密码验证规则的正则表达式
        const passwordRegex = /^(?=.*\d)(?=.*[a-zA-Z])[\da-zA-Z~!@#$%^&*_]{8,18}$/;
        if (!passwordRegex.test(password)) {
            // 提供更详细、友好的错误提示
            newErrors.password = '密码必须为8-18位，且至少包含字母和数字。';
        }
    }
    
    if (!confirmPassword) {
        newErrors.confirmPassword = '请再次输入密码';
    } else if (confirmPassword !== password) {
        newErrors.confirmPassword = '两次输入的密码不一致';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
};
  
  // 处理表单提交
const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // 1. 前置流程检查 (保持不变)
    if (!hasSentCode) {
        toast.error('请先获取邮箱验证码');
        return;
    }
    if (!validateForm()) {
        return;
    }

    // 2. 开始加载，设置按钮为转圈状态
    setIsLoading(true);

    try {
        // 3. 发送注册请求
        const result = await register(username, email, password, verificationCode);

        // 4. 根据后端返回的结果进行分支处理
        if (result.success) {
            // --- 成功路径 ---
            toast.success(result.message || '注册成功！即将跳转...');
            // 准备跳转，此时不需要停止加载动画，因为组件即将被销毁
            setTimeout(() => {
                navigate('/login');
            }, 1500);

        } else {
            // --- 失败路径 (例如：邮箱已存在、验证码错误) ---
            toast.error(result.message || '注册失败，请重试');
            // 明确地停止加载动画，让用户可以再次点击
            setIsLoading(false);
        }

    } catch (err) {
        // --- 异常路径 (例如：网络请求失败、后端服务崩溃等) ---
        
        // 【新增】在控制台打印详细错误，这是调试的关键！
        console.error("注册过程中发生异常:", err); 
        
        toast.error('注册时发生网络错误，请检查网络连接或稍后重试');
        // 同样必须停止加载动画
        setIsLoading(false);
    }
};

  
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex flex-col">
      <div className="bg-white dark:bg-gray-800 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <Link to="/" className="flex items-center">
            <i className="fa-solid fa-comments text-blue-600 text-2xl mr-2"></i>
            <span className="font-bold text-xl text-gray-900 dark:text-white">TechForum</span>
          </Link>
          <Link to="/" className="text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400">
            <i className="fa-solid fa-arrow-left mr-1"></i> 返回首页
          </Link>
        </div>
      </div>
      
      <div className="flex-grow flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <div className="w-full max-w-md">
          <div className="bg-white dark:bg-gray-800 shadow-lg rounded-2xl overflow-hidden border border-gray-100 dark:border-gray-700">
            <div className="p-6 sm:p-8">
              <div className="text-center mb-8">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">创建账号</h2>
                <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">加入社区，分享你的知识</p>
              </div>
              
              <form onSubmit={handleSubmit} className="space-y-4">
                {/* 邮箱 */}
                <div>
                  <div className="relative">
                    <i className="fa-regular fa-envelope absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"></i>
                    <input
                      placeholder="请输入邮箱"
                      className={cn("w-full pl-10 pr-3 py-3 border rounded-lg focus:ring-blue-500 focus:border-blue-500", errors.email ? "border-red-500" : "border-gray-300 dark:border-gray-600")}
                      value={email} onChange={(e) => setEmail(e.target.value)} disabled={isLoading || countdown > 0}
                    />
                  </div>
                  {errors.email && <p className="mt-1 text-xs text-red-500">{errors.email}</p>}
                </div>
                
                {/* 邮箱验证码 */}
                <div>
                  <div className="flex gap-4">
                    <div className="relative flex-grow">
                      <i className="fa-regular fa-shield-check absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"></i>
                      <input
                        placeholder="请输入邮箱验证码"
                        className={cn("w-full pl-10 pr-3 py-3 border rounded-lg focus:ring-blue-500 focus:border-blue-500", errors.verificationCode ? "border-red-500" : "border-gray-300 dark:border-gray-600")}
                        value={verificationCode} onChange={(e) => setVerificationCode(e.target.value)} disabled={isLoading}
                      />
                    </div>
                    <button type="button" onClick={handleSendCode} disabled={isCodeSending || countdown > 0} className="w-32 px-4 py-2 border border-transparent rounded-lg text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400">
                      {isCodeSending ? <i className="fa-solid fa-spinner fa-spin"></i> : countdown > 0 ? `${countdown}s` : '获取验证码'}
                    </button>
                  </div>
                  {errors.verificationCode && <p className="mt-1 text-xs text-red-500">{errors.verificationCode}</p>}
                </div>

                {/* 昵称 */}
                <div>
                  <div className="relative">
                    <i className="fa-regular fa-user absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"></i>
                    <input
                      placeholder="请输入昵称"
                      className={cn("w-full pl-10 pr-3 py-3 border rounded-lg focus:ring-blue-500 focus:border-blue-500", errors.username ? "border-red-500" : "border-gray-300 dark:border-gray-600")}
                      value={username} onChange={(e) => setUsername(e.target.value)} disabled={isLoading}
                    />
                  </div>
                  {errors.username && <p className="mt-1 text-xs text-red-500">{errors.username}</p>}
                </div>

                {/* 密码 */}
                <div>
                  <div className="relative">
                    <i className="fa-solid fa-lock absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"></i>
                    <input
                      type="password" placeholder="请输入密码"
                      className={cn("w-full pl-10 pr-3 py-3 border rounded-lg focus:ring-blue-500 focus:border-blue-500", errors.password ? "border-red-500" : "border-gray-300 dark:border-gray-600")}
                      value={password} onChange={(e) => setPassword(e.target.value)} disabled={isLoading}
                    />
                  </div>
                  {errors.password && <p className="mt-1 text-xs text-red-500">{errors.password}</p>}
                </div>

                {/* 确认密码 */}
                <div>
                   <div className="relative">
                    <i className="fa-solid fa-lock absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"></i>
                    <input
                      type="password" placeholder="请再次输入密码"
                      className={cn("w-full pl-10 pr-3 py-3 border rounded-lg focus:ring-blue-500 focus:border-blue-500", errors.confirmPassword ? "border-red-500" : "border-gray-300 dark:border-gray-600")}
                      value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} disabled={isLoading}
                    />
                  </div>
                  {errors.confirmPassword && <p className="mt-1 text-xs text-red-500">{errors.confirmPassword}</p>}
                </div>

                {/* 5. 【移除】整个图形验证码的<div>...</div>代码块 */}
                
                <div className="pt-4">
  <button 
    type="submit" 
    disabled={isLoading} 
    className="w-full flex justify-center items-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-70"
  >
    {isLoading ? (
      <>
        <i className="fa-solid fa-spinner fa-spin mr-2"></i>
        <span>注册中...</span>
      </>
    ) : (
      <span>注册</span>
    )}
  </button>
</div>
              </form>
              
              <div className="mt-6 text-center">
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  已有账号？{' '}
                  <Link to="/login" className="font-medium text-blue-600 hover:text-blue-500">
                    立即登录
                  </Link>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}