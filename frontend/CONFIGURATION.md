# ClassMatch Frontend - Configuration Guide

## 🎭 Dual-Mode Authentication System

The frontend now supports **BOTH** mock authentication (for testing) and real API authentication (for production)!

---

## 🔧 How to Configure

### Option 1: MOCK MODE (Default - No Backend Needed)

Perfect for **frontend development and testing** without a backend server.

**Create `.env.local` file:**
```bash
cd frontend
touch .env.local
```

**Add this content:**
```env
# MOCK MODE - Frontend testing without backend
NEXT_PUBLIC_USE_MOCK_AUTH=true
```

**Features:**
- ✅ No backend server needed
- ✅ Login with ANY credentials
- ✅ Data stored in localStorage
- ✅ Simulates API delays (500ms)
- ✅ Perfect for UI/UX testing
- ✅ Console logs: "🎭 Using MOCK authentication"

---

### Option 2: REAL API MODE (Production)

For **production deployment** with actual backend API.

**Update `.env.local` file:**
```env
# REAL API MODE - Production with backend
NEXT_PUBLIC_USE_MOCK_AUTH=false

# Your backend URLs
NEXT_PUBLIC_API_URL=http://localhost:3001/api
NEXT_PUBLIC_WS_URL=ws://localhost:3001
```

**Features:**
- ✅ Connects to real backend
- ✅ Validates actual credentials
- ✅ Persistent authentication
- ✅ JWT token management
- ✅ Console logs: "🔌 Using REAL API authentication"

---

## 🚀 Quick Setup

### For Frontend Team (Mock Mode):

```bash
cd frontend

# Create env file
echo "NEXT_PUBLIC_USE_MOCK_AUTH=true" > .env.local

# Restart server
npm run dev
```

**Now you can:**
- Login with any email/password
- Test all pages
- No backend needed!

---

### For Backend Integration (Real API Mode):

```bash
cd frontend

# Create env file with real API
cat > .env.local << EOF
NEXT_PUBLIC_USE_MOCK_AUTH=false
NEXT_PUBLIC_API_URL=http://localhost:3001/api
NEXT_PUBLIC_WS_URL=ws://localhost:3001
EOF

# Restart server
npm run dev
```

**Make sure:**
- Backend is running on port 3001
- API endpoints are implemented
- CORS is configured

---

## 📊 How It Works

### Architecture

```
┌─────────────────────┐
│   AuthContext.jsx   │
│                     │
│  USE_MOCK_AUTH?     │
│         ↓           │
│    ┌────┴────┐      │
│    ↓         ↓      │
│  MOCK      REAL     │
│  MODE      API      │
│    ↓         ↓      │
│ localStorage  │     │
│              ↓      │
│         authService │
│              ↓      │
│         Backend API │
└─────────────────────┘
```

### Code Flow

**In `context/AuthContext.jsx`:**
```javascript
// Reads environment variable
const USE_MOCK_AUTH = process.env.NEXT_PUBLIC_USE_MOCK_AUTH !== 'false';

// Login function
const login = async (email, password) => {
  if (USE_MOCK_AUTH) {
    // MOCK: Create fake user, save to localStorage
    // No API calls
  } else {
    // REAL: Call authService.login()
    // Makes actual API request
  }
};
```

---

## 🧪 Testing Both Modes

### Test Mock Mode:
```bash
# Set mock mode
echo "NEXT_PUBLIC_USE_MOCK_AUTH=true" > .env.local

# Restart and test
npm run dev

# Open browser console - should see:
# "🎭 Using MOCK authentication (no backend needed)"
```

### Test Real API Mode:
```bash
# Set real API mode
echo "NEXT_PUBLIC_USE_MOCK_AUTH=false" > .env.local
echo "NEXT_PUBLIC_API_URL=http://localhost:3001/api" >> .env.local

# Start backend first
cd ../backend
npm start

# Then start frontend
cd ../frontend
npm run dev

# Open browser console - should see:
# "🔌 Using REAL API authentication"
```

---

## 🎯 Use Cases

### Frontend Development Team:
**Use MOCK MODE**
- Develop UI components
- Test user flows
- No backend dependency
- Fast iteration

### Integration Testing:
**Use REAL API MODE**
- Test backend integration
- Validate API responses
- End-to-end testing
- Performance testing

### Production Deployment:
**Use REAL API MODE**
- Set `NEXT_PUBLIC_USE_MOCK_AUTH=false`
- Point to production backend
- Enable authentication
- Deploy to Vercel/Netlify

---

## 🔍 Checking Current Mode

Open browser console when logging in. You'll see:
- Mock: `🎭 Using MOCK authentication (no backend needed)`
- Real: `🔌 Using REAL API authentication`

Or check in code:
```javascript
import { useAuth } from '@/context/AuthContext';

function MyComponent() {
  const { isMockMode } = useAuth();
  
  console.log('Mock mode:', isMockMode); // true or false
}
```

---

## 🛠️ Environment Variables Reference

| Variable | Values | Description |
|----------|--------|-------------|
| `NEXT_PUBLIC_USE_MOCK_AUTH` | `true` (default) | Use mock authentication |
| | `false` | Use real API authentication |
| `NEXT_PUBLIC_API_URL` | URL string | Backend API base URL |
| `NEXT_PUBLIC_WS_URL` | URL string | WebSocket server URL |

---

## 📝 Important Notes

### Default Behavior:
- If `.env.local` doesn't exist → **MOCK MODE**
- If `NEXT_PUBLIC_USE_MOCK_AUTH` not set → **MOCK MODE**
- Only explicitly setting to `'false'` enables **REAL API MODE**

### Switching Modes:
1. Update `.env.local`
2. **RESTART** the dev server (`Ctrl+C`, then `npm run dev`)
3. **REFRESH** browser (hard refresh: Cmd+Shift+R or Ctrl+Shift+R)
4. Check console for mode indicator

### Backend Requirements (Real API Mode):
- Endpoints must match `services/auth.js` expectations
- See `BACKEND_INTEGRATION.md` for API specs
- CORS must allow frontend origin
- JWT tokens must be properly formatted

---

## 🚨 Troubleshooting

### "Load failed" error:
- **Mock Mode**: Should never happen
- **Real API Mode**: Backend not running or wrong URL

**Fix:**
1. Check `.env.local` - is `NEXT_PUBLIC_USE_MOCK_AUTH=true`?
2. Restart dev server
3. Clear browser cache and refresh

### Can't see typed text:
- Input styling issue, already fixed
- Hard refresh browser (Cmd+Shift+R)

### Login doesn't navigate:
- Check browser console for errors
- Verify environment variable is loaded
- Restart dev server

---

## 📚 Related Files

- **Auth Logic**: `context/AuthContext.jsx`
- **API Services**: `services/auth.js`
- **Login Page**: `app/login/page.jsx`
- **Signup Page**: `app/signup/page.jsx`
- **API Specs**: `BACKEND_INTEGRATION.md`

---

## ✨ Summary

You now have a **flexible authentication system** that:
- ✅ Works immediately with mock data (frontend team)
- ✅ Ready for real API integration (backend team)
- ✅ Easy toggle via environment variable
- ✅ No code changes needed to switch modes
- ✅ Console logs show current mode
- ✅ Perfect for parallel frontend/backend development

**Frontend team can start testing NOW, and switch to real API when ready!** 🎉

