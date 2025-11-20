# 🔑 Supabase Credentials Setup Guide

## Quick Reference

You need these 3 credentials to run the backend:

1. **SUPABASE_URL** - Your project URL
2. **SUPABASE_ANON_KEY** - Public API key
3. **SUPABASE_JWT_SECRET** - JWT secret for token verification

---

## Option 1: Get from Your Team (FASTEST)

Ask your backend team for the credentials. They should already have a Supabase project.

**Message to send:**
```
Hey! I need our Supabase credentials to run the backend locally:
- SUPABASE_URL
- SUPABASE_ANON_KEY  
- SUPABASE_JWT_SECRET

Thanks!
```

---

## Option 2: Create New Supabase Project

### Step 1: Sign Up
1. Go to https://supabase.com
2. Click "Start your project"
3. Sign up with GitHub or Email

### Step 2: Create Project
1. Click "New Project"
2. Fill in:
   - **Name:** ClassMatch
   - **Database Password:** [create strong password]
   - **Region:** Choose closest to you
   - **Plan:** Free
3. Click "Create new project"
4. Wait 1-2 minutes

### Step 3: Get Credentials
1. Click ⚙️ **Settings** (bottom left sidebar)
2. Click **API** in settings menu
3. Copy these values:

#### SUPABASE_URL
- Location: "Project URL" section
- Example: `https://xyzabc123.supabase.co`

#### SUPABASE_ANON_KEY
- Location: "Project API keys" → "anon public"
- Example: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...` (very long)

#### SUPABASE_JWT_SECRET
- Location: "JWT Settings" → Click "Reveal"
- Example: `super-secret-jwt-token-mint-fresh-...` (long string)

---

## Step 4: Add to Backend

### Open File
```bash
/Users/rishikmuthyala/320-Team-1/backend/.env
```

### Replace Values
```env
# Replace these placeholder values with your actual credentials:

SUPABASE_URL=https://your-project-id.supabase.co
SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6...
SUPABASE_JWT_SECRET=your-super-secret-jwt-token-here
```

### Save File
- macOS: `Cmd + S`
- Windows: `Ctrl + S`

---

## Step 5: Setup Database Tables

Your backend needs these tables. Run this SQL in Supabase:

1. Go to Supabase Dashboard
2. Click **SQL Editor** (left sidebar)
3. Click **"+ New query"**
4. Copy/paste your `backend/schemas.sql` file content
5. Click **"Run"** (or press `Cmd/Ctrl + Enter`)

---

## Step 6: Start Backend Server

```bash
cd /Users/rishikmuthyala/320-Team-1/backend
node server.js
```

**Expected output:**
```
Initializing Supabase client...
server is running on port 8080
```

✅ **Success!** Backend is running!

---

## Troubleshooting

### Error: "Invalid supabaseUrl"
**Problem:** URL is wrong or missing
**Solution:** 
- Check SUPABASE_URL starts with `https://`
- No trailing slash
- Example: `https://abc123.supabase.co`

### Error: "Invalid API key"
**Problem:** Anon key is wrong
**Solution:**
- Copy the FULL key (it's very long!)
- Make sure no extra spaces
- Use "anon public" key, NOT "service_role"

### Error: "JWT verification failed"
**Problem:** JWT secret is wrong
**Solution:**
- Click "Reveal" in JWT Settings
- Copy the FULL secret
- No quotes around the value in .env

### Backend won't start
**Solution:**
```bash
# 1. Check .env file exists
ls -la backend/.env

# 2. Check credentials are set
cat backend/.env

# 3. Make sure no extra packages needed
cd backend
npm install

# 4. Try starting again
node server.js
```

---

## Security Tips ⚠️

1. **Never commit .env file to git** (it's already in .gitignore)
2. **Don't share credentials publicly** (Slack DMs only, not public channels)
3. **Use separate projects** for development/production
4. **Rotate keys** if accidentally exposed

---

## Testing the Setup

Once backend starts, test these endpoints:

```bash
# Test server is running
curl http://localhost:8080/test
# Should return: "Hello World"

# Test signup (will create a user in Supabase)
curl -X POST http://localhost:8080/api/auth/signup \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test User",
    "email": "test@example.com",
    "password": "password123",
    "major": "Computer Science",
    "gradYear": 2026
  }'
```

---

## Next Steps

After backend is running:

1. ✅ Test login from frontend
2. ✅ Update profile page to use real API
3. ✅ Test all features
4. ✅ Share credentials with team

---

## Quick Command Reference

```bash
# Start backend
cd backend && node server.js

# Start frontend  
cd frontend && npm run dev

# Check if backend is running
curl http://localhost:8080/test

# View backend logs
tail -f /tmp/backend.log
```

---

**Need Help?** 
- Check Supabase docs: https://supabase.com/docs
- Check your backend team's documentation
- Look at `backend/schemas.sql` for required database structure

---

**Last Updated:** ${new Date().toLocaleDateString()}
**Backend Port:** 8080
**Frontend Port:** 3000

