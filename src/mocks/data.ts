import { Post, Tag, User } from '@/types';

// 模拟用户数据
export const mockUsers: User[] = [
  {
    id: '1',
    username: '技术达人',
    avatar: 'https://space.coze.cn/api/coze_space/gen_image?image_size=square&prompt=User+avatar+1&sign=7cc5e5e9d261bde8ce5fccdb28c709aa',
    joinDate: '2023-01-15',
    postCount: 42
  },
  {
    id: '2',
    username: '学习笔记',
    avatar: 'https://space.coze.cn/api/coze_space/gen_image?image_size=square&prompt=User+avatar+2&sign=f2938273b9dc9bc101407615eb648d08',
    joinDate: '2023-03-22',
    postCount: 28
  },
  {
    id: '3',
    username: '前端开发',
    avatar: 'https://space.coze.cn/api/coze_space/gen_image?image_size=square&prompt=User+avatar+3&sign=c8bb87cc81bc89d5d3d3ceaa37903fe2',
    joinDate: '2022-11-05',
    postCount: 56
  },
  {
    id: '4',
    username: '后端架构',
    avatar: 'https://space.coze.cn/api/coze_space/gen_image?image_size=square&prompt=User+avatar+4&sign=3fac798f0cb9117a50b7190050f54f04',
    joinDate: '2023-05-18',
    postCount: 33
  },
  {
    id: '5',
    username: 'AI爱好者',
    avatar: 'https://space.coze.cn/api/coze_space/gen_image?image_size=square&prompt=User+avatar+5&sign=2ead1d98a8cc4677740377f885d9d597',
    joinDate: '2023-02-10',
    postCount: 47
  }
];

// 模拟帖子数据
export const mockPosts: Post[] = [
  {
    id: '1',
    title: 'React 18新特性详解及迁移指南',
    author: mockUsers[0],
    section: { id: '1', name: '技术问答' },
    summary: '本文详细介绍了React 18的并发渲染、自动批处理、过渡机制等新特性，并提供了从旧版本迁移的实用指南和注意事项。',
    likes: 128,
    comments: 45,
    createTime: '2025-07-25T14:30:00Z',
    tags: [
      { id: '1', name: 'React', count: 320 },
      { id: '2', name: '前端', count: 540 }
    ]
  },
  {
    id: '2',
    title: 'TypeScript高级类型技巧与最佳实践',
    author: mockUsers[2],
    section: { id: '1', name: '技术问答' },
    summary: '探索TypeScript中的条件类型、映射类型、模板字面量类型等高级特性，以及如何在大型项目中有效应用这些技巧提升代码质量。',
    likes: 96,
    comments: 32,
    createTime: '2025-07-25T11:15:00Z',
    tags: [
      { id: '3', name: 'TypeScript', count: 280 },
      { id: '2', name: '前端', count: 540 }
    ]
  },
  {
    id: '3',
    title: '我的前端学习路线与资源分享',
    author: mockUsers[1],
    section: { id: '2', name: '学习笔记' },
    summary: '作为一名自学前端的开发者，我整理了过去一年的学习路线图、优质资源推荐以及遇到的常见问题和解决方案，希望能帮助到刚入行的同学。',
    likes: 215,
    comments: 87,
    createTime: '2025-07-24T09:45:00Z',
    tags: [
      { id: '4', name: '学习路线', count: 156 },
      { id: '5', name: '资源分享', count: 128 }
    ]
  },
  {
    id: '4',
    title: 'Node.js微服务架构设计与实践',
    author: mockUsers[3],
    section: { id: '1', name: '技术问答' },
    summary: '讨论如何使用Node.js构建可扩展的微服务架构，包括服务发现、API网关、负载均衡、容错处理等关键技术点，并提供实际项目案例分析。',
    likes: 156,
    comments: 53,
    createTime: '2025-07-24T16:20:00Z',
    tags: [
      { id: '6', name: 'Node.js', count: 210 },
      { id: '7', name: '微服务', count: 185 }
    ]
  },
  {
    id: '5',
    title: '大语言模型在前端开发中的应用探索',
    author: mockUsers[4],
    section: { id: '3', name: 'AI讨论' },
    summary: '探索如何将GPT等大语言模型集成到前端开发流程中，包括代码生成、自动补全、文档生成、测试用例创建等实际应用场景。',
    likes: 189,
    comments: 67,
    createTime: '2025-07-23T10:30:00Z',
    tags: [
      { id: '8', name: 'AI', count: 342 },
      { id: '9', name: '大语言模型', count: 215 },
      { id: '2', name: '前端', count: 540 }
    ]
  }
];

// 模拟热门标签数据
export const hotTags: Tag[] = [
  { id: '2', name: '前端', count: 540 },
  { id: '8', name: 'AI', count: 342 },
  { id: '1', name: 'React', count: 320 },
  { id: '3', name: 'TypeScript', count: 280 },
  { id: '7', name: '微服务', count: 185 },
  { id: '6', name: 'Node.js', count: 210 },
  { id: '10', name: '数据库', count: 175 },
  { id: '11', name: '性能优化', count: 163 }
];

// 模拟活跃用户数据
export const activeUsers = mockUsers.slice(0, 5);