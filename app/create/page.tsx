"use client";

import { useState } from "react";
import { Send, Sparkles, ArrowLeft, Eye, Code } from "lucide-react";
import Link from "next/link";
import { Button } from "../components/Button";
import { AppSandbox } from "../components/AppSandbox";

export default function CreatePage() {
  const [prompt, setPrompt] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedApp, setGeneratedApp] = useState<{
    title: string;
    description: string;
    htmlContent: string;
    cssContent: string;
    jsContent: string;
  } | null>(null);
  const [conversation, setConversation] = useState<Array<{
    role: "user" | "assistant";
    content: string;
  }>>([]);
  const [viewMode, setViewMode] = useState<"preview" | "code">("preview");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!prompt.trim() || isGenerating) return;

    const userMessage = prompt;
    setPrompt("");
    setIsGenerating(true);

    // Add user message to conversation
    setConversation(prev => [...prev, { role: "user", content: userMessage }]);

    try {
      // Call our Claude API endpoint
      const response = await fetch('/api/claude/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          prompt: userMessage,
          conversationHistory: conversation
        }),
      });

      if (!response.ok) {
        throw new Error(`API request failed: ${response.statusText}`);
      }

      const data = await response.json();

      if (!data.success) {
        throw new Error(data.error || 'Failed to generate app');
      }

      setGeneratedApp(data.app);
      setConversation(prev => [...prev, { 
        role: "assistant", 
        content: data.message 
      }]);

    } catch (error) {
      console.error("Error generating app:", error);
      setConversation(prev => [...prev, { 
        role: "assistant", 
        content: "Sorry, there was an error generating your app. Please try again." 
      }]);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <header className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 p-4">
        <div className="flex items-center gap-4">
          <Link href="/feed">
            <Button variant="ghost" size="sm">
              <ArrowLeft className="h-4 w-4" />
            </Button>
          </Link>
          <h1 className="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
            <Sparkles className="h-6 w-6 text-purple-600" />
            Create with AI
          </h1>
        </div>
      </header>

      <div className="max-w-6xl mx-auto p-4 grid lg:grid-cols-2 gap-6">
        {/* Chat Interface */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg h-[calc(100vh-120px)] flex flex-col">
          <div className="p-4 border-b border-gray-200 dark:border-gray-700">
            <h2 className="font-semibold text-gray-900 dark:text-white">
              Chat with AI Assistant
            </h2>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Describe the app you want to create
            </p>
          </div>

          {/* Conversation */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {conversation.length === 0 && (
              <div className="text-center py-8">
                <Sparkles className="h-12 w-12 text-purple-600 mx-auto mb-4" />
                <p className="text-gray-500 dark:text-gray-400">
                  Start by describing the app you want to create!
                </p>
                <div className="mt-4 grid gap-2">
                  <button 
                    onClick={() => setPrompt("Create a tip calculator with dark theme")}
                    className="text-left p-3 bg-gray-50 dark:bg-gray-700 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors"
                  >
                    "Create a tip calculator with dark theme"
                  </button>
                  <button 
                    onClick={() => setPrompt("Make a memory matching game with emoji")}
                    className="text-left p-3 bg-gray-50 dark:bg-gray-700 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors"
                  >
                    "Make a memory matching game with emoji"
                  </button>
                  <button 
                    onClick={() => setPrompt("Build a random quote generator")}
                    className="text-left p-3 bg-gray-50 dark:bg-gray-700 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors"
                  >
                    "Build a random quote generator"
                  </button>
                </div>
              </div>
            )}

            {conversation.map((message, index) => (
              <div
                key={index}
                className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`max-w-xs lg:max-w-md px-4 py-2 rounded-2xl ${
                    message.role === "user"
                      ? "bg-purple-600 text-white"
                      : "bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white"
                  }`}
                >
                  {message.content}
                </div>
              </div>
            ))}

            {isGenerating && (
              <div className="flex justify-start">
                <div className="bg-gray-100 dark:bg-gray-700 px-4 py-2 rounded-2xl">
                  <div className="flex items-center gap-2">
                    <div className="animate-spin rounded-full h-4 w-4 border-2 border-purple-600 border-t-transparent"></div>
                    <span className="text-gray-600 dark:text-gray-300">Creating your app...</span>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Input Form */}
          <form onSubmit={handleSubmit} className="p-4 border-t border-gray-200 dark:border-gray-700">
            <div className="flex gap-2">
              <input
                type="text"
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder="Describe the app you want to create..."
                className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                disabled={isGenerating}
              />
              <Button type="submit" disabled={!prompt.trim() || isGenerating}>
                <Send className="h-4 w-4" />
              </Button>
            </div>
          </form>
        </div>

        {/* Preview Pane */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg h-[calc(100vh-120px)] flex flex-col">
          <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
            <h2 className="font-semibold text-gray-900 dark:text-white">
              {generatedApp ? generatedApp.title : "App Preview"}
            </h2>
            
            {generatedApp && (
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setViewMode("preview")}
                  className={`p-2 rounded-lg ${
                    viewMode === "preview"
                      ? "bg-purple-100 text-purple-600 dark:bg-purple-900/30"
                      : "text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                  }`}
                >
                  <Eye className="h-4 w-4" />
                </button>
                <button
                  onClick={() => setViewMode("code")}
                  className={`p-2 rounded-lg ${
                    viewMode === "code"
                      ? "bg-purple-100 text-purple-600 dark:bg-purple-900/30"
                      : "text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                  }`}
                >
                  <Code className="h-4 w-4" />
                </button>
              </div>
            )}
          </div>

          <div className="flex-1 overflow-hidden">
            {!generatedApp ? (
              <div className="h-full flex items-center justify-center text-gray-500 dark:text-gray-400">
                Your generated app will appear here
              </div>
            ) : viewMode === "preview" ? (
              <div className="h-full p-4">
                <AppSandbox
                  htmlContent={generatedApp.htmlContent}
                  cssContent={generatedApp.cssContent}
                  jsContent={generatedApp.jsContent}
                  title={generatedApp.title}
                  className="h-full"
                  allowFullscreen={true}
                />
              </div>
            ) : (
              <div className="h-full p-4 overflow-y-auto">
                <div className="space-y-4 text-sm">
                  <div>
                    <h3 className="font-medium text-gray-900 dark:text-white mb-2">HTML</h3>
                    <pre className="bg-gray-100 dark:bg-gray-700 p-3 rounded-lg overflow-x-auto">
                      <code>{generatedApp.htmlContent}</code>
                    </pre>
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-900 dark:text-white mb-2">CSS</h3>
                    <pre className="bg-gray-100 dark:bg-gray-700 p-3 rounded-lg overflow-x-auto">
                      <code>{generatedApp.cssContent}</code>
                    </pre>
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-900 dark:text-white mb-2">JavaScript</h3>
                    <pre className="bg-gray-100 dark:bg-gray-700 p-3 rounded-lg overflow-x-auto">
                      <code>{generatedApp.jsContent}</code>
                    </pre>
                  </div>
                </div>
              </div>
            )}
          </div>

          {generatedApp && (
            <div className="p-4 border-t border-gray-200 dark:border-gray-700">
              <div className="flex gap-3">
                <Button variant="outline" className="flex-1">
                  Improve App
                </Button>
                <Button variant="primary" className="flex-1">
                  Publish to Feed
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}