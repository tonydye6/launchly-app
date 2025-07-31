"use client";

import { useEffect, useRef, useState } from "react";
import { AlertTriangle, Maximize2, Minimize2 } from "lucide-react";

interface AppSandboxProps {
  htmlContent: string;
  cssContent: string;
  jsContent: string;
  title?: string;
  className?: string;
  allowFullscreen?: boolean;
  onInteractionStart?: () => void;
  onInteractionEnd?: () => void;
}

export function AppSandbox({
  htmlContent,
  cssContent,
  jsContent,
  title = "App Preview",
  className = "",
  allowFullscreen = true,
  onInteractionStart,
  onInteractionEnd,
}: AppSandboxProps) {
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [hasError, setHasError] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const interactionTimeoutRef = useRef<NodeJS.Timeout>();

  // Create sandboxed HTML document
  const createSandboxedContent = () => {
    return `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${title}</title>
    <style>
        /* Reset and base styles */
        * {
            box-sizing: border-box;
        }
        
        body {
            margin: 0;
            padding: 20px;
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            background: #ffffff;
            min-height: 100vh;
        }
        
        /* User styles */
        ${cssContent}
    </style>
</head>
<body>
    ${htmlContent}
    
    <script>
        // Security: Disable dangerous APIs
        window.parent = undefined;
        window.top = undefined;
        
        // Intercept console for debugging
        const originalLog = console.log;
        console.log = function(...args) {
            try {
                window.parent.postMessage({
                    type: 'console',
                    level: 'log',
                    args: args.map(arg => typeof arg === 'object' ? JSON.stringify(arg) : String(arg))
                }, '*');
            } catch (e) {
                // Fallback to original console
                originalLog.apply(console, args);
            }
        };
        
        // Track interactions
        let interactionTimeout;
        
        function notifyInteraction(type) {
            try {
                window.parent.postMessage({
                    type: 'interaction',
                    action: type
                }, '*');
            } catch (e) {
                // Silently fail if parent communication fails
            }
        }
        
        // Add interaction listeners
        ['click', 'touchstart', 'keydown', 'input'].forEach(eventType => {
            document.addEventListener(eventType, () => {
                notifyInteraction('start');
                
                clearTimeout(interactionTimeout);
                interactionTimeout = setTimeout(() => {
                    notifyInteraction('end');
                }, 1000);
            }, { passive: true });
        });
        
        // Error handling
        window.addEventListener('error', (event) => {
            window.parent.postMessage({
                type: 'error',
                message: event.message,
                filename: event.filename,
                lineno: event.lineno
            }, '*');
        });
        
        // Notify parent that app is ready
        window.addEventListener('load', () => {
            window.parent.postMessage({ type: 'ready' }, '*');
        });
        
        try {
            // User JavaScript code
            ${jsContent}
        } catch (error) {
            console.error('App execution error:', error);
            window.parent.postMessage({
                type: 'error',
                message: error.message
            }, '*');
        }
    </script>
</body>
</html>`;
  };

  // Handle messages from iframe
  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      if (event.source !== iframeRef.current?.contentWindow) return;

      switch (event.data.type) {
        case 'ready':
          setIsLoading(false);
          setHasError(false);
          break;
        
        case 'error':
          console.error('Sandboxed app error:', event.data);
          setHasError(true);
          setIsLoading(false);
          break;
        
        case 'interaction':
          if (event.data.action === 'start') {
            onInteractionStart?.();
          } else if (event.data.action === 'end') {
            onInteractionEnd?.();
          }
          break;
        
        case 'console':
          // Forward console messages for debugging
          console.log(`[${title}]`, ...event.data.args);
          break;
      }
    };

    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, [title, onInteractionStart, onInteractionEnd]);

  // Load content into iframe
  useEffect(() => {
    const iframe = iframeRef.current;
    if (!iframe) return;

    setIsLoading(true);
    setHasError(false);

    try {
      const sandboxedContent = createSandboxedContent();
      const blob = new Blob([sandboxedContent], { type: 'text/html' });
      const url = URL.createObjectURL(blob);
      
      iframe.src = url;
      
      // Cleanup
      return () => {
        URL.revokeObjectURL(url);
      };
    } catch (error) {
      console.error('Failed to create sandboxed content:', error);
      setHasError(true);
      setIsLoading(false);
    }
  }, [htmlContent, cssContent, jsContent, title]);

  const toggleFullscreen = () => {
    setIsFullscreen(!isFullscreen);
  };

  if (isFullscreen) {
    return (
      <div className="fixed inset-0 z-50 bg-black bg-opacity-90 flex items-center justify-center p-4">
        <div className="w-full h-full max-w-4xl max-h-full bg-white rounded-lg overflow-hidden flex flex-col">
          <div className="flex items-center justify-between p-4 border-b bg-gray-50">
            <h3 className="font-semibold text-gray-900">{title}</h3>
            <button
              onClick={toggleFullscreen}
              className="p-2 text-gray-500 hover:text-gray-700 rounded-lg hover:bg-gray-200"
            >
              <Minimize2 className="h-5 w-5" />
            </button>
          </div>
          <div className="flex-1 relative">
            {isLoading && (
              <div className="absolute inset-0 flex items-center justify-center bg-gray-50">
                <div className="animate-spin rounded-full h-8 w-8 border-2 border-purple-600 border-t-transparent"></div>
              </div>
            )}
            {hasError && (
              <div className="absolute inset-0 flex items-center justify-center bg-red-50">
                <div className="text-center text-red-600">
                  <AlertTriangle className="h-8 w-8 mx-auto mb-2" />
                  <p>Failed to load app</p>
                </div>
              </div>
            )}
            <iframe
              ref={iframeRef}
              className="w-full h-full border-0"
              sandbox="allow-scripts allow-forms allow-popups allow-modals"
              title={title}
            />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`relative bg-white border border-gray-200 dark:border-gray-600 rounded-lg overflow-hidden ${className}`}>
      {/* Loading State */}
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-50 dark:bg-gray-800 z-10">
          <div className="flex items-center gap-2 text-gray-600 dark:text-gray-300">
            <div className="animate-spin rounded-full h-5 w-5 border-2 border-purple-600 border-t-transparent"></div>
            <span className="text-sm">Loading app...</span>
          </div>
        </div>
      )}

      {/* Error State */}
      {hasError && (
        <div className="absolute inset-0 flex items-center justify-center bg-red-50 dark:bg-red-900/20 z-10">
          <div className="text-center text-red-600 dark:text-red-400">
            <AlertTriangle className="h-8 w-8 mx-auto mb-2" />
            <p className="text-sm">App failed to load</p>
          </div>
        </div>
      )}

      {/* Fullscreen Button */}
      {allowFullscreen && !isLoading && !hasError && (
        <button
          onClick={toggleFullscreen}
          className="absolute top-2 right-2 z-20 p-2 bg-black bg-opacity-20 text-white rounded-lg hover:bg-opacity-30 transition-opacity"
        >
          <Maximize2 className="h-4 w-4" />
        </button>
      )}

      {/* Sandboxed App Iframe */}
      <iframe
        ref={iframeRef}
        className="w-full h-full border-0"
        sandbox="allow-scripts allow-forms allow-popups allow-modals"
        title={title}
      />
    </div>
  );
}