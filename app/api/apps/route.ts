import { NextRequest, NextResponse } from 'next/server';

// Mock data for testing (replace with real database later)
const mockApps = [
  {
    id: "1",
    title: "Tip Calculator",
    description: "Calculate tips and split bills easily",
    htmlContent: `<div class="tip-calculator">...</div>`, // Truncated for brevity
    cssContent: `/* CSS styles */`,
    jsContent: `// JavaScript code`,
    userId: "user1",
    user: {
      id: "user1",
      username: "john_creator",
      displayName: "John Smith",
      avatarUrl: null,
    },
    likes: 24,
    comments: 5,
    isPublished: true,
    safetyScore: 0.95,
    createdAt: "2024-01-15T10:30:00Z",
    updatedAt: "2024-01-15T10:30:00Z",
  },
  // Add more mock apps...
];

// GET /api/apps - Get paginated apps for feed
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const userId = searchParams.get('userId'); // Optional filter by user
    
    // TODO: Replace with real database query
    let filteredApps = mockApps;
    
    if (userId) {
      filteredApps = mockApps.filter(app => app.userId === userId);
    }
    
    // Simulate pagination
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    const paginatedApps = filteredApps.slice(startIndex, endIndex);
    
    return NextResponse.json({
      success: true,
      apps: paginatedApps,
      pagination: {
        page,
        limit,
        total: filteredApps.length,
        hasMore: endIndex < filteredApps.length
      }
    });
    
  } catch (error) {
    console.error('Error fetching apps:', error);
    return NextResponse.json(
      { error: 'Failed to fetch apps' },
      { status: 500 }
    );
  }
}

// POST /api/apps - Create a new app
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      title,
      description,
      htmlContent,
      cssContent,
      jsContent,
      promptUsed,
      userId = "current-user" // TODO: Get from authentication
    } = body;

    // Validate required fields
    if (!title || !htmlContent || !cssContent || !jsContent) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // TODO: Safety scoring and content analysis
    const safetyScore = 0.95; // Mock safety score

    // TODO: Save to database
    const newApp = {
      id: `app_${Date.now()}`,
      title,
      description: description || '',
      htmlContent,
      cssContent,
      jsContent,
      promptUsed: promptUsed || '',
      userId,
      user: {
        id: userId,
        username: "current_user",
        displayName: "Current User",
        avatarUrl: null,
      },
      likes: 0,
      comments: 0,
      isPublished: true,
      safetyScore,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    return NextResponse.json({
      success: true,
      app: newApp,
      message: 'App created successfully'
    });

  } catch (error) {
    console.error('Error creating app:', error);
    return NextResponse.json(
      { error: 'Failed to create app' },
      { status: 500 }
    );
  }
}