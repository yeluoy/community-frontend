// 文件: src/pages/CreatePost.tsx

import { useState, useEffect, useContext, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { AuthContext } from '@/contexts/authContext.tsx';
import Navbar from '@/components/Navbar';
import { cn } from '@/lib/utils';
import { hotTags } from '@/mocks/data'; // 热门标签暂时继续使用mock数据
import apiClient from '@/services/apiClient';

// 定义从后端获取的分区类型
interface Section {
  id: number | string;
  name: string;
}

export default function CreatePost() {
  const { isAuthenticated } = useContext(AuthContext);
  const auth = useContext(AuthContext);
  const navigate = useNavigate();

  // 状态管理
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    sectionId: '',
    tags: [] as string[]
  });
  const [sections, setSections] = useState<Section[]>([]);
  const [activeTab, setActiveTab] = useState('edit');
  const [tagInput, setTagInput] = useState('');
  const [errors, setErrors] = useState<{ title?: string; content?: string; sectionId?: string; tags?: string; }>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const contentTextAreaRef = useRef<HTMLTextAreaElement>(null);

  // 检查登录状态 & 动态获取分区数据
  useEffect(() => {
    if (!isAuthenticated) {
      toast.error('请先登录后再发布帖子');
      navigate('/login');
      return;
    }
    const fetchSections = async () => {
      try {
        const response = await apiClient.get('/sections');
        if (response.data.success && response.data.data.length > 0) {
          const fetchedSections = response.data.data;
          setSections(fetchedSections);
          setFormData(prev => ({ ...prev, sectionId: fetchedSections[0].id }));
        } else {
          toast.error(response.data.message || '分区列表加载失败');
        }
      } catch (error) {
        toast.error('网络错误，无法加载分区列表');
      }
    };
    fetchSections();
  }, [isAuthenticated, navigate]);

  // 事件处理函数
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { id, value } = e.target;
    setFormData(prev => ({ ...prev, [id]: value }));
    if (errors[id]) {
      setErrors(prev => ({ ...prev, [id]: undefined }));
    }
  };

  const addTag = (tag?: string) => {
    const tagToAdd = (tag || tagInput.trim()).toLowerCase();
    if (tagToAdd && !formData.tags.includes(tagToAdd) && formData.tags.length < 5) {
      setFormData(prev => ({ ...prev, tags: [...prev.tags, tagToAdd] }));
      setTagInput('');
    }
  };

  const removeTag = (tagToRemove: string) => {
    setFormData(prev => ({ ...prev, tags: formData.tags.filter(tag => tag !== tagToRemove) }));
  };
  
  const handleTagKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      addTag();
    }
  };
  
  const applyFormatting = (format: string) => {
    const textarea = contentTextAreaRef.current;
    if (!textarea) return;
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = formData.content.substring(start, end);
    let newText = '';
    
    switch (format) {
      case 'bold': newText = `**${selectedText}**`; break;
      case 'italic': newText = `*${selectedText}*`; break;
      case 'heading': newText = `# ${selectedText}`; break;
      case 'link': newText = `[${selectedText || '链接文本'}](https://)`; break;
      case 'code': newText = `\`\`\`\n${selectedText || '代码'}\n\`\`\``; break;
      default: return;
    }
    
    const newContent = formData.content.substring(0, start) + newText + formData.content.substring(end);
    setFormData({ ...formData, content: newContent });
    
    setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(start + newText.length, start + newText.length);
    }, 0);
  };

  // 表单验证
  const validateForm = () => {
    const newErrors: typeof errors = {};
    if (!formData.title.trim() || formData.title.length > 100) newErrors.title = '请输入1-100个字符的标题';
    if (!formData.content.trim() || formData.content.length < 10) newErrors.content = '请输入至少10个字符的内容';
    if (!formData.sectionId) newErrors.sectionId = '请选择一个分区';
    if (formData.tags.length === 0) newErrors.tags = '请至少添加一个标签';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // 数据提交
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsSubmitting(true);
    try {
      const response = await apiClient.post('/posts', {
        title: formData.title,
        content: formData.content,
        sectionId: formData.sectionId,
        tags: formData.tags,
      });

      if (response.data.success) {
        toast.success('帖子发布成功！');
        
        // --- 【关键修改】在这里选择你的跳转逻辑 ---

        // 方案A：跳转到首页 (最简单)
        // navigate('/');

        // 方案B：跳转到当前登录用户的个人主页
        if (auth?.user?.uid) {
            navigate(`/profile/${auth.user.uid}`);
        } else {
            // 如果因为某些原因无法获取用户信息，则默认跳转到首页
            navigate('/');
        }

        // 方案C (推荐，但需要后端支持)：跳转到新创建的帖子详情页
        // 这需要你的后端在成功创建帖子后，返回新帖子的ID或UID
        // const newPostId = response.data.data.postId; 
        // navigate(`/post/${newPostId}`); 

      } else {
        toast.error(response.data.message || '发布失败，请重试');
      }
    } catch (error) {
      toast.error('发布时发生网络错误');
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex flex-col">
      <Navbar />
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex-grow w-full">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
          <div className="p-6 sm:p-8">
            <h1 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">发布新帖子</h1>
            <form onSubmit={handleSubmit} className="space-y-6">
              
              {/* 标题 */}
              <div>
                <label htmlFor="title" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">标题</label>
                <input id="title" type="text" value={formData.title} onChange={handleInputChange} placeholder="请输入帖子标题..." className={cn("block w-full px-3 py-2 border rounded-md shadow-sm", errors.title ? "border-red-500" : "border-gray-300 dark:border-gray-600")} />
                <p className="mt-1 text-xs text-gray-500">{formData.title.length}/100 字符</p>
              </div>
              
              {/* 分区 */}
              <div>
                <label htmlFor="sectionId" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">分区</label>
                <select id="sectionId" value={formData.sectionId} onChange={handleInputChange} className={cn("block w-full px-3 py-2 border rounded-md shadow-sm", errors.sectionId ? "border-red-500" : "border-gray-300 dark:border-gray-600")}>
                  {sections.map(section => <option key={section.id} value={section.id}>{section.name}</option>)}
                </select>
              </div>

              {/* 正文 (支持Markdown) */}
              <div>
                <label htmlFor="content" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">正文 (支持Markdown格式)</label>
                <div className="border border-gray-300 dark:border-gray-600 rounded-md shadow-sm">
                  <div className="flex items-center space-x-2 p-2 bg-gray-50 dark:bg-gray-700 border-b border-gray-300 dark:border-gray-600">
                    <button type="button" onClick={() => applyFormatting('bold')} className="p-2 hover:bg-gray-200 dark:hover:bg-gray-600 rounded" title="加粗"><i className="fa-solid fa-bold"></i></button>
                    <button type="button" onClick={() => applyFormatting('italic')} className="p-2 hover:bg-gray-200 dark:hover:bg-gray-600 rounded" title="斜体"><i className="fa-solid fa-italic"></i></button>
                    <button type="button" onClick={() => applyFormatting('heading')} className="p-2 hover:bg-gray-200 dark:hover:bg-gray-600 rounded" title="标题"><i className="fa-solid fa-heading"></i></button>
                    <button type="button" onClick={() => applyFormatting('link')} className="p-2 hover:bg-gray-200 dark:hover:bg-gray-600 rounded" title="链接"><i className="fa-solid fa-link"></i></button>
                    <button type="button" onClick={() => applyFormatting('code')} className="p-2 hover:bg-gray-200 dark:hover:bg-gray-600 rounded" title="代码块"><i className="fa-solid fa-code"></i></button>
                  </div>
                  <div className="flex border-b border-gray-300 dark:border-gray-600">
                    <button type="button" onClick={() => setActiveTab('edit')} className={`py-2 px-4 text-sm font-medium ${activeTab === 'edit' ? 'border-b-2 border-blue-500 text-blue-600' : 'text-gray-500 hover:text-gray-700'}`}>编辑</button>
                    <button type="button" onClick={() => setActiveTab('preview')} className={`py-2 px-4 text-sm font-medium ${activeTab === 'preview' ? 'border-b-2 border-blue-500 text-blue-600' : 'text-gray-500 hover:text-gray-700'}`}>预览</button>
                  </div>
                  {activeTab === 'edit' ? (
                    <textarea id="content" ref={contentTextAreaRef} value={formData.content} onChange={handleInputChange} placeholder="请输入帖子内容，支持Markdown格式..." rows={15} className="block w-full p-3 font-mono text-sm border-0 focus:ring-0 resize-y" />
                  ) : (
                    // 【关键修改】在这里应用 'prose' 类
                    <div className="min-h-[360px] p-4 prose dark:prose-invert max-w-none">
                      <ReactMarkdown remarkPlugins={[remarkGfm]}>{formData.content || "暂无内容可预览..."}</ReactMarkdown>
                    </div>
                  )}
                </div>
                {errors.content && <p className="mt-1 text-xs text-red-500">{errors.content}</p>}
                <p className="mt-1 text-xs text-gray-500">{formData.content.length} 字符 (至少20个字符)</p>
              </div>

              {/* 标签 (UI已匹配) */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">标签</label>
                <div className="relative">
                  <input type="text" value={tagInput} onChange={e => setTagInput(e.target.value)} onKeyPress={handleTagKeyPress} placeholder="输入标签后按回车添加 (最多5个)" disabled={formData.tags.length >= 5} className={cn("block w-full px-3 py-2 border rounded-md shadow-sm pr-20", errors.tags ? "border-red-500" : "border-gray-300 dark:border-gray-600")} />
                  <button type="button" onClick={() => addTag()} disabled={!tagInput.trim() || formData.tags.length >= 5} className="absolute right-1 top-1/2 -translate-y-1/2 px-4 py-1.5 bg-blue-600 text-white rounded-md text-sm hover:bg-blue-700 disabled:opacity-50">添加</button>
                </div>
                {errors.tags && <p className="mt-1 text-xs text-red-500">{errors.tags}</p>}
                <div className="flex flex-wrap gap-2 mt-3">
                  {formData.tags.map(tag => (
                    <div key={tag} className="flex items-center pl-3 pr-2 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">
                      {tag}
                      <button type="button" onClick={() => removeTag(tag)} className="ml-1.5 text-blue-600 hover:text-blue-800 text-xs"><i className="fa-solid fa-times"></i></button>
                    </div>
                  ))}
                </div>
                <div className="mt-3">
                  <p className="text-xs text-gray-500 mb-2">热门标签:</p>
                  <div className="flex flex-wrap gap-2">
                    {hotTags.slice(0, 8).map(tag => (
                      <button key={tag.id} type="button" onClick={() => addTag(tag.name)} disabled={formData.tags.includes(tag.name.toLowerCase()) || formData.tags.length >= 5} className="px-2.5 py-1 text-xs bg-gray-100 hover:bg-gray-200 rounded-md disabled:opacity-50 disabled:cursor-not-allowed">{tag.name}</button>
                    ))}
                  </div>
                </div>
              </div>
              
              {/* 提交与取消按钮 (UI已匹配) */}
              <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200 dark:border-gray-700">
                <button type="button" onClick={() => navigate('/')} className="px-5 py-2 border border-gray-300 rounded-md text-sm font-medium hover:bg-gray-50">取消</button>
                <button type="submit" disabled={isSubmitting} className="px-5 py-2 bg-blue-600 text-white rounded-md text-sm font-medium hover:bg-blue-700 disabled:opacity-70">
                  {isSubmitting ? '发布中...' : '发布帖子'}
                </button>
              </div>
            </form>
          </div>
        </div>
      </main>
    </div>
  );
}