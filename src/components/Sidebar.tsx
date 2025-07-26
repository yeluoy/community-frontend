import { Link } from 'react-router-dom';
import { Tag, User } from '@/types';

interface HotTagsProps {
  tags: Tag[];
}

export function HotTags({ tags }: HotTagsProps) {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5 dark:bg-gray-800 dark:border-gray-700">
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
        <i className="fa-solid fa-fire text-orange-500 mr-2"></i>热门标签
      </h3>
      <div className="flex flex-wrap gap-2">
        {tags.map((tag) => (
          <Link
            key={tag.id}
            to={`/tag/${tag.id}`}
            className="inline-flex items-center px-3 py-1.5 rounded-full text-sm font-medium bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
          >
            {tag.name}
            <span className="ml-1 text-xs bg-white dark:bg-gray-800 px-1.5 py-0.25 rounded-full">
              {tag.count}
            </span>
          </Link>
        ))}
      </div>
    </div>
  );
}

interface ActiveUsersProps {
  users: User[];
}

export function ActiveUsers({ users }: ActiveUsersProps) {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5 mt-5 dark:bg-gray-800 dark:border-gray-700">
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
        <i className="fa-solid fa-trophy text-yellow-500 mr-2"></i>活跃用户
      </h3>
      <ul className="space-y-4">
        {users.map((user, index) => (
          <li key={user.id} className="flex items-center">
            <div className="flex-shrink-0 relative">
              <img
                className="h-10 w-10 rounded-full object-cover border-2 border-white dark:border-gray-800"
                src={user.avatar}
                alt={user.username}
              />
              {index < 3 && (
                <div className="absolute -top-1 -right-1 w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold text-white">
                  {index + 1}
                </div>
              )}
            </div>
            <div className="ml-3">
              <Link to={`/u/${user.id}`} className="text-sm font-medium text-gray-900 dark:text-white hover:text-blue-600 dark:hover:text-blue-400">
                {user.username}
              </Link>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                发帖 {user.postCount}
              </p>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

interface AnnouncementProps {
  title: string;
  content: string;
}

export function Announcement({ title, content }: AnnouncementProps) {
  return (
    <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl shadow-sm border border-blue-100 p-5 mt-5 dark:from-blue-900/30 dark:to-indigo-900/30 dark:border-blue-800">
      <h3 className="text-lg font-semibold text-blue-800 dark:text-blue-300 mb-2 flex items-center">
        <i className="fa-solid fa-bullhorn mr-2"></i>{title}
      </h3>
      <p className="text-sm text-blue-700 dark:text-blue-200 mb-3">
        {content}
      </p>
      <Link
        to="/announcement"
        className="text-xs font-medium text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 flex items-center"
      >
        查看详情 <i className="fa-solid fa-angle-right ml-1"></i>
      </Link>
    </div>
  );
}