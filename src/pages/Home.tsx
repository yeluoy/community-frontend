import { Tabs, TabList, Tab, TabPanel } from '@/components/Tabs';
import Navbar from '@/components/Navbar';
import PostCard from '@/components/PostCard';
import { HotTags, ActiveUsers, Announcement } from '@/components/Sidebar';
import { mockPosts, hotTags, activeUsers } from '@/mocks/data';

export default function Home() {
  // 模拟不同排序的帖子数据
  const featuredPosts = [...mockPosts].sort((a, b) => b.likes - a.likes);
  const latestPosts = [...mockPosts].sort((a, b) => 
    new Date(b.createTime).getTime() - new Date(a.createTime).getTime()
  );
  const hottestPosts = [...mockPosts].sort((a, b) => {
    // 简单模拟热度计算：点赞数 + 评论数 * 2
    const hotA = a.likes + a.comments * 2;
    const hotB = b.likes + b.comments * 2;
    return hotB - hotA;
  });

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* 导航栏 */}
      <Navbar />

      {/* 主内容区 */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col md:flex-row gap-6">
          {/* 左侧主内容 */}
          <div className="w-full md:w-2/3">
            <Tabs defaultValue="featured" className="w-full">
              <TabList className="w-full">
                <Tab value="featured" className="flex-1">推荐</Tab>
                <Tab value="latest" className="flex-1">最新</Tab>
                <Tab value="hottest" className="flex-1">热门</Tab>
              </TabList>

              <TabPanel value="featured" className="mt-6">
                <div className="space-y-5">
                  {featuredPosts.map(post => (
                    <PostCard key={post.id} post={post} />
                  ))}
                </div>
              </TabPanel>

              <TabPanel value="latest" className="mt-6">
                <div className="space-y-5">
                  {latestPosts.map(post => (
                    <PostCard key={post.id} post={post} />
                  ))}
                </div>
              </TabPanel>

              <TabPanel value="hottest" className="mt-6">
                <div className="space-y-5">
                  {hottestPosts.map(post => (
                    <PostCard key={post.id} post={post} />
                  ))}
                </div>
              </TabPanel>
            </Tabs>
          </div>

          {/* 右侧边栏 */}
          <div className="w-full md:w-1/3 space-y-4">
            <HotTags tags={hotTags} />
            <ActiveUsers users={activeUsers} />
            <Announcement 
              title="网站公告" 
              content="社区新版块'AI讨论'已上线，欢迎大家积极分享AI技术相关内容和经验！" 
            />
          </div>
        </div>
      </main>

      {/* 页脚 */}
      <footer className="bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <p className="text-center text-sm text-gray-500 dark:text-gray-400">
            © 2025 TechForum 社区. 保留所有权利.
          </p>
        </div>
      </footer>
    </div>
  );
}