// 用户类型定义
export interface User {
  id: string;
  username: string;
  avatar: string;
  joinDate: string;
  postCount?: number;
}

// 帖子类型定义
export interface Post {
  id: string;
  title: string;
  author: User;
  section: {
    id: string;
    name: string;
  };
  summary: string;
  likes: number;
  comments: number;
  createTime: string;
  tags: Tag[];
}

// 标签类型定义
export interface Tag {
  id: string;
  name: string;
  count: number;
}