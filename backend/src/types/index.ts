export interface User {
  id: string;
  email: string;
  password: string;
  budget: number;
  teamGenerationStatus: TeamGenerationStatus;
  teamGeneratedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface Player {
  id: string;
  name: string;
  position: Position;
  team: string;
  price: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface UserPlayer {
  id: string;
  userId: string;
  playerId: string;
  acquiredAt: Date;
  price: number;
  user?: User;
  player?: Player;
}

export interface TransferListing {
  id: string;
  sellerId: string;
  playerId: string;
  price: number;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
  seller?: User;
  player?: Player;
}

export enum Position {
  GK = 'GK',
  DEF = 'DEF',
  MID = 'MID',
  ATT = 'ATT',
}

export enum TeamGenerationStatus {
  PENDING = 'PENDING',
  PROCESSING = 'PROCESSING',
  COMPLETED = 'COMPLETED',
  FAILED = 'FAILED',
}

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
  listings: (TransferListing & { player: Player; seller: User })[];
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
