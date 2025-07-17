import { prisma } from '../models/index';
import { TEAM_REQUIREMENTS } from '../types/index';

export async function validateTeamSize(userId: string): Promise<{
  isValid: boolean;
  currentSize: number;
  minSize: number;
  maxSize: number;
  message?: string;
}> {
  const playerCount = await prisma.userPlayer.count({
    where: { userId },
  });

  const isValid =
    playerCount >= TEAM_REQUIREMENTS.MIN_SQUAD_SIZE &&
    playerCount <= TEAM_REQUIREMENTS.MAX_SQUAD_SIZE;

  let message: string | undefined;
  if (!isValid) {
    if (playerCount < TEAM_REQUIREMENTS.MIN_SQUAD_SIZE) {
      message = `Team must have at least ${TEAM_REQUIREMENTS.MIN_SQUAD_SIZE} players.`;
    } else {
      message = `Team cannot exceed ${TEAM_REQUIREMENTS.MAX_SQUAD_SIZE} players.`;
    }
  }

  const result = {
    isValid,
    currentSize: playerCount,
    minSize: TEAM_REQUIREMENTS.MIN_SQUAD_SIZE,
    maxSize: TEAM_REQUIREMENTS.MAX_SQUAD_SIZE,
  };

  return message ? { ...result, message } : result;
}

export async function canSellPlayer(userId: string): Promise<{
  canSell: boolean;
  currentSize: number;
  message?: string;
}> {
  const validation = await validateTeamSize(userId);
  const canSell = validation.currentSize > TEAM_REQUIREMENTS.MIN_SQUAD_SIZE;

  const result = {
    canSell,
    currentSize: validation.currentSize,
  };

  return canSell
    ? result
    : {
        ...result,
        message: `Cannot sell player. Team would have fewer than ${TEAM_REQUIREMENTS.MIN_SQUAD_SIZE} players.`,
      };
}

export async function canBuyPlayer(userId: string): Promise<{
  canBuy: boolean;
  currentSize: number;
  message?: string;
}> {
  const validation = await validateTeamSize(userId);
  const canBuy = validation.currentSize < TEAM_REQUIREMENTS.MAX_SQUAD_SIZE;

  const result = {
    canBuy,
    currentSize: validation.currentSize,
  };

  return canBuy
    ? result
    : {
        ...result,
        message: `Cannot buy player. Team would exceed ${TEAM_REQUIREMENTS.MAX_SQUAD_SIZE} players.`,
      };
}
