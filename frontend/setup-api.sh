#!/bin/bash

# Setup script for REAL API authentication mode
echo "🔌 Setting up REAL API authentication mode..."
echo ""

# Prompt for backend URL
read -p "Enter backend API URL (default: http://localhost:3001/api): " API_URL
API_URL=${API_URL:-http://localhost:3001/api}

read -p "Enter WebSocket URL (default: ws://localhost:3001): " WS_URL
WS_URL=${WS_URL:-ws://localhost:3001}

# Create .env.local with real API mode
cat > .env.local << EOF
# REAL API MODE - Production with backend
NEXT_PUBLIC_USE_MOCK_AUTH=false

# Backend URLs
NEXT_PUBLIC_API_URL=$API_URL
NEXT_PUBLIC_WS_URL=$WS_URL
EOF

echo "✅ Created .env.local with REAL API mode enabled"
echo ""
echo "📝 Configuration:"
echo "   - Mock authentication: DISABLED"
echo "   - API URL: $API_URL"
echo "   - WebSocket URL: $WS_URL"
echo ""
echo "⚠️  Make sure:"
echo "   - Backend is running"
echo "   - API endpoints are implemented"
echo "   - CORS is configured"
echo ""
echo "🚀 Next steps:"
echo "   1. Start backend server"
echo "   2. Run: npm run dev"
echo "   3. Open: http://localhost:3000"
echo "   4. Login with real credentials"
echo ""
echo "💡 To switch back to MOCK mode, run: ./setup-mock.sh"
echo ""

