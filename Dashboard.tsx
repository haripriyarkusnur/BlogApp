
import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useBlog } from '../contexts/BlogContext';
import { Eye, Edit, Calendar, TrendingUp, Users, Clock, BookOpen } from 'lucide-react';

const Dashboard = () => {
  const { user } = useAuth();
  const { blogs, userBlogs } = useBlog();

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-slate-900 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-slate-100 mb-4">
            Please log in to view your dashboard
          </h1>
          <Link
            to="/login"
            className="px-6 py-3 bg-gradient-to-r from-violet-600 to-purple-600 text-white rounded-lg hover:from-violet-500 hover:to-purple-500 transition-all duration-300"
          >
            Sign In
          </Link>
        </div>
      </div>
    );
  }

  const stats = {
    totalViews: userBlogs.reduce((sum, blog) => sum + blog.views, 0),
    totalLikes: userBlogs.reduce((sum, blog) => sum + blog.likes, 0),
    totalBlogs: userBlogs.length,
    avgReadingTime: Math.round(userBlogs.reduce((sum, blog) => sum + blog.readingTime, 0) / userBlogs.length) || 0
  };

  const recentActivity = [
    { type: 'publish', message: 'Published "The Future of Web Development"', time: '2 hours ago' },
    { type: 'like', message: 'Your article received 15 new likes', time: '4 hours ago' },
    { type: 'comment', message: 'New comment on "Mastering React Hooks"', time: '1 day ago' },
    { type: 'view', message: 'Your articles reached 1,000 views', time: '2 days ago' }
  ];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-slate-900 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-slate-100 mb-2">
            Welcome back, {user.name}!
          </h1>
          <p className="text-gray-600 dark:text-slate-400">
            Here's what's happening with your blog
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white dark:bg-slate-800 p-6 rounded-xl shadow-lg border border-gray-200 dark:border-slate-700">
            <div className="flex items-center">
              <div className="p-2 bg-violet-100 dark:bg-violet-600/20 rounded-lg">
                <Eye className="w-6 h-6 text-violet-600 dark:text-violet-400" />
              </div>
              <div className="ml-4">
                <p className="text-2xl font-bold text-gray-900 dark:text-slate-100">
                  {stats.totalViews.toLocaleString()}
                </p>
                <p className="text-gray-600 dark:text-slate-400">Total Views</p>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-slate-800 p-6 rounded-xl shadow-lg border border-gray-200 dark:border-slate-700">
            <div className="flex items-center">
              <div className="p-2 bg-red-100 dark:bg-red-600/20 rounded-lg">
                <svg className="w-6 h-6 text-red-600 dark:text-red-400" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
              </div>
              <div className="ml-4">
                <p className="text-2xl font-bold text-gray-900 dark:text-slate-100">
                  {stats.totalLikes.toLocaleString()}
                </p>
                <p className="text-gray-600 dark:text-slate-400">Total Likes</p>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-slate-800 p-6 rounded-xl shadow-lg border border-gray-200 dark:border-slate-700">
            <div className="flex items-center">
              <div className="p-2 bg-green-100 dark:bg-green-600/20 rounded-lg">
                <BookOpen className="w-6 h-6 text-green-600 dark:text-green-400" />
              </div>
              <div className="ml-4">
                <p className="text-2xl font-bold text-gray-900 dark:text-slate-100">
                  {stats.totalBlogs}
                </p>
                <p className="text-gray-600 dark:text-slate-400">Published Articles</p>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-slate-800 p-6 rounded-xl shadow-lg border border-gray-200 dark:border-slate-700">
            <div className="flex items-center">
              <div className="p-2 bg-purple-100 dark:bg-purple-600/20 rounded-lg">
                <Clock className="w-6 h-6 text-purple-600 dark:text-purple-400" />
              </div>
              <div className="ml-4">
                <p className="text-2xl font-bold text-gray-900 dark:text-slate-100">
                  {stats.avgReadingTime}m
                </p>
                <p className="text-gray-600 dark:text-slate-400">Avg. Reading Time</p>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Recent Articles */}
          <div className="lg:col-span-2">
            <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg border border-gray-200 dark:border-slate-700 p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-gray-900 dark:text-slate-100">Recent Articles</h2>
                <Link
                  to="/editor"
                  className="px-4 py-2 bg-gradient-to-r from-violet-600 to-purple-600 text-white rounded-lg hover:from-violet-500 hover:to-purple-500 transition-all duration-300 text-sm"
                >
                  Write New
                </Link>
              </div>

              <div className="space-y-4">
                {userBlogs.slice(0, 5).map((blog) => (
                  <div key={blog.id} className="flex items-center justify-between p-4 bg-gray-50 dark:bg-slate-700 rounded-lg">
                    <div className="flex-1">
                      <h3 className="font-medium text-gray-900 dark:text-slate-100 mb-1">
                        {blog.title}
                      </h3>
                      <p className="text-sm text-gray-600 dark:text-slate-400">
                        {new Date(blog.publishedAt).toLocaleDateString()} • {blog.views} views • {blog.likes} likes
                      </p>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Link
                        to={`/editor/${blog.id}`}
                        className="p-2 text-gray-400 hover:text-violet-600 dark:hover:text-violet-400 transition-colors"
                      >
                        <Edit className="w-4 h-4" />
                      </Link>
                      <Link
                        to={`/blog/${blog.id}`}
                        className="p-2 text-gray-400 hover:text-violet-600 dark:hover:text-violet-400 transition-colors"
                      >
                        <Eye className="w-4 h-4" />
                      </Link>
                    </div>
                  </div>
                ))}

                {userBlogs.length === 0 && (
                  <div className="text-center py-8">
                    <BookOpen className="mx-auto w-12 h-12 text-gray-400 mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 dark:text-slate-100 mb-2">
                      No articles yet
                    </h3>
                    <p className="text-gray-600 dark:text-slate-400 mb-4">
                      Start writing your first article to see it here
                    </p>
                    <Link
                      to="/title-generator"
                      className="px-4 py-2 bg-violet-600 text-white rounded-lg hover:bg-violet-700 transition-colors"
                    >
                      Get Started
                    </Link>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Activity Feed */}
          <div>
            <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg border border-gray-200 dark:border-slate-700 p-6">
              <h2 className="text-xl font-bold text-gray-900 dark:text-slate-100 mb-6">Recent Activity</h2>
              
              <div className="space-y-4">
                {recentActivity.map((activity, index) => (
                  <div key={index} className="flex items-start space-x-3">
                    <div className={`p-2 rounded-lg ${
                      activity.type === 'publish' ? 'bg-green-100 dark:bg-green-600/20' :
                      activity.type === 'like' ? 'bg-red-100 dark:bg-red-600/20' :
                      activity.type === 'comment' ? 'bg-blue-100 dark:bg-blue-600/20' :
                      'bg-purple-100 dark:bg-purple-600/20'
                    }`}>
                      {activity.type === 'publish' && <BookOpen className="w-4 h-4 text-green-600 dark:text-green-400" />}
                      {activity.type === 'like' && (
                        <svg className="w-4 h-4 text-red-600 dark:text-red-400" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                        </svg>
                      )}
                      {activity.type === 'comment' && <Users className="w-4 h-4 text-blue-600 dark:text-blue-400" />}
                      {activity.type === 'view' && <Eye className="w-4 h-4 text-purple-600 dark:text-purple-400" />}
                    </div>
                    <div className="flex-1">
                      <p className="text-sm text-gray-900 dark:text-slate-100 mb-1">
                        {activity.message}
                      </p>
                      <p className="text-xs text-gray-500 dark:text-slate-400">
                        {activity.time}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg border border-gray-200 dark:border-slate-700 p-6 mt-6">
              <h2 className="text-xl font-bold text-gray-900 dark:text-slate-100 mb-6">Quick Actions</h2>
              
              <div className="space-y-3">
                <Link
                  to="/title-generator"
                  className="w-full flex items-center px-4 py-3 bg-gradient-to-r from-violet-600 to-purple-600 text-white rounded-lg hover:from-violet-500 hover:to-purple-500 transition-all duration-300"
                >
                  <Edit className="w-5 h-5 mr-3" />
                  Generate Title
                </Link>
                
                <Link
                  to="/editor"
                  className="w-full flex items-center px-4 py-3 border border-gray-300 dark:border-slate-600 text-gray-700 dark:text-slate-300 rounded-lg hover:bg-gray-100 dark:hover:bg-slate-700 transition-colors"
                >
                  <BookOpen className="w-5 h-5 mr-3" />
                  Write Article
                </Link>
                
                <Link
                  to="/profile"
                  className="w-full flex items-center px-4 py-3 border border-gray-300 dark:border-slate-600 text-gray-700 dark:text-slate-300 rounded-lg hover:bg-gray-100 dark:hover:bg-slate-700 transition-colors"
                >
                  <Users className="w-5 h-5 mr-3" />
                  Edit Profile
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
