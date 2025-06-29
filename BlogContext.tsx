
import React, { createContext, useContext, useState, useEffect } from 'react';

export interface Blog {
  id: string;
  title: string;
  content: string;
  excerpt: string;
  author: string;
  authorAvatar: string;
  publishedAt: string;
  tags: string[];
  readingTime: number;
  views: number;
  likes: number;
  isLiked: boolean;
  isBookmarked: boolean;
  coverImage?: string;
}

interface BlogContextType {
  blogs: Blog[];
  featuredBlogs: Blog[];
  userBlogs: Blog[];
  bookmarkedBlogs: Blog[];
  createBlog: (blog: Omit<Blog, 'id' | 'publishedAt' | 'views' | 'likes' | 'isLiked' | 'isBookmarked'>) => void;
  updateBlog: (id: string, blog: Partial<Blog>) => void;
  deleteBlog: (id: string) => void;
  toggleLike: (id: string) => void;
  toggleBookmark: (id: string) => void;
  searchBlogs: (query: string) => Blog[];
  filterByTag: (tag: string) => Blog[];
  getDraftBlogs: () => Blog[];
  saveDraft: (blog: Partial<Blog>) => void;
}

const BlogContext = createContext<BlogContextType | undefined>(undefined);

const mockBlogs: Blog[] = [
  {
    id: '1',
    title: 'The Future of Web Development: Trends to Watch in 2024',
    content: 'Web development is constantly evolving...',
    excerpt: 'Explore the latest trends shaping the future of web development, from AI integration to new frameworks.',
    author: 'Sarah Johnson',
    authorAvatar: 'https://ui-avatars.com/api/?name=Sarah+Johnson&background=7c3aed&color=ffffff',
    publishedAt: '2024-01-15',
    tags: ['Web Development', 'Technology', 'Future'],
    readingTime: 8,
    views: 1250,
    likes: 89,
    isLiked: false,
    isBookmarked: false,
    coverImage: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=800&h=400&fit=crop'
  },
  {
    id: '2',
    title: 'Mastering React Hooks: A Comprehensive Guide',
    content: 'React Hooks have revolutionized...',
    excerpt: 'Learn how to effectively use React Hooks to build better, more maintainable applications.',
    author: 'Mike Chen',
    authorAvatar: 'https://ui-avatars.com/api/?name=Mike+Chen&background=a855f7&color=ffffff',
    publishedAt: '2024-01-12',
    tags: ['React', 'Programming', 'Tutorial'],
    readingTime: 12,
    views: 2100,
    likes: 156,
    isLiked: true,
    isBookmarked: true,
    coverImage: 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=800&h=400&fit=crop'
  },
  {
    id: '3',
    title: 'Design Systems: Building Consistent User Experiences',
    content: 'A well-designed system is the backbone...',
    excerpt: 'Discover how to create and maintain design systems that scale across your organization.',
    author: 'Emma Rodriguez',
    authorAvatar: 'https://ui-avatars.com/api/?name=Emma+Rodriguez&background=7c3aed&color=ffffff',
    publishedAt: '2024-01-10',
    tags: ['Design', 'UX', 'Systems'],
    readingTime: 6,
    views: 890,
    likes: 67,
    isLiked: false,
    isBookmarked: false,
    coverImage: 'https://images.unsplash.com/photo-1561070791-2526d30994b5?w=800&h=400&fit=crop'
  }
];

export const BlogProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [blogs, setBlogs] = useState<Blog[]>(mockBlogs);
  const [drafts, setDrafts] = useState<Partial<Blog>[]>([]);

  const featuredBlogs = blogs.slice(0, 3);
  const userBlogs = blogs; // In a real app, filter by current user
  const bookmarkedBlogs = blogs.filter(blog => blog.isBookmarked);

  const createBlog = (newBlog: Omit<Blog, 'id' | 'publishedAt' | 'views' | 'likes' | 'isLiked' | 'isBookmarked'>) => {
    const blog: Blog = {
      ...newBlog,
      id: Date.now().toString(),
      publishedAt: new Date().toISOString().split('T')[0],
      views: 0,
      likes: 0,
      isLiked: false,
      isBookmarked: false,
    };
    setBlogs(prev => [blog, ...prev]);
  };

  const updateBlog = (id: string, updatedBlog: Partial<Blog>) => {
    setBlogs(prev => prev.map(blog => 
      blog.id === id ? { ...blog, ...updatedBlog } : blog
    ));
  };

  const deleteBlog = (id: string) => {
    setBlogs(prev => prev.filter(blog => blog.id !== id));
  };

  const toggleLike = (id: string) => {
    setBlogs(prev => prev.map(blog => 
      blog.id === id ? { 
        ...blog, 
        isLiked: !blog.isLiked,
        likes: blog.isLiked ? blog.likes - 1 : blog.likes + 1
      } : blog
    ));
  };

  const toggleBookmark = (id: string) => {
    setBlogs(prev => prev.map(blog => 
      blog.id === id ? { ...blog, isBookmarked: !blog.isBookmarked } : blog
    ));
  };

  const searchBlogs = (query: string) => {
    return blogs.filter(blog => 
      blog.title.toLowerCase().includes(query.toLowerCase()) ||
      blog.content.toLowerCase().includes(query.toLowerCase()) ||
      blog.tags.some(tag => tag.toLowerCase().includes(query.toLowerCase()))
    );
  };

  const filterByTag = (tag: string) => {
    return blogs.filter(blog => blog.tags.includes(tag));
  };

  const getDraftBlogs = () => {
    return drafts.filter(draft => draft.id) as Blog[];
  };

  const saveDraft = (blog: Partial<Blog>) => {
    const draftId = blog.id || Date.now().toString();
    setDrafts(prev => {
      const existingIndex = prev.findIndex(draft => draft.id === draftId);
      if (existingIndex !== -1) {
        return prev.map((draft, index) => 
          index === existingIndex ? { ...draft, ...blog, id: draftId } : draft
        );
      }
      return [...prev, { ...blog, id: draftId }];
    });
  };

  return (
    <BlogContext.Provider value={{
      blogs,
      featuredBlogs,
      userBlogs,
      bookmarkedBlogs,
      createBlog,
      updateBlog,
      deleteBlog,
      toggleLike,
      toggleBookmark,
      searchBlogs,
      filterByTag,
      getDraftBlogs,
      saveDraft,
    }}>
      {children}
    </BlogContext.Provider>
  );
};

export const useBlog = () => {
  const context = useContext(BlogContext);
  if (context === undefined) {
    throw new Error('useBlog must be used within a BlogProvider');
  }
  return context;
};
