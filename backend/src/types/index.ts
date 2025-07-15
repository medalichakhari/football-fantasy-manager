import { Request } from 'express';
import {
  User as PrismaUser,
  Player as PrismaPlayer,
  UserPlayer as PrismaUserPlayer,
  TransferListing as PrismaTransferListing,
  Position,
  TeamGenerationStatus,
} from '@prisma/client';

export interface User extends PrismaUser {}

export interface Player extends PrismaPlayer {}

export interface UserPlayer extends PrismaUserPlayer {}

export interface TransferListing extends PrismaTransferListing {}

export { Position, TeamGenerationStatus };

export interface RegisterRequest {
  email: string;
  password: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface AuthResponse {
  token: string;
  user: {
    id: string;
    email: string;
    budget: number;
    teamGenerationStatus: TeamGenerationStatus;
  };
}

export interface UnifiedAuthResponse extends AuthResponse {
  isNewUser: boolean;
}

export interface TeamResponse {
  players: (UserPlayer & { player: Player })[];
  budget: number;
  teamStats: {
    goalkeepers: number;
    defenders: number;
    midfielders: number;
    attackers: number;
    totalPlayers: number;
  };
}

export interface TransferMarketResponse {
  listings: TransferListingWithRelations[];
  totalCount: number;
  page: number;
  limit: number;
}

export interface TransferMarketFilters {
  position?: Position;
  minPrice?: number;
  maxPrice?: number;
  search?: string;
  page?: number;
  limit?: number;
}

export interface CreateTransferListingRequest {
  playerId: string;
  price: number;
}

export interface BuyPlayerRequest {
  transferListingId: string;
}

// JWT Payload
export interface JWTPayload {
  userId: string;
  email: string;
}

export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}

export interface TeamGenerationJobData {
  userId: string;
  email: string;
}

export const TEAM_REQUIREMENTS = {
  GOALKEEPERS: 3,
  DEFENDERS: 6,
  MIDFIELDERS: 6,
  ATTACKERS: 5,
  TOTAL: 20,
} as const;

export const INITIAL_BUDGET = 5000000;

export interface AuthenticatedRequest extends Request {
  user: {
    userId: string;
    email: string;
  };
}

export interface TeamStatsResponse {
  goalkeepers: number;
  defenders: number;
  midfielders: number;
  attackers: number;
  totalPlayers: number;
  totalValue: number;
  averageValue: number;
}

export interface TeamGenerationResponse {
  message: string;
  status: TeamGenerationStatus;
}

export interface TransferListingWithRelations extends TransferListing {
  player: Player;
  seller: Pick<User, 'id' | 'email'>;
}

export interface BuyPlayerResponse {
  player: Player;
  price: number;
  newBudget: number;
}
