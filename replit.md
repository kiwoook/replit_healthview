# HealthView - Fitness Routine Sharing Platform

## Overview

HealthView is a comprehensive fitness platform designed to connect fitness enthusiasts with professional trainers through shared workout routines. The application serves as a marketplace where trainers can create and share verified workout routines, while users can discover, save, and track their fitness progress. The platform also includes community features for users to share achievements, ask questions, and support each other's fitness journeys.

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript
- **Routing**: Wouter for client-side routing
- **State Management**: TanStack Query (React Query) for server state management
- **UI Components**: Radix UI primitives with custom Shadcn/ui components
- **Styling**: Tailwind CSS with CSS custom properties for theming
- **Build Tool**: Vite for development and production builds

### Backend Architecture
- **Runtime**: Node.js with Express.js server
- **Language**: TypeScript with ES modules
- **Database**: PostgreSQL via Neon Database
- **ORM**: Drizzle ORM for type-safe database operations
- **Authentication**: Replit Auth with OpenID Connect
- **Session Management**: Express sessions with PostgreSQL store

### Data Storage Solutions
- **Primary Database**: PostgreSQL hosted on Neon Database
- **Session Storage**: PostgreSQL sessions table for authentication state
- **File Storage**: Not implemented (likely to be added for user-generated content)

## Key Components

### Authentication System
- Replit Auth integration with OpenID Connect
- Passport.js for authentication middleware
- Session-based authentication with PostgreSQL session store
- User profile management with trainer/enthusiast role distinction

### Database Schema
- **Users**: Core user information with role-based access (enthusiast/trainer)
- **Trainers**: Extended profiles for fitness professionals
- **Routines**: Workout routines with metadata (difficulty, duration, body parts)
- **Exercises**: Individual exercises within routines
- **Workout Records**: User fitness tracking and progress data
- **Community**: Posts, comments, and social features
- **Ratings**: Routine rating and feedback system

### Frontend Components
- **Responsive Design**: Mobile-first approach with desktop optimizations
- **Component Library**: Comprehensive UI components based on Radix primitives
- **Form Handling**: React Hook Form with Zod validation
- **Charts**: Recharts for progress visualization
- **Search & Filtering**: Advanced filtering system for routines and trainers

### API Structure
- RESTful API design with Express.js
- Type-safe request/response handling with Zod schemas
- Comprehensive CRUD operations for all entities
- Query parameters for filtering, pagination, and search

## Data Flow

1. **Authentication Flow**:
   - User initiates login through Replit Auth
   - OpenID Connect handles authentication
   - Session created and stored in PostgreSQL
   - User profile loaded from database

2. **Routine Discovery**:
   - Users browse routines with filtering options
   - Search functionality across routine metadata
   - Pagination for large result sets
   - Routine details with exercises and creator information

3. **Progress Tracking**:
   - Users log workout sessions
   - Exercise-specific tracking (sets, reps, duration)
   - Progress visualization through charts
   - Achievement system for motivation

4. **Community Interaction**:
   - Users create posts (questions, achievements, general)
   - Comment system for community engagement
   - Routine rating and review system

## External Dependencies

### Core Dependencies
- **@neondatabase/serverless**: PostgreSQL database connection
- **drizzle-orm**: Type-safe database operations
- **express**: Web application framework
- **@tanstack/react-query**: Server state management
- **wouter**: Lightweight React routing
- **zod**: Runtime type validation

### UI Dependencies
- **@radix-ui/***: Headless UI primitives
- **tailwindcss**: Utility-first CSS framework
- **recharts**: Chart library for data visualization
- **react-hook-form**: Form state management
- **date-fns**: Date manipulation utilities

### Authentication Dependencies
- **openid-client**: OpenID Connect client
- **passport**: Authentication middleware
- **express-session**: Session management
- **connect-pg-simple**: PostgreSQL session store

## Deployment Strategy

### Development Environment
- Vite development server with hot module replacement
- Replit integration with development banner
- TypeScript compilation with strict type checking
- Environment-specific configuration

### Production Build
- Vite production build with optimizations
- Express server bundle with esbuild
- Static file serving from Express
- Environment variable configuration for database and auth

### Database Management
- Drizzle migrations for schema changes
- Push-based deployment for rapid iteration
- Connection pooling for production scalability

## Changelog

```
Changelog:
- July 01, 2025. Initial setup
```

## User Preferences

```
Preferred communication style: Simple, everyday language.
```