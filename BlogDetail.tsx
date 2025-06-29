
import React, { useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { useBlog, Blog } from '../contexts/BlogContext';
import { Clock, Eye, Calendar, BookOpen, Share, MessageSquare, Edit } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

const BlogDetail = () => {
  const { id } = useParams<{ id: string }>();
  const { blogs, toggleLike, toggleBookmark } = useBlog();
  const { user } = useAuth();
  const [showShareOptions, setShowShareOptions] = useState(false);

  const blog = blogs.find(b => b.id === id);

  if (!blog) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-slate-900 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-slate-100 mb-4">
            Blog post not found
          </h1>
          <Link
            to="/"
            className="px-4 py-2 text-violet-600 hover:text-violet-700 dark:text-violet-400 dark:hover:text-violet-300"
          >
            Return to home
          </Link>
        </div>
      </div>
    );
  }

  const handleLike = () => {
    toggleLike(blog.id);
  };

  const handleBookmark = () => {
    toggleBookmark(blog.id);
  };

  const toggleShareOptions = () => {
    setShowShareOptions(!showShareOptions);
  };

  const handleShare = (platform: string) => {
    const shareUrl = window.location.href;
    const shareText = `Check out this article: ${blog.title}`;
    
    let shareLink = '';
    
    switch (platform) {
      case 'twitter':
        shareLink = `https://twitter.com/intent/tweet?url=${encodeURIComponent(shareUrl)}&text=${encodeURIComponent(shareText)}`;
        break;
      case 'facebook':
        shareLink = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`;
        break;
      case 'linkedin':
        shareLink = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}`;
        break;
      case 'copy':
        navigator.clipboard.writeText(shareUrl);
        return;
    }
    
    if (shareLink) {
      window.open(shareLink, '_blank');
    }
    
    setShowShareOptions(false);
  };

  // Related articles based on matching tags
  const relatedArticles = blogs
    .filter(b => b.id !== blog.id && b.tags.some(tag => blog.tags.includes(tag)))
    .slice(0, 3);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-slate-900 py-8">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Cover Image */}
        {blog.coverImage && (
          <div className="w-full h-96 mb-8 rounded-xl overflow-hidden relative shadow-xl">
            <img
              src={blog.coverImage}
              alt={blog.title}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-b from-black/0 via-black/0 to-black/50"></div>
          </div>
        )}

        {/* Article Header */}
        <div className="mb-8">
          {/* Tags */}
          <div className="flex flex-wrap gap-2 mb-4">
            {blog.tags.map((tag) => (
              <Link
                key={tag}
                to={`/?tag=${tag}`}
                className="px-3 py-1 text-sm font-medium bg-violet-100 dark:bg-violet-600/20 text-violet-700 dark:text-violet-300 rounded-full hover:bg-violet-200 dark:hover:bg-violet-600/30 transition-colors"
              >
                {tag}
              </Link>
            ))}
          </div>

          {/* Title */}
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-slate-100 mb-4 leading-tight">
            {blog.title}
          </h1>

          {/* Meta Info */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 text-gray-600 dark:text-slate-400 mb-8">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <img
                  src={blog.authorAvatar}
                  alt={blog.author}
                  className="w-10 h-10 rounded-full"
                />
                <div>
                  <p className="font-medium text-gray-900 dark:text-slate-100">{blog.author}</p>
                  <p className="text-xs">{new Date(blog.publishedAt).toLocaleDateString()}</p>
                </div>
              </div>
            </div>
            
            <div className="flex items-center space-x-4 text-sm">
              <div className="flex items-center space-x-1">
                <Clock className="w-4 h-4" />
                <span>{blog.readingTime} min read</span>
              </div>
              <div className="flex items-center space-x-1">
                <Eye className="w-4 h-4" />
                <span>{blog.views} views</span>
              </div>
            </div>
          </div>
        </div>

        {/* Article Content and Sidebar */}
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Main Content */}
          <div className="lg:flex-1">
            <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg border border-gray-200 dark:border-slate-700 p-6 md:p-10 prose prose-lg max-w-none dark:prose-invert prose-img:rounded-lg prose-headings:text-gray-900 dark:prose-headings:text-slate-100">
              <div className="whitespace-pre-wrap">
                {blog.content}
              </div>
            </div>

            {/* Action Bar */}
            <div className="mt-8 bg-white dark:bg-slate-800 rounded-xl shadow-lg border border-gray-200 dark:border-slate-700 p-6 flex items-center justify-between">
              <div className="flex items-center space-x-4">
                {/* Like Button */}
                <button
                  onClick={handleLike}
                  className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors ${
                    blog.isLiked
                      ? 'bg-red-500 text-white'
                      : 'text-gray-600 dark:text-slate-400 hover:bg-gray-100 dark:hover:bg-slate-700 hover:text-red-500'
                  }`}
                >
                  <svg className="w-5 h-5" fill={blog.isLiked ? 'currentColor' : 'none'} stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                  </svg>
                  <span>{blog.likes}</span>
                </button>

                {/* Bookmark Button */}
                <button
                  onClick={handleBookmark}
                  className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors ${
                    blog.isBookmarked
                      ? 'bg-violet-600 text-white'
                      : 'text-gray-600 dark:text-slate-400 hover:bg-gray-100 dark:hover:bg-slate-700 hover:text-violet-600'
                  }`}
                >
                  <BookOpen className="w-5 h-5" />
                  <span>Bookmark</span>
                </button>

                {/* Share Dropdown */}
                <div className="relative">
                  <button
                    onClick={toggleShareOptions}
                    className="flex items-center space-x-2 px-4 py-2 text-gray-600 dark:text-slate-400 hover:bg-gray-100 dark:hover:bg-slate-700 rounded-lg transition-colors"
                  >
                    <Share className="w-5 h-5" />
                    <span>Share</span>
                  </button>

                  {showShareOptions && (
                    <div className="absolute left-0 mt-2 w-48 bg-white dark:bg-slate-700 shadow-lg rounded-lg overflow-hidden z-10 border border-gray-200 dark:border-slate-600">
                      <button
                        onClick={() => handleShare('twitter')}
                        className="w-full text-left px-4 py-2 text-gray-700 dark:text-slate-300 hover:bg-gray-100 dark:hover:bg-slate-600 transition-colors flex items-center space-x-2"
                      >
                        <svg className="w-5 h-5 text-blue-400" fill="currentColor" viewBox="0 0 20 20">
                          <path d="M6.29 18.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0020 3.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.073 4.073 0 01.8 7.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 010 16.407a11.616 11.616 0 006.29 1.84" />
                        </svg>
                        <span>Twitter</span>
                      </button>
                      <button
                        onClick={() => handleShare('facebook')}
                        className="w-full text-left px-4 py-2 text-gray-700 dark:text-slate-300 hover:bg-gray-100 dark:hover:bg-slate-600 transition-colors flex items-center space-x-2"
                      >
                        <svg className="w-5 h-5 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M20 10c0-5.523-4.477-10-10-10S0 4.477 0 10c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V10h2.54V7.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V10h2.773l-.443 2.89h-2.33v6.988C16.343 19.128 20 14.991 20 10z" clipRule="evenodd" />
                        </svg>
                        <span>Facebook</span>
                      </button>
                      <button
                        onClick={() => handleShare('linkedin')}
                        className="w-full text-left px-4 py-2 text-gray-700 dark:text-slate-300 hover:bg-gray-100 dark:hover:bg-slate-600 transition-colors flex items-center space-x-2"
                      >
                        <svg className="w-5 h-5 text-blue-700" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.338 16.338H13.67V12.16c0-.995-.017-2.277-1.387-2.277-1.39 0-1.601 1.086-1.601 2.207v4.248H8.014v-8.59h2.559v1.174h.037c.356-.675 1.227-1.387 2.526-1.387 2.703 0 3.203 1.778 3.203 4.092v4.711zM5.005 6.575a1.548 1.548 0 11-.003-3.096 1.548 1.548 0 01.003 3.096zm-1.337 9.763H6.34v-8.59H3.667v8.59zM17.668 1H2.328C1.595 1 1 1.581 1 2.298v15.403C1 18.418 1.595 19 2.328 19h15.34c.734 0 1.332-.582 1.332-1.299V2.298C19 1.581 18.402 1 17.668 1z" clipRule="evenodd" />
                        </svg>
                        <span>LinkedIn</span>
                      </button>
                      <button
                        onClick={() => handleShare('copy')}
                        className="w-full text-left px-4 py-2 text-gray-700 dark:text-slate-300 hover:bg-gray-100 dark:hover:bg-slate-600 transition-colors flex items-center space-x-2"
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V5" />
                        </svg>
                        <span>Copy Link</span>
                      </button>
                    </div>
                  )}
                </div>
              </div>

              {/* Edit Button */}
              {user && user.name === blog.author && (
                <Link
                  to={`/editor/${blog.id}`}
                  className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-violet-600 to-purple-600 text-white rounded-lg hover:from-violet-500 hover:to-purple-500 transition-all duration-300"
                >
                  <Edit className="w-5 h-5" />
                  <span>Edit</span>
                </Link>
              )}
            </div>

            {/* Related Articles */}
            {relatedArticles.length > 0 && (
              <div className="mt-12">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-slate-100 mb-6">
                  Related Articles
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                  {relatedArticles.map((article) => (
                    <div 
                      key={article.id}
                      className="bg-white dark:bg-slate-800 rounded-xl shadow-lg border border-gray-200 dark:border-slate-700 overflow-hidden hover:shadow-xl transition-shadow duration-300"
                    >
                      <Link to={`/blog/${article.id}`}>
                        {article.coverImage && (
                          <img
                            src={article.coverImage}
                            alt={article.title}
                            className="w-full h-40 object-cover"
                          />
                        )}
                        <div className="p-4">
                          <h3 className="text-lg font-bold text-gray-900 dark:text-slate-100 mb-2 line-clamp-2">
                            {article.title}
                          </h3>
                          <p className="text-gray-600 dark:text-slate-400 text-sm line-clamp-2 mb-3">
                            {article.excerpt}
                          </p>
                          <div className="flex items-center text-xs text-gray-500 dark:text-slate-500">
                            <Clock className="w-3 h-3 mr-1" />
                            <span>{article.readingTime} min read</span>
                          </div>
                        </div>
                      </Link>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="w-full lg:w-80">
            <div className="sticky top-24 space-y-6">
              {/* Author Info */}
              <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg border border-gray-200 dark:border-slate-700 p-6">
                <div className="flex items-center space-x-4 mb-4">
                  <img
                    src={blog.authorAvatar}
                    alt={blog.author}
                    className="w-16 h-16 rounded-full"
                  />
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-slate-100">
                      {blog.author}
                    </h3>
                    <p className="text-gray-600 dark:text-slate-400 text-sm">
                      Author
                    </p>
                  </div>
                </div>
                <p className="text-gray-600 dark:text-slate-400 mb-4">
                  Writer and content creator passionate about technology and design.
                </p>
                <button className="w-full px-4 py-2 border border-gray-300 dark:border-slate-600 text-gray-700 dark:text-slate-300 rounded-lg hover:bg-gray-100 dark:hover:bg-slate-700 transition-colors text-sm">
                  Follow
                </button>
              </div>

              {/* Tag Cloud */}
              <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg border border-gray-200 dark:border-slate-700 p-6">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-slate-100 mb-4">
                  Popular Tags
                </h3>
                <div className="flex flex-wrap gap-2">
                  {blog.tags.concat(['Design', 'UX', 'Technology', 'Web Development', 'Product', 'Tutorial']).slice(0, 10).map((tag, index) => (
                    <Link
                      key={index}
                      to={`/?tag=${tag}`}
                      className="px-3 py-1 text-sm bg-violet-100 dark:bg-violet-600/20 text-violet-700 dark:text-violet-300 rounded-full hover:bg-violet-200 dark:hover:bg-violet-600/30 transition-colors"
                    >
                      {tag}
                    </Link>
                  ))}
                </div>
              </div>

              {/* Newsletter */}
              <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg border border-gray-200 dark:border-slate-700 p-6">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-slate-100 mb-2">
                  Subscribe to our newsletter
                </h3>
                <p className="text-gray-600 dark:text-slate-400 text-sm mb-4">
                  Get the latest posts delivered right to your inbox.
                </p>
                <form className="space-y-3">
                  <input
                    type="email"
                    placeholder="Your email address"
                    className="w-full px-3 py-2 border border-gray-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-gray-900 dark:text-slate-100 placeholder-gray-500 dark:placeholder-slate-400 focus:ring-2 focus:ring-violet-500 focus:border-transparent"
                  />
                  <button
                    type="submit"
                    className="w-full px-4 py-2 bg-gradient-to-r from-violet-600 to-purple-600 text-white rounded-lg hover:from-violet-500 hover:to-purple-500 transition-all duration-300"
                  >
                    Subscribe
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BlogDetail;
