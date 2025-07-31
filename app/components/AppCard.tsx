import { Heart, MessageCircle, Share, User } from "lucide-react";
import { Button } from "./Button";
import { AppSandbox } from "./AppSandbox";

interface AppCardProps {
  app: {
    id: string;
    title: string;
    description?: string;
    htmlContent: string;
    cssContent: string;
    jsContent: string;
    user: {
      username: string;
      displayName?: string;
      avatarUrl?: string;
    };
    likes: number;
    comments: number;
    isLiked?: boolean;
    createdAt: string;
  };
  onLike?: (appId: string) => void;
  onComment?: (appId: string) => void;
  onShare?: (appId: string) => void;
}

export function AppCard({ app, onLike, onComment, onShare }: AppCardProps) {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg overflow-hidden">
      {/* User Header */}
      <div className="flex items-center gap-3 p-4 border-b border-gray-100 dark:border-gray-700">
        <div className="w-10 h-10 rounded-full bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center">
          {app.user.avatarUrl ? (
            <img 
              src={app.user.avatarUrl} 
              alt={app.user.displayName || app.user.username}
              className="w-full h-full rounded-full object-cover"
            />
          ) : (
            <User className="w-5 h-5 text-purple-600" />
          )}
        </div>
        <div>
          <p className="font-medium text-gray-900 dark:text-white">
            {app.user.displayName || app.user.username}
          </p>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            @{app.user.username}
          </p>
        </div>
      </div>

      {/* App Content */}
      <div className="p-4">
        <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">
          {app.title}
        </h3>
        {app.description && (
          <p className="text-gray-600 dark:text-gray-300 text-sm mb-4">
            {app.description}
          </p>
        )}

        {/* Interactive App Preview */}
        <div className="mb-4">
          <AppSandbox
            htmlContent={app.htmlContent}
            cssContent={app.cssContent}
            jsContent={app.jsContent}
            title={app.title}
            className="h-48"
            allowFullscreen={true}
            onInteractionStart={() => {
              // Track interaction analytics
              console.log(`User started interacting with app: ${app.id}`);
            }}
            onInteractionEnd={() => {
              // Track interaction duration
              console.log(`User finished interacting with app: ${app.id}`);
            }}
          />
        </div>

        {/* Actions */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              onClick={() => onLike?.(app.id)}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-sm transition-colors ${
                app.isLiked
                  ? "bg-red-100 text-red-600 dark:bg-red-900/30"
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600"
              }`}
            >
              <Heart className={`w-4 h-4 ${app.isLiked ? "fill-current" : ""}`} />
              {app.likes}
            </button>

            <button
              onClick={() => onComment?.(app.id)}
              className="flex items-center gap-2 px-3 py-1.5 rounded-full text-sm bg-gray-100 text-gray-600 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600 transition-colors"
            >
              <MessageCircle className="w-4 h-4" />
              {app.comments}
            </button>

            <button
              onClick={() => onShare?.(app.id)}
              className="flex items-center gap-2 px-3 py-1.5 rounded-full text-sm bg-gray-100 text-gray-600 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600 transition-colors"
            >
              <Share className="w-4 h-4" />
            </button>
          </div>

          <Button variant="outline" size="sm">
            Try Full Screen
          </Button>
        </div>
      </div>
    </div>
  );
}