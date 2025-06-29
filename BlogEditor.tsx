
import React, { useState, useEffect } from 'react';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import { useBlog } from '../contexts/BlogContext';
import { useAuth } from '../contexts/AuthContext';
import { Save, Eye, Upload, Bold, Italic, List, Link as LinkIcon, Image as ImageIcon } from 'lucide-react';

const BlogEditor = () => {
  const { id } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { blogs, createBlog, updateBlog, saveDraft } = useBlog();

  const [formData, setFormData] = useState({
    title: '',
    content: '',
    excerpt: '',
    tags: [] as string[],
    coverImage: ''
  });
  
  const [isPreview, setIsPreview] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [tagInput, setTagInput] = useState('');
  const [availableTags] = useState(['Technology', 'Programming', 'Design', 'Business', 'Lifestyle', 'Travel', 'Health', 'Education']);

  useEffect(() => {
    // Load existing blog for editing
    if (id) {
      const blog = blogs.find(b => b.id === id);
      if (blog) {
        setFormData({
          title: blog.title,
          content: blog.content,
          excerpt: blog.excerpt,
          tags: blog.tags,
          coverImage: blog.coverImage || ''
        });
      }
    }
    
    // Load title from title generator
    if (location.state?.title) {
      setFormData(prev => ({ ...prev, title: location.state.title }));
    }
  }, [id, blogs, location.state]);

  // Auto-save draft every 30 seconds
  useEffect(() => {
    const autoSave = setInterval(() => {
      if (formData.title || formData.content) {
        saveDraft({
          id: id || undefined,
          ...formData,
          author: user?.name || 'Anonymous',
          authorAvatar: user?.avatar || '',
          readingTime: Math.ceil(formData.content.split(' ').length / 200)
        });
      }
    }, 30000);

    return () => clearInterval(autoSave);
  }, [formData, id, user, saveDraft]);

  const handleSave = async () => {
    if (!user) {
      navigate('/login');
      return;
    }

    setIsSaving(true);
    
    const blogData = {
      ...formData,
      author: user.name,
      authorAvatar: user.avatar || '',
      readingTime: Math.ceil(formData.content.split(' ').length / 200),
      excerpt: formData.excerpt || formData.content.substring(0, 150) + '...'
    };

    try {
      if (id) {
        updateBlog(id, blogData);
      } else {
        createBlog(blogData);
      }
      
      setTimeout(() => {
        setIsSaving(false);
        navigate('/dashboard');
      }, 1000);
    } catch (error) {
      setIsSaving(false);
      console.error('Error saving blog:', error);
    }
  };

  const addTag = (tag: string) => {
    if (tag && !formData.tags.includes(tag)) {
      setFormData(prev => ({
        ...prev,
        tags: [...prev.tags, tag]
      }));
    }
    setTagInput('');
  };

  const removeTag = (tagToRemove: string) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.filter(tag => tag !== tagToRemove)
    }));
  };

  const insertFormatting = (format: string) => {
    const textarea = document.getElementById('content') as HTMLTextAreaElement;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = textarea.value.substring(start, end);
    
    let formattedText = '';
    switch (format) {
      case 'bold':
        formattedText = `**${selectedText}**`;
        break;
      case 'italic':
        formattedText = `*${selectedText}*`;
        break;
      case 'list':
        formattedText = `\n- ${selectedText}`;
        break;
      case 'link':
        formattedText = `[${selectedText}](url)`;
        break;
      default:
        formattedText = selectedText;
    }

    const newContent = textarea.value.substring(0, start) + formattedText + textarea.value.substring(end);
    setFormData(prev => ({ ...prev, content: newContent }));
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-slate-900 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-slate-100 mb-4">
            Please log in to write a blog post
          </h1>
          <button
            onClick={() => navigate('/login')}
            className="px-6 py-3 bg-gradient-to-r from-violet-600 to-purple-600 text-white rounded-lg hover:from-violet-500 hover:to-purple-500 transition-all duration-300"
          >
            Sign In
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-slate-900">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-slate-100">
            {id ? 'Edit Blog Post' : 'Write New Blog Post'}
          </h1>
          
          <div className="flex items-center space-x-4">
            <button
              onClick={() => setIsPreview(!isPreview)}
              className="flex items-center px-4 py-2 border border-gray-300 dark:border-slate-600 text-gray-700 dark:text-slate-300 rounded-lg hover:bg-gray-100 dark:hover:bg-slate-700 transition-colors"
            >
              <Eye className="w-4 h-4 mr-2" />
              {isPreview ? 'Edit' : 'Preview'}
            </button>
            
            <button
              onClick={handleSave}
              disabled={isSaving}
              className="flex items-center px-6 py-2 bg-gradient-to-r from-violet-600 to-purple-600 text-white rounded-lg hover:from-violet-500 hover:to-purple-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 shadow-lg shadow-violet-500/25"
            >
              {isSaving ? (
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
              ) : (
                <Save className="w-4 h-4 mr-2" />
              )}
              {isSaving ? 'Saving...' : 'Publish'}
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Main Editor */}
          <div className="lg:col-span-3">
            <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg border border-gray-200 dark:border-slate-700 overflow-hidden">
              {!isPreview ? (
                <>
                  {/* Toolbar */}
                  <div className="border-b border-gray-200 dark:border-slate-700 p-4">
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => insertFormatting('bold')}
                        className="p-2 text-gray-600 dark:text-slate-300 hover:bg-gray-100 dark:hover:bg-slate-700 rounded-lg transition-colors"
                        title="Bold"
                      >
                        <Bold className="w-4 h-4" />
                      </button>
                      
                      <button
                        onClick={() => insertFormatting('italic')}
                        className="p-2 text-gray-600 dark:text-slate-300 hover:bg-gray-100 dark:hover:bg-slate-700 rounded-lg transition-colors"
                        title="Italic"
                      >
                        <Italic className="w-4 h-4" />
                      </button>
                      
                      <button
                        onClick={() => insertFormatting('list')}
                        className="p-2 text-gray-600 dark:text-slate-300 hover:bg-gray-100 dark:hover:bg-slate-700 rounded-lg transition-colors"
                        title="List"
                      >
                        <List className="w-4 h-4" />
                      </button>
                      
                      <button
                        onClick={() => insertFormatting('link')}
                        className="p-2 text-gray-600 dark:text-slate-300 hover:bg-gray-100 dark:hover:bg-slate-700 rounded-lg transition-colors"
                        title="Link"
                      >
                        <LinkIcon className="w-4 h-4" />
                      </button>
                      
                      <button
                        className="p-2 text-gray-600 dark:text-slate-300 hover:bg-gray-100 dark:hover:bg-slate-700 rounded-lg transition-colors"
                        title="Upload Image"
                      >
                        <Upload className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  {/* Editor Form */}
                  <div className="p-6 space-y-6">
                    {/* Title */}
                    <div>
                      <input
                        type="text"
                        placeholder="Enter your blog title..."
                        value={formData.title}
                        onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                        className="w-full text-3xl font-bold border-none outline-none bg-transparent text-gray-900 dark:text-slate-100 placeholder-gray-500 dark:placeholder-slate-400"
                      />
                    </div>

                    {/* Cover Image */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-2">
                        Cover Image URL (optional)
                      </label>
                      <input
                        type="url"
                        placeholder="https://example.com/image.jpg"
                        value={formData.coverImage}
                        onChange={(e) => setFormData(prev => ({ ...prev, coverImage: e.target.value }))}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-gray-900 dark:text-slate-100 placeholder-gray-500 dark:placeholder-slate-400 focus:ring-2 focus:ring-violet-500 focus:border-transparent"
                      />
                    </div>

                    {/* Content */}
                    <div>
                      <textarea
                        id="content"
                        placeholder="Tell your story..."
                        value={formData.content}
                        onChange={(e) => setFormData(prev => ({ ...prev, content: e.target.value }))}
                        rows={20}
                        className="w-full border-none outline-none resize-none bg-transparent text-gray-900 dark:text-slate-100 placeholder-gray-500 dark:placeholder-slate-400 text-lg leading-relaxed"
                      />
                    </div>

                    {/* Excerpt */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-2">
                        Excerpt (optional)
                      </label>
                      <textarea
                        placeholder="Write a brief description of your post..."
                        value={formData.excerpt}
                        onChange={(e) => setFormData(prev => ({ ...prev, excerpt: e.target.value }))}
                        rows={3}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-gray-900 dark:text-slate-100 placeholder-gray-500 dark:placeholder-slate-400 focus:ring-2 focus:ring-violet-500 focus:border-transparent"
                      />
                    </div>
                  </div>
                </>
              ) : (
                /* Preview Mode */
                <div className="p-8">
                  {formData.coverImage && (
                    <img
                      src={formData.coverImage}
                      alt={formData.title}
                      className="w-full h-64 object-cover rounded-lg mb-8"
                    />
                  )}
                  
                  <h1 className="text-4xl font-bold text-gray-900 dark:text-slate-100 mb-4">
                    {formData.title || 'Untitled Post'}
                  </h1>
                  
                  <div className="flex items-center space-x-4 mb-8 text-gray-600 dark:text-slate-400">
                    <div className="flex items-center space-x-2">
                      <img
                        src={user.avatar}
                        alt={user.name}
                        className="w-8 h-8 rounded-full"
                      />
                      <span>{user.name}</span>
                    </div>
                    <span>•</span>
                    <span>{Math.ceil(formData.content.split(' ').length / 200)} min read</span>
                  </div>

                  <div className="prose prose-lg max-w-none dark:prose-invert">
                    <div className="whitespace-pre-wrap text-gray-900 dark:text-slate-100 leading-relaxed">
                      {formData.content || 'Start writing your content...'}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Tags */}
            <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg border border-gray-200 dark:border-slate-700 p-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-slate-100 mb-4">Tags</h3>
              
              <div className="space-y-4">
                <div className="flex flex-wrap gap-2">
                  {formData.tags.map((tag) => (
                    <span
                      key={tag}
                      className="inline-flex items-center px-2 py-1 bg-violet-100 dark:bg-violet-600/20 text-violet-700 dark:text-violet-300 rounded-full text-sm"
                    >
                      {tag}
                      <button
                        onClick={() => removeTag(tag)}
                        className="ml-1 text-violet-500 hover:text-violet-700 dark:hover:text-violet-200"
                      >
                        ×
                      </button>
                    </span>
                  ))}
                </div>

                <div>
                  <input
                    type="text"
                    placeholder="Add a tag..."
                    value={tagInput}
                    onChange={(e) => setTagInput(e.target.value)}
                    onKeyPress={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        addTag(tagInput);
                      }
                    }}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-gray-900 dark:text-slate-100 placeholder-gray-500 dark:placeholder-slate-400 focus:ring-2 focus:ring-violet-500 focus:border-transparent"
                  />
                </div>

                <div className="flex flex-wrap gap-2">
                  {availableTags.filter(tag => !formData.tags.includes(tag)).map((tag) => (
                    <button
                      key={tag}
                      onClick={() => addTag(tag)}
                      className="px-2 py-1 text-xs border border-gray-300 dark:border-slate-600 text-gray-600 dark:text-slate-400 rounded-full hover:bg-violet-100 dark:hover:bg-violet-600/20 hover:text-violet-700 dark:hover:text-violet-300 transition-colors"
                    >
                      + {tag}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* SEO Preview */}
            <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg border border-gray-200 dark:border-slate-700 p-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-slate-100 mb-4">SEO Preview</h3>
              
              <div className="border border-gray-200 dark:border-slate-600 rounded-lg p-4 bg-gray-50 dark:bg-slate-700">
                <h4 className="text-violet-600 dark:text-violet-400 text-lg font-medium mb-1 line-clamp-1">
                  {formData.title || 'Your Blog Title'}
                </h4>
                <p className="text-green-700 dark:text-green-400 text-sm mb-2">
                  blogcraft.com/blog/{formData.title.toLowerCase().replace(/\s+/g, '-')}
                </p>
                <p className="text-gray-600 dark:text-slate-400 text-sm line-clamp-2">
                  {formData.excerpt || formData.content.substring(0, 150) + '...' || 'Your blog excerpt will appear here'}
                </p>
              </div>
            </div>

            {/* Reading Stats */}
            <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg border border-gray-200 dark:border-slate-700 p-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-slate-100 mb-4">Reading Stats</h3>
              
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-slate-400">Words:</span>
                  <span className="font-medium text-gray-900 dark:text-slate-100">
                    {formData.content.split(' ').filter(word => word.length > 0).length}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-slate-400">Characters:</span>
                  <span className="font-medium text-gray-900 dark:text-slate-100">
                    {formData.content.length}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-slate-400">Reading time:</span>
                  <span className="font-medium text-gray-900 dark:text-slate-100">
                    {Math.ceil(formData.content.split(' ').length / 200)} min
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BlogEditor;
