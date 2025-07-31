import { Sparkles, Zap, Users, Smartphone } from "lucide-react";
import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-100 dark:from-gray-900 dark:via-blue-900/20 dark:to-indigo-900/20">
      {/* Header */}
      <header className="p-4 flex justify-between items-center">
        <div className="flex items-center gap-2">
          <Zap className="h-8 w-8 text-purple-600" />
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Launchly</h1>
        </div>
        <Link href="/feed">
          <button className="bg-purple-600 text-white px-4 py-2 rounded-full text-sm font-medium hover:bg-purple-700 transition-colors">
            Get Started
          </button>
        </Link>
      </header>

      {/* Hero Section */}
      <main className="px-4 pt-8 pb-16">
        <div className="max-w-4xl mx-auto text-center">
          <div className="flex justify-center mb-6">
            <div className="bg-purple-100 dark:bg-purple-900/30 p-3 rounded-full">
              <Sparkles className="h-12 w-12 text-purple-600" />
            </div>
          </div>
          
          <h1 className="text-4xl md:text-6xl font-bold text-gray-900 dark:text-white mb-6">
            Create Apps with{" "}
            <span className="bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
              AI Magic
            </span>
          </h1>
          
          <p className="text-xl text-gray-600 dark:text-gray-300 mb-8 max-w-2xl mx-auto">
            The social platform where you create amazing mini-applications using AI, 
            share them instantly, and discover incredible creations from others.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
            <Link href="/create">
              <button className="bg-purple-600 text-white px-8 py-3 rounded-full text-lg font-medium hover:bg-purple-700 transition-colors">
                Start Creating
              </button>
            </Link>
            <Link href="/feed">
              <button className="border border-purple-600 text-purple-600 px-8 py-3 rounded-full text-lg font-medium hover:bg-purple-50 dark:hover:bg-purple-900/20 transition-colors">
                Explore Apps
              </button>
            </Link>
          </div>

          {/* Features */}
          <div className="grid md:grid-cols-3 gap-8 mt-16">
            <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-lg">
              <div className="bg-blue-100 dark:bg-blue-900/30 p-3 rounded-full w-fit mx-auto mb-4">
                <Zap className="h-8 w-8 text-blue-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">AI-Powered Creation</h3>
              <p className="text-gray-600 dark:text-gray-300">
                Simply describe what you want: "Create a tip calculator" or "Make a memory game". 
                Our AI builds it instantly.
              </p>
            </div>

            <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-lg">
              <div className="bg-green-100 dark:bg-green-900/30 p-3 rounded-full w-fit mx-auto mb-4">
                <Smartphone className="h-8 w-8 text-green-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">Instant Interaction</h3>
              <p className="text-gray-600 dark:text-gray-300">
                Try apps immediately in your feed. No downloads, no installations. 
                Just tap and play with working applications.
              </p>
            </div>

            <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-lg">
              <div className="bg-purple-100 dark:bg-purple-900/30 p-3 rounded-full w-fit mx-auto mb-4">
                <Users className="h-8 w-8 text-purple-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">Social Discovery</h3>
              <p className="text-gray-600 dark:text-gray-300">
                Share your creations, discover amazing apps from others, and build 
                a following around your innovative ideas.
              </p>
            </div>
          </div>

          {/* Demo Preview */}
          <div className="mt-16 bg-white dark:bg-gray-800 p-8 rounded-3xl shadow-xl">
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
              See It In Action
            </h3>
            <div className="bg-gray-100 dark:bg-gray-700 rounded-2xl p-8 h-64 flex items-center justify-center">
              <p className="text-gray-500 dark:text-gray-400 text-lg">
                🚀 Interactive feed demo coming soon...
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}