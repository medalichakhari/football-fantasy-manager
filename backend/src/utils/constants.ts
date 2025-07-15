export * from './jwt';
export * from './playerGenerator';

export const TEAM_REQUIREMENTS = {
  GOALKEEPERS: 3,
  DEFENDERS: 6,
  MIDFIELDERS: 6,
  ATTACKERS: 5,
  TOTAL: 20,
} as const;

export const INITIAL_BUDGET = 5000000;

export const TEAM_GENERATION_DELAY = parseInt(process.env.TEAM_GENERATION_DELAY || '30000');

export const DEFAULT_PAGE_SIZE = 20;
export const MAX_PAGE_SIZE = 100;

export const formatPrice = (price: number): string => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
  }).format(price);
};

export const ERROR_MESSAGES = {
  INVALID_CREDENTIALS: 'Invalid email or password',
  USER_ALREADY_EXISTS: 'User with this email already exists',
  USER_NOT_FOUND: 'User not found',
  INVALID_TOKEN: 'Invalid or expired token',
  INSUFFICIENT_BUDGET: 'Insufficient budget for this purchase',
  PLAYER_NOT_FOUND: 'Player not found',
  TRANSFER_LISTING_NOT_FOUND: 'Transfer listing not found',
  CANNOT_BUY_OWN_PLAYER: 'Cannot buy your own player',
  PLAYER_ALREADY_OWNED: 'You already own this player',
  TEAM_GENERATION_IN_PROGRESS: 'Team generation is already in progress',
  TEAM_ALREADY_GENERATED: 'Team has already been generated',
  VALIDATION_ERROR: 'Validation error',
  INTERNAL_SERVER_ERROR: 'Internal server error',
} as const;
