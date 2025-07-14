# ⚽ Football Fantasy Manager

A modern, full-stack web application for managing fantasy football teams with real-time features, built with production-ready practices for job interview demonstration.

## 🚀 Project Overview

This project demonstrates enterprise-level web development skills through a comprehensive fantasy football management system featuring:

- **Team Management**: Create and manage teams with $5,000,000 budget allocation
- **Player Trading**: Transfer market with advanced filtering and search capabilities
- **Real-time Features**: Live notifications and updates
- **Background Processing**: Automated team generation with email notifications
- **Authentication**: Secure JWT-based user authentication system

## 🏗️ Architecture & Tech Stack

### Backend (Node.js + TypeScript)

- **Framework**: Express.js with practical MVC architecture
- **Database**: PostgreSQL with Prisma ORM for type-safe operations
- **Authentication**: JWT tokens with bcrypt password hashing
- **Background Jobs**: BullMQ + Redis for queue processing
- **Email Service**: SendGrid integration
- **Validation**: Zod runtime validation
- **Code Quality**: ESLint + Prettier + Husky pre-commit hooks

### Frontend (React + TypeScript)

- **Framework**: React 18 with TypeScript and Vite
- **UI Library**: Tailwind CSS + Shadcn/UI components
- **State Management**: Zustand + React Query for server state
- **Routing**: React Router v6
- **Forms**: React Hook Form with Zod validation
- **HTTP Client**: Axios with interceptors

### DevOps & Development

- **Containerization**: Docker + Docker Compose for development
- **Testing**: Jest (backend) + Vitest (frontend)
- **Code Quality**: ESLint, Prettier, TypeScript strict mode
- **Git Hooks**: Husky + lint-staged for automated quality checks

## 📁 Project Structure

```
football-fantasy-manager/
├── backend/                 # Node.js + Express API
│   ├── src/
│   │   ├── controllers/     # HTTP request handlers
│   │   ├── services/        # Business logic layer
│   │   ├── models/          # Prisma database models
│   │   ├── middleware/      # Auth, validation, error handling
│   │   ├── routes/          # API route definitions
│   │   ├── utils/           # Helper functions and utilities
│   │   ├── jobs/            # Background job processing
│   │   ├── types/           # TypeScript type definitions
│   │   └── app.ts           # Express application setup
│   ├── prisma/              # Database schema and migrations
│   ├── tests/               # Unit and integration tests
│   └── dist/                # Compiled JavaScript output
│
├── frontend/                # React + TypeScript SPA
│   ├── src/
│   │   ├── components/      # Reusable UI components
│   │   ├── pages/           # Route-based page components
│   │   ├── hooks/           # Custom React hooks
│   │   ├── services/        # API communication layer
│   │   ├── types/           # TypeScript type definitions
│   │   └── utils/           # Helper functions
│   └── public/              # Static assets
│
├── docker-compose.yml       # Development environment setup
├── .husky/                  # Git hooks configuration
└── README.md                # This file
```

## 🛠️ Development Setup

### Prerequisites

- **Node.js** 18+
- **npm** or **yarn**
- **Docker** & **Docker Compose**
- **PostgreSQL** (or use Docker)
- **Redis** (or use Docker)

### Quick Start

1. **Clone the repository**

   ```bash
   git clone <repository-url>
   cd football-fantasy-manager
   ```

2. **Start development environment with Docker**

   ```bash
   docker-compose up -d
   ```

3. **Setup Backend**

   ```bash
   cd backend
   npm install
   cp .env.example .env
   # Edit .env with your configuration
   npm run db:migrate
   npm run db:seed
   npm run dev
   ```

4. **Setup Frontend**

   ```bash
   cd frontend
   npm install
   cp .env.example .env
   # Edit .env with your configuration
   npm run dev
   ```

5. **Access the application**
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:3001
   - API Health Check: http://localhost:3001/health

## 📋 Current Implementation Status

### ✅ **Phase 1: Foundation & Code Quality (COMPLETED)**

**Backend Setup:**

- [x] Project structure with practical MVC architecture
- [x] TypeScript configuration with strict mode enabled
- [x] Express.js application setup with security middleware
- [x] Code quality tools (ESLint + Prettier + Husky)
- [x] All code cleaned and comment-free for interview readiness
- [x] Database schema design (Prisma)
- [x] Basic middleware structure (auth, validation, error handling)
- [x] Route structure for main endpoints
- [x] JWT utility functions
- [x] Player generation utilities
- [x] Development environment with hot reload

**Frontend Setup:**

- [x] React + TypeScript + Vite configuration
- [x] Modern UI framework (Tailwind CSS + Shadcn/UI)
- [x] State management setup (Zustand + React Query)
- [x] Routing configuration (React Router)
- [x] Form handling setup (React Hook Form + Zod)
- [x] Component structure planning
- [x] TypeScript strict configuration
- [x] Development environment setup

**DevOps & Quality:**

- [x] Docker containerization for development
- [x] Git repository with proper .gitignore
- [x] Code quality automation (pre-commit hooks)
- [x] Environment configuration templates
- [x] Development scripts and commands

### 🚧 **Phase 2: Core Backend Implementation (PENDING)**

**Authentication System:**

- [ ] User registration with email validation
- [ ] Login/logout with JWT tokens
- [ ] Password hashing with bcrypt
- [ ] Email verification service
- [ ] Password reset functionality
- [ ] Protected route middleware

**Database Implementation:**

- [ ] PostgreSQL database setup
- [ ] Prisma migrations and schema
- [ ] User model with relationships
- [ ] Player and team models
- [ ] Transfer listing models
- [ ] Database seeding with sample data

**Core API Endpoints:**

- [ ] Authentication routes (register, login, logout)
- [ ] User profile management
- [ ] Team management endpoints
- [ ] Player CRUD operations
- [ ] Transfer market functionality
- [ ] Search and filtering capabilities

### 🚧 **Phase 3: Frontend Implementation (PENDING)**

**Authentication UI:**

- [ ] Login/Register forms with validation
- [ ] Protected routes and navigation
- [ ] User session management
- [ ] Error handling and notifications

**Main Application:**

- [ ] Dashboard with team overview
- [ ] Team management interface
- [ ] Transfer market with filtering
- [ ] Player selection and trading
- [ ] Real-time notifications

**UI/UX Features:**

- [ ] Responsive design for all devices
- [ ] Loading states and skeletons
- [ ] Error boundaries and fallbacks
- [ ] Toast notifications
- [ ] Confirmation dialogs

### 🚧 **Phase 4: Advanced Features (PLANNED)**

**Background Processing:**

- [ ] Team generation job queue
- [ ] Email notification system
- [ ] Automated market price updates
- [ ] Performance monitoring

**Real-time Features:**

- [ ] WebSocket connections
- [ ] Live transfer updates
- [ ] Real-time notifications
- [ ] User presence indicators

**Testing & Deployment:**

- [ ] Comprehensive test suite
- [ ] CI/CD pipeline setup
- [ ] Production deployment configuration
- [ ] Performance optimization

## 🎯 **Development Standards**

### Code Quality

- **TypeScript Strict Mode**: Enabled across the entire project
- **ESLint**: Configured with TypeScript-specific rules
- **Prettier**: Consistent code formatting
- **No Comments**: Production-ready, self-documenting code
- **Git Hooks**: Automated quality checks on commit

### Architecture Principles

- **Separation of Concerns**: Clear layer separation
- **Type Safety**: Comprehensive TypeScript usage
- **Error Handling**: Consistent error management
- **Security**: Authentication and data validation
- **Performance**: Optimized queries and caching

### Testing Strategy

- **Unit Tests**: Individual function testing
- **Integration Tests**: API endpoint testing
- **Component Tests**: React component testing
- **E2E Tests**: Full user journey testing

## 📚 Available Scripts

### Backend Commands

```bash
# Development
npm run dev              # Start development server with hot reload
npm run build           # Build TypeScript to JavaScript
npm run start           # Start production server

# Code Quality
npm run lint            # Run ESLint checks
npm run lint:fix        # Auto-fix ESLint issues
npm run format          # Format code with Prettier
npm run format:check    # Check code formatting
npm run type-check      # TypeScript compilation check
npm run precommit       # Run all quality checks

# Database
npm run db:migrate      # Run Prisma database migrations
npm run db:generate     # Generate Prisma client
npm run db:studio       # Open Prisma Studio GUI
npm run db:seed         # Seed database with sample data

# Testing
npm run test            # Run Jest test suite
npm run test:watch      # Run tests in watch mode
```

### Frontend Commands

```bash
# Development
npm run dev             # Start Vite development server
npm run build           # Build for production
npm run preview         # Preview production build

# Code Quality
npm run lint            # Run ESLint checks
npm run lint:fix        # Auto-fix ESLint issues

# Testing
npm run test            # Run Vitest test suite
npm run test:ui         # Run tests with UI
```

## 🔧 **Environment Configuration**

### Backend Environment Variables

```env
NODE_ENV=development
PORT=3001
DATABASE_URL="postgresql://username:password@localhost:5432/football_fantasy"
JWT_SECRET="your-super-secret-jwt-key"
JWT_EXPIRES_IN="7d"
REDIS_URL="redis://localhost:6379"
SENDGRID_API_KEY="your-sendgrid-api-key"
EMAIL_FROM="noreply@footballfantasy.com"
CORS_ORIGIN="http://localhost:3000"
```

### Frontend Environment Variables

```env
VITE_API_URL="http://localhost:3001/api"
VITE_APP_NAME="Football Fantasy Manager"
```
