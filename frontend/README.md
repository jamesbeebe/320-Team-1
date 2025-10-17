# ClassMatch Frontend

A modern web application for connecting students in their classes, creating study groups, and facilitating collaboration.

## Features

- 🔐 **Authentication**: Login and signup pages
- 📚 **Class Management**: Add and manage your classes
- 👥 **Classmates**: View classmates with compatibility percentages
- 📖 **Study Groups**: Create and join study groups for your classes
- 💬 **Chat**: Communication channels for each class and study group
- 🎨 **Modern UI**: Clean, responsive design with Tailwind CSS

## Tech Stack

- **Framework**: Next.js 15 (App Router)
- **UI**: React 19
- **Styling**: Tailwind CSS 4
- **Language**: JavaScript (JSX)

## Getting Started

### Installation

```bash
npm install
```

### Development

Run the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Build

```bash
npm run build
npm start
```

## Project Structure

```
frontend/
├── app/                    # Next.js app router pages
│   ├── class/[id]/        # Dynamic class detail pages
│   ├── dashboard/         # User dashboard
│   ├── login/             # Login page
│   ├── onboarding/        # Class selection page
│   ├── signup/            # Signup page
│   ├── layout.jsx         # Root layout
│   ├── page.jsx           # Home page (redirects to login)
│   └── globals.css        # Global styles
├── components/            # Reusable components
│   ├── class/            # Class-related components
│   │   ├── ChatInterface.jsx
│   │   ├── Classmates.jsx
│   │   └── StudyGroups.jsx
│   ├── layout/           # Layout components
│   │   └── Header.jsx
│   └── ui/               # UI primitives
│       ├── Button.jsx
│       ├── Card.jsx
│       └── Input.jsx
└── public/               # Static assets

```

## Backend Integration

The frontend is ready for backend integration. Key areas for backend connection:

1. **Authentication** (`/app/login/page.jsx`, `/app/signup/page.jsx`)
   - Add API calls to authenticate users
   - Store JWT tokens/session data

2. **Classes** (`/app/onboarding/page.jsx`, `/app/dashboard/page.jsx`)
   - Fetch available classes
   - Add/remove user classes

3. **Study Groups** (`/components/class/StudyGroups.jsx`)
   - Create, join, leave study groups
   - Fetch group details

4. **Chat** (`/components/class/ChatInterface.jsx`)
   - Real-time messaging (consider WebSocket/Socket.io)
   - Message history

5. **Classmates** (`/components/class/Classmates.jsx`)
   - Compatibility algorithm integration
   - Fetch classmate data

## API Integration Points

Create an `api/` directory with service modules:

```javascript
// Example: api/auth.js
export async function login(email, password) {
  const response = await fetch('/api/auth/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  });
  return response.json();
}
```

## Environment Variables

Create a `.env.local` file:

```
NEXT_PUBLIC_API_URL=http://localhost:3001
NEXT_PUBLIC_WS_URL=ws://localhost:3001
```

## Design System

### Colors
- Primary: `#EF5350` (Red)
- Primary Dark: `#E53935`
- Primary Light: `#FFCDD2`
- Background: `#FAFAFA`
- Card: `#FFFFFF`

### Components
All UI components are in `/components/ui` and can be reused throughout the app.

## Contributing

When adding new features:
1. Follow the existing component structure
2. Use Tailwind CSS for styling
3. Add proper prop types/validation
4. Keep components modular and reusable
5. Comment complex logic
6. Test responsiveness

## Notes

- Mock data is currently used throughout the app
- Replace mock data with real API calls
- Consider adding loading states and error handling
- Add form validation where needed
- Implement proper authentication flow with tokens

