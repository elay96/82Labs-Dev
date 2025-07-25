# 82 Labs Marketing Site

## Overview

This is a modern single-page marketing website built with a full-stack TypeScript architecture. The application showcases 82 Labs' AI automation and custom software development services through an interactive, visually stunning interface featuring 3D graphics, smooth animations, and responsive design.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript and Vite for fast development and hot reloading
- **Routing**: Wouter for lightweight client-side routing
- **Styling**: Tailwind CSS with CSS variables for theming and custom color palette
- **UI Components**: Radix UI primitives with shadcn/ui component library for consistent, accessible design
- **3D Graphics**: Three.js with React Three Fiber for animated background elements (floating icosahedrons)
- **Animations**: Framer Motion for smooth page transitions and scroll-triggered animations
- **Forms**: React Hook Form with Zod validation for type-safe form handling
- **State Management**: TanStack Query for server state management with built-in caching

### Backend Architecture
- **Runtime**: Node.js with Express.js server
- **Language**: TypeScript with ES modules
- **Database**: PostgreSQL with Drizzle ORM for type-safe database operations
- **Session Storage**: In-memory storage (MemStorage) for development, designed to be easily replaced with persistent storage
- **Build System**: ESBuild for fast production builds

### Project Structure
```
├── client/          # Frontend React application
├── server/          # Backend Express server
├── shared/          # Shared types and schemas
├── components.json  # shadcn/ui configuration
└── migrations/      # Database migration files
```

## Key Components

### 1. Database Layer
- **ORM**: Drizzle with PostgreSQL dialect
- **Schema**: Shared schema definitions in `/shared/schema.ts`
- **Tables**: Users and contact submissions with UUID primary keys
- **Validation**: Zod schemas for runtime type checking

### 2. API Layer
- **Contact Endpoint**: POST `/api/contact` for form submissions
- **Admin Endpoint**: GET `/api/contact-submissions` for retrieving submissions
- **Error Handling**: Centralized error handling with proper HTTP status codes
- **Request Logging**: Custom middleware for API request/response logging

### 3. Frontend Components
- **Three.js Background**: Animated icosahedron particles with custom materials
- **Responsive Design**: Mobile-first approach with hamburger navigation
- **Modal System**: Custom modal component with portal rendering and keyboard shortcuts
- **Form Components**: Reusable form elements with consistent validation

### 4. Development Tools
- **Hot Reloading**: Vite dev server with React Fast Refresh
- **Type Checking**: Strict TypeScript configuration
- **Path Aliases**: Configured for clean imports (`@/`, `@shared/`)
- **Replit Integration**: Runtime error modal and cartographer plugins

## Data Flow

1. **Contact Form Submission**:
   - User fills form → React Hook Form validation → Zod schema validation → API call → Database storage
   - Success/error feedback via toast notifications

2. **Page Rendering**:
   - Server serves static HTML → React hydration → Component mounting → Three.js canvas initialization

3. **State Management**:
   - TanStack Query handles API calls with automatic caching and error handling
   - Local component state for UI interactions (modals, animations)

## External Dependencies

### Core Dependencies
- **@neondatabase/serverless**: Neon database connection for serverless environments
- **drizzle-orm**: Type-safe ORM with PostgreSQL support
- **@tanstack/react-query**: Server state management
- **@radix-ui/***: Accessible UI primitives
- **framer-motion**: Animation library
- **three**: 3D graphics library
- **react-hook-form**: Form state management
- **zod**: Runtime type validation

### Development Dependencies
- **vite**: Build tool and dev server
- **typescript**: Type checking
- **tailwindcss**: Utility-first CSS framework
- **eslint**: Code linting

## Deployment Strategy

### Build Process
1. **Frontend Build**: Vite builds React app to `dist/public/`
2. **Backend Build**: ESBuild bundles server code to `dist/index.js`
3. **Database**: Drizzle migrations run against PostgreSQL instance

### Environment Requirements
- Node.js 18+ with ES modules support
- PostgreSQL database (configured via `DATABASE_URL`)
- Production environment variables for database connectivity

### Deployment Configuration
- **Production Server**: Express serves static files from `dist/public/`
- **Database Migrations**: Run via `npm run db:push` using Drizzle Kit
- **Process Management**: Single Node.js process handling both static files and API routes

### Scalability Considerations
- In-memory storage is replaced with persistent database for production
- Static assets can be served via CDN
- Database connection pooling for high traffic
- Horizontal scaling possible due to stateless server design