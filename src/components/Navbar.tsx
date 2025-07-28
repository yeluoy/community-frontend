// 文件: src/components/Navbar.tsx

import { useContext, useState } from 'react';
import { Link } from 'react-router-dom';
import { AuthContext } from '@/contexts/authContext.tsx';
import { cn } from '@/lib/utils';

// 分区数据
const sections = [
  { id: '1', name: '技术问答' },
  { id: '2', name: '学习笔记' },
  { id: '3', name: 'AI讨论' },
  { id: '4', name: '求职招聘' },
  { id: '5', name: '经验分享' }
];

export default function Navbar() {
  const auth = useContext(AuthContext);
  const [searchQuery, setSearchQuery] = useState('');
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  // 【重要】检查AuthContext是否存在，防止因ContextProvider未包裹导致的错误
  if (!auth) {
    // 在开发环境中，这会帮助你快速定位到问题
    throw new Error("Navbar must be used within an AuthProvider");
  }
  const { isAuthenticated, user, logout } = auth;

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      console.log('Searching for:', searchQuery);
    }
  };

  return (
    <nav className="sticky top-0 z-50 bg-white shadow-md dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          {/* Logo和分区导航 - 桌面版 */}
          <div className="flex items-center">
            <Link to="/" className="flex-shrink-0 flex items-center">
              <i className="fa-solid fa-comments text-blue-600 text-2xl mr-2"></i>
              <span className="font-bold text-xl text-gray-900 dark:text-white">TechForum</span>
            </Link>
            
            <div className="hidden md:ml-10 md:flex md:space-x-8">
              {sections.map((section) => (
                <Link
                  key={section.id}
                  to={`/s/${section.id}`}
                  className="border-transparent text-gray-500 hover:border-blue-500 hover:text-blue-600 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium"
                >
                  {section.name}
                </Link>
              ))}
            </div>
          </div>

          {/* 搜索框和用户操作区 */}
          <div className="flex items-center">
            {/* 搜索框 */}
            <form onSubmit={handleSearch} className="relative mr-4 hidden md:block">
              <input
                type="text"
                placeholder="搜索帖子..."
                className="py-2 pl-10 pr-4 rounded-full border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent w-64"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <i className="fa-solid fa-search absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"></i>
            </form>

            {/* 创作按钮 - 仅登录后显示 */}
            {isAuthenticated && (
              <Link
                to="/create"
                className="hidden md:flex items-center px-4 py-2 border border-transparent rounded-full shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                <i className="fa-solid fa-pen-to-square mr-2"></i>
                发布帖子
              </Link>
            )}

            {/* 用户操作按钮 */}
            <div className="ml-4 flex items-center">
                {isAuthenticated && user ? ( // 【修改】这里增加了对 user 对象的检查，更安全
                  // 已登录状态 - 显示头像和下拉菜单
                  <div className="relative group">
                    <button
                      type="button"
                      className="flex text-sm rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                      id="user-menu-button"
                      aria-expanded="false"
                      aria-haspopup="true"
                    >
                      <img
                        className="h-8 w-8 rounded-full object-cover border-2 border-transparent hover:border-blue-500 transition-all"
                        src={user.avatar || `https://ui-avatars.com/api/?name=${user.username}`}
                        alt={user.username || "User avatar"}
                      />
                    </button>
                    
                    {/* 下拉菜单 */}
                    <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-lg shadow-lg py-1 z-10 border border-gray-200 dark:border-gray-700 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 transform origin-top-right scale-95 group-hover:scale-100">
                      
                      {/* --- 唯一的、核心的修改在这里！ --- */}
                      <Link
                        to={`/profile/${user.uid}`} // 使用 user.uid 动态生成链接
                        className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                      >
                        <i className="fa-solid fa-user mr-2"></i>个人主页
                      </Link>
                      
                      <Link
                        to="/settings"
                        className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                      >
                        <i className="fa-solid fa-cog mr-2"></i>设置
                      </Link>
                      <div className="border-t border-gray-200 dark:border-gray-700 my-1"></div>
                      <button
                        onClick={logout}
                        className="block w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                      >
                        <i className="fa-solid fa-sign-out-alt mr-2"></i>退出登录
                      </button>
                    </div>
                  </div>  
                ) : (
                  // 未登录状态 - 显示登录和注册按钮
                  <div className="hidden md:flex items-center space-x-3">
                    <Link
                      to="/login"
                      className="px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800 transition-colors"
                    >
                      登录
                    </Link>
                    <Link
                      to="/register"
                      className="px-3 py-2 rounded-md text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 transition-colors"
                    >
                      注册
                    </Link>
                  </div>
                )}

              {/* 移动端菜单按钮 */}
              <button
                type="button"
                className="ml-4 inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-500 md:hidden"
                aria-expanded="false"
                onClick={() => setIsMenuOpen(!isMenuOpen)}
              >
                <span className="sr-only">打开主菜单</span>
                <i className={cn("fa-solid", isMenuOpen ? "fa-times" : "fa-bars")}></i>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* 移动端菜单 */}
      {isMenuOpen && (
        <div className="md:hidden">
          <div className="pt-2 pb-3 space-y-1">
            {sections.map((section) => (
              <Link
                key={section.id}
                to={`/s/${section.id}`}
                className="block pl-3 pr-4 py-2 border-l-4 border-transparent text-base font-medium text-gray-500 hover:bg-gray-50 hover:border-blue-500 hover:text-blue-600"
              >
                {section.name}
              </Link>
            ))}
          </div>
          
          {/* 移动端搜索框 */}
          <div className="pt-4 pb-3 border-t border-gray-200">
            <form onSubmit={handleSearch} className="relative mx-4">
              <input
                type="text"
                placeholder="搜索帖子..."
                className="py-2 pl-10 pr-4 rounded-full border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent w-full"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <i className="fa-solid fa-search absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"></i>
            </form>
          </div>
          
          {/* 移动端创作/登录按钮 */}
          <div className="pt-4 pb-3 border-t border-gray-200">
            {isAuthenticated ? (
              <div className="flex justify-center">
                <Link
                  to="/create"
                  className="flex items-center px-4 py-2 border border-transparent rounded-full shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700"
                >
                  <i className="fa-solid fa-pen-to-square mr-2"></i>
                  发布帖子
                </Link>
              </div>
            ) : (
              <div className="flex justify-center space-x-3 px-4">
                <Link
                  to="/login"
                  className="flex-1 px-3 py-2 rounded-md text-sm font-medium text-center text-gray-700 border border-gray-300 hover:bg-gray-50"
                >
                  登录
                </Link>
                <Link
                  to="/register"
                  className="flex-1 px-3 py-2 rounded-md text-sm font-medium text-center text-white bg-blue-600 hover:bg-blue-700"
                >
                  注册
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}