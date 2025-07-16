# Football Fantasy Manager

A modern, full-stack fantasy football management application built with enterprise-grade architecture, demonstrating production-ready development practices and comprehensive TypeScript implementation.

## Project Overview

Football Fantasy Manager is a comprehensive web application that enables users to create and manage fantasy football teams with a $5,000,000 budget. The system features real-time player transfers, automated team generation, and a sophisticated transfer market with advanced filtering capabilities.

**Key Features:**

- **Team Management**: Create and manage fantasy teams with budget constraints
- **Transfer Market**: Buy and sell players with dynamic pricing and filtering
- **Authentication**: Unified login/registration system with JWT security
- **Background Processing**: Automated team generation with email notifications
- **Real-time Updates**: Live transfer market updates and notifications

## Architecture & Technology Stack

### Backend (Node.js + TypeScript)

- **Framework**: Express.js with MVC architecture
- **Database**: PostgreSQL with Prisma ORM for type-safe operations
- **Authentication**: JWT-based security with bcrypt password hashing
- **Background Jobs**: Automated processing with email integration
- **Validation**: Zod runtime validation with comprehensive error handling
- **Code Quality**: ESLint + Prettier + strict TypeScript configuration

### Frontend (React + TypeScript)

- **Framework**: React 18 with TypeScript and Vite
- **UI Components**: Tailwind CSS + Shadcn/UI design system
- **State Management**: Zustand stores + React Query for server state
- **Routing**: React Router v6 with protected routes
- **Forms**: React Hook Form with Zod validation
- **HTTP Client**: Axios with interceptors and error handling

### Development & DevOps

- **Containerization**: Docker + Docker Compose for development environment
- **Code Quality**: Husky pre-commit hooks with automated linting and formatting
- **Type Safety**: Strict TypeScript mode across entire application
- **Testing**: Jest (backend) + Vitest (frontend) testing suites
- **Development**: Hot reload and efficient development workflows

## Project Structure

```
football-fantasy-manager/
├── backend/                 # Node.js + Express API
│   ├── src/
│   │   ├── controllers/     # HTTP request handlers
│   │   ├── services/        # Business logic layer
│   │   ├── routes/          # API route definitions
│   │   ├── middleware/      # Authentication, validation, error handling
│   │   ├── models/          # Prisma database models
│   │   ├── jobs/            # Background job processing
│   │   ├── types/           # TypeScript type definitions
│   │   └── utils/           # Helper functions and utilities
│   ├── prisma/              # Database schema and migrations
│   └── tests/               # Unit and integration tests
│
├── frontend/                # React + TypeScript SPA
│   ├── src/
│   │   ├── components/      # Reusable UI components
│   │   ├── pages/           # Route-based page components
│   │   ├── hooks/           # Custom React hooks
│   │   ├── store/           # Zustand state management
│   │   ├── services/        # API communication layer
│   │   └── types/           # TypeScript type definitions
│   └── public/              # Static assets
│
├── docker-compose.yml       # Development environment setup
└── .husky/                  # Git hooks configuration
```

## Implementation Status

### Core Authentication System

- **Unified Authentication Flow**: Single endpoint handling both login and registration
- **JWT Security**: Secure token-based authentication with refresh capability
- **Password Security**: bcrypt hashing with salt rounds
- **Profile Management**: User profile endpoints with budget tracking
- **Email Integration**: Welcome emails and password reset functionality

### Team Management System

- **Team Creation**: Automated team generation with balanced player distribution
- **Budget Management**: $5,000,000 budget allocation and tracking
- **Player Statistics**: Comprehensive player data with skill ratings
- **Team Validation**: Position requirements and squad composition rules

### Transfer Market System

- **Market Listings**: Create and manage player transfer listings
- **Player Trading**: Buy/sell functionality with price validation
- **Market Filtering**: Advanced search and filtering capabilities
- **Dynamic Pricing**: Real-time price updates based on transfers
- **Transaction Management**: Secure database transactions for transfers

### Frontend Application

- **Responsive UI**: Modern interface with Tailwind CSS
- **Protected Routes**: Authentication-based route protection
- **State Management**: Efficient state handling with Zustand and React Query
- **Form Validation**: Comprehensive form handling with error management
- **API Integration**: Type-safe API communication layer

### Development Infrastructure

- **Type Safety**: Strict TypeScript configuration across full stack
- **Code Quality**: Automated linting, formatting, and pre-commit hooks
- **Development Environment**: Docker-based setup with hot reload
- **Testing Framework**: Comprehensive testing setup for both frontend and backend

## Quick Start

### Prerequisites

- Node.js 18+
- Docker & Docker Compose
- PostgreSQL (or use Docker)

### Setup Instructions

1. **Clone and Setup Environment**

   ```bash
   git clone <repository-url>
   cd football-fantasy-manager
   docker-compose up -d
   ```

2. **Backend Setup**

   ```bash
   cd backend
   npm install
   cp .env.example .env
   npm run db:migrate
   npm run db:seed
   npm run dev
   ```

3. **Frontend Setup**

   ```bash
   cd frontend
   npm install
   cp .env.example .env
   npm run dev
   ```

4. **Access Application**
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:3001
   - Health Check: http://localhost:3001/health

## API Endpoints

### Authentication

- `POST /api/auth/authenticate` - Unified login/registration
- `GET /api/auth/profile` - User profile information
- `POST /api/auth/refresh-token` - Token refresh
- `POST /api/auth/forgot-password` - Password reset request
- `POST /api/auth/reset-password` - Password reset confirmation

### Team Management

- `GET /api/team/my-team` - Get user's current team
- `POST /api/team/generate` - Initiate team generation

### Transfer Market

- `GET /api/transfer/market` - Get market listings with filtering
- `GET /api/transfer/my-listings` - Get user's active listings
- `POST /api/transfer/market` - Create new player listing
- `POST /api/transfer/buy` - Purchase player from market
- `DELETE /api/transfer/listings/:id` - Remove player listing

## Development Commands

### Backend

```bash
npm run dev
npm run build
npm run test
npm run db:migrate
npm run db:seed
npm run lint
npm run format
```

### Frontend

```bash
npm run dev
npm run build
npm run test
npm run lint
```

## Environment Configuration

### Backend Environment Variables

```env
NODE_ENV=development
PORT=3001
DATABASE_URL="postgresql://username:password@localhost:5432/football_fantasy"
JWT_SECRET="your-super-secret-jwt-key"
JWT_EXPIRES_IN="7d"
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password
CORS_ORIGIN="http://localhost:3000"
```

### Frontend Environment Variables

```env
VITE_API_URL="http://localhost:3001/api"
VITE_APP_NAME="Football Fantasy Manager"
```

## Development Standards

**Code Quality:**

- TypeScript strict mode enabled
- ESLint with TypeScript-specific rules
- Prettier for consistent formatting
- Husky pre-commit hooks for quality assurance

**Architecture Principles:**

- Clear separation of concerns with MVC pattern
- Comprehensive type safety throughout application
- Consistent error handling and validation
- Performance-optimized queries and caching strategies

**Security Implementation:**

- JWT-based authentication with secure token handling
- Input validation with Zod schemas
- SQL injection protection with Prisma ORM
- CORS configuration and rate limiting

This project demonstrates proficiency in modern web development practices, full-stack architecture design, and production-ready code implementation suitable for enterprise-level applications.
