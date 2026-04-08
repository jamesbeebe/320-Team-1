# Class Match

Class Match is a full-stack study-group platform built for UMass students. It helps users add classes, connect with classmates, join real-time chats, and organize study groups in one place.

## Live Demo

[Try the live app](https://320teamone-oyrl.vercel.app/login)

## App Screenshots

### Login
![Login Page](./docs/screenshots/login.png)

### Dashboard / Class View
![Dashboard](./docs/screenshots/dashboard.png)

### Chat / Study Group View
![Chat View](./docs/screenshots/chat.png)

## Overview

The goal of Class Match was to make it easier for students to find peers in their courses and build more organized study communities. The platform supports class-based matching, live chat, study-group creation, and schedule-related workflows to reduce friction when connecting with other students academically.

## Features

- Course-based student matching
- Real-time class and study-group chat
- Study-group creation and scheduling
- Add and remove enrolled classes
- Schedule import support
- Authentication and protected routes
- Backend API documentation through Swagger UI

## Tech Stack

**Frontend**
- Next.js
- Tailwind CSS

**Backend**
- Node.js
- Express.js

**Database / Auth**
- Supabase
- PostgreSQL

**Deployment / Tooling**
- Vercel
- AWS
- Git
- GitHub
- Postman
- Swagger UI

## System Design

### Architecture Diagram
![Architecture Diagram](./docs/architecture-diagram.png)

### UI Diagram
![UI Diagram](./docs/ui-diagram.png)

### ER Diagram
![ER Diagram](./docs/er-diagram.png)

## Technical Challenges

Some of the main engineering challenges included:

- Implementing real-time messaging with WebSockets
- Integrating frontend and backend endpoints across multiple features
- Supporting ICS schedule import functionality
- Preventing duplicate class enrollment
- Managing database load considerations for live chat writes

## Testing

The application was tested using Postman for backend API validation and manual frontend testing for key user flows and edge cases. Feature validation was also included as part of the pull request review process.

## Setup

### Prerequisites
Consult the frontend README for required dependencies, environment variables, and local setup instructions.
