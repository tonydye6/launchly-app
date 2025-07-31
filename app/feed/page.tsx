"use client";

import { useState } from "react";
import { Plus, Search, Home, Zap } from "lucide-react";
import Link from "next/link";
import { AppCard } from "../components/AppCard";
import { Button } from "../components/Button";

// Mock data with real working apps for testing
const mockApps = [
  {
    id: "1",
    title: "Tip Calculator",
    description: "Calculate tips and split bills easily",
    htmlContent: `
      <div class="tip-calculator">
        <h2>💰 Tip Calculator</h2>
        <div class="input-group">
          <label for="bill">Bill Amount ($)</label>
          <input type="number" id="bill" placeholder="0.00" step="0.01">
        </div>
        <div class="tip-buttons">
          <button onclick="calculateTip(15)">15%</button>
          <button onclick="calculateTip(18)">18%</button>
          <button onclick="calculateTip(20)">20%</button>
        </div>
        <div class="results">
          <div class="result-row">
            <span>Tip Amount:</span>
            <span class="amount">$<span id="tip">0.00</span></span>
          </div>
          <div class="result-row total">
            <span>Total:</span>
            <span class="amount">$<span id="total">0.00</span></span>
          </div>
        </div>
      </div>
    `,
    cssContent: `
      .tip-calculator {
        max-width: 280px;
        margin: 0 auto;
        padding: 20px;
        font-family: -apple-system, BlinkMacSystemFont, sans-serif;
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        border-radius: 16px;
        color: white;
      }
      h2 {
        text-align: center;
        margin: 0 0 20px 0;
        font-size: 24px;
      }
      .input-group {
        margin-bottom: 20px;
      }
      label {
        display: block;
        margin-bottom: 8px;
        font-weight: 500;
      }
      input {
        width: 100%;
        padding: 12px;
        border: none;
        border-radius: 8px;
        font-size: 18px;
        text-align: center;
      }
      .tip-buttons {
        display: flex;
        gap: 8px;
        margin-bottom: 20px;
      }
      .tip-buttons button {
        flex: 1;
        padding: 12px;
        background: rgba(255,255,255,0.2);
        color: white;
        border: none;
        border-radius: 8px;
        cursor: pointer;
        font-weight: 500;
        transition: background 0.2s;
      }
      .tip-buttons button:hover {
        background: rgba(255,255,255,0.3);
      }
      .results {
        background: rgba(255,255,255,0.1);
        border-radius: 8px;
        padding: 16px;
      }
      .result-row {
        display: flex;
        justify-content: space-between;
        margin-bottom: 8px;
      }
      .result-row.total {
        border-top: 1px solid rgba(255,255,255,0.3);
        padding-top: 8px;
        font-weight: bold;
        font-size: 18px;
      }
      .amount {
        font-weight: 600;
      }
    `,
    jsContent: `
      function calculateTip(percentage) {
        const billAmount = parseFloat(document.getElementById('bill').value) || 0;
        const tipAmount = billAmount * (percentage / 100);
        const totalAmount = billAmount + tipAmount;
        
        document.getElementById('tip').textContent = tipAmount.toFixed(2);
        document.getElementById('total').textContent = totalAmount.toFixed(2);
      }
      
      document.getElementById('bill').addEventListener('input', function() {
        if (this.value) {
          calculateTip(18); // Default to 18%
        } else {
          document.getElementById('tip').textContent = '0.00';
          document.getElementById('total').textContent = '0.00';
        }
      });
    `,
    user: {
      username: "john_creator",
      displayName: "John Smith",
      avatarUrl: undefined,
    },
    likes: 24,
    comments: 5,
    isLiked: false,
    createdAt: "2024-01-15T10:30:00Z",
  },
  {
    id: "2", 
    title: "Color Picker Tool",
    description: "Generate random beautiful colors with hex codes",
    htmlContent: `
      <div class="color-picker">
        <h2>🎨 Color Picker</h2>
        <div class="color-display" id="colorDisplay">
          <div class="hex-code" id="hexCode">#3498db</div>
        </div>
        <div class="controls">
          <button onclick="generateRandomColor()">Generate Random</button>
          <button onclick="copyToClipboard()">Copy Hex</button>
        </div>
        <div class="palette" id="palette"></div>
      </div>
    `,
    cssContent: `
      .color-picker {
        max-width: 280px;
        margin: 0 auto;
        padding: 20px;
        font-family: -apple-system, BlinkMacSystemFont, sans-serif;
        text-align: center;
      }
      h2 {
        margin: 0 0 20px 0;
        color: #333;
      }
      .color-display {
        width: 100%;
        height: 120px;
        border-radius: 12px;
        display: flex;
        align-items: center;
        justify-content: center;
        margin-bottom: 20px;
        box-shadow: 0 4px 12px rgba(0,0,0,0.1);
        transition: all 0.3s ease;
      }
      .hex-code {
        background: rgba(255,255,255,0.9);
        padding: 8px 16px;
        border-radius: 20px;
        font-weight: bold;
        font-family: monospace;
        color: #333;
      }
      .controls {
        display: flex;
        gap: 10px;
        margin-bottom: 20px;
      }
      .controls button {
        flex: 1;
        padding: 12px;
        background: #3498db;
        color: white;
        border: none;
        border-radius: 8px;
        cursor: pointer;
        font-weight: 500;
        transition: background 0.2s;
      }
      .controls button:hover {
        background: #2980b9;
      }
      .palette {
        display: grid;
        grid-template-columns: repeat(5, 1fr);
        gap: 8px;
      }
      .palette-color {
        width: 100%;
        height: 32px;
        border-radius: 6px;
        cursor: pointer;
        border: 2px solid transparent;
        transition: border 0.2s;
      }
      .palette-color:hover {
        border-color: #333;
      }
    `,
    jsContent: `
      function generateRandomColor() {
        const colors = ['#e74c3c', '#3498db', '#2ecc71', '#f39c12', '#9b59b6', '#1abc9c', '#34495e', '#e67e22'];
        const randomColor = colors[Math.floor(Math.random() * colors.length)];
        
        const display = document.getElementById('colorDisplay');
        const hexCode = document.getElementById('hexCode');
        
        display.style.backgroundColor = randomColor;
        hexCode.textContent = randomColor;
        
        generatePalette(randomColor);
      }
      
      function generatePalette(baseColor) {
        const palette = document.getElementById('palette');
        palette.innerHTML = '';
        
        for (let i = 0; i < 10; i++) {
          const variation = adjustBrightness(baseColor, (i - 5) * 20);
          const colorDiv = document.createElement('div');
          colorDiv.className = 'palette-color';
          colorDiv.style.backgroundColor = variation;
          colorDiv.onclick = () => {
            document.getElementById('colorDisplay').style.backgroundColor = variation;
            document.getElementById('hexCode').textContent = variation;
          };
          palette.appendChild(colorDiv);
        }
      }
      
      function adjustBrightness(hex, percent) {
        const num = parseInt(hex.replace("#", ""), 16);
        const amt = Math.round(2.55 * percent);
        const R = (num >> 16) + amt;
        const G = (num >> 8 & 0x00FF) + amt;
        const B = (num & 0x0000FF) + amt;
        return "#" + (0x1000000 + (R < 255 ? R < 1 ? 0 : R : 255) * 0x10000 +
          (G < 255 ? G < 1 ? 0 : G : 255) * 0x100 +
          (B < 255 ? B < 1 ? 0 : B : 255)).toString(16).slice(1);
      }
      
      function copyToClipboard() {
        const hexCode = document.getElementById('hexCode').textContent;
        navigator.clipboard.writeText(hexCode).then(() => {
          alert('Color copied to clipboard!');
        });
      }
      
      // Initialize
      generateRandomColor();
    `,
    user: {
      username: "alex_design",
      displayName: "Alex Chen",
      avatarUrl: undefined,
    },
    likes: 156,
    comments: 23,
    isLiked: false,
    createdAt: "2024-01-14T15:45:00Z",
  },
  {
    id: "3",
    title: "Simple Timer",
    description: "A beautiful countdown timer for productivity",
    htmlContent: `
      <div class="timer-app">
        <h2>⏰ Focus Timer</h2>
        <div class="timer-display">
          <div class="time" id="timeDisplay">25:00</div>
        </div>
        <div class="controls">
          <button onclick="startTimer()" id="startBtn">Start</button>
          <button onclick="pauseTimer()" id="pauseBtn">Pause</button>
          <button onclick="resetTimer()" id="resetBtn">Reset</button>
        </div>
        <div class="presets">
          <button onclick="setTimer(5)">5m</button>
          <button onclick="setTimer(25)">25m</button>
          <button onclick="setTimer(50)">50m</button>
        </div>
      </div>
    `,
    cssContent: `
      .timer-app {
        max-width: 280px;
        margin: 0 auto;
        padding: 20px;
        font-family: -apple-system, BlinkMacSystemFont, sans-serif;
        text-align: center;
        background: linear-gradient(135deg, #ff6b6b 0%, #ee5a24 100%);
        border-radius: 16px;
        color: white;
      }
      h2 {
        margin: 0 0 20px 0;
        font-size: 24px;
      }
      .timer-display {
        background: rgba(255,255,255,0.1);
        border-radius: 20px;
        padding: 30px;
        margin-bottom: 20px;
      }
      .time {
        font-size: 48px;
        font-weight: bold;
        font-family: 'Courier New', monospace;
      }
      .controls {
        display: flex;
        gap: 10px;
        margin-bottom: 15px;
      }
      .controls button {
        flex: 1;
        padding: 12px;
        background: rgba(255,255,255,0.2);
        color: white;
        border: none;
        border-radius: 8px;
        cursor: pointer;
        font-weight: 500;
        transition: background 0.2s;
      }
      .controls button:hover {
        background: rgba(255,255,255,0.3);
      }
      .presets {
        display: flex;
        gap: 8px;
      }
      .presets button {
        flex: 1;
        padding: 8px;
        background: rgba(255,255,255,0.1);
        color: white;
        border: none;
        border-radius: 6px;
        cursor: pointer;
        font-size: 12px;
        transition: background 0.2s;
      }
      .presets button:hover {
        background: rgba(255,255,255,0.2);
      }
    `,
    jsContent: `
      let timeLeft = 25 * 60; // 25 minutes in seconds
      let timerInterval = null;
      let isRunning = false;
      
      function updateDisplay() {
        const minutes = Math.floor(timeLeft / 60);
        const seconds = timeLeft % 60;
        document.getElementById('timeDisplay').textContent = 
          minutes.toString().padStart(2, '0') + ':' + seconds.toString().padStart(2, '0');
      }
      
      function startTimer() {
        if (!isRunning) {
          isRunning = true;
          timerInterval = setInterval(() => {
            timeLeft--;
            updateDisplay();
            
            if (timeLeft <= 0) {
              pauseTimer();
              alert('Time\\'s up! 🎉');
            }
          }, 1000);
        }
      }
      
      function pauseTimer() {
        isRunning = false;
        if (timerInterval) {
          clearInterval(timerInterval);
          timerInterval = null;
        }
      }
      
      function resetTimer() {
        pauseTimer();
        timeLeft = 25 * 60;
        updateDisplay();
      }
      
      function setTimer(minutes) {
        pauseTimer();
        timeLeft = minutes * 60;
        updateDisplay();
      }
      
      // Initialize display
      updateDisplay();
    `,
    user: {
      username: "sarah_dev",
      displayName: "Sarah Johnson", 
      avatarUrl: undefined,
    },
    likes: 89,
    comments: 12,
    isLiked: true,
    createdAt: "2024-01-13T09:20:00Z",
  }
];

export default function FeedPage() {
  const [apps, setApps] = useState(mockApps);

  const handleLike = (appId: string) => {
    setApps(prevApps => 
      prevApps.map(app => 
        app.id === appId 
          ? { 
              ...app, 
              isLiked: !app.isLiked,
              likes: app.isLiked ? app.likes - 1 : app.likes + 1
            }
          : app
      )
    );
  };

  const handleComment = (appId: string) => {
    console.log("Comment on app:", appId);
    // TODO: Implement comment functionality
  };

  const handleShare = (appId: string) => {
    console.log("Share app:", appId);
    // TODO: Implement share functionality
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Mobile Header */}
      <header className="sticky top-0 z-50 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center justify-between p-4">
          <div className="flex items-center gap-2">
            <Zap className="h-8 w-8 text-purple-600" />
            <h1 className="text-xl font-bold text-gray-900 dark:text-white">
              Launchly
            </h1>
          </div>
          
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="sm">
              <Search className="h-5 w-5" />
            </Button>
            <Link href="/create">
              <Button variant="primary" size="sm">
                <Plus className="h-4 w-4 mr-1" />
                Create
              </Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Feed Content */}
      <main className="max-w-2xl mx-auto p-4">
        <div className="space-y-6">
          {apps.map((app) => (
            <AppCard
              key={app.id}
              app={app}
              onLike={handleLike}
              onComment={handleComment}
              onShare={handleShare}
            />
          ))}
        </div>

        {/* Load More */}
        <div className="flex justify-center py-8">
          <Button variant="outline">
            Load More Apps
          </Button>
        </div>
      </main>

      {/* Mobile Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 px-4 py-2">
        <div className="flex items-center justify-around max-w-md mx-auto">
          <button className="flex flex-col items-center gap-1 p-2 text-purple-600">
            <Home className="h-6 w-6" />
            <span className="text-xs font-medium">Feed</span>
          </button>
          
          <button className="flex flex-col items-center gap-1 p-2 text-gray-400">
            <Search className="h-6 w-6" />
            <span className="text-xs">Discover</span>
          </button>
          
          <Link href="/create">
            <button className="flex flex-col items-center gap-1 p-2 text-gray-400">
              <Plus className="h-6 w-6" />
              <span className="text-xs">Create</span>
            </button>
          </Link>
          
          <Link href="/profile">
            <button className="flex flex-col items-center gap-1 p-2 text-gray-400">
              <div className="w-6 h-6 rounded-full bg-gray-300"></div>
              <span className="text-xs">Profile</span>
            </button>
          </Link>
        </div>
      </nav>

      {/* Bottom padding for mobile nav */}
      <div className="h-20"></div>
    </div>
  );
}