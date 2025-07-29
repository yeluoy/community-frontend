// 文件: src/pages/UserProfile.tsx

import { useEffect, useState, useContext } from 'react';
import { useParams, Link } from 'react-router-dom';
import { toast } from 'sonner';
import apiClient from '@/services/apiClient';
import { User, Post } from '@/types';
import { cn } from '@/lib/utils';
import Navbar from '@/components/Navbar';
import PostCard from '@/components/PostCard';
// 【关键修复】确保这里的导入路径和方式完全正确
import { AuthContext } from '@/contexts/authContext.tsx';

// 1. 定义更完整的数据类型
interface UserProfileData extends User {
  signature: string;
  reputation: number;
  postCount: number;
  commentCount: number;
  followerCount: number;
  followingCount: number;
  createdTime: string;
  isOwner: boolean;
}

interface PagedData<T> {
  records: T[];
  totalRecords: number;
  // ... 其他分页信息
}

export default function UserProfile() {
  const { uid } = useParams<{ uid: string }>();
  // 【修复】从 AuthContext 中获取 user 对象
  const auth = useContext(AuthContext);
  const currentUser = auth?.user;
  
  const [profile, setProfile] = useState<UserProfileData | null>(null);
  const [posts, setPosts] = useState<PagedData<Post> | null>(null);
  const [activeTab, setActiveTab] = useState('posts');
  const [isLoading, setIsLoading] = useState(true);
  const [isTabLoading, setIsTabLoading] = useState(false);

  // 获取用户基本资料的函数
  useEffect(() => {
    const fetchUserProfile = async () => {
      if (!uid) return;
      setIsLoading(true);
      try {
        const response = await apiClient.get(`/users/${uid}`);
        if (response.data.success) {
          setProfile(response.data.data);
        } else {
          toast.error(response.data.message || '获取用户信息失败');
        }
      } catch (error) {
        toast.error('网络错误，无法加载用户信息');
      } finally {
        setIsLoading(false);
      }
    };
    fetchUserProfile();
  }, [uid]);

  // 根据激活的Tab获取对应数据的函数
  useEffect(() => {
    const fetchDataForTab = async () => {
      if (!uid) return;
      setIsTabLoading(true);

      let apiUrl = '';
      switch (activeTab) {
        case 'posts':
          apiUrl = `/users/${uid}/posts`;
          break;
        case 'comments':
          setPosts(null);
          setIsTabLoading(false);
          return;
        case 'likes':
           setPosts(null);
          setIsTabLoading(false);
          return;
        case 'collections':
          apiUrl = `/users/${uid}/collections`;
          break;
        default:
          setIsTabLoading(false);
          return;
      }
      
      try {
        const response = await apiClient.get(apiUrl, { params: { page: 1, size: 10 } });
        if (response.data.success) {
          setPosts(response.data.data);
        } else {
          toast.error(`获取${activeTab}列表失败`);
          setPosts(null);
        }
      } catch (error) {
        toast.error('网络错误，无法加载列表数据');
        setPosts(null);
      } finally {
        setIsTabLoading(false);
      }
    };
    
    fetchDataForTab();
  }, [uid, activeTab]);


  if (isLoading) {
    return <div>正在加载...</div>;
  }

  if (!profile) {
    return <div>用户不存在。</div>;
  }

  // 渲染Tab内容的函数
  const renderTabContent = () => {
    if (isTabLoading) {
      return <div>正在加载内容...</div>;
    }
    
    if (!posts || posts.records.length === 0) {
      return (
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 p-12 text-center">
          <i className="fa-regular fa-file-lines text-5xl text-gray-300 dark:text-gray-600 mb-4"></i>
          <h3 className="text-xl font-medium text-gray-900 dark:text-white mb-2">暂无内容</h3>
          <p className="text-gray-500 dark:text-gray-400">这里什么都没有哦~</p>
        </div>
      );
    }
    
    return (
      <div className="space-y-5">
        {posts.records.map(post => (
          // @ts-ignore
          <PostCard key={post.id} post={post} />
        ))}
      </div>
    );
  };
  

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex flex-col">
      <Navbar />
      
      {/* 个人资料头部 */}
      <div className="bg-gradient-to-r from-blue-500 to-indigo-600 py-12 md:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="relative flex flex-col md:flex-row items-center">
            <img
              className="h-28 w-28 md:h-32 md:w-32 rounded-full border-4 border-white shadow-lg object-cover"
              src={profile.avatar || `https://ui-avatars.com/api/?name=${profile.username}`}
              alt={profile.username}
            />
            
            <div className="mt-6 md:mt-0 md:ml-8 text-center md:text-left">
              <h1 className="text-3xl md:text-4xl font-bold text-white">{profile.username}</h1>
              <p className="mt-2 text-blue-100 max-w-2xl">{profile.signature || '这个人很酷，什么也没留下。'}</p>
              
              {/* 优化后的用户信息行 */}
<div className="mt-5 flex flex-wrap justify-center md:justify-start items-center gap-x-6 gap-y-3 text-sm text-blue-100">
  
  {/* 声望 */}
  <div className="flex items-center" title="声望值">
    <i className="fa-solid fa-star-of-life w-4 h-4 mr-2"></i>
    <span>声望 <span className="font-semibold text-white">{profile.reputation}</span></span>
  </div>
  
  {/* 帖子 */}
  <div className="flex items-center" title="帖子数">
    <i className="fa-regular fa-file-lines w-4 h-4 mr-2"></i>
    <span>帖子 <span className="font-semibold text-white">{profile.postCount}</span></span>
  </div>
  
  {/* 加入日期 */}
  <div className="flex items-center" title="加入日期">
    <i className="fa-solid fa-calendar-alt w-4 h-4 mr-2"></i>
    <span>加入于 <span className="font-semibold text-white">{new Date(profile.createdTime).toLocaleDateString()}</span></span>
  </div>

</div>
            </div>

            <div className="flex-grow"></div>
            
            <div className="mt-6 md:mt-0 flex items-center space-x-6">
                <div className="text-center">
                    <p className="text-2xl font-bold text-white">{profile.followingCount}</p>
                    <p className="text-blue-100">关注</p>
                </div>
                <div className="text-center">
                    <p className="text-2xl font-bold text-white">{profile.followerCount}</p>
                    <p className="text-blue-100">粉丝</p>
                </div>
                { profile.isOwner ? (
                    <Link to="/settings/profile" className="px-4 py-2 bg-white/20 text-white rounded-lg hover:bg-white/30 transition-colors">编辑资料</Link>
                ) : (
                    <button className="px-4 py-2 bg-white text-blue-600 font-semibold rounded-lg hover:bg-gray-100 transition-colors">关注</button>
                )}
            </div>
          </div>
        </div>
      </div>
      
      {/* 主内容区 */}
      <main className="max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
            <div className="border-b border-gray-200 dark:border-gray-700">
                <nav className="flex space-x-2 md:space-x-4 p-2">
                    {['posts', 'comments', 'likes', 'collections'].map(tab => (
                        <button
                            key={tab}
                            onClick={() => setActiveTab(tab)}
                            className={cn(
                                'px-3 py-2 font-medium text-sm rounded-md transition-colors',
                                activeTab === tab
                                ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/50 dark:text-blue-300'
                                : 'text-gray-500 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-700'
                            )}
                        >
                            {
                                { posts: '他的创作', comments: '他的评论', likes: '他的点赞', collections: '他的收藏' }[tab]
                            }
                        </button>
                    ))}
                </nav>
            </div>
            <div className="p-4 md:p-6">
                {renderTabContent()}
            </div>
        </div>
      </main>
    </div>
  );
}