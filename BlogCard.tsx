
import React from 'react';
import { Link } from 'react-router-dom';
import { useBlog, Blog } from '../../contexts/BlogContext';
import { Clock, Eye, BookOpen, Calendar } from 'lucide-react';

interface BlogCardProps {
  blog: Blog;
  featured?: boolean;
}

const BlogCard: React.FC<BlogCardProps> = ({ blog, featured = false }) => {
  const { toggleLike, toggleBookmark } = useBlog();

  const handleLike = (e: React.MouseEvent) => {
    e.preventDefault();
    toggleLike(blog.id);
  };

  const handleBookmark = (e: React.MouseEvent) => {
    e.preventDefault();
    toggleBookmark(blog.id);
  };

  return (
    <article className={`group bg-white dark:bg-slate-800 rounded-xl shadow-lg hover:shadow-2xl dark:shadow-violet-500/10 transition-all duration-300 overflow-hidden border border-gray-200 dark:border-slate-700 ${featured ? 'hover:scale-105' : ''}`}>
      {/* Cover Image */}
      {blog.coverImage && (
        <div className="relative overflow-hidden">
          <img
            src={blog.coverImage}
            alt={blog.title}
            className="w-full h-48 object-cover group-hover:scale-110 transition-transform duration-300"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
        </div>
      )}

      <div className="p-6">
        {/* Tags */}
        <div className="flex flex-wrap gap-2 mb-3">
          {blog.tags.slice(0, 3).map((tag) => (
            <span
              key={tag}
              className="px-2 py-1 text-xs font-medium bg-violet-100 dark:bg-violet-600/20 text-violet-700 dark:text-violet-300 rounded-full"
            >
              {tag}
            </span>
          ))}
        </div>

        {/* Title */}
        <Link to={`/blog/${blog.id}`} className="block group">
          <h3 className={`font-bold text-gray-900 dark:text-slate-100 mb-3 line-clamp-2 group-hover:text-violet-600 dark:group-hover:text-violet-400 transition-colors ${featured ? 'text-xl' : 'text-lg'}`}>
            {blog.title}
          </h3>
        </Link>

        {/* Excerpt */}
        <p className="text-gray-600 dark:text-slate-300 mb-4 line-clamp-3">
          {blog.excerpt}
        </p>

        {/* Meta Info */}
        <div className="flex items-center justify-between text-sm text-gray-500 dark:text-slate-400 mb-4">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-1">
              <Clock className="w-4 h-4" />
              <span>{blog.readingTime} min read</span>
            </div>
            <div className="flex items-center space-x-1">
              <Eye className="w-4 h-4" />
              <span>{blog.views}</span>
            </div>
          </div>
          <div className="flex items-center space-x-1">
            <Calendar className="w-4 h-4" />
            <span>{new Date(blog.publishedAt).toLocaleDateString()}</span>
          </div>
        </div>

        {/* Author & Actions */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <img
              src={blog.authorAvatar}
              alt={blog.author}
              className="w-8 h-8 rounded-full"
            />
            <span className="text-sm font-medium text-gray-900 dark:text-slate-100">
              {blog.author}
            </span>
          </div>

          <div className="flex items-center space-x-2">
            {/* Like Button */}
            <button
              onClick={handleLike}
              className={`p-2 rounded-lg transition-colors ${
                blog.isLiked
                  ? 'bg-red-500 text-white'
                  : 'text-gray-400 hover:bg-gray-100 dark:hover:bg-slate-700 hover:text-red-500'
              }`}
            >
              <svg className="w-4 h-4" fill={blog.isLiked ? 'currentColor' : 'none'} stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
              </svg>
              <span className="sr-only">Like</span>
            </button>

            {/* Bookmark Button */}
            <button
              onClick={handleBookmark}
              className={`p-2 rounded-lg transition-colors ${
                blog.isBookmarked
                  ? 'bg-violet-600 text-white'
                  : 'text-gray-400 hover:bg-gray-100 dark:hover:bg-slate-700 hover:text-violet-600'
              }`}
            >
              <BookOpen className="w-4 h-4" />
              <span className="sr-only">Bookmark</span>
            </button>
          </div>
        </div>
      </div>
    </article>
  );
};

export default BlogCard;
