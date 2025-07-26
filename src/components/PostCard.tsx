import { Link } from 'react-router-dom';
import { Post } from '@/types';
import { cn } from '@/lib/utils';

// 格式化时间函数
const formatTimeAgo = (dateString: string) => {
  const date = new Date(dateString);
  const now = new Date();
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);
  
  let interval = Math.floor(diffInSeconds / 31536000);
  if (interval >= 1) return `${interval}年前`;
  
  interval = Math.floor(diffInSeconds / 2592000);
  if (interval >= 1) return `${interval}个月前`;
  
  interval = Math.floor(diffInSeconds / 86400);
  if (interval >= 1) return `${interval}天前`;
  
  interval = Math.floor(diffInSeconds / 3600);
  if (interval >= 1) return `${interval}小时前`;
  
  interval = Math.floor(diffInSeconds / 60);
  if (interval >= 1) return `${interval}分钟前`;
  
  return '刚刚';
};

interface PostCardProps {
  post: Post;
}

export default function PostCard({ post }: PostCardProps) {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow duration-200 overflow-hidden dark:bg-gray-800 dark:border-gray-700">
      <div className="p-5">
        <div className="flex items-start justify-between mb-3">
          <Link to={`/s/${post.section.id}`} className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-100">
            {post.section.name}
          </Link>
          <span className="text-xs text-gray-500 dark:text-gray-400">
            {formatTimeAgo(post.createTime)}
          </span>
        </div>
        
        <Link to={`/p/${post.id}`} className="block mb-3">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white hover:text-blue-600 dark:hover:text-blue-400 transition-colors line-clamp-2">
            {post.title}
          </h2>
        </Link>
        
        <p className="text-gray-600 dark:text-gray-300 text-sm mb-4 line-clamp-2">
          {post.summary}
        </p>
        
        <div className="flex flex-wrap gap-1 mb-4">
          {post.tags.map((tag) => (
            <Link 
              key={tag.id} 
              to={`/tag/${tag.id}`}
              className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-600"
            >
              {tag.name}
            </Link>
          ))}
        </div>
        
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <Link to={`/u/${post.author.id}`} className="flex items-center">
              <img
                className="h-8 w-8 rounded-full object-cover"
                src={post.author.avatar}
                alt={post.author.username}
              />
              <span className="ml-2 text-sm font-medium text-gray-700 dark:text-gray-300">
                {post.author.username}
              </span>
            </Link>
          </div>
          
          <div className="flex items-center space-x-4">
            <button className="flex items-center text-gray-500 hover:text-blue-500 dark:text-gray-400 dark:hover:text-blue-400">
              <i className="fa-regular fa-thumbs-up mr-1"></i>
              <span className="text-sm">{post.likes}</span>
            </button>
            <button className="flex items-center text-gray-500 hover:text-green-500 dark:text-gray-400 dark:hover:text-green-400">
              <i className="fa-regular fa-comment mr-1"></i>
              <span className="text-sm">{post.comments}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}