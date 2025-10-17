#!/bin/bash

# Setup script for MOCK authentication mode
echo "🎭 Setting up MOCK authentication mode..."
echo ""

# Create .env.local with mock mode
cat > .env.local << EOF
# MOCK MODE - Frontend testing without backend
NEXT_PUBLIC_USE_MOCK_AUTH=true

# Backend URLs (not used in mock mode)
NEXT_PUBLIC_API_URL=http://localhost:3001/api
NEXT_PUBLIC_WS_URL=ws://localhost:3001
EOF

echo "✅ Created .env.local with MOCK mode enabled"
echo ""
echo "📝 Configuration:"
echo "   - Mock authentication: ENABLED"
echo "   - No backend needed"
echo "   - Login with ANY credentials"
echo ""
echo "🚀 Next steps:"
echo "   1. Run: npm run dev"
echo "   2. Open: http://localhost:3000"
echo "   3. Login with any email/password"
echo ""
echo "💡 To switch to REAL API mode, run: ./setup-api.sh"
echo ""

