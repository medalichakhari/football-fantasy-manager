import { beforeAll, beforeEach } from '@jest/globals';

export const mockPrisma = {
  user: {
    findUnique: jest.fn(),
    findMany: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
  },
  player: {
    findUnique: jest.fn(),
    findMany: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
  },
  userPlayer: {
    findUnique: jest.fn(),
    findMany: jest.fn(),
    findFirst: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
    count: jest.fn(),
  },
  transferListing: {
    findUnique: jest.fn(),
    findMany: jest.fn(),
    findFirst: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
    count: jest.fn(),
  },
  $transaction: jest.fn(),
  $queryRaw: jest.fn(),
};

// Prisma models
jest.mock('../src/models/index', () => ({
  prisma: mockPrisma,
}));

jest.mock('../src/services/emailService', () => ({
  EmailService: jest.fn().mockImplementation(() => ({
    sendPlayerSoldEmail: jest.fn().mockResolvedValue(true),
    sendWelcomeEmail: jest.fn().mockResolvedValue(true),
    sendPasswordResetEmail: jest.fn().mockResolvedValue(true),
    sendTeamGenerationCompleteEmail: jest.fn().mockResolvedValue(true),
    testConnection: jest.fn().mockResolvedValue(true),
  })),
}));

jest.mock('bcrypt', () => ({
  hash: jest.fn().mockResolvedValue('hashed_password'),
  compare: jest.fn().mockResolvedValue(true),
}));

jest.mock('jsonwebtoken', () => ({
  sign: jest.fn().mockReturnValue('mock_token'),
  verify: jest.fn().mockReturnValue({ userId: 'user-id', email: 'test@example.com' }),
}));

beforeAll(async () => {
  process.env.NODE_ENV = 'test';
  process.env.JWT_SECRET = 'test-jwt-secret';
  process.env.DATABASE_URL = 'postgresql://test:test@localhost:5432/test_db';
});

beforeEach(() => {
  jest.clearAllMocks();
});

export const createMockUser = (overrides = {}) => ({
  id: 'user-1',
  email: 'test@example.com',
  passwordHash: 'hashed_password',
  budget: 5000000,
  teamGenerated: false,
  createdAt: new Date(),
  updatedAt: new Date(),
  ...overrides,
});

export const createMockPlayer = (overrides = {}) => ({
  id: 'player-1',
  name: 'Test Player',
  position: 'FW',
  team: 'Test Team',
  price: 1000000,
  skill: 85,
  age: 25,
  nationality: 'Test Country',
  ...overrides,
});

export const createMockTransferListing = (overrides = {}) => ({
  id: 'listing-1',
  playerId: 'player-1',
  sellerId: 'user-1',
  price: 1000000,
  isActive: true,
  createdAt: new Date(),
  player: createMockPlayer(),
  seller: createMockUser(),
  ...overrides,
});

export const createMockUserPlayer = (overrides = {}) => ({
  id: 'user-player-1',
  userId: 'user-1',
  playerId: 'player-1',
  price: 1000000,
  user: createMockUser(),
  player: createMockPlayer(),
  ...overrides,
});
