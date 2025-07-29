// 文件: src/pages/SettingsProfile.tsx

import { useState, useEffect, useContext, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import apiClient from '@/services/apiClient';
import { AuthContext } from '@/contexts/authContext.tsx';
import Navbar from '@/components/Navbar';

export default function SettingsProfile() {
  const auth = useContext(AuthContext);
  const navigate = useNavigate();
  
  const [username, setUsername] = useState('');
  const [signature, setSignature] = useState('');
  const [email, setEmail] = useState('');
  const [avatarUrl, setAvatarUrl] = useState('');
  
  const [newAvatarFile, setNewAvatarFile] = useState<File | null>(null);
  const [avatarPreview, setAvatarPreview] = useState<string>('');
  
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  // 组件加载时，获取当前用户信息
  useEffect(() => {
    const fetchCurrentProfile = async () => {
      setIsLoading(true);
      try {
        const response = await apiClient.get('/profile');
        if (response.data.success) {
          const { username, signature, email, avatar } = response.data.data;
          setUsername(username);
          setSignature(signature || '');
          setEmail(email);
          setAvatarUrl(avatar);
          setAvatarPreview(avatar);
        } else {
          toast.error('无法加载您的个人信息');
        }
      } catch (error) {
        toast.error('网络错误，请稍后重试');
      } finally {
        setIsLoading(false);
      }
    };
    fetchCurrentProfile();
  }, []);

  // 处理文件选择
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setNewAvatarFile(file);
      // 创建本地预览URL
      const previewUrl = URL.createObjectURL(file);
      setAvatarPreview(previewUrl);
    }
  };

  // 处理表单提交
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    
    try {
      let finalAvatarUrl = avatarUrl;

      // 1. 如果有新头像，先上传头像
      if (newAvatarFile) {
        const formData = new FormData();
        formData.append('avatarFile', newAvatarFile);

        const uploadResponse = await apiClient.post('/profile/avatar', formData, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });

        if (uploadResponse.data.success) {
          finalAvatarUrl = uploadResponse.data.data.avatarUrl;
        } else {
          throw new Error(uploadResponse.data.message || '头像上传失败');
        }
      }

      // 2. 更新用户信息（包括可能已更新的头像URL）
      const updateData = { username, signature, avatar: finalAvatarUrl };
      const updateResponse = await apiClient.put('/profile', updateData);

      if (updateResponse.data.success) {
        toast.success('个人资料更新成功！');
        // 【重要】更新全局的用户状态
        if(auth) {
            auth.updateUser(updateResponse.data.data);
        }
        navigate(`/profile/${auth?.user?.uid}`); // 跳转回个人主页
      } else {
        throw new Error(updateResponse.data.message || '信息更新失败');
      }

    } catch (error: any) {
      toast.error(error.message || '操作失败，请重试');
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return <div>正在加载...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Navbar />
      <div className="max-w-2xl mx-auto p-4 sm:p-6 lg:p-8">
        <form onSubmit={handleSubmit} className="bg-white dark:bg-gray-800 shadow-lg rounded-2xl p-8 space-y-6">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">编辑个人资料</h1>
          
          {/* 头像设置 */}
          <div className="flex items-center space-x-6">
            <img 
              src={avatarPreview || `https://ui-avatars.com/api/?name=${username}`} 
              alt="Avatar Preview" 
              className="w-24 h-24 rounded-full object-cover"
            />
            <input 
              type="file" 
              ref={fileInputRef} 
              onChange={handleFileChange}
              accept="image/png, image/jpeg, image/gif"
              className="hidden"
            />
            <button 
              type="button" 
              onClick={() => fileInputRef.current?.click()}
              className="px-4 py-2 border rounded-lg text-sm font-medium hover:bg-gray-100 dark:hover:bg-gray-700"
            >
              更换头像
            </button>
          </div>

          {/* 用户名 */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">用户名</label>
            <input 
              type="text" 
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full px-3 py-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600"
            />
          </div>

          {/* 邮箱（只读） */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">邮箱</label>
            <input 
              type="email" 
              value={email}
              disabled
              className="w-full px-3 py-2 border rounded-lg bg-gray-100 dark:bg-gray-700/50 dark:border-gray-600 cursor-not-allowed"
            />
          </div>

          {/* 个性签名 */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">个性签名</label>
            <textarea 
              value={signature}
              onChange={(e) => setSignature(e.target.value)}
              rows={3}
              className="w-full px-3 py-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600"
              placeholder="介绍一下自己吧..."
            />
          </div>

          {/* 保存按钮 */}
          <div className="text-right">
            <button
              type="submit"
              disabled={isSaving}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 disabled:opacity-70"
            >
              {isSaving ? '保存中...' : '保存更改'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}