# Backend Integration Guide

This document provides detailed instructions for integrating the ClassMatch backend with the frontend.

## Overview

The frontend is built with **Next.js 15** using the App Router and is fully prepared for backend integration. All API service layers are in place with placeholder implementations that need to be connected to your actual backend endpoints.

## Service Layer Architecture

All API calls are centralized in the `/services` directory:

```
services/
├── api.js           # Base API client with auth token management
├── auth.js          # Authentication services
├── classes.js       # Class management services
├── studyGroups.js   # Study group services
└── chat.js          # Chat and messaging services
```

## Backend API Endpoints Required

### 1. Authentication Endpoints

**Base Path**: `/api/auth`

| Method | Endpoint | Request Body | Response | Description |
|--------|----------|--------------|----------|-------------|
| POST | `/auth/register` | `{ username, email, password }` | `{ user, token }` | Register new user |
| POST | `/auth/login` | `{ email, password }` | `{ user, token }` | Login user |
| GET | `/auth/me` | - | `{ user }` | Get current user (requires auth) |

**User Object Structure**:
```javascript
{
  id: string,
  username: string,
  email: string,
  createdAt: timestamp
}
```

### 2. Classes Endpoints

**Base Path**: `/api/classes`

| Method | Endpoint | Request Body | Response | Description |
|--------|----------|--------------|----------|-------------|
| GET | `/classes` | - | `{ classes: [] }` | Get all available classes |
| GET | `/classes/search?q={query}` | - | `{ classes: [] }` | Search classes |
| GET | `/classes/my-classes` | - | `{ classes: [] }` | Get user's enrolled classes |
| POST | `/classes/add` | `{ classId }` | `{ success, class }` | Enroll in a class |
| DELETE | `/classes/{classId}` | - | `{ success }` | Unenroll from a class |
| GET | `/classes/{classId}` | - | `{ class }` | Get class details |
| GET | `/classes/{classId}/classmates` | - | `{ classmates: [] }` | Get classmates with compatibility |

**Class Object Structure**:
```javascript
{
  id: string,
  code: string,          // e.g., "CS 311"
  name: string,          // e.g., "Intro to Algorithms"
  semester: string,      // e.g., "Fall 2025"
  professor: string,
  totalStudents: number
}
```

**Classmate Object Structure**:
```javascript
{
  id: string,
  name: string,
  initials: string,
  compatibility: number  // 0-100 percentage
}
```

### 3. Study Groups Endpoints

**Base Path**: `/api/study-groups`

| Method | Endpoint | Request Body | Response | Description |
|--------|----------|--------------|----------|-------------|
| GET | `/study-groups?classId={id}` | - | `{ groups: [] }` | Get study groups for a class |
| POST | `/study-groups` | `{ classId, name, date, time, location, maxSpots }` | `{ group }` | Create study group |
| POST | `/study-groups/{groupId}/join` | - | `{ success }` | Join a study group |
| POST | `/study-groups/{groupId}/leave` | - | `{ success }` | Leave a study group |
| GET | `/study-groups/{groupId}` | - | `{ group }` | Get study group details |
| PUT | `/study-groups/{groupId}` | `{ name?, date?, time?, location? }` | `{ group }` | Update study group |
| DELETE | `/study-groups/{groupId}` | - | `{ success }` | Delete study group |

**Study Group Object Structure**:
```javascript
{
  id: string,
  name: string,
  date: string,          // ISO date string
  time: string,          // e.g., "3:00 PM - 5:00 PM"
  location: string,
  spots: {
    filled: number,
    total: number
  },
  classId: string,
  createdBy: string,     // user ID
  members: string[]      // array of user IDs
}
```

### 4. Chat Endpoints

**Base Path**: `/api/chat`

| Method | Endpoint | Request Body | Response | Description |
|--------|----------|--------------|----------|-------------|
| GET | `/chat/channels?classId={id}` | - | `{ channels: [] }` | Get chat channels for a class |
| GET | `/chat/channels/{channelId}/messages` | Query: `limit`, `offset` | `{ messages: [] }` | Get messages for a channel |
| POST | `/chat/channels/{channelId}/messages` | `{ message }` | `{ message }` | Send a message |
| DELETE | `/chat/messages/{messageId}` | - | `{ success }` | Delete a message |

**Channel Object Structure**:
```javascript
{
  id: string,
  name: string,
  type: 'general' | 'study-group',
  classId: string,
  studyGroupId?: string  // if type is 'study-group'
}
```

**Message Object Structure**:
```javascript
{
  id: string,
  sender: {
    id: string,
    name: string,
    initials: string
  },
  message: string,
  timestamp: string,      // ISO timestamp
  channelId: string
}
```

### 5. WebSocket for Real-Time Chat

**Connection URL**: `ws://localhost:3001?token={authToken}`

**Expected Events**:

**Client → Server**:
```javascript
{
  type: 'join_channel',
  channelId: string
}

{
  type: 'leave_channel',
  channelId: string
}

{
  type: 'send_message',
  channelId: string,
  message: string
}
```

**Server → Client**:
```javascript
{
  type: 'new_message',
  channelId: string,
  message: {
    id: string,
    sender: { id, name, initials },
    message: string,
    timestamp: string
  }
}

{
  type: 'user_joined',
  channelId: string,
  user: { id, name }
}

{
  type: 'user_left',
  channelId: string,
  user: { id, name }
}
```

## Authentication Flow

1. **Token Storage**: JWT tokens are stored in `localStorage` with the key `authToken`
2. **Token Transmission**: Tokens are sent in the `Authorization` header as `Bearer {token}`
3. **Token Refresh**: Currently not implemented - add refresh token logic if needed
4. **Logout**: Token is removed from localStorage

## Environment Variables

Create a `.env.local` file in the frontend directory:

```env
NEXT_PUBLIC_API_URL=http://localhost:3001/api
NEXT_PUBLIC_WS_URL=ws://localhost:3001
```

**Important**: All environment variables that need to be accessible in the browser must be prefixed with `NEXT_PUBLIC_`.

## Testing Backend Integration

### Step 1: Start the Backend
```bash
cd backend
npm start  # or your backend start command
```

### Step 2: Update Environment Variables
Update `.env.local` with your backend URLs.

### Step 3: Start the Frontend
```bash
cd frontend
npm install
npm run dev
```

### Step 4: Test Authentication
1. Navigate to `http://localhost:3000`
2. Try signing up with test credentials
3. Check browser console and network tab for API calls
4. Verify token is stored in localStorage

### Step 5: Test Features
- Add classes from onboarding
- View dashboard with enrolled classes
- Navigate to class details
- Try creating/joining study groups
- Send messages in chat

## Error Handling

The frontend expects errors in this format:
```javascript
{
  message: "Error description",
  code?: "ERROR_CODE",  // optional
  details?: {}          // optional additional details
}
```

## CORS Configuration

Your backend needs to allow requests from the frontend origin:

```javascript
// Express.js example
const cors = require('cors');
app.use(cors({
  origin: 'http://localhost:3000',
  credentials: true
}));
```

## Common Integration Issues

### Issue: CORS Errors
**Solution**: Configure backend to allow frontend origin

### Issue: 401 Unauthorized
**Solution**: Check token is being sent correctly, verify token validation on backend

### Issue: Network Error
**Solution**: Verify backend is running and API_URL is correct

### Issue: WebSocket Not Connecting
**Solution**: Check WS_URL, verify WebSocket server is running, check token authentication

## Next Steps for Full Integration

1. **Implement Matching Algorithm**
   - Add endpoint for calculating compatibility scores
   - Update `/classes/{classId}/classmates` to include scores

2. **Add User Profiles**
   - Profile editing
   - Avatar uploads
   - Schedule/preferences

3. **Notifications**
   - Study group invites
   - New messages
   - Class announcements

4. **Search & Filters**
   - Advanced class search
   - Study group filters
   - Classmate filtering by compatibility

5. **Analytics**
   - Track study group participation
   - Class engagement metrics
   - User activity

## Frontend Code Locations

- **API Service Layer**: `/services/*`
- **Auth Context**: `/context/AuthContext.jsx`
- **Components**: `/components/*`
- **Pages**: `/app/*`

## Support

For questions or issues with frontend integration, check:
1. Browser console for errors
2. Network tab for failed requests
3. `services/api.js` for request formatting
4. Component files for how data is being used

## Example: Adding a New Feature

Let's say you want to add a "favorite classmates" feature:

### 1. Add Backend Endpoint
```
POST /api/classmates/{classmateId}/favorite
DELETE /api/classmates/{classmateId}/favorite
GET /api/classmates/favorites
```

### 2. Create Service
```javascript
// services/classmates.js
export const classmateService = {
  async getFavorites() {
    return await api.get('/classmates/favorites');
  },
  
  async addFavorite(classmateId) {
    return await api.post(`/classmates/${classmateId}/favorite`);
  },
  
  async removeFavorite(classmateId) {
    return await api.delete(`/classmates/${classmateId}/favorite`);
  }
};
```

### 3. Use in Component
```javascript
import { classmateService } from '@/services/classmates';

function ClassmateCard({ classmate }) {
  const [isFavorite, setIsFavorite] = useState(false);
  
  const toggleFavorite = async () => {
    if (isFavorite) {
      await classmateService.removeFavorite(classmate.id);
    } else {
      await classmateService.addFavorite(classmate.id);
    }
    setIsFavorite(!isFavorite);
  };
  
  // ... render component
}
```

This architecture makes it easy to add new features while maintaining clean separation between frontend and backend concerns.

