// 文件: src/pages/UserProfile.tsx

import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { toast } from 'sonner';
import apiClient from '@/services/apiClient'; // 引入我们封装的axios实例
import { User } from '@/types'; // 假设User类型已包含新字段
import { cn } from '@/lib/utils';
import Navbar from '@/components/Navbar'; // 引入导航栏

// 定义从后端获取的用户信息类型
interface UserProfile extends User {
  signature?: string;
  postCount: number;
  commentCount: number;
  reputation: number;
  createdTime: string;
}

export default function UserProfile() {
  const { uid } = useParams<{ uid: string }>(); // 从URL中获取uid
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('posts');

  useEffect(() => {
    const fetchUserProfile = async () => {
      if (!uid) return;
      setIsLoading(true);
      try {
        const response = await apiClient.get(`/users/${uid}`);
        if (response.data.success) {
          setUserProfile(response.data.data);
        } else {
          toast.error(response.data.message || '获取用户信息失败');
        }
      } catch (error) {
        toast.error('网络错误，无法加载用户信息');
        console.error(error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserProfile();
  }, [uid]);

  if (isLoading) {
    return <div>正在加载用户资料...</div>; // 或者一个 Spinner 组件
  }

  if (!userProfile) {
    return <div>无法找到该用户。</div>;
  }

  const renderTabContent = () => {
    switch (activeTab) {
      case 'posts':
        return <div className="p-4 bg-gray-100 dark:bg-gray-800 rounded-lg">帖子列表功能待实现。</div>;
      case 'comments':
        return <div className="p-4 bg-gray-100 dark:bg-gray-800 rounded-lg">评论列表功能待实现。</div>;
      case 'likes':
        return <div className="p-4 bg-gray-100 dark:bg-gray-800 rounded-lg">点赞列表功能待实现。</div>;
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Navbar />
      <div className="max-w-4xl mx-auto p-4 sm:p-6 lg:p-8">
        {/* 用户信息卡片 */}
        <div className="bg-white dark:bg-gray-800 shadow-lg rounded-2xl p-6 mb-8 flex flex-col sm:flex-row items-center space-y-4 sm:space-y-0 sm:space-x-6">
          <img
            src={userProfile.avatar || `https://ui-avatars.com/api/?name=${userProfile.username}&background=random`}
            alt={userProfile.username}
            className="w-24 h-24 rounded-full border-4 border-blue-500"
          />
          <div className="text-center sm:text-left">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">{userProfile.username}</h1>
            <p className="text-gray-500 dark:text-gray-400 mt-1">
              {userProfile.signature || '这位用户很神秘，什么也没留下...'}
            </p>
            <p className="text-sm text-gray-400 dark:text-gray-500 mt-2">
              加入于 {new Date(userProfile.createdTime).toLocaleDateString()}
            </p>
          </div>
          <div className="flex-grow"></div>
          <div className="flex space-x-4 text-center">
            <div>
              <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">{userProfile.postCount}</p>
              <p className="text-sm text-gray-500">帖子</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">{userProfile.commentCount}</p>
              <p className="text-sm text-gray-500">评论</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">{userProfile.reputation}</p>
              <p className="text-sm text-gray-500">声望</p>
            </div>
          </div>
        </div>

        {/* Tab 导航 */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow">
          <div className="border-b border-gray-200 dark:border-gray-700">
            <nav className="-mb-px flex space-x-6 px-6" aria-label="Tabs">
              <button
                onClick={() => setActiveTab('posts')}
                className={cn(
                  'py-4 px-1 border-b-2 font-medium text-sm',
                  activeTab === 'posts'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                )}
              >
                他的帖子
              </button>
              <button
                onClick={() => setActiveTab('comments')}
                className={cn(
                  'py-4 px-1 border-b-2 font-medium text-sm',
                  activeTab === 'comments'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                )}
              >
                他的评论
              </button>
              <button
                onClick={() => setActiveTab('likes')}
                className={cn(
                  'py-4 px-1 border-b-2 font-medium text-sm',
                  activeTab === 'likes'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                )}
              >
                他的点赞
              </button>
            </nav>
          </div>
          <div className="p-4">
            {renderTabContent()}
          </div>
        </div>
      </div>
    </div>
  );
}