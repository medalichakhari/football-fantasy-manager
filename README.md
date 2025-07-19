# Football Online Manager

A web application for fantasy football management where users can build and manage their teams, trade players, and compete with others in a virtual transfer market.

## Project Overview

This application was built to fulfill the requirements of creating a football fantasy manager web app. Users start by registering with email and password, then generate their team through a separate process, receiving a $5M budget to participate in the transfer market and trade players.

### Core Functionalities

**User Management**

- Single authentication flow handling both registration and login
- Email and password-based authentication with JWT tokens
- User profile management with budget tracking

**Team System**

- Automatic team generation as a separate flow after registration:
  - $5,000,000 transfer budget
  - 20 players distributed across positions (3 GK, 6 DEF, 6 MID, 5 ATT)
- Dedicated team generation endpoint and process
- Team composition validation (15-25 players required)

**Transfer Market**

- List players for sale with custom asking prices
- Purchase players from other teams at 95% of asking price
- Advanced filtering by team name, player name, and price range
- Real-time market updates and transaction processing
- **Atomic Transactions**: Each transfer operation uses Prisma transactions to ensure data integrity across 6 database operations (player ownership transfer, budget updates, listing deactivation) preventing race conditions and maintaining consistency during concurrent purchases

## Technologies Used

**Backend**

- Node.js with Express.js framework
- TypeScript for type safety
- PostgreSQL database with Prisma ORM
- JWT for authentication
- Zod for request validation
- Automated team generation system

**Frontend**

- React 18 with TypeScript
- Vite for build tooling
- Tailwind CSS for styling
- Zustand for state management
- React Query for server state
- React Router for navigation

**Development Tools**

- Docker and Docker Compose for containerization
- ESLint and Prettier for code quality
- Husky for pre-commit hooks

## Project Structure

```
football-fantasy-manager/
├── backend/
│   ├── src/
│   │   ├── controllers/     # Request handlers
│   │   ├── services/        # Business logic
│   │   ├── middleware/      # Auth and validation
│   │   ├── routes/          # API routes
│   │   └── utils/           # Helper functions
│   ├── prisma/              # Database schema
│   └── .env.dev             # Environment template
├── frontend/
│   ├── src/
│   │   ├── components/      # UI components
│   │   ├── pages/           # Application pages
│   │   ├── hooks/           # Custom React hooks
│   │   ├── store/           # State management
│   │   └── services/        # API communication
│   └── .env.dev             # Environment template
└── docker-compose.yml       # Development setup
```

## Setup Instructions

### Prerequisites

- Node.js 18 or higher
- Docker and Docker Compose

### Environment Configuration

I've provided environment templates for both frontend and backend. Copy the provided configurations:

```bash
# Backend environment
cp backend/.env.dev backend/.env

# Frontend environment
cp frontend/.env.dev frontend/.env
```

### Running the Application

**Option 1: Docker (Recommended)**

```bash
docker-compose up --build
```

**Option 2: Manual Setup**

```bash
# Backend
cd backend
npm install
npm run db:generate
npm run db:migrate
npm run db:studio
npm run dev

# Frontend (in another terminal)
cd frontend
npm install
npm run dev
```

The application will be available at:

- Frontend: http://localhost:5173
- Backend API: http://localhost:3001

## Development Scope & Time Report

### Scope 1: Project Setup & Foundation (6 hours)

- Initial project structure and Docker configuration
- Database schema design with Prisma (User, Team, Player, TransferListing models)
- Express.js backend setup with TypeScript and middleware
- React frontend setup with Vite, routing, and basic components
- Authentication infrastructure (JWT, middleware, store setup)

### Scope 2: Authentication Feature (Complete Backend + Frontend) (8 hours)

**Backend Implementation (4h):**

- authController.ts - unified login/registration logic
- JWT token generation and validation middleware
- User model and validation schemas
- Auth routes and error handling

**Frontend Implementation (4h):**

- LoginPage.tsx with unified login/registration form
- useAuth.ts hook for authentication logic
- Auth store with Zustand for state management
- ProtectedRoute component and navigation integration

### Scope 3: Team Management Feature (Complete Backend + Frontend) (10 hours)

**Backend Implementation (5h):**

- teamController.ts with team generation logic
- Team and Player models with relationships
- Team generation algorithm and validation
- Database seeding with player data

**Frontend Implementation (5h):**

- MyTeamPage.tsx for team display and management
- useTeam.ts hook for team operations
- Team components and player cards
- Budget tracking and team composition UI

### Scope 4: Transfer Market Feature (Complete Backend + Frontend) (12 hours)

**Backend Implementation (6h):**

- transferController.ts with market CRUD operations
- Transfer listing model and relationships
- Buy/sell transaction logic with price calculations
- Advanced filtering and search functionality

**Frontend Implementation (6h):**

- TransferMarketPage.tsx with market listings and filters
- SellPlayerPage.tsx for creating player listings
- MyListingsPage.tsx for managing user listings
- useTransfer.ts hook with React Query integration
- Transfer components and market interface

### Scope 5: UI/UX Polish & Integration (6 hours)

- Responsive design implementation across all components
- Navigation component and layout optimization
- Error handling and loading states
- Component styling with Tailwind CSS
- Mobile-first responsive adjustments

### Scope 6: Testing & Documentation (3 hours)

- End-to-end testing of user flows
- API integration debugging
- Performance optimization
- Docker setup refinement
- Documentation and final polish

## Key Challenge: Concurrent Transaction Management

The most technically challenging aspect was implementing a robust transfer market that handles concurrent transactions while maintaining data consistency. When multiple users attempt to purchase the same player simultaneously, the system needed to ensure only one transaction succeeds without creating race conditions.

**The Problem**: Each player purchase involves 6 critical database operations:

1. Remove player from seller's team (`userPlayer.delete`)
2. Add player to buyer's team (`userPlayer.create`)
3. Deduct money from buyer's budget (`user.update`)
4. Add money to seller's budget (`user.update`)
5. Update player's market value (`player.update`)
6. Deactivate the transfer listing (`transferListing.update`)

**The Solution**: Implemented Prisma's `$transaction()` API to wrap all operations in an atomic transaction. This ensures either all operations succeed together, or all are rolled back on failure, preventing data corruption and maintaining financial integrity even under high concurrent load.

## Support & Feedback

If you encounter any issues while running the project or have feedback, please feel free to reach out:

**Email**: medalichakhari.dev@gmail.com

I'm always open to discussing technical implementations, suggestions for improvements, or helping resolve any setup difficulties.
