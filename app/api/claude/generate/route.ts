import { NextRequest, NextResponse } from 'next/server';
// import Anthropic from '@anthropic-ai/sdk';

// Initialize Claude client (will work once environment variables are set up)
// const anthropic = new Anthropic({
//   apiKey: process.env.ANTHROPIC_API_KEY,
// });

interface GenerateRequest {
  prompt: string;
  conversationHistory?: Array<{
    role: 'user' | 'assistant';
    content: string;
  }>;
}

interface GeneratedApp {
  title: string;
  description: string;
  htmlContent: string;
  cssContent: string;
  jsContent: string;
}

export async function POST(request: NextRequest) {
  try {
    const { prompt, conversationHistory = [] }: GenerateRequest = await request.json();

    if (!prompt) {
      return NextResponse.json(
        { error: 'Prompt is required' },
        { status: 400 }
      );
    }

    // For now, return mock data until Claude API is set up
    // TODO: Replace with actual Claude API call
    const mockResponse: GeneratedApp = generateMockApp(prompt);

    return NextResponse.json({
      success: true,
      app: mockResponse,
      message: `I've created a ${mockResponse.title} for you! ${mockResponse.description}`
    });

    // TODO: Uncomment when environment variables are set up
    /*
    const systemPrompt = `You are an expert web developer that creates mini-applications based on user requests. 

CRITICAL REQUIREMENTS:
1. Generate ONLY self-contained HTML/CSS/JavaScript that works in an iframe
2. Use NO external libraries or CDNs - vanilla JS only
3. All code must be safe and functional
4. Style should be modern and beautiful
5. The app should be fully functional and interactive

RESPONSE FORMAT:
Return a JSON object with exactly these fields:
{
  "title": "App Name",
  "description": "Brief description", 
  "htmlContent": "HTML code here",
  "cssContent": "CSS code here",
  "jsContent": "JavaScript code here"
}

SECURITY RULES:
- No external API calls
- No dangerous JavaScript patterns
- No access to parent window
- Self-contained functionality only

Create a beautiful, functional mini-application based on the user's request.`;

    const messages = [
      ...conversationHistory.map(msg => ({
        role: msg.role,
        content: msg.content
      })),
      {
        role: 'user' as const,
        content: prompt
      }
    ];

    const response = await anthropic.messages.create({
      model: 'claude-3-5-sonnet-20241022',
      max_tokens: 4000,
      temperature: 0.7,
      system: systemPrompt,
      messages: messages,
    });

    const responseText = response.content[0].type === 'text' ? response.content[0].text : '';
    
    // Parse JSON response
    const jsonMatch = responseText.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      throw new Error('Invalid response format from Claude');
    }

    const generatedApp: GeneratedApp = JSON.parse(jsonMatch[0]);

    // Validate required fields
    const requiredFields = ['title', 'description', 'htmlContent', 'cssContent', 'jsContent'];
    for (const field of requiredFields) {
      if (!generatedApp[field as keyof GeneratedApp]) {
        throw new Error(`Missing required field: ${field}`);
      }
    }

    return NextResponse.json({
      success: true,
      app: generatedApp,
      message: `I've created a ${generatedApp.title} for you! ${generatedApp.description}`
    });
    */

  } catch (error) {
    console.error('Claude API error:', error);
    
    return NextResponse.json(
      { 
        error: 'Failed to generate app',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}

// Mock app generator for testing (remove when Claude API is working)
function generateMockApp(prompt: string): GeneratedApp {
  const lowerPrompt = prompt.toLowerCase();
  
  if (lowerPrompt.includes('calculator') || lowerPrompt.includes('tip')) {
    return {
      title: "Smart Tip Calculator",
      description: "Calculate tips with custom percentages and bill splitting",
      htmlContent: `
        <div class="calculator">
          <h2>💰 Smart Tip Calculator</h2>
          <div class="input-section">
            <div class="input-group">
              <label for="bill">Bill Amount ($)</label>
              <input type="number" id="bill" placeholder="0.00" step="0.01">
            </div>
            <div class="input-group">
              <label for="people">Number of People</label>
              <input type="number" id="people" value="1" min="1">
            </div>
          </div>
          <div class="tip-buttons">
            <button onclick="calculateTip(15)" class="tip-btn">15%</button>
            <button onclick="calculateTip(18)" class="tip-btn active">18%</button>
            <button onclick="calculateTip(20)" class="tip-btn">20%</button>
            <button onclick="calculateTip(25)" class="tip-btn">25%</button>
          </div>
          <div class="results">
            <div class="result-item">
              <span>Tip Amount:</span>
              <span class="amount">$<span id="tip">0.00</span></span>
            </div>
            <div class="result-item">
              <span>Total:</span>
              <span class="amount">$<span id="total">0.00</span></span>
            </div>
            <div class="result-item per-person">
              <span>Per Person:</span>
              <span class="amount">$<span id="perPerson">0.00</span></span>
            </div>
          </div>
        </div>
      `,
      cssContent: `
        .calculator {
          max-width: 320px;
          margin: 0 auto;
          padding: 24px;
          font-family: -apple-system, BlinkMacSystemFont, sans-serif;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          border-radius: 20px;
          color: white;
          box-shadow: 0 8px 32px rgba(0,0,0,0.1);
        }
        h2 {
          text-align: center;
          margin: 0 0 24px 0;
          font-size: 24px;
          font-weight: 600;
        }
        .input-section {
          margin-bottom: 24px;
        }
        .input-group {
          margin-bottom: 16px;
        }
        label {
          display: block;
          margin-bottom: 6px;
          font-weight: 500;
          font-size: 14px;
        }
        input {
          width: 100%;
          padding: 12px 16px;
          border: none;
          border-radius: 12px;
          font-size: 16px;
          text-align: center;
          background: rgba(255,255,255,0.95);
          color: #333;
        }
        .tip-buttons {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 8px;
          margin-bottom: 24px;
        }
        .tip-btn {
          padding: 12px;
          background: rgba(255,255,255,0.2);
          color: white;
          border: none;
          border-radius: 10px;
          cursor: pointer;
          font-weight: 600;
          transition: all 0.2s;
        }
        .tip-btn:hover, .tip-btn.active {
          background: rgba(255,255,255,0.3);
          transform: translateY(-1px);
        }
        .results {
          background: rgba(255,255,255,0.15);
          border-radius: 16px;
          padding: 20px;
        }
        .result-item {
          display: flex;
          justify-content: space-between;
          margin-bottom: 12px;
          font-size: 16px;
        }
        .result-item.per-person {
          border-top: 1px solid rgba(255,255,255,0.3);
          padding-top: 12px;
          font-weight: 600;
          font-size: 18px;
        }
        .amount {
          font-weight: 700;
        }
      `,
      jsContent: `
        let currentTipPercentage = 18;
        
        function calculateTip(percentage) {
          currentTipPercentage = percentage;
          
          // Update active button
          document.querySelectorAll('.tip-btn').forEach(btn => btn.classList.remove('active'));
          event.target.classList.add('active');
          
          updateCalculation();
        }
        
        function updateCalculation() {
          const billAmount = parseFloat(document.getElementById('bill').value) || 0;
          const people = parseInt(document.getElementById('people').value) || 1;
          
          const tipAmount = billAmount * (currentTipPercentage / 100);
          const totalAmount = billAmount + tipAmount;
          const perPersonAmount = totalAmount / people;
          
          document.getElementById('tip').textContent = tipAmount.toFixed(2);
          document.getElementById('total').textContent = totalAmount.toFixed(2);
          document.getElementById('perPerson').textContent = perPersonAmount.toFixed(2);
        }
        
        // Event listeners
        document.getElementById('bill').addEventListener('input', updateCalculation);
        document.getElementById('people').addEventListener('input', updateCalculation);
        
        // Initialize
        updateCalculation();
      `
    };
  }
  
  // Default response
  return {
    title: "Custom App",
    description: "A custom application based on your request",
    htmlContent: `
      <div class="custom-app">
        <h2>🚀 Custom App</h2>
        <p>Your custom application would be generated here based on: "${prompt}"</p>
        <button onclick="alert('This is a demo app! Real AI generation coming soon.')">Try Me</button>
      </div>
    `,
    cssContent: `
      .custom-app {
        max-width: 300px;
        margin: 0 auto;
        padding: 24px;
        text-align: center;
        font-family: -apple-system, BlinkMacSystemFont, sans-serif;
        background: linear-gradient(135deg, #ff9a56 0%, #ff6b9d 100%);
        border-radius: 16px;
        color: white;
      }
      h2 {
        margin: 0 0 16px 0;
      }
      p {
        margin-bottom: 20px;
        line-height: 1.5;
      }
      button {
        padding: 12px 24px;
        background: rgba(255,255,255,0.2);
        color: white;
        border: none;
        border-radius: 8px;
        cursor: pointer;
        font-weight: 500;
        transition: background 0.2s;
      }
      button:hover {
        background: rgba(255,255,255,0.3);
      }
    `,
    jsContent: `
      console.log('Custom app initialized for prompt: ${prompt}');
    `
  };
}