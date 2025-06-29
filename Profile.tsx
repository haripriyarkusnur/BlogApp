
import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useBlog } from '../contexts/BlogContext';
import { Camera, Edit, Save, BookOpen, Eye, Calendar } from 'lucide-react';
import BlogCard from '../components/Blog/BlogCard';

const Profile = () => {
  const { user } = useAuth();
  const { userBlogs, bookmarkedBlogs } = useBlog();
  const [isEditing, setIsEditing] = useState(false);
  const [activeTab, setActiveTab] = useState('published');
  const [profileData, setProfileData] = useState({
    name: user?.name || '',
    bio: user?.bio || '',
    avatar: user?.avatar || ''
  });

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-slate-900 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-slate-100 mb-4">
            Please log in to view your profile
          </h1>
        </div>
      </div>
    );
  }

  const handleSave = () => {
    // In a real app, this would update the user profile
    setIsEditing(false);
  };

  const tabs = [
    { id: 'published', name: 'Published', count: userBlogs.length },
    { id: 'bookmarked', name: 'Bookmarked', count: bookmarkedBlogs.length },
    { id: 'drafts', name: 'Drafts', count: 0 }
  ];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-slate-900 py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Profile Header */}
        <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg border border-gray-200 dark:border-slate-700 overflow-hidden mb-8">
          {/* Cover Photo */}
          <div className="h-48 bg-gradient-to-r from-violet-600 to-purple-600 relative">
            <div className="absolute inset-0 bg-black/20"></div>
          </div>

          {/* Profile Info */}
          <div className="relative px-6 pb-6">
            {/* Avatar */}
            <div className="flex items-end -mt-16 mb-4">
              <div className="relative">
                <img
                  src={profileData.avatar}
                  alt={profileData.name}
                  className="w-32 h-32 rounded-full border-4 border-white dark:border-slate-800 shadow-lg"
                />
                {isEditing && (
                  <button className="absolute bottom-2 right-2 p-2 bg-violet-600 text-white rounded-full hover:bg-violet-700 transition-colors">
                    <Camera className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>

            <div className="flex flex-col md:flex-row md:items-center md:justify-between">
              <div className="flex-1">
                {isEditing ? (
                  <div className="space-y-4 max-w-md">
                    <input
                      type="text"
                      value={profileData.name}
                      onChange={(e) => setProfileData(prev => ({ ...prev, name: e.target.value }))}
                      className="text-2xl font-bold bg-transparent border-b-2 border-violet-600 text-gray-900 dark:text-slate-100 focus:outline-none"
                    />
                    <textarea
                      value={profileData.bio}
                      onChange={(e) => setProfileData(prev => ({ ...prev, bio: e.target.value }))}
                      placeholder="Write something about yourself..."
                      rows={3}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-gray-900 dark:text-slate-100 placeholder-gray-500 dark:placeholder-slate-400 focus:ring-2 focus:ring-violet-500 focus:border-transparent"
                    />
                  </div>
                ) : (
                  <div>
                    <h1 className="text-3xl font-bold text-gray-900 dark:text-slate-100 mb-2">
                      {profileData.name}
                    </h1>
                    <p className="text-gray-600 dark:text-slate-400 mb-4 max-w-2xl">
                      {profileData.bio || 'No bio available'}
                    </p>
                  </div>
                )}

                {/* Stats */}
                <div className="flex items-center space-x-6 text-sm text-gray-600 dark:text-slate-400">
                  <div className="flex items-center space-x-1">
                    <BookOpen className="w-4 h-4" />
                    <span>{userBlogs.length} articles</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Eye className="w-4 h-4" />
                    <span>{userBlogs.reduce((sum, blog) => sum + blog.views, 0)} views</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Calendar className="w-4 h-4" />
                    <span>Joined January 2024</span>
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="mt-4 md:mt-0">
                {isEditing ? (
                  <div className="flex space-x-2">
                    <button
                      onClick={() => setIsEditing(false)}
                      className="px-4 py-2 border border-gray-300 dark:border-slate-600 text-gray-700 dark:text-slate-300 rounded-lg hover:bg-gray-100 dark:hover:bg-slate-700 transition-colors"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleSave}
                      className="flex items-center px-4 py-2 bg-gradient-to-r from-violet-600 to-purple-600 text-white rounded-lg hover:from-violet-500 hover:to-purple-500 transition-all duration-300"
                    >
                      <Save className="w-4 h-4 mr-2" />
                      Save
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={() => setIsEditing(true)}
                    className="flex items-center px-4 py-2 bg-gradient-to-r from-violet-600 to-purple-600 text-white rounded-lg hover:from-violet-500 hover:to-purple-500 transition-all duration-300"
                  >
                    <Edit className="w-4 h-4 mr-2" />
                    Edit Profile
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Content Tabs */}
        <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg border border-gray-200 dark:border-slate-700">
          {/* Tab Navigation */}
          <div className="border-b border-gray-200 dark:border-slate-700">
            <nav className="flex space-x-8 px-6" aria-label="Tabs">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                    activeTab === tab.id
                      ? 'border-violet-600 text-violet-600 dark:text-violet-400'
                      : 'border-transparent text-gray-500 dark:text-slate-400 hover:text-gray-700 dark:hover:text-slate-300 hover:border-gray-300 dark:hover:border-slate-600'
                  }`}
                >
                  {tab.name}
                  <span className="ml-2 inline-block bg-gray-100 dark:bg-slate-700 rounded-full px-2 py-0.5 text-xs">
                    {tab.count}
                  </span>
                </button>
              ))}
            </nav>
          </div>

          {/* Tab Content */}
          <div className="p-6">
            {activeTab === 'published' && (
              <div>
                {userBlogs.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {userBlogs.map((blog) => (
                      <BlogCard key={blog.id} blog={blog} />
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <BookOpen className="mx-auto w-16 h-16 text-gray-400 mb-4" />
                    <h3 className="text-xl font-medium text-gray-900 dark:text-slate-100 mb-2">
                      No published articles yet
                    </h3>
                    <p className="text-gray-600 dark:text-slate-400 mb-6">
                      Start writing your first article to see it here
                    </p>
                  </div>
                )}
              </div>
            )}

            {activeTab === 'bookmarked' && (
              <div>
                {bookmarkedBlogs.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {bookmarkedBlogs.map((blog) => (
                      <BlogCard key={blog.id} blog={blog} />
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <BookOpen className="mx-auto w-16 h-16 text-gray-400 mb-4" />
                    <h3 className="text-xl font-medium text-gray-900 dark:text-slate-100 mb-2">
                      No bookmarked articles yet
                    </h3>
                    <p className="text-gray-600 dark:text-slate-400 mb-6">
                      Bookmark articles to read later and find them here
                    </p>
                  </div>
                )}
              </div>
            )}

            {activeTab === 'drafts' && (
              <div className="text-center py-12">
                <Edit className="mx-auto w-16 h-16 text-gray-400 mb-4" />
                <h3 className="text-xl font-medium text-gray-900 dark:text-slate-100 mb-2">
                  No drafts yet
                </h3>
                <p className="text-gray-600 dark:text-slate-400 mb-6">
                  Start writing and saving drafts to see them here
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
