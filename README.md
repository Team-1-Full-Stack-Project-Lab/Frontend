# 🏨 Frontend - Team 1 Full Stack Project Lab

> Full-stack web application for booking accommodations, built with React and TypeScript.

This is the frontend portion of a comprehensive travel booking platform similar to Expedia, built with modern web technologies and best practices.

## 📋 Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Getting Started](#getting-started)
- [Environment Variables](#environment-variables)
- [API Integration](#api-integration)
- [Key Concepts](#key-concepts)
- [Available Scripts](#available-scripts)
- [Docker Deployment](#docker-deployment)
- [Development Guidelines](#development-guidelines)
- [Learning Outcomes](#learning-outcomes)

## 🎯 Overview

This application provides a complete booking experience for travelers and a management dashboard for accommodation hosts. Users can search for stays, view details, make reservations, and manage their trips. Hosts with registered companies can create and manage their properties through a dedicated dashboard.

### Main User Flows

1. **Guest Users**: Browse and search for accommodations, access help center
2. **Authenticated Users**: Book stays, manage trips
3. **Host Users** (with company): Manage properties, units, and view analytics

## ✨ Features

### Public Features

- 🔍 Advanced search with filters (city, dates, price range, services)
- 🏨 Browse accommodations with detailed information
- 🖼️ Image carousels with fullscreen mode
- 🎨 Dark/Light theme support
- 📱 Responsive design for all devices

### User Features

- 🔐 Authentication (Login/Register)
- 🗂️ Trips management with drawer interface
- 💬 AI-powered chatbot assistant
- ⚙️ User settings and profile management
- 🏢 Company registration for hosts
- ❓ Help center with support resources

### Host Dashboard Features

- 📊 Analytics dashboard with statistics
- 🏨 Create and manage stays (properties)
- 🛏️ Manage units (rooms) for each stay
- 📍 City search with autocomplete
- 🖼️ Visual image URL management
- 📝 Full CRUD operations for properties and units

## 🛠️ Tech Stack

### Core Technologies

- **React** - UI library with hooks and modern patterns
- **TypeScript** - Type-safe JavaScript
- **Vite** - Fast build tool and dev server
- **React Router** - Client-side routing

### State Management & Data Fetching

- **Redux Toolkit** - Global state management (auth, user)
- **Apollo Client** - GraphQL client
- **Fetch API** - REST API integration

### UI & Styling

- **shadcn/ui** - Headless component library
- **Tailwind CSS** - Utility-first CSS framework
- **Radix UI** - Accessible component primitives
- **Lucide React** - Icon library

### Additional Libraries

- **date-fns** - Date manipulation
- **react-day-picker** - Date range picker
- **sonner** - Toast notifications

## 📁 Project Structure

```
Frontend/
├── public/              # Static assets
├── src/
│   ├── components/      # Reusable UI components
│   │   ├── ui/         # shadcn base components
│   │   ├── Host/       # Host dashboard components
│   │   ├── Stays/      # Accommodation components
│   │   ├── Trips/      # Trip management components
│   │   └── ...
│   ├── config/         # App configuration
│   │   ├── api.ts      # API endpoints
│   │   └── apolloClient.ts
│   ├── contexts/       # React contexts
│   ├── hooks/          # Custom React hooks
│   ├── layouts/        # Page layouts
│   │   ├── MainLayout.tsx
│   │   ├── HostLayout.tsx
│   │   ├── AuthLayout.tsx
│   │   └── ProtectedRoute.tsx
│   ├── mappers/        # Data transformation utilities
│   ├── pages/          # Route components
│   │   ├── auth/       # Login, Register
│   │   ├── host/       # Host dashboard pages
│   │   ├── stays/      # Accommodation pages
│   │   ├── settings/   # User settings
│   │   └── helpcenter/ # Help & support
│   ├── services/       # API service layer
│   │   ├── rest/       # REST API services
│   │   └── graphql/    # GraphQL services
│   ├── store/          # Redux store configuration
│   ├── types/          # TypeScript type definitions
│   ├── utils/          # Utility functions
│   ├── App.tsx         # Main app component
│   └── main.tsx        # Entry point
└── ...
```

## 🚀 Getting Started

### Prerequisites

- **Node.js 22** or higher
- **npm** or yarn package manager
- **Backend server** running (see Backend README)
- **Docker** (optional, for containerization)

### Installation

1. Clone the repository:

```bash
git clone https://github.com/Team-1-Full-Stack-Project-Lab/Frontend.git
cd Frontend
```

2. Install dependencies:

```bash
npm install
```

3. Create environment file:

```bash
cp .env.example .env
```

4. Configure environment variables (see [Environment Variables](#environment-variables))

5. Start development server:

```bash
npm run dev
```

The application will be available at `http://localhost:5173`

### Quick Start with Docker

```bash
# Build image
docker build -t travel-booking-frontend .

# Run container
docker run -p 80:80 travel-booking-frontend
# Access at http://localhost

# Or with custom port
docker run -p 3000:80 travel-booking-frontend
# Access at http://localhost:3000
```

## 🔧 Environment Variables

Create a `.env` file in the root directory:

```env
# API Configuration
VITE_BACKEND_URL=http://localhost:8080
VITE_GRAPHQL_URL=http://localhost:8080/graphql

# API Mode: 'rest' or 'graphql'
VITE_API_MODE=rest
```

### API Mode Selection

The application supports dual API integration:

- **REST**: Traditional HTTP endpoints with JSON
- **GraphQL**: Single endpoint with flexible queries

Toggle between modes using `VITE_API_MODE` environment variable. The service layer automatically adapts based on this setting.

## 🔌 API Integration

### Service Layer Architecture

The application uses a **service abstraction layer** that supports both REST and GraphQL:

```typescript
// services/index.ts
export function useServices() {
  const apiMode = API_MODE as keyof typeof services
  return {
    mode: apiMode,
    authService: services[apiMode].auth,
    userService: services[apiMode].user,
    // ... other services
  }
}
```

### Benefits of This Approach

- **Flexibility**: Switch between API types without changing components
- **Type Safety**: Consistent TypeScript interfaces
- **Learning**: Understand both REST and GraphQL patterns
- **Maintainability**: Centralized API logic

## 💡 Key Concepts

### 1. Component Composition

The project follows React best practices for component composition:

```typescript
// Small, focused components
<Card>
  <CardHeader>
    <CardTitle>Property Details</CardTitle>
  </CardHeader>
  <CardContent>
    {/* Content */}
  </CardContent>
</Card>
```

### 2. Custom Hooks

Reusable logic extracted into custom hooks:

```typescript
const useAuth = () => {
  const dispatch = useDispatch()
  const { user, isAuthenticated } = useSelector(state => state.auth)

  const login = (email, password) => {
    // Login logic
  }

  return { user, isAuthenticated, login }
}
```

### 3. Protected Routes

Route guards for authentication and authorization:

```typescript
<Route element={<ProtectedRoute />}>
  <Route element={<CompanyRoute />}>
    <Route element={<HostLayout />}>
      <Route path="/host/dashboard" element={<HostDashboardPage />} />
    </Route>
  </Route>
</Route>
```

### 4. Type Safety

Comprehensive TypeScript types for all data:

```typescript
interface Stay {
  id: number
  name: string
  city?: City
  stayType?: StayType
  units?: StayUnit[]
  // ...
}
```

### 5. State Management Strategy

- **Redux**: Global auth state and user data
- **Local State**: Component-specific UI state
- **Context API**: Theme, trip drawer, shared UI state
- **URL State**: Search parameters, filters

## 📜 Available Scripts

```bash
# Development
npm run dev          # Start dev server with HMR

# Building
npm run build        # Build for production
npm run preview      # Preview production build

# Code Quality
npm run lint         # Run ESLint

# Testing (if configured)
npm run test         # Run tests
```

## � Docker Deployment

### Docker Configuration

The frontend is containerized using a **multi-stage build** for optimal production deployment:

**Stage 1 - Build:**

- Uses `node:20-alpine` to build the React application
- Installs dependencies and runs production build
- Outputs static files to `/dist` folder

**Stage 2 - Production:**

- Uses `nginx:alpine` (~20MB) to serve static files
- Includes custom Nginx configuration for SPA routing
- Adds security headers and caching optimization

### Files Structure

```
Frontend/
├── Dockerfile           # Multi-stage Docker build
├── .dockerignore       # Excludes node_modules, build artifacts
└── nginx.conf          # Nginx configuration for SPA
```

### Building and Running

**Local Build:**

```bash
# Build Docker image
docker build -t travel-booking-frontend .

# Run container
docker run -p 80:80 travel-booking-frontend

# Access at http://localhost
```

**With Custom Port:**

```bash
docker run -p 3000:80 travel-booking-frontend
# Access at http://localhost:3000
```

### Nginx Configuration

The included `nginx.conf` provides:

- **SPA Routing**: Redirects all routes to `index.html` for React Router
- **Gzip Compression**: Reduces bundle sizes for faster loading
- **Security Headers**: X-Frame-Options, X-Content-Type-Options, XSS-Protection
- **Cache Optimization**:
  - Static assets (JS, CSS, images): 1 year cache
  - `index.html`: No cache (always fresh)
- **Health Endpoint**: `/health` for container health checks

### Production Deployment Architecture

When deploying to a server (Azure VM, AWS EC2, etc.), the recommended setup is:

```
Internet (Port 80/443)
         ↓
    [Nginx Reverse Proxy on Server]
         ↓                    ↓
  Frontend Container    Backend Container
  (localhost:3000)      (localhost:8080)
         ↓
    [PostgreSQL]
  (localhost:5432)
```

**Benefits:**

- Single entry point for HTTPS/SSL
- Simplified CORS configuration
- Centralized logging
- Better security (containers not exposed to internet)

See the root `docker-compose.yml` for full orchestration setup.

## �👨‍💻 Development Guidelines

### Code Style

- Use functional components with hooks
- Prefer `const` over `let`
- Use TypeScript for type safety
- Follow ESLint rules
- Use meaningful variable names
- Write self-documenting code with comments for complex logic

### Component Guidelines

1. **Single Responsibility**: Each component should do one thing
2. **Prop Types**: Always define TypeScript interfaces for props
3. **Error Handling**: Use try-catch for async operations
4. **Loading States**: Show loading indicators for data fetching
5. **Accessibility**: Use semantic HTML and ARIA attributes

### File Naming

- Components: `PascalCase.tsx` (e.g., `HostDashboard.tsx`)
- Hooks: `camelCase.ts` starting with `use` (e.g., `useAuth.ts`)
- Utilities: `camelCase.ts` (e.g., `helpers.ts`)
- Types: `camelCase.ts` (e.g., `stays.ts`)

## 📚 Learning Outcomes

This project demonstrates understanding of:

### Frontend Development

- ✅ Modern React patterns (Hooks, Context, Composition)
- ✅ TypeScript for type-safe development
- ✅ Client-side routing and navigation
- ✅ Form handling and validation
- ✅ Responsive design principles
- ✅ Component library integration (shadcn/ui)

### State Management

- ✅ Redux Toolkit for global state
- ✅ Context API for shared state
- ✅ Local component state management
- ✅ URL as a source of truth

### API Integration

- ✅ RESTful API consumption
- ✅ GraphQL queries and mutations
- ✅ Service layer abstraction
- ✅ Error handling and loading states
- ✅ Data transformation and mapping

### User Experience

- ✅ Authentication flows
- ✅ Protected routes and authorization
- ✅ Search and filtering
- ✅ CRUD operations
- ✅ Real-time notifications (toasts)
- ✅ Theme switching
- ✅ Responsive layouts

### Best Practices

- ✅ Code organization and structure
- ✅ Separation of concerns
- ✅ DRY principles
- ✅ Performance optimization
- ✅ Accessibility considerations
- ✅ Error boundaries and fallbacks

## 🎓 Project Context

This project was developed as part of a **Full Stack Project Lab - Softserve**, demonstrating:

- Integration of modern frontend technologies
- Connection with a Spring Boot backend
- Real-world application patterns
- Professional development practices
- Team collaboration (Git workflows)
- Documentation and code quality
