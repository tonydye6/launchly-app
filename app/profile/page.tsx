"use client";

import { useState } from "react";
import { ArrowLeft, Settings, Share, User, Heart, MessageCircle } from "lucide-react";
import Link from "next/link";
import { Button } from "../components/Button";
import { AppCard } from "../components/AppCard";

// Mock user data
const mockUser = {
  id: "user1",
  username: "john_creator",
  displayName: "John Smith",
  bio: "AI enthusiast & app creator. Making useful tools for everyday problems! 🚀",
  avatarUrl: undefined,
  followers: 342,
  following: 89,
  appsCreated: 12,
  totalLikes: 1520,
  joinedAt: "2024-01-01",
};

// Mock user's apps
const mockUserApps = [
  {
    id: "1",
    title: "Tip Calculator",
    description: "Calculate tips and split bills easily",
    htmlContent: `<div>App content...</div>`,
    cssContent: `/* CSS */`,
    jsContent: `// JS`,
    user: mockUser,
    likes: 24,
    comments: 5,
    isLiked: false,
    createdAt: "2024-01-15T10:30:00Z",
  },
  {
    id: "4",
    title: "Random Quote Generator",
    description: "Get inspired with beautiful quotes",
    htmlContent: `<div>Quote app...</div>`,
    cssContent: `/* CSS */`,
    jsContent: `// JS`,
    user: mockUser,
    likes: 67,
    comments: 12,
    isLiked: true,
    createdAt: "2024-01-10T14:20:00Z",
  },
];

export default function ProfilePage() {
  const [activeTab, setActiveTab] = useState<"apps" | "liked">("apps");
  const [isFollowing, setIsFollowing] = useState(false);

  const handleFollow = () => {
    setIsFollowing(!isFollowing);
    // TODO: API call to follow/unfollow user
  };

  const handleLike = (appId: string) => {
    // TODO: Implement like functionality
    console.log("Like app:", appId);
  };

  const handleComment = (appId: string) => {
    // TODO: Implement comment functionality
    console.log("Comment on app:", appId);
  };

  const handleShare = (appId: string) => {
    // TODO: Implement share functionality
    console.log("Share app:", appId);
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <header className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 p-4">
        <div className="flex items-center justify-between">
          <Link href="/feed">
            <Button variant="ghost" size="sm">
              <ArrowLeft className="h-4 w-4" />
            </Button>
          </Link>
          <h1 className="text-xl font-bold text-gray-900 dark:text-white">
            Profile
          </h1>
          <Button variant="ghost" size="sm">
            <Settings className="h-4 w-4" />
          </Button>
        </div>
      </header>

      <main className="max-w-2xl mx-auto p-4">
        {/* Profile Header */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 mb-6">
          <div className="flex items-start gap-4">
            <div className="w-20 h-20 rounded-full bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center">
              {mockUser.avatarUrl ? (
                <img 
                  src={mockUser.avatarUrl} 
                  alt={mockUser.displayName}
                  className="w-full h-full rounded-full object-cover"
                />
              ) : (
                <User className="w-10 h-10 text-purple-600" />
              )}
            </div>
            
            <div className="flex-1">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                {mockUser.displayName}
              </h2>
              <p className="text-gray-500 dark:text-gray-400 mb-2">
                @{mockUser.username}
              </p>
              {mockUser.bio && (
                <p className="text-gray-700 dark:text-gray-300 mb-4">
                  {mockUser.bio}
                </p>
              )}
              
              <div className="flex gap-6 text-sm">
                <div>
                  <span className="font-bold text-gray-900 dark:text-white">
                    {mockUser.followers}
                  </span>
                  <span className="text-gray-500 dark:text-gray-400 ml-1">
                    followers
                  </span>
                </div>
                <div>
                  <span className="font-bold text-gray-900 dark:text-white">
                    {mockUser.following}
                  </span>
                  <span className="text-gray-500 dark:text-gray-400 ml-1">
                    following
                  </span>
                </div>
                <div>
                  <span className="font-bold text-gray-900 dark:text-white">
                    {mockUser.appsCreated}
                  </span>
                  <span className="text-gray-500 dark:text-gray-400 ml-1">
                    apps
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div className="flex gap-3 mt-6">
            <Button
              variant={isFollowing ? "outline" : "primary"}
              onClick={handleFollow}
              className="flex-1"
            >
              {isFollowing ? "Following" : "Follow"}
            </Button>
            <Button variant="outline">
              <Share className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 gap-4 mb-6">
          <div className="bg-white dark:bg-gray-800 rounded-xl p-4 text-center">
            <div className="text-2xl font-bold text-purple-600 mb-1">
              {mockUser.totalLikes}
            </div>
            <div className="text-sm text-gray-500 dark:text-gray-400">
              Total Likes
            </div>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-xl p-4 text-center">
            <div className="text-2xl font-bold text-blue-600 mb-1">
              {mockUser.appsCreated}
            </div>
            <div className="text-sm text-gray-500 dark:text-gray-400">
              Apps Created
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="bg-white dark:bg-gray-800 rounded-t-2xl">
          <div className="flex border-b border-gray-200 dark:border-gray-700">
            <button
              onClick={() => setActiveTab("apps")}
              className={`flex-1 py-4 px-6 text-center font-medium transition-colors ${
                activeTab === "apps"
                  ? "text-purple-600 border-b-2 border-purple-600"
                  : "text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300"
              }`}
            >
              My Apps ({mockUserApps.length})
            </button>
            <button
              onClick={() => setActiveTab("liked")}
              className={`flex-1 py-4 px-6 text-center font-medium transition-colors ${
                activeTab === "liked"
                  ? "text-purple-600 border-b-2 border-purple-600"
                  : "text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300"
              }`}
            >
              <Heart className="w-4 h-4 inline mr-1" />
              Liked (0)
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="space-y-6 mt-6">
          {activeTab === "apps" ? (
            mockUserApps.length > 0 ? (
              mockUserApps.map((app) => (
                <AppCard
                  key={app.id}
                  app={app}
                  onLike={handleLike}
                  onComment={handleComment}
                  onShare={handleShare}
                />
              ))
            ) : (
              <div className="text-center py-12 text-gray-500 dark:text-gray-400">
                <User className="w-12 h-12 mx-auto mb-4 opacity-50" />
                <p>No apps created yet</p>
                <Link href="/create">
                  <Button variant="primary" className="mt-4">
                    Create Your First App
                  </Button>
                </Link>
              </div>
            )
          ) : (
            <div className="text-center py-12 text-gray-500 dark:text-gray-400">
              <Heart className="w-12 h-12 mx-auto mb-4 opacity-50" />
              <p>No liked apps yet</p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}